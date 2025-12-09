# ✅ Executável Criado com Sucesso!

## 📦 Localização do Executável

O executável está localizado em:
```
release/win-unpacked/Santa Luzia Admin.exe
```

## 🚀 Como Usar

1. **Navegue até a pasta:**
   ```
   release/win-unpacked/
   ```

2. **Execute o arquivo:**
   ```
   Santa Luzia Admin.exe
   ```

3. **Primeira execução:**
   - O aplicativo abrirá a tela de login
   - Faça login com suas credenciais do Supabase
   - Você terá acesso completo ao painel administrativo

## ⚠️ IMPORTANTE - Configuração do Supabase Storage

**ANTES DE USAR O UPLOAD DE ARQUIVOS**, você precisa:

### 1. Criar o Bucket no Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Storage** → **New bucket**
4. Configure:
   - **Name**: `exam-files` (exatamente assim)
   - **Public bucket**: **NÃO** (deixe desmarcado)
   - **File size limit**: `52428800` (50MB)
5. Clique em **Create bucket**

### 2. Aplicar Políticas RLS

Execute o SQL em `supabase/migrations/20250120000000_setup_exam_files_storage.sql` no SQL Editor do Supabase.

Ou execute manualmente:

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

## 📋 Funcionalidades Disponíveis

✅ **Login com Supabase**
✅ **Painel Administrativo Completo**
✅ **Gestão de Pacientes**
✅ **Gestão de Consultas**
✅ **Gestão de Exames**
✅ **Upload de Arquivos de Exames** (após configurar o bucket)
✅ **Visualização de Arquivos**
✅ **Download de Arquivos**
✅ **Exclusão de Arquivos** (admin e médicos)

## 🔄 Sincronização Web ↔️ Desktop

- **Arquivos salvos no .exe** → Ficam disponíveis na **web** automaticamente
- **Arquivos salvos na web** → Ficam disponíveis no **.exe** automaticamente
- **Pacientes podem acessar** → Via portal web (`/portal-paciente`)

## 🛠️ Troubleshooting

### Erro: "Bucket não encontrado"
- Verifique se criou o bucket `exam-files` no Supabase Storage
- Confirme que o nome está exatamente como `exam-files`

### Erro: "Permission denied"
- Verifique se aplicou as políticas RLS
- Confirme que está logado com usuário admin/doctor/secretary

### Aplicativo não abre
- Verifique se tem conexão com internet
- Confirme que as variáveis de ambiente estão configuradas no `.env`

### Upload não funciona
- Verifique se o bucket foi criado
- Confirme que as políticas RLS foram aplicadas
- Verifique o tamanho do arquivo (máx. 50MB)

## 📝 Variáveis de Ambiente Necessárias

O executável precisa das seguintes variáveis no arquivo `.env` (que são embutidas no build):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 🎯 Próximos Passos

1. ✅ Executável criado
2. ⏳ Criar bucket `exam-files` no Supabase
3. ⏳ Aplicar políticas RLS
4. ✅ Testar login
5. ✅ Testar upload de arquivos
6. ✅ Verificar acesso dos pacientes na web

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console (F12 no aplicativo)
2. Verifique as políticas RLS no Supabase
3. Confirme que o bucket foi criado corretamente

---

**Desenvolvido para Instituto de Olhos Santa Luzia** 👁️

