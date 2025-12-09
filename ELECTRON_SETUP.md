# Configuração do Electron - Santa Luzia Admin

## Pré-requisitos

1. Node.js instalado
2. Conta no Supabase configurada
3. Variáveis de ambiente configuradas no arquivo `.env`

## Configuração do Supabase Storage

### 1. Criar o Bucket

1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **New bucket**
5. Configure:
   - **Name**: `exam-files`
   - **Public bucket**: **NÃO** (deixe desmarcado - privado)
   - **File size limit**: 52428800 (50MB)
   - **Allowed MIME types**: `application/pdf,image/jpeg,image/jpg,image/png,image/gif`
6. Clique em **Create bucket**

### 2. Aplicar Políticas RLS

Execute a migração SQL que está em:
```
supabase/migrations/20250120000000_setup_exam_files_storage.sql
```

Ou execute manualmente no SQL Editor do Supabase:

```sql
-- Política para administradores, médicos e secretários fazerem upload
CREATE POLICY "Admin staff can upload exam files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor', 'secretary')
  )
);

-- Política para administradores, médicos e secretários visualizarem arquivos
CREATE POLICY "Admin staff can view exam files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor', 'secretary')
  )
);

-- Política para administradores e médicos deletarem arquivos
CREATE POLICY "Admin and doctors can delete exam files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor')
  )
);
```

## Desenvolvimento

### Rodar em modo desenvolvimento:

```bash
npm run electron:dev
```

Isso irá:
1. Iniciar o servidor Vite na porta 8080
2. Aguardar o servidor estar pronto
3. Abrir a aplicação Electron

## Build do Executável

### Build para Windows:

```bash
npm run electron:build:win
```

O executável será gerado em:
```
release/Santa Luzia Admin Setup x.x.x.exe
```

### Build apenas do diretório (para testes):

```bash
npm run electron:build:win:dir
```

O executável será gerado em:
```
release/win-unpacked/Santa Luzia Admin.exe
```

## Estrutura do Projeto

```
├── electron/
│   ├── main.js          # Processo principal do Electron
│   └── preload.js       # Script de preload (segurança)
├── src/
│   ├── App.electron.tsx    # App específico para Electron
│   ├── App.tsx              # App web normal
│   ├── components/
│   │   ├── ExamFileUpload.tsx   # Componente de upload
│   │   └── PatientExams.tsx      # Componente atualizado com upload
│   └── utils/
│       └── examUpload.ts          # Funções de upload para Supabase
└── supabase/
    └── migrations/
        └── 20250120000000_setup_exam_files_storage.sql
```

## Funcionalidades

### Upload de Arquivos
- Upload de múltiplos arquivos
- Suporte para PDF, JPG, PNG, GIF
- Limite de 50MB por arquivo
- Validação de tipos de arquivo
- Feedback visual durante upload

### Visualização
- Lista de arquivos anexados a cada exame
- Visualização em nova aba
- Download de arquivos
- Exclusão (apenas admin e médicos)

### Segurança
- Arquivos armazenados no Supabase Storage
- Políticas RLS configuradas
- Acesso controlado por roles
- Validação de tipos e tamanhos

## Variáveis de Ambiente

Certifique-se de ter no arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Troubleshooting

### Erro: "Bucket não encontrado"
- Verifique se o bucket `exam-files` foi criado no Supabase Storage
- Confirme que o nome está exatamente como `exam-files`

### Erro: "Permission denied"
- Verifique se as políticas RLS foram aplicadas
- Confirme que o usuário está autenticado
- Verifique se o usuário tem role de admin, doctor ou secretary

### Erro no build
- Certifique-se de ter executado `npm install`
- Verifique se todas as dependências estão instaladas
- Tente limpar o cache: `npm run build` antes do build do Electron

## Notas Importantes

1. **Arquivos são salvos no Supabase Storage**, não localmente
2. **Pacientes podem acessar arquivos via portal web** após upload
3. **O executável precisa de conexão com internet** para funcionar
4. **Credenciais do Supabase** são embutidas no executável (use apenas chave anon)

