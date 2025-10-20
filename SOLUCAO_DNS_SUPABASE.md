# 🚨 PROBLEMA CRÍTICO: DNS não resolve o domínio do Supabase

## 🔍 Diagnóstico:

```
❌ DNS request timed out
❌ O nome remoto não pôde ser resolvido: 'aobjtwikccovikmfoicg.supabase.co'
```

**O código está CORRETO, mas o Windows não consegue acessar o Supabase!**

---

## ✅ SOLUÇÃO 1: Trocar DNS para Google DNS (MAIS COMUM)

### **No Windows:**

1. **Abra "Configurações"** (Windows + I)
2. Vá em **"Rede e Internet"**
3. Clique em **"Status"** → **"Propriedades"**
4. Role até **"Atribuição de servidor DNS"**
5. Clique em **"Editar"**
6. Selecione **"Manual"**
7. Ative **IPv4**
8. Configure:
   ```
   DNS preferencial: 8.8.8.8
   DNS alternativo:  8.8.4.4
   ```
9. Clique em **"Salvar"**
10. **Reinicie o navegador**

### **Via PowerShell (Administrador):**

```powershell
# Execute como Administrador
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
ipconfig /flushdns
```

**⚠️ Troque "Wi-Fi" por "Ethernet" se usar cabo.**

---

## ✅ SOLUÇÃO 2: Verificar Firewall/Antivírus

### **Windows Defender:**

1. **Windows Defender** → **Firewall e proteção de rede**
2. **Permitir um aplicativo pelo firewall**
3. Procure pelo **navegador** (Chrome/Edge/Firefox)
4. Certifique-se que está **marcado** em Privada e Pública

### **Antivírus (Kaspersky, Avast, Norton, etc):**

1. Abra seu antivírus
2. Procure por **"Proteção Web"** ou **"Firewall"**
3. Adicione **`*.supabase.co`** às **exceções/permitidos**
4. **Desative temporariamente** para testar

---

## ✅ SOLUÇÃO 3: Limpar Cache DNS

Abra **PowerShell como Administrador** e execute:

```powershell
ipconfig /flushdns
ipconfig /registerdns
ipconfig /release
ipconfig /renew
```

Depois **reinicie o computador**.

---

## ✅ SOLUÇÃO 4: Usar Cloudflare DNS (Alternativa)

Se o Google DNS não funcionar, tente o Cloudflare:

```
DNS preferencial: 1.1.1.1
DNS alternativo:  1.0.0.1
```

---

## ✅ SOLUÇÃO 5: Verificar se é Rede Corporativa

**Se você está em:**
- 🏢 Empresa/Escritório
- 🏫 Universidade/Escola
- 🏨 Hotel/Público

**A rede pode estar bloqueando o Supabase!**

**Teste:**
1. Conecte-se a um **hotspot do celular**
2. Tente acessar novamente
3. Se funcionar, é a rede corporativa bloqueando

**Solução:**
- Fale com o TI da empresa para liberar `*.supabase.co`
- Use VPN
- Use seu próprio hotspot

---

## ✅ SOLUÇÃO 6: Verificar Projeto Supabase

1. Acesse: **https://supabase.com/dashboard**
2. Faça login
3. Verifique se o projeto **`aobjtwikccovikmfoicg`** está:
   - ✅ Ativo (não pausado)
   - ✅ Visível na lista
   - ✅ Não deletado

Se o projeto foi pausado:
- Clique em **"Resume"** ou **"Restore"**

---

## 🧪 TESTE RÁPIDO:

Após tentar qualquer solução, teste no PowerShell:

```powershell
nslookup aobjtwikccovikmfoicg.supabase.co 8.8.8.8
```

**Deve retornar:**
```
Name:    aobjtwikccovikmfoicg.supabase.co
Address: [algum IP]
```

---

## 📱 TESTE ALTERNATIVO (Celular):

1. Abra o site no **celular** (usando dados móveis, NÃO Wi-Fi)
2. Se funcionar no celular = problema é no computador/rede
3. Se NÃO funcionar = problema é no projeto Supabase

---

## 🎯 RESUMO DAS CAUSAS PROVÁVEIS:

1. **DNS local com problema** → Trocar para 8.8.8.8
2. **Firewall bloqueando** → Adicionar exceção
3. **Rede corporativa** → Usar hotspot do celular
4. **Projeto Supabase pausado** → Verificar no dashboard

---

## 💡 SOLUÇÃO TEMPORÁRIA (Teste Local):

Enquanto resolve o DNS, teste localmente:

```bash
cd c:\Users\roque\io-santaluzia
npm run dev
```

Acesse: **http://localhost:8080/admin-dashboard-santa-luzia**

Se funcionar localmente mas não no Vercel, confirma que é problema de rede no seu computador.

---

**🔧 Próximo Passo:**

**TROQUE O DNS PARA 8.8.8.8 E TESTE!**

Essa é a causa mais comum (90% dos casos).

