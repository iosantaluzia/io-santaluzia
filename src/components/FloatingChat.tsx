import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppUser {
  id: string;
  username: string;
  display_name: string | null;
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
}

interface FloatingChatProps {
  currentUsername: string | null;
}

export function FloatingChat({ currentUsername }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousUnreadCountRef = useRef(0);
  const previousMessagesLengthRef = useRef(0);
  const notifiedMessageIdsRef = useRef<Set<string>>(new Set());

  // Inicializar chat (silencioso)
  useEffect(() => {
    if (!currentUsername) {
      console.warn('⚠️ FloatingChat sem currentUsername');
    }
  }, [currentUsername]);

  const {
    messages,
    onlineUsers,
    isConnected,
    unreadCount,
    isLoading,
    sendMessage,
    markAsRead,
    getMessagesBetween,
    getUnreadCountFrom,
    clearNotifications
  } = useRealtimeChat(currentUsername);

  // Solicitar permissão para notificações do navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Ref para rastrear IDs de mensagens já processadas
  const processedMessageIdsRef = useRef<Set<string>>(new Set());

  // Detectar novas mensagens e mostrar notificações toast
  useEffect(() => {
    if (!currentUsername || isOpen) {
      // Atualizar refs mesmo quando o chat está aberto ou sem usuário
      previousUnreadCountRef.current = unreadCount;
      previousMessagesLengthRef.current = messages.length;
      return;
    }

    const currentUsernameLower = currentUsername.toLowerCase();

    // Encontrar mensagens não lidas que ainda não foram notificadas
    const unreadMessages = messages.filter(msg => {
      const msgFromLower = (msg.from_username || '').toLowerCase();
      const msgToLower = (msg.to_username || '').toLowerCase();

      return !msg.read &&
        msgFromLower !== currentUsernameLower &&
        (msg.message_type === 'group' || msgToLower === currentUsernameLower) &&
        !notifiedMessageIdsRef.current.has(msg.id) &&
        !processedMessageIdsRef.current.has(msg.id);
    });

    // Se houver novas mensagens não notificadas
    if (unreadMessages.length > 0) {
      console.log('🔔 Detectadas novas mensagens não notificadas:', unreadMessages.length);

      // Ordenar por data mais recente
      const sortedNewMessages = [...unreadMessages].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Mostrar toast apenas para a mensagem mais recente
      const latestMessage = sortedNewMessages[0];
      // Usar display_name se disponível, senão usar username
      const senderDisplayName = allRegisteredUsers.find(u =>
        u.username.toLowerCase() === latestMessage.from_username?.toLowerCase()
      )?.display_name || latestMessage.from_username;
      const messagePreview = latestMessage.message.length > 50
        ? latestMessage.message.substring(0, 50) + '...'
        : latestMessage.message;

      // Marcar como notificada e processada
      notifiedMessageIdsRef.current.add(latestMessage.id);
      processedMessageIdsRef.current.add(latestMessage.id);

      // Tocar som de notificação (uma vez por mensagem)
      try {
        const audio = new Audio('/sound-messages.mp3');
        audio.volume = 0.5; // Volume em 50% para não ser muito alto
        audio.play().catch(error => {
          console.warn('⚠️ Não foi possível tocar o som de notificação:', error);
          // Alguns navegadores bloqueiam autoplay de áudio até que o usuário interaja com a página
        });
      } catch (error) {
        console.warn('⚠️ Erro ao criar áudio de notificação:', error);
      }

      console.log('📢 Exibindo notificação toast para:', {
        id: latestMessage.id,
        from: senderDisplayName,
        type: latestMessage.message_type
      });

      // Determinar qual conversa abrir ao clicar
      const conversationToOpen = latestMessage.message_type === 'group'
        ? null
        : latestMessage.from_username;

      // Função para abrir a conversa e marcar como lida (para badge/toast sumirem)
      const openConversation = () => {
        setSelectedUser(conversationToOpen);
        setIsOpen(true);
        markAsRead(conversationToOpen ?? undefined);
      };

      // Criar toast customizado com JSX para tornar clicável
      toast.custom(
        (t) => (
          <div
            onClick={openConversation}
            className="group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="20"
                  width="20"
                  className="text-blue-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {latestMessage.message_type === 'group'
                    ? `Nova mensagem de ${senderDisplayName}`
                    : `Mensagem de ${senderDisplayName}`}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {messagePreview}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss(t);
                }}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
                aria-label="Fechar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="16"
                  width="16"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
        }
      );
    }

    // Limpar IDs de mensagens que foram lidas
    const readMessages = messages.filter(msg => msg.read);
    readMessages.forEach(msg => {
      notifiedMessageIdsRef.current.delete(msg.id);
      processedMessageIdsRef.current.delete(msg.id);
    });

    // Atualizar refs
    previousUnreadCountRef.current = unreadCount;
    previousMessagesLengthRef.current = messages.length;
  }, [unreadCount, messages, currentUsername, isOpen]);

  // Buscar todos os usuários cadastrados
  const { data: allRegisteredUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['app_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select('username, display_name, role, approved')
        .eq('approved', true)
        .order('username', { ascending: true });

      if (error) throw error;
      return data as AppUser[];
    },
  });

  // Função auxiliar para obter o nome de exibição de um usuário
  const getDisplayName = (username: string | null | undefined): string => {
    if (!username) return 'Usuário';
    const user = allRegisteredUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user?.display_name || user?.username || username;
  };

  // Scroll para a última mensagem
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Função para encontrar a conversa com mensagem não lida mais recente
  const findLatestUnreadConversation = useCallback(() => {
    if (!currentUsername) return null;

    const currentUsernameLower = currentUsername.toLowerCase();

    const unreadMessages = messages.filter(msg => {
      const msgFromLower = (msg.from_username || '').toLowerCase();
      const msgToLower = (msg.to_username || '').toLowerCase();

      return !msg.read &&
        msgFromLower !== currentUsernameLower &&
        (msg.message_type === 'group' || msgToLower === currentUsernameLower);
    });

    if (unreadMessages.length === 0) return null;

    // Ordenar por data mais recente
    const sortedUnread = [...unreadMessages].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const latestMessage = sortedUnread[0];

    // Se for mensagem de grupo (todos), retornar null (para abrir em "Todos")
    if (latestMessage.message_type === 'group') {
      return null;
    }

    // Se for mensagem privada, retornar o remetente
    return latestMessage.from_username;
  }, [messages, currentUsername]);

  // Não marcar como lida ao abrir o modal — apenas quando o usuário abrir uma conversa específica
  // (ao clicar no botão flutuante com conversa pré-selecionada ou ao clicar em um item da lista)

  // Filtrar mensagens baseado no tipo de chat
  const displayMessages = selectedUser
    ? getMessagesBetween(currentUsername || '', selectedUser)
    : messages.filter(msg => msg.message_type === 'group');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUsername || isSending) {
      if (!currentUsername) {
        toast.error('Usuário não identificado. Faça login novamente.');
      }
      return;
    }

    setIsSending(true);
    try {
      const type = selectedUser ? 'private' : 'group';
      console.log('📨 Enviando mensagem via FloatingChat:', {
        currentUsername,
        type,
        selectedUser,
        messageLength: newMessage.trim().length
      });

      await sendMessage(newMessage.trim(), type, selectedUser || undefined);
      setNewMessage('');

      if (selectedUser) {
        toast.success(`Mensagem enviada para ${selectedUser}`);
      } else {
        toast.success('Mensagem enviada');
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem no FloatingChat:', error);
      const errorMessage = error?.message || 'Erro desconhecido ao enviar mensagem';
      toast.error(`Erro ao enviar mensagem: ${errorMessage}`);

      // Log detalhado para debug
      if (error?.code) {
        console.error('Código do erro:', error.code);
      }
      if (error?.details) {
        console.error('Detalhes do erro:', error.details);
      }
      if (error?.hint) {
        console.error('Dica do erro:', error.hint);
      }
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  // Agrupar mensagens por data
  const groupedMessages = displayMessages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof displayMessages>);

  // Combinar usuários cadastrados com usuários online
  // Priorizar usuários cadastrados, mas incluir também usuários que aparecem nas mensagens
  const allUsers = Array.from(
    new Set([
      ...allRegisteredUsers.map(u => u.username),
      ...onlineUsers.map(u => u.username),
      ...messages.map(m => m.from_username),
      ...(currentUsername ? [currentUsername] : [])
    ])
  )
    .filter(Boolean)
    .filter(u => u !== currentUsername)
    .sort();

  if (!currentUsername) {
    return null;
  }

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => {
              // Se houver mensagens não lidas, abrir na conversa mais recente e marcar essa conversa como lida
              if (unreadCount > 0) {
                const latestConversation = findLatestUnreadConversation();
                setSelectedUser(latestConversation);
                // Marcar como lida a conversa que estamos abrindo (null = Todos/grupo)
                markAsRead(latestConversation ?? undefined);
              }
              setIsOpen(true);
            }}
            size="lg"
            className={`rounded-full h-14 w-14 shadow-lg relative transition-colors ${unreadCount > 0
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-medical-primary hover:bg-medical-primary/90'
              }`}
          >
            <MessageCircle className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
            {isConnected && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </Button>
        </div>
      )}

      {/* Janela de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col">
          <Card className="flex flex-col h-full shadow-2xl rounded-t-lg overflow-hidden">
            <CardHeader className="flex-shrink-0 pb-3 bg-medical-primary border-b-0 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-white" />
                  <h3 className="font-semibold text-lg text-white">
                    {selectedUser ? `Chat com ${getDisplayName(selectedUser)}` : 'Chat com Todos'}
                  </h3>
                  {isConnected && (
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedUser(null);
                    }}
                    className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="flex flex-1 overflow-hidden">
              {/* Lista de usuários */}
              <div className="w-32 border-r flex-shrink-0 bg-gray-50 flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    <Button
                      variant={selectedUser === null ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => {
                        setSelectedUser(null);
                        markAsRead(); // Marcar mensagens do grupo como lidas ao abrir "Todos"
                      }}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Todos
                    </Button>
                    <div className="border-t border-medical-primary/30 my-1" />
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-primary" />
                      </div>
                    ) : (
                      allUsers.map(username => {
                        const user = onlineUsers.find(u => u.username === username);
                        const registeredUser = allRegisteredUsers.find(u => u.username === username);
                        const unread = getUnreadCountFrom(username);
                        return (
                          <Button
                            key={username}
                            variant={selectedUser === username ? 'default' : 'ghost'}
                            size="sm"
                            className="w-full justify-start text-xs relative"
                            onClick={() => {
                              setSelectedUser(username);
                              markAsRead(username);
                            }}
                          >
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                              />
                              <span className="truncate">{getDisplayName(username)}</span>
                            </div>
                            {unread > 0 && (
                              <Badge className="ml-1 h-4 px-1 text-xs bg-red-500">
                                {unread > 9 ? '9+' : unread}
                              </Badge>
                            )}
                          </Button>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>

                <div className="p-2 border-t bg-gray-50 text-center">
                  {!isConnected && (
                    <p className="text-[10px] text-yellow-600 leading-tight">
                      ⚠️ Reconectando...
                    </p>
                  )}
                  {isConnected && (
                    <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                      <span>✓</span> Conectado
                    </p>
                  )}
                </div>
              </div>

              {/* Área de mensagens */}
              <div className="flex-1 flex flex-col min-w-0">
                <ScrollArea className="flex-1 p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary" />
                    </div>
                  ) : Object.keys(groupedMessages).length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma mensagem ainda.</p>
                      <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                          <div className="text-center text-xs text-gray-500 mb-3 sticky top-0 bg-white py-1">
                            {date}
                          </div>
                          {dateMessages.map((message) => {
                            const isOwn = (message.from_username?.toLowerCase() || '') === (currentUsername?.toLowerCase() || '');
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                              >
                                <div
                                  className={`max-w-[80%] px-4 py-2 rounded-lg ${isOwn
                                    ? 'bg-medical-primary text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                  {!isOwn && (
                                    <div className="text-xs font-semibold mb-1">
                                      {getDisplayName(message.from_username)}
                                    </div>
                                  )}
                                  <div className="text-sm whitespace-pre-wrap break-words">
                                    {message.message}
                                  </div>
                                  <div
                                    className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'
                                      }`}
                                  >
                                    {formatTime(message.created_at)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input de mensagem */}
                <div className="border-t p-3 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        selectedUser
                          ? `Enviar mensagem para ${getDisplayName(selectedUser)}...`
                          : 'Enviar mensagem para todos...'
                      }
                      disabled={isSending}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !isSending && newMessage.trim()) {
                          e.preventDefault();
                          handleSendMessage(e as any);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={isSending || !newMessage.trim()}
                      size="sm"
                      className="bg-medical-primary text-white hover:bg-medical-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}


