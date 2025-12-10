import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  from_username: string;
  to_username: string | null;
  message: string;
  message_type: 'group' | 'private';
  read: boolean;
  created_at: string;
}

export interface OnlineUser {
  username: string;
  isOnline: boolean;
  lastSeen: number;
}

const MESSAGE_RETENTION_HOURS = 24;

export function useRealtimeChat(currentUsername: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);

  // Carregar mensagens iniciais (últimas 24 horas)
  const loadMessages = useCallback(async () => {
    if (!currentUsername) return;

    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - MESSAGE_RETENTION_HOURS);

      // Carregar mensagens do grupo e privadas para o usuário atual
      const { data: groupMessages, error: groupError } = await supabase
        .from('internal_messages')
        .select('*')
        .eq('message_type', 'group')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: true });

      if (groupError) throw groupError;

      const { data: privateMessages, error: privateError } = await supabase
        .from('internal_messages')
        .select('*')
        .eq('message_type', 'private')
        .or(`from_username.eq.${currentUsername},to_username.eq.${currentUsername}`)
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: true });

      if (privateError) throw privateError;

      const allMessages = [
        ...(groupMessages || []),
        ...(privateMessages || [])
      ].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setMessages(allMessages as ChatMessage[]);

      // Calcular mensagens não lidas
      const unread = allMessages.filter(
        msg => !msg.read && 
        msg.from_username !== currentUsername &&
        (msg.message_type === 'group' || msg.to_username === currentUsername)
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUsername]);

  // Configurar Realtime para novas mensagens
  useEffect(() => {
    if (!currentUsername) {
      setIsConnected(false);
      return;
    }

    // Limpar canais anteriores
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
    }

    // Canal para mensagens - escutar TODAS as inserções e filtrar no código
    const channel = supabase
      .channel(`internal_messages_${currentUsername}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'internal_messages'
        },
        (payload) => {
          console.log('📨 Nova mensagem recebida via Realtime:', payload);
          const newMessage = payload.new as ChatMessage;
          
          // Verificar se é mensagem de grupo
          if (newMessage.message_type === 'group') {
            setMessages(prev => {
              // Evitar duplicatas
              if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('⚠️ Mensagem duplicada ignorada:', newMessage.id);
                return prev;
              }
              console.log('✅ Mensagem de grupo adicionada:', newMessage);
              return [...prev, newMessage];
            });

            // Incrementar contador de não lidas se não for do usuário atual
            if (newMessage.from_username !== currentUsername) {
              setUnreadCount(prev => {
                const newCount = prev + 1;
                console.log('📊 Contador de não lidas atualizado:', newCount);
                return newCount;
              });
            }
          } 
          // Verificar se é mensagem privada para o usuário atual
          else if (newMessage.message_type === 'private') {
            // Só adicionar se for para o usuário atual ou do usuário atual
            if (newMessage.to_username === currentUsername || newMessage.from_username === currentUsername) {
              setMessages(prev => {
                if (prev.some(msg => msg.id === newMessage.id)) {
                  console.log('⚠️ Mensagem privada duplicada ignorada:', newMessage.id);
                  return prev;
                }
                console.log('✅ Mensagem privada adicionada:', newMessage);
                return [...prev, newMessage];
              });

              // Incrementar contador se for para o usuário atual
              if (newMessage.to_username === currentUsername && newMessage.from_username !== currentUsername) {
                setUnreadCount(prev => {
                  const newCount = prev + 1;
                  console.log('📊 Contador de não lidas atualizado (privada):', newCount);
                  return newCount;
                });
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'internal_messages'
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          setMessages(prev =>
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          );
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Status da subscrição Realtime:', status, err);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Conectado ao Realtime para mensagens - aguardando novas mensagens...');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na conexão Realtime:', err);
          console.error('💡 Verifique se a tabela internal_messages está habilitada para Realtime no Supabase');
        } else if (status === 'TIMED_OUT') {
          console.warn('⏱️ Timeout na conexão Realtime - tentando reconectar...');
        } else if (status === 'CLOSED') {
          console.warn('🔌 Conexão Realtime fechada');
        } else {
          console.log('🔄 Status intermediário:', status);
        }
      });

    channelRef.current = channel;

    // Canal de presença para usuários online
    const presenceChannel = supabase
      .channel('online_users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: OnlineUser[] = [];
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.username) {
              users.push({
                username: presence.username,
                isOnline: true,
                lastSeen: Date.now()
              });
            }
          });
        });
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const newUsers = newPresences
          .filter((presence: any) => presence.username)
          .map((presence: any) => ({
            username: presence.username,
            isOnline: true,
            lastSeen: Date.now()
          }));
        setOnlineUsers(prev => {
          const updated = [...prev];
          newUsers.forEach((user: OnlineUser) => {
            const index = updated.findIndex(u => u.username === user.username);
            if (index >= 0) {
              updated[index] = user;
            } else {
              updated.push(user);
            }
          });
          return updated;
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const leftUsernames = leftPresences
          .filter((presence: any) => presence.username)
          .map((presence: any) => presence.username);
        setOnlineUsers(prev =>
          prev.filter(user => !leftUsernames.includes(user.username))
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Enviar presença do usuário atual
          await presenceChannel.track({
            username: currentUsername,
            online_at: new Date().toISOString()
          });
        }
      });

    presenceChannelRef.current = presenceChannel;

    // Carregar mensagens iniciais
    loadMessages();

    // Limpeza ao desmontar
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (presenceChannelRef.current) {
        presenceChannelRef.current.track({ username: currentUsername, online_at: null });
        supabase.removeChannel(presenceChannelRef.current);
      }
    };
  }, [currentUsername, loadMessages]);

  // Enviar mensagem
  const sendMessage = useCallback(async (
    message: string,
    type: 'group' | 'private' = 'group',
    toUsername?: string
  ) => {
    if (!currentUsername || !message.trim()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('internal_messages')
        .insert({
          from_username: currentUsername,
          to_username: type === 'private' ? toUsername || null : null,
          message: message.trim(),
          message_type: type,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      return data as ChatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [currentUsername]);

  // Marcar mensagens como lidas
  const markAsRead = useCallback(async (fromUsername?: string) => {
    if (!currentUsername) return;

    try {
      let query = supabase
        .from('internal_messages')
        .update({ read: true })
        .eq('read', false);

      if (fromUsername) {
        // Marcar mensagens de um usuário específico
        query = query.or(
          `and(message_type.eq.private,from_username.eq.${fromUsername},to_username.eq.${currentUsername}),and(message_type.eq.group,from_username.eq.${fromUsername})`
        );
      } else {
        // Marcar todas as mensagens não lidas para o usuário atual
        query = query.or(
          `and(message_type.eq.group,from_username.neq.${currentUsername}),and(message_type.eq.private,to_username.eq.${currentUsername})`
        );
      }

      const { error } = await query;

      if (error) throw error;

      // Atualizar estado local
      setMessages(prev =>
        prev.map(msg => {
          if (msg.read) return msg;
          if (fromUsername) {
            if (msg.from_username === fromUsername && 
                (msg.message_type === 'group' || msg.to_username === currentUsername)) {
              return { ...msg, read: true };
            }
          } else {
            if (msg.from_username !== currentUsername &&
                (msg.message_type === 'group' || msg.to_username === currentUsername)) {
              return { ...msg, read: true };
            }
          }
          return msg;
        })
      );

      // Recalcular não lidas
      const updatedMessages = messages.map(msg => {
        if (msg.read) return msg;
        if (fromUsername) {
          if (msg.from_username === fromUsername && 
              (msg.message_type === 'group' || msg.to_username === currentUsername)) {
            return { ...msg, read: true };
          }
        } else {
          if (msg.from_username !== currentUsername &&
              (msg.message_type === 'group' || msg.to_username === currentUsername)) {
            return { ...msg, read: true };
          }
        }
        return msg;
      });

      const unread = updatedMessages.filter(
        msg => !msg.read && 
        msg.from_username !== currentUsername &&
        (msg.message_type === 'group' || msg.to_username === currentUsername)
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUsername, messages]);

  // Obter mensagens entre dois usuários
  const getMessagesBetween = useCallback((user1: string, user2: string) => {
    return messages.filter(msg =>
      msg.message_type === 'private' &&
      ((msg.from_username === user1 && msg.to_username === user2) ||
       (msg.from_username === user2 && msg.to_username === user1))
    ).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages]);

  // Obter contagem de não lidas de um usuário específico
  const getUnreadCountFrom = useCallback((fromUsername: string) => {
    return messages.filter(
      msg => !msg.read &&
      msg.from_username === fromUsername &&
      msg.from_username !== currentUsername &&
      (msg.message_type === 'group' || msg.to_username === currentUsername)
    ).length;
  }, [messages, currentUsername]);

  // Limpar notificações
  const clearNotifications = useCallback(() => {
    setUnreadCount(0);
    if (currentUsername) {
      markAsRead();
    }
  }, [currentUsername, markAsRead]);

  return {
    messages,
    onlineUsers,
    isConnected,
    unreadCount,
    isLoading,
    sendMessage,
    markAsRead,
    getMessagesBetween,
    getUnreadCountFrom,
    clearNotifications,
    reloadMessages: loadMessages
  };
}

