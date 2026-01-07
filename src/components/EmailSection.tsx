
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Inbox, 
  Send, 
  FileEdit, 
  Trash2, 
  Star, 
  Archive, 
  MailPlus,
  Search,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  RefreshCw,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEmails, type Email, type EmailDraft } from '@/hooks/useEmails';
import { toast } from 'sonner';
import { sanitizeEmailHtml } from '@/utils/sanitizeHtml';

export function EmailSection() {
  const { 
    emails, 
    isLoading, 
    currentUser,
    emailAccount,
    syncEmails, 
    isSyncing, 
    sendEmail, 
    isSending,
    markAsRead,
    toggleStar
  } = useEmails();

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailDraft, setEmailDraft] = useState<EmailDraft>({
    to_email: '',
    subject: '',
    content_html: ''
  });

  // Auto-sync emails every 5 minutes
  useEffect(() => {
    if (currentUser) {
      syncEmails();
      const interval = setInterval(() => {
        syncEmails();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const folders = [
    { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox, count: emails.filter(e => e.folder === 'inbox').length },
    { id: 'sent', name: 'Enviados', icon: Send, count: emails.filter(e => e.folder === 'sent').length },
    { id: 'drafts', name: 'Rascunhos', icon: FileEdit, count: 0 },
    { id: 'starred', name: 'Favoritos', icon: Star, count: emails.filter(e => e.is_starred).length },
    { id: 'archived', name: 'Arquivados', icon: Archive, count: emails.filter(e => e.folder === 'archived').length },
    { id: 'trash', name: 'Lixeira', icon: Trash2, count: emails.filter(e => e.folder === 'trash').length }
  ];

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.from_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFolder = activeFolder === 'starred' 
      ? email.is_starred 
      : email.folder === activeFolder;
    
    return matchesSearch && matchesFolder;
  });

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsComposing(false);
    
    if (!email.is_read) {
      markAsRead(email.id);
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setEmailDraft({
      to_email: '',
      subject: '',
      content_html: ''
    });
  };

  const handleReply = (email: Email) => {
    setIsComposing(true);
    setSelectedEmail(null);
    setEmailDraft({
      to_email: email.from_email,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      content_html: `<br><br>---<br>Em ${new Date(email.date_received).toLocaleString()}, ${email.from_name || email.from_email} escreveu:<br>${email.content_html || email.content_text || ''}`,
      reply_to_email_id: email.id
    });
  };

  const handleSendEmail = () => {
    if (!emailDraft.to_email || !emailDraft.subject) {
      toast.error('Preencha o destinatário e o assunto');
      return;
    }

    sendEmail(emailDraft);
    setIsComposing(false);
    setEmailDraft({
      to_email: '',
      subject: '',
      content_html: ''
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return `${days} dias`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
        <span className="ml-2">Carregando emails...</span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          {/* Informações do usuário e conta */}
          <div className="mb-4 p-3 bg-bege-principal/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-bege-principal" />
              <span className="text-sm font-medium text-bege-principal">
                {currentUser.username}
              </span>
              <Badge variant="outline" className="text-xs">
                {currentUser.role === 'secretary' ? 'Secretária' : 
                 currentUser.role === 'doctor' ? 'Médico' : 'Admin'}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              Email: {emailAccount}
            </div>
            {currentUser.username === 'financeiro' && (
              <div className="text-xs text-orange-600 mt-1">
                🔒 Acesso apenas aos emails financeiros
              </div>
            )}
            {currentUser.role === 'doctor' && (
              <div className="text-xs text-blue-600 mt-1">
                ℹ️ Emails financeiros não visíveis
              </div>
            )}
          </div>

          <Button 
            onClick={handleCompose}
            className="w-full bg-bege-principal hover:bg-marrom-acentuado mb-2"
          >
            <MailPlus className="h-4 w-4 mr-2" />
            Escrever
          </Button>
          <Button 
            onClick={() => syncEmails()}
            disabled={isSyncing}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Atualizar'}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                  activeFolder === folder.id ? 'bg-bege-principal/10 text-bege-principal' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <folder.icon className="h-4 w-4 mr-3" />
                  {folder.name}
                </div>
                {folder.count > 0 && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Email List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-100">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum email encontrado</p>
                {currentUser.username === 'financeiro' && (
                  <p className="text-xs mt-2">
                    Você só pode ver emails da conta financeiro@iosantaluzia.com.br
                  </p>
                )}
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-bege-principal/5 border-r-2 border-bege-principal' : ''
                  } ${!email.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-sm ${!email.is_read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                      {email.from_name || email.from_email}
                    </span>
                    <div className="flex items-center space-x-1 ml-2">
                      {email.is_starred && (
                        <button onClick={(e) => {
                          e.stopPropagation();
                          toggleStar({ emailId: email.id, isStarred: email.is_starred });
                        }}>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </button>
                      )}
                      {email.has_attachments && <Paperclip className="h-3 w-3 text-gray-400" />}
                      <span className="text-xs text-gray-500">{formatDate(email.date_received)}</span>
                    </div>
                  </div>
                  <h3 className={`text-sm ${!email.is_read ? 'font-semibold' : ''} text-gray-900 mb-1 truncate`}>
                    {email.subject}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {email.content_text?.slice(0, 100) || email.content_html?.replace(/<[^>]*>/g, '').slice(0, 100) || ''}
                  </p>
                  {/* Indicador de email financeiro */}
                  {(email.to_email === 'financeiro@iosantaluzia.com.br' || email.from_email === 'financeiro@iosantaluzia.com.br') && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                        💰 Financeiro
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white">
        {isComposing ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Nova Mensagem</h2>
              <p className="text-sm text-gray-600 mt-1">Enviando de: {emailAccount}</p>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
                <Input 
                  placeholder="destinatario@email.com"
                  value={emailDraft.to_email}
                  onChange={(e) => setEmailDraft({ ...emailDraft, to_email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto:</label>
                <Input 
                  placeholder="Assunto do email"
                  value={emailDraft.subject}
                  onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem:</label>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="flex-1 min-h-[300px] resize-none"
                  value={emailDraft.content_html}
                  onChange={(e) => setEmailDraft({ ...emailDraft, content_html: e.target.value })}
                />
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-1" />
                    Anexar
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-bege-principal hover:bg-marrom-acentuado"
                    onClick={handleSendEmail}
                    disabled={isSending}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isSending ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-900">{selectedEmail.subject}</h2>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleReply(selectedEmail)}>
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Forward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">{selectedEmail.from_name || selectedEmail.from_email}</span>
                  <span className="mx-2">para</span>
                  <span>{selectedEmail.to_email}</span>
                </div>
                <span>{formatDate(selectedEmail.date_received)}</span>
              </div>
              {/* Indicador de email financeiro no cabeçalho */}
              {(selectedEmail.to_email === 'financeiro@iosantaluzia.com.br' || selectedEmail.from_email === 'financeiro@iosantaluzia.com.br') && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    💰 Email Financeiro
                  </Badge>
                </div>
              )}
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="prose max-w-none">
                {selectedEmail.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(selectedEmail.content_html) }} />
                ) : (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.content_text}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione um email para visualizar</p>
              {emails.length === 0 && (
                <p className="text-sm mt-2">
                  Clique em "Atualizar" para sincronizar seus emails
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
