
import React, { useState } from 'react';
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
  Filter,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function EmailSection() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados de emails
  const emails = [
    {
      id: 1,
      from: 'paciente@email.com',
      to: 'financeiro@iosantaluzia.com.br',
      subject: 'Dúvida sobre consulta',
      preview: 'Gostaria de saber sobre os horários disponíveis...',
      content: 'Olá, gostaria de saber sobre os horários disponíveis para consulta oftalmológica. Tenho disponibilidade nas manhãs de terça e quinta-feira.',
      date: '10:30',
      isRead: false,
      isStarred: false,
      hasAttachment: false
    },
    {
      id: 2,
      from: 'fornecedor@medical.com',
      to: 'financeiro@iosantaluzia.com.br',
      subject: 'Proposta de equipamentos',
      preview: 'Segue em anexo nossa proposta comercial...',
      content: 'Prezados, seguem em anexo nossa proposta comercial para equipamentos oftalmológicos. Aguardamos retorno para agendarmos uma apresentação.',
      date: 'Ontem',
      isRead: true,
      isStarred: true,
      hasAttachment: true
    },
    {
      id: 3,
      from: 'sistema@iosantaluzia.com.br',
      to: 'financeiro@iosantaluzia.com.br',
      subject: 'Relatório mensal de faturamento',
      preview: 'Relatório automático do sistema...',
      content: 'Relatório automático gerado pelo sistema com o faturamento do mês anterior. Receita total: R$ 45.000,00.',
      date: '2 dias',
      isRead: true,
      isStarred: false,
      hasAttachment: true
    }
  ];

  const folders = [
    { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox, count: 3 },
    { id: 'sent', name: 'Enviados', icon: Send, count: 0 },
    { id: 'drafts', name: 'Rascunhos', icon: FileEdit, count: 1 },
    { id: 'starred', name: 'Favoritos', icon: Star, count: 1 },
    { id: 'archived', name: 'Arquivados', icon: Archive, count: 12 },
    { id: 'trash', name: 'Lixeira', icon: Trash2, count: 0 }
  ];

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setIsComposing(false);
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Button 
            onClick={handleCompose}
            className="w-full bg-bege-principal hover:bg-marrom-acentuado"
          >
            <MailPlus className="h-4 w-4 mr-2" />
            Escrever
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
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-bege-principal/5 border-r-2 border-bege-principal' : ''
                } ${!email.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm ${!email.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                    {email.from}
                  </span>
                  <div className="flex items-center space-x-1 ml-2">
                    {email.isStarred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                    {email.hasAttachment && <Paperclip className="h-3 w-3 text-gray-400" />}
                    <span className="text-xs text-gray-500">{email.date}</span>
                  </div>
                </div>
                <h3 className={`text-sm ${!email.isRead ? 'font-semibold' : ''} text-gray-900 mb-1 truncate`}>
                  {email.subject}
                </h3>
                <p className="text-xs text-gray-600 truncate">{email.preview}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white">
        {isComposing ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Nova Mensagem</h2>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
                <Input placeholder="destinatario@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto:</label>
                <Input placeholder="Assunto do email" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem:</label>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="flex-1 min-h-[300px] resize-none"
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
                  <Button className="bg-bege-principal hover:bg-marrom-acentuado">
                    <Send className="h-4 w-4 mr-1" />
                    Enviar
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
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ReplyAll className="h-4 w-4" />
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
                  <span className="font-medium">{selectedEmail.from}</span>
                  <span className="mx-2">para</span>
                  <span>{selectedEmail.to}</span>
                </div>
                <span>{selectedEmail.date}</span>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.content}
                </p>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione um email para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
