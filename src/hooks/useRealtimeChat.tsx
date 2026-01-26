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

    // Canal para mensagens - escutar TODAS as inserções e filtrar no código
    // Usar um nome de canal estável baseado no username para evitar múltiplas conexões
    const channelName = `internal_messages_${usernameLower}`;
    console.log('📡 Criando canal Realtime:', channelName);
    
    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false },
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'internal_messages',
          filter: undefined // Sem filtro - escutar todas as inserções
        },
        (payload) => {
          console.log('📨 Nova mensagem recebida via Realtime:', payload);
          console.log('📨 Payload completo:', JSON.stringify(payload, null, 2));
          const newMessage = payload.new as ChatMessage;
          
          // Garantir comparação case-insensitive
          const currentUsernameLower = currentUsername.toLowerCase();
          const fromUsernameLower = newMessage.from_username?.toLowerCase() || '';
          const toUsernameLower = newMessage.to_username?.toLowerCase() || '';

          // Verificar se é mensagem relevante para o usuário atual
          const isRelevant = 
            newMessage.message_type === 'group' ||
            (newMessage.message_type === 'private' && 
             (toUsernameLower === currentUsernameLower || fromUsernameLower === currentUsernameLower));

          if (!isRelevant) {
            console.log('⚠️ Mensagem não relevante para o usuário atual, ignorando');
            return;
          }

          // Adicionar mensagem ao estado
          setMessages(prev => {
            // Evitar duplicatas
            if (prev.some(msg => msg.id === newMessage.id)) {
              console.log('⚠️ Mensagem duplicada ignorada:', newMessage.id);
              return prev;
            }
            
            console.log('✅ Mensagem adicionada via Realtime:', {
              id: newMessage.id,
              type: newMessage.message_type,
              from: newMessage.from_username,
              to: newMessage.to_username,
              read: newMessage.read
            });
            
            // O unreadCount será recalculado automaticamente pelo useEffect quando messages mudar
            return [...prev, newMessage];
          });
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
          console.log('🔄 Mensagem atualizada via Realtime:', payload);
          const updatedMessage = payload.new as ChatMessage;
          setMessages(prev =>
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          );
        }
      )
      .subscribe(async (status, err) => {
        console.log('📡 Status da subscrição Realtime:', status, err);
        console.log('📡 Detalhes do canal:', {
          name: channelName,
          state: channel.state,
          topic: channel.topic
        });
        
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Conectado ao Realtime para mensagens - aguardando novas mensagens...');
          console.log('📊 Canal ativo:', channelName);
          console.log('📊 Estado do canal:', channel.state);
          console.log('📊 Tópico do canal:', channel.topic);
          
          // Verificar se o canal está realmente escutando
          const channelState = channel.state;
          if (channelState !== 'joined') {
            console.warn('⚠️ Canal não está no estado "joined", estado atual:', channelState);
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na conexão Realtime:', err);
          console.error('💡 Verifique se a tabela internal_messages está habilitada para Realtime no Supabase');
          setIsConnected(false);
        } else if (status === 'TIMED_OUT') {
          console.warn('⏱️ Timeout na conexão Realtime - tentando reconectar...');
          setIsConnected(false);
          // Tentar reconectar após um delay
          setTimeout(() => {
            if (channelRef.current && currentUsername) {
              console.log('🔄 Tentando reconectar...');
              channelRef.current.subscribe();
            }
          }, 2000);
        } else if (status === 'CLOSED') {
          console.warn('🔌 Conexão Realtime fechada');
          setIsConnected(false);
        } else {
          console.log('🔄 Status intermediário:', status);
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
      
      // Atualizar estado local IMEDIATAMENTE para que a mensagem apareça na tela
      const newMessage = data as ChatMessage;
      setMessages(prev => {
        // Evitar duplicatas caso o Realtime também adicione
        if (prev.some(msg => msg.id === newMessage.id)) {
          console.log('⚠️ Mensagem já existe no estado, ignorando duplicata');
          return prev;
        }
        console.log('✅ Adicionando mensagem ao estado local imediatamente');
        return [...prev, newMessage];
      });
      
      return newMessage;
    } catch (error) {
      console.error('❌ Exceção ao enviar mensagem:', error);
      throw error;
    }
  }, [currentUsername]);

  // Marcar mensagens como lidas
  const markAsRead = useCallback(async (fromUsername?: string) => {
    if (!currentUsername) return;

    try {
      // Garantir que os usernames estão em minúsculas
      const usernameLower = currentUsername.toLowerCase();
      const fromUsernameLower = fromUsername?.toLowerCase();

      let query = supabase
        .from('internal_messages')
        .update({ read: true })
        .eq('read', false);

      if (fromUsernameLower) {
        // Marcar mensagens de um usuário específico
        query = query.or(
          `and(message_type.eq.private,from_username.eq.${fromUsernameLower},to_username.eq.${usernameLower}),and(message_type.eq.group,from_username.eq.${fromUsernameLower})`
        );
      } else {
        // Marcar todas as mensagens não lidas para o usuário atual
        query = query.or(
          `and(message_type.eq.group,from_username.neq.${usernameLower}),and(message_type.eq.private,to_username.eq.${usernameLower})`
        );
      }

      const { error } = await query;

      if (error) throw error;

      // Atualizar estado local
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

      // Recalcular não lidas
      const updatedMessages = messages.map(msg => {
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
      });

      const unread = updatedMessages.filter(
        msg => !msg.read && 
        (msg.from_username?.toLowerCase() || '') !== usernameLower &&
        (msg.message_type === 'group' || (msg.to_username?.toLowerCase() || '') === usernameLower)
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUsername, messages]);

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

