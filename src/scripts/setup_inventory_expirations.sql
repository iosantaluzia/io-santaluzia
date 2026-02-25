-- Execute este script na aba "SQL Editor" do seu painel Supabase
-- Ele adiciona a coluna "expirations" na tabela "inventory", que será usada para armazenar as validades múltiplas.

ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS expirations JSONB DEFAULT '[]'::jsonb;

-- Após rodar o código e der sucesso, você pode confirmar para implementarmos as mudanças no painel de estoque.
