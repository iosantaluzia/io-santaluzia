import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Users, Minimize2, Maximize2 } from 'lucide-react';
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
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
}

interface FloatingChatProps {
  currentUsername: string | null;
}

export function FloatingChat({ currentUsername }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousUnreadCountRef = useRef(0);
  const previousMessagesLengthRef = useRef(0);

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

  // Detectar novas mensagens e mostrar notificações toast
  useEffect(() => {
    if (!currentUsername) return;

    // Verificar se há novas mensagens
    const currentUnread = unreadCount;
    const previousUnread = previousUnreadCountRef.current;
    
    // Se o número de não lidas aumentou, mostrar notificação toast
    if (currentUnread > previousUnread && !isOpen) {
      const newMessages = messages.filter(msg => 
        !msg.read && 
        msg.from_username !== currentUsername &&
        (msg.message_type === 'group' || msg.to_username === currentUsername)
      );
      
      if (newMessages.length > 0) {
        const latestMessage = newMessages[newMessages.length - 1];
        const senderName = latestMessage.from_username;
        const messagePreview = latestMessage.message.length > 50 
          ? latestMessage.message.substring(0, 50) + '...' 
          : latestMessage.message;
        
        if (latestMessage.message_type === 'group') {
          toast.info(`Nova mensagem de ${senderName}`, {
            description: messagePreview,
            duration: 5000,
          });
        } else {
          toast.info(`Mensagem de ${senderName}`, {
            description: messagePreview,
            duration: 5000,
          });
        }
      }
    }

    previousUnreadCountRef.current = currentUnread;
    previousMessagesLengthRef.current = messages.length;
  }, [unreadCount, messages, currentUsername, isOpen]);

  // Buscar todos os usuários cadastrados
  const { data: allRegisteredUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['app_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select('username, role, approved')
        .eq('approved', true)
        .order('username', { ascending: true });
      
      if (error) throw error;
      return data as AppUser[];
    },
  });

  // Scroll para a última mensagem
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Marcar como lida quando abrir
  useEffect(() => {
    if (isOpen && currentUsername) {
      if (selectedUser) {
        markAsRead(selectedUser);
      } else {
        markAsRead();
      }
      clearNotifications();
    }
  }, [isOpen, selectedUser, currentUsername, markAsRead, clearNotifications]);

  // Filtrar mensagens baseado no tipo de chat
  const displayMessages = selectedUser
    ? getMessagesBetween(currentUsername || '', selectedUser)
    : messages.filter(msg => msg.message_type === 'group');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUsername || isSending) return;

    setIsSending(true);
    try {
      const type = selectedUser ? 'private' : 'group';
      await sendMessage(newMessage.trim(), type, selectedUser || undefined);
      setNewMessage('');
      
      if (selectedUser) {
        toast.success(`Mensagem enviada para ${selectedUser}`);
      } else {
        toast.success('Mensagem enviada');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
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
            onClick={() => setIsOpen(true)}
            size="lg"
            className={`rounded-full h-14 w-14 shadow-lg relative transition-colors ${
              unreadCount > 0 
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
          <Card className="flex flex-col h-full shadow-2xl">
            <CardHeader className="flex-shrink-0 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-medical-primary" />
                  <h3 className="font-semibold text-lg">
                    {selectedUser ? `Chat com ${selectedUser}` : 'Chat da Equipe'}
                  </h3>
                  {isConnected && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedUser(null);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                <div className="flex flex-1 overflow-hidden">
                  {/* Lista de usuários */}
                  <div className="w-32 border-r flex-shrink-0 bg-gray-50">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-1">
                        <Button
                          variant={selectedUser === null ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => setSelectedUser(null)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Grupo
                        </Button>
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
                                    className={`w-2 h-2 rounded-full ${
                                      user?.isOnline ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                  />
                                  <span className="truncate capitalize">{username}</span>
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
                                const isOwn = message.from_username === currentUsername;
                                return (
                                  <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                                  >
                                    <div
                                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                        isOwn
                                          ? 'bg-medical-primary text-white'
                                          : 'bg-gray-100 text-gray-900'
                                      }`}
                                    >
                                      {!isOwn && (
                                        <div className="text-xs font-semibold mb-1 capitalize">
                                          {message.from_username}
                                        </div>
                                      )}
                                      <div className="text-sm whitespace-pre-wrap break-words">
                                        {message.message}
                                      </div>
                                      <div
                                        className={`text-xs mt-1 ${
                                          isOwn ? 'text-white/70' : 'text-gray-500'
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
                              ? `Enviar mensagem para ${selectedUser}...`
                              : 'Enviar mensagem para o grupo...'
                          }
                          disabled={isSending || !isConnected}
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          disabled={isSending || !newMessage.trim() || !isConnected}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                      {!isConnected && (
                        <p className="text-xs text-red-500 mt-1">
                          Reconectando...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

