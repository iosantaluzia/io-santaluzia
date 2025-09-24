import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, LogOut, Users, Eye, EyeOff, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { toast } from 'sonner';
import { LocalLoginForm } from '@/components/LocalLoginForm';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

const Admin = () => {
  const { isAuthenticated, appUser, signOut } = useLocalAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('admin-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('admin-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Simulate online users (in a real app, this would come from a server)
  useEffect(() => {
    if (isAuthenticated && appUser) {
      // Add current user to online list
      setOnlineUsers(prev => {
        if (!prev.includes(appUser.username)) {
          return [...prev, appUser.username];
        }
        return prev;
      });

      // Simulate other users being online
      const allUsers = ['matheus', 'fabiola', 'thauanne', 'beatriz'];
      const otherUsers = allUsers.filter(user => user !== appUser.username);
      
      // Randomly show some users as online
      const randomOnlineUsers = otherUsers.filter(() => Math.random() > 0.5);
      setOnlineUsers(prev => [...new Set([...prev, ...randomOnlineUsers])]);
    }
  }, [isAuthenticated, appUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !appUser?.username) return;

    setIsLoading(true);
    
    try {
      const message: Message = {
        id: Date.now().toString(),
        username: appUser.username,
        message: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Show notification
      toast.success(`Mensagem enviada como ${appUser.username}!`);
      
      // Simulate typing indicator for other users
      setTimeout(() => {
        toast.info('Outros membros da equipe podem ver sua mensagem');
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('admin-chat-messages');
    toast.success('Chat limpo!');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  if (!isAuthenticated) {
    return <LocalLoginForm />;
  }

  // Debug log
  console.log('Admin component rendered:', { isAuthenticated, appUser });

  // Show loading state if user is authenticated but appUser is not loaded yet
  if (isAuthenticated && !appUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-medical-primary">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                Logado como: <span className="font-semibold capitalize">{appUser?.username}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pacientes</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Consultas</p>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <LayoutDashboard className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Exames</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Equipe</p>
                      <p className="text-2xl font-bold text-gray-900">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova consulta agendada</p>
                      <p className="text-xs text-gray-500">Há 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Exame de OCT realizado</p>
                      <p className="text-xs text-gray-500">Há 15 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Relatório de cirurgia enviado</p>
                      <p className="text-xs text-gray-500">Há 1 hora</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm">Novo Paciente</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <MessageCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm">Agendar Consulta</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <LayoutDashboard className="w-6 h-6 mb-2" />
                    <span className="text-sm">Solicitar Exame</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <MessageCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm">Enviar Relatório</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Mensagens da Equipe
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUsers(!showUsers)}
                      >
                        {showUsers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showUsers ? 'Ocultar' : 'Mostrar'} Usuários
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                      >
                        Limpar Chat
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {Object.keys(groupedMessages).length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma mensagem ainda.</p>
                        <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
                      </div>
                    ) : (
                      Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                          <div className="text-center text-xs text-gray-500 mb-3 sticky top-0 bg-gray-50 py-1">
                            {date}
                          </div>
                          {dateMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.isOwn
                                    ? 'bg-medical-primary text-white'
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                {!message.isOwn && (
                                  <div className="text-xs font-semibold text-medical-primary mb-1 capitalize">
                                    {message.username}
                                  </div>
                                )}
                                <div className="text-sm">{message.message}</div>
                                <div
                                  className={`text-xs mt-1 ${
                                    message.isOwn ? 'text-white/70' : 'text-gray-500'
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Online Users */}
            {showUsers && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Equipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['matheus', 'fabiola', 'thauanne', 'beatriz'].map((user) => (
                        <div
                          key={user}
                          className={`flex items-center space-x-2 p-2 rounded-lg ${
                            user === appUser?.username
                              ? 'bg-medical-primary/10 border border-medical-primary/20'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              onlineUsers.includes(user)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span className={`text-sm capitalize ${
                            user === appUser?.username
                              ? 'font-semibold text-medical-primary'
                              : 'text-gray-600'
                          }`}>
                            {user}
                          </span>
                          {user === appUser?.username && (
                            <span className="text-xs text-medical-primary">(você)</span>
                          )}
                          {onlineUsers.includes(user) && user !== appUser?.username && (
                            <span className="text-xs text-green-600">(online)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
