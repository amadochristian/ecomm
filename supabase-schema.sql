-- ============================================================
-- 🗄️ BRAGSHIRT — Schema do Banco de Dados (Supabase / PostgreSQL)
-- ============================================================
-- Execute este SQL no Supabase SQL Editor:
-- https://app.supabase.com → SQL Editor → New query
-- ============================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 👤 TABELA: perfis (dados extras do usuário além do auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS perfis (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  cep TEXT,
  endereco TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Usuário só pode ver/editar o próprio perfil
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprio perfil" ON perfis
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuário edita próprio perfil" ON perfis
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuário insere próprio perfil" ON perfis
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- 👕 TABELA: produtos
-- ============================================================
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  preco_antigo NUMERIC(10,2),
  categoria TEXT DEFAULT 'selecao',
  imagens JSONB DEFAULT '[]',
  tamanhos JSONB DEFAULT '[]',
  modelos JSONB DEFAULT '[]',
  estoque JSONB DEFAULT '{}',
  destaque BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  tags JSONB DEFAULT '[]',
  peso INTEGER DEFAULT 350,
  dimensoes JSONB DEFAULT '{}',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Leitura pública, escrita só admins (via service key)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de produtos ativos" ON produtos
  FOR SELECT USING (ativo = TRUE);

-- ============================================================
-- 📦 TABELA: pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usuario_nome TEXT,
  usuario_email TEXT,
  itens JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  frete_preco NUMERIC(10,2) DEFAULT 0,
  frete_servico TEXT,
  desconto NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','pago','enviado','entregue','cancelado')),
  endereco_entrega JSONB,
  cupom_codigo TEXT,
  tracking_code TEXT,
  mp_payment_id TEXT,
  mp_status TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  pago_em TIMESTAMPTZ,
  enviado_em TIMESTAMPTZ,
  entregue_em TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_criado ON pedidos(criado_em DESC);

-- RLS: Usuário vê apenas os próprios pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprios pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuário cria pedido" ON pedidos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Admins podem ver todos (via service key — sem RLS)

-- ============================================================
-- 📋 TABELA: logs_pedidos (linha do tempo)
-- ============================================================
CREATE TABLE IF NOT EXISTS logs_pedidos (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  evento TEXT NOT NULL,
  detalhes TEXT DEFAULT '',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_pedido ON logs_pedidos(pedido_id);

ALTER TABLE logs_pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê logs dos próprios pedidos" ON logs_pedidos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pedidos p
      WHERE p.id = logs_pedidos.pedido_id AND p.usuario_id = auth.uid()
    )
  );

-- ============================================================
-- 🏷️ TABELA: cupons
-- ============================================================
CREATE TABLE IF NOT EXISTS cupons (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'fixo')),
  valor NUMERIC(10,2) NOT NULL,
  minimo_compra NUMERIC(10,2) DEFAULT 0,
  usos_maximos INTEGER,
  usos_atuais INTEGER DEFAULT 0,
  valido_ate TIMESTAMPTZ,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Leitura pública de cupons ativos (para validação no frontend)
ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de cupons ativos" ON cupons
  FOR SELECT USING (ativo = TRUE);

-- ============================================================
-- 🔧 TRIGGER: atualizar updated_at nos perfis
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_perfis
  BEFORE UPDATE ON perfis
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================================
-- 🌱 SEED: Dados iniciais de exemplo (cupons)
-- ============================================================
INSERT INTO cupons (codigo, tipo, valor, minimo_compra, usos_maximos, valido_ate, ativo)
VALUES
  ('COPA2026', 'percentual', 10, 199.90, 100, '2026-12-31', TRUE),
  ('FRETEGRATIS', 'fixo', 30, 0, 50, '2026-06-30', TRUE),
  ('PRIMEIRACOMPRA', 'percentual', 15, 100, 1000, NULL, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
-- ✅ Schema criado com sucesso!
-- Próximos passos:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Configure o .env com as chaves do Supabase
-- 3. Ative a autenticação por e-mail no Supabase Auth
-- ============================================================
