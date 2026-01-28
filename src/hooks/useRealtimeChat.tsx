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
  const currentUsernameRef = useRef<string | null>(null);

  // Carregar mensagens iniciais (últimas 24 horas)
  const loadMessages = useCallback(async () => {
    if (!currentUsername) return;

    try {
      // Garantir que o username está em minúsculas
      const usernameLower = currentUsername.toLowerCase();
      
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
        .or(`from_username.eq.${usernameLower},to_username.eq.${usernameLower}`)
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
      const unread = allMessages.filter(
        msg => !msg.read && 
        msg.from_username?.toLowerCase() !== usernameLower &&
        (msg.message_type === 'group' || msg.to_username?.toLowerCase() === usernameLower)
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
      currentUsernameRef.current = null;
      return;
    }

    // Sempre recriar o canal para garantir que está funcionando
    // A verificação anterior estava impedindo a subscrição correta
    console.log('🔄 Recriando canal Realtime para garantir conexão ativa');

    console.log('🔌 Configurando Realtime para usuário:', currentUsername);
    currentUsernameRef.current = currentUsername;

    // Garantir que o username está em minúsculas
    const usernameLower = currentUsername.toLowerCase();

    // Limpar canais anteriores apenas se existirem
    if (channelRef.current) {
      console.log('🧹 Limpando canal anterior...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }

    // Canal compartilhado para mensagens: todos os usuários no mesmo canal para Broadcast em tempo real
    // Nome fixo para que quem envia faça broadcast e todos os inscritos recebam
    const channelName = 'internal_messages_live';
    console.log('📡 Criando canal Realtime (compartilhado):', channelName);

    const addMessageIfRelevant = (newMessage: ChatMessage) => {
      const currentUsernameLower = currentUsername.toLowerCase();
      const fromUsernameLower = newMessage.from_username?.toLowerCase() || '';
      const toUsernameLower = newMessage.to_username?.toLowerCase() || '';
      const isRelevant =
        newMessage.message_type === 'group' ||
        (newMessage.message_type === 'private' &&
          (toUsernameLower === currentUsernameLower || fromUsernameLower === currentUsernameLower));
      if (!isRelevant) return;
      setMessages(prev => {
        if (prev.some(msg => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    };

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false },
        },
      })
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload: { message?: ChatMessage; payload?: { message?: ChatMessage } }) => {
          const newMessage = payload?.message ?? payload?.payload?.message;
          if (!newMessage?.id) return;
          console.log('📨 Nova mensagem recebida via Broadcast:', newMessage.id);
          addMessageIfRelevant(newMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'internal_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          console.log('📨 Nova mensagem recebida via postgres_changes:', newMessage.id);
          addMessageIfRelevant(newMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'internal_messages',
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          setMessages(prev =>
            prev.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg))
          );
        }
      )
      .subscribe(async (status, err) => {
        console.log('📡 Status da subscrição Realtime:', status, err);
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('✅ Conectado ao Realtime (Broadcast + postgres_changes)');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na conexão Realtime:', err);
          setIsConnected(false);
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          setTimeout(() => {
            if (channelRef.current && currentUsername) {
              channelRef.current.subscribe();
            }
          }, 2000);
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    // Canal de presença para usuários online
    const presenceChannel = supabase
      .channel(`online_users_${usernameLower}`)
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
            username: usernameLower,
            online_at: new Date().toISOString()
          });
        }
      });

    presenceChannelRef.current = presenceChannel;

    // Carregar mensagens iniciais
    loadMessages();

    // Verificação periódica da conexão (a cada 30 segundos)
    const connectionCheckInterval = setInterval(() => {
      if (channelRef.current) {
        const channelState = channelRef.current.state;
        if (channelState !== 'joined' && channelState !== 'joining') {
          console.warn('⚠️ Canal Realtime desconectado, tentando reconectar...');
          setIsConnected(false);
          // Tentar reconectar
          channelRef.current.subscribe();
        } else {
          console.log('✅ Canal Realtime ainda conectado:', channelState);
        }
      }
    }, 30000);

    // Limpeza ao desmontar
    return () => {
      console.log('🧹 Limpando canais Realtime...');
      clearInterval(connectionCheckInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (presenceChannelRef.current) {
        presenceChannelRef.current.track({ username: usernameLower, online_at: null });
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsername]); // loadMessages intencionalmente omitido para evitar re-subscrições constantes

  // Recalcular unreadCount sempre que messages mudar
  useEffect(() => {
    if (!currentUsername) {
      setUnreadCount(0);
      return;
    }

    const usernameLower = currentUsername.toLowerCase();
    const unread = messages.filter(
      msg => !msg.read && 
      (msg.from_username?.toLowerCase() || '') !== usernameLower &&
      (msg.message_type === 'group' || (msg.to_username?.toLowerCase() || '') === usernameLower)
    ).length;

    setUnreadCount(unread);
    console.log('📊 UnreadCount recalculado baseado em messages:', unread);
  }, [messages, currentUsername]);

  // Enviar mensagem
  const sendMessage = useCallback(async (
    message: string,
    type: 'group' | 'private' = 'group',
    toUsername?: string
  ) => {
    if (!currentUsername || !message.trim()) {
      console.error('❌ Não é possível enviar mensagem:', { currentUsername, message: message.trim() });
      return null;
    }

    // Garantir que o username está em minúsculas
    const usernameLower = currentUsername.toLowerCase();
    const toUsernameLower = type === 'private' ? (toUsername?.toLowerCase() || null) : null;

    try {
      console.log('📤 Tentando enviar mensagem:', {
        from_username: usernameLower,
        to_username: toUsernameLower,
        message_type: type,
        message_length: message.trim().length,
        currentUsername_original: currentUsername
      });

      const { data, error } = await supabase
        .from('internal_messages')
        .insert({
          from_username: usernameLower,
          to_username: toUsernameLower,
          message: message.trim(),
          message_type: type,
          read: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        console.error('Detalhes do erro:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ Mensagem enviada com sucesso:', data);

      const newMessage = data as ChatMessage;

      // Atualizar estado local imediatamente para o remetente
      setMessages(prev => {
        if (prev.some(msg => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      // Broadcast para outros clientes receberem em tempo real (não depende de postgres_changes)
      const ch = channelRef.current;
      if (ch) {
        ch.send({
          type: 'broadcast',
          event: 'new_message',
          payload: { message: newMessage },
        }).catch((e) => console.warn('Broadcast falhou (outros usuários podem não ver em tempo real):', e));
      }

      return newMessage;
    } catch (error) {
      console.error('❌ Exceção ao enviar mensagem:', error);
      throw error;
    }
  }, [currentUsername]);

  // Marcar mensagens como lidas (atualização otimista: UI atualiza primeiro, depois persiste no Supabase)
  const markAsRead = useCallback(async (fromUsername?: string) => {
    if (!currentUsername) return;

    const usernameLower = currentUsername.toLowerCase();
    const fromUsernameLower = fromUsername?.toLowerCase();

    // 1) Atualização otimista: atualizar estado local imediatamente para o badge/toast sumirem
    setMessages(prev =>
      prev.map(msg => {
        if (msg.read) return msg;
        const msgFromLower = msg.from_username?.toLowerCase() || '';
        const msgToLower = msg.to_username?.toLowerCase() || '';
        if (fromUsernameLower) {
          if (msgFromLower === fromUsernameLower &&
              (msg.message_type === 'group' || msgToLower === usernameLower)) {
            return { ...msg, read: true };
          }
        } else {
          if (msgFromLower !== usernameLower &&
              (msg.message_type === 'group' || msgToLower === usernameLower)) {
            return { ...msg, read: true };
          }
        }
        return msg;
      })
    );

    // 2) Persistir no Supabase (se falhar, a UI já foi atualizada)
    try {
      let query = supabase
        .from('internal_messages')
        .update({ read: true })
        .eq('read', false);

      if (fromUsernameLower) {
        query = query.or(
          `and(message_type.eq.private,from_username.eq.${fromUsernameLower},to_username.eq.${usernameLower}),and(message_type.eq.group,from_username.eq.${fromUsernameLower})`
        );
      } else {
        query = query.or(
          `and(message_type.eq.group,from_username.neq.${usernameLower}),and(message_type.eq.private,to_username.eq.${usernameLower})`
        );
      }

      const { error } = await query;
      if (error) {
        console.error('Error marking messages as read (UI already updated):', error);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUsername]);

  // Obter mensagens entre dois usuários
  const getMessagesBetween = useCallback((user1: string, user2: string) => {
    const user1Lower = user1.toLowerCase();
    const user2Lower = user2.toLowerCase();
    
    return messages.filter(msg =>
      msg.message_type === 'private' &&
      ((msg.from_username?.toLowerCase() === user1Lower && msg.to_username?.toLowerCase() === user2Lower) ||
       (msg.from_username?.toLowerCase() === user2Lower && msg.to_username?.toLowerCase() === user1Lower))
    ).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages]);

  // Obter contagem de não lidas de um usuário específico
  const getUnreadCountFrom = useCallback((fromUsername: string) => {
    const fromUsernameLower = fromUsername.toLowerCase();
    const currentUsernameLower = currentUsername?.toLowerCase() || '';
    
    return messages.filter(
      msg => !msg.read &&
      (msg.from_username?.toLowerCase() || '') === fromUsernameLower &&
      (msg.from_username?.toLowerCase() || '') !== currentUsernameLower &&
      (msg.message_type === 'group' || (msg.to_username?.toLowerCase() || '') === currentUsernameLower)
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

