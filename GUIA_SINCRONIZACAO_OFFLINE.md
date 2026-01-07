# Guia de Sincronização Offline

## 📋 Visão Geral

O aplicativo agora funciona **offline-first**, permitindo que você continue trabalhando mesmo sem conexão com a internet. Todas as alterações são salvas localmente e sincronizadas automaticamente quando a conexão for restaurada.

## ✨ Funcionalidades

### 1. **Modo Offline**
- O aplicativo funciona completamente sem internet
- Todas as operações (criar, editar, deletar) são salvas localmente
- Dados são armazenados no IndexedDB do navegador

### 2. **Sincronização Automática**
- **A cada 5 minutos**: Quando online, o app sincroniza automaticamente
- **Ao detectar internet**: Sincroniza imediatamente quando a conexão é restaurada
- **Semanal**: Backup automático toda segunda-feira às 2h da manhã

### 3. **Sincronização Manual**
- Botão de sincronização no header do dashboard
- Clique para sincronizar imediatamente quando online
- Mostra status: Online/Offline, Pendências, Última sincronização

## 🎯 Como Usar

### Status de Sincronização

O botão de sincronização no header mostra:
- 🟢 **Verde com ✓**: Tudo sincronizado
- 🟡 **Amarelo com ⚠**: Operações pendentes
- 🔴 **Vermelho com ☁️**: Modo offline
- 🔵 **Azul girando**: Sincronizando...

### Trabalhando Offline

1. **Criar/Editar dados offline**:
   - Funciona normalmente mesmo sem internet
   - Os dados são salvos localmente
   - Uma notificação confirma o salvamento

2. **Quando voltar online**:
   - A sincronização acontece automaticamente
   - Você receberá uma notificação: "X operação(ões) sincronizada(s) com sucesso!"

3. **Sincronização manual**:
   - Clique no botão de sincronização no header
   - Aguarde a conclusão
   - Verifique o status

## 🔧 Configuração Técnica

### Armazenamento Local
- **IndexedDB**: Banco de dados local do navegador
- **Capacidade**: ~50MB por domínio (suficiente para milhares de registros)
- **Limpeza automática**: Dados antigos são removidos após 7 dias

### Sincronização
- **Frequência automática**: 5 minutos quando online
- **Backup semanal**: Segunda-feira às 2h
- **Limpeza**: Operações sincronizadas são removidas após 7 dias

## ⚠️ Importante

1. **Dados locais**: Os dados offline são armazenados no navegador do computador
2. **Não compartilhado**: Dados offline não são compartilhados entre computadores
3. **Sincronização necessária**: Para ver dados em outros dispositivos, é necessário sincronizar
4. **Backup**: Faça backup regularmente usando o botão de sincronização

## 🐛 Solução de Problemas

### Dados não sincronizam
1. Verifique sua conexão com a internet
2. Clique no botão de sincronização manual
3. Verifique o console do navegador (F12) para erros

### Muitas operações pendentes
1. Verifique sua conexão
2. Tente sincronizar manualmente
3. Se persistir, entre em contato com o suporte

### Dados desaparecem
1. Verifique se está logado
2. Os dados offline são específicos do navegador
3. Se trocou de navegador/computador, os dados offline não estarão disponíveis

## 📝 Notas

- O sistema funciona melhor quando há conexão constante
- A sincronização offline é uma camada de segurança, não um substituto para conexão estável
- Para operações críticas, sempre verifique se está online antes de executar

