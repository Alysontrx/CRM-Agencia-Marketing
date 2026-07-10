-- Habilita extensão para UUID, se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Usuários ATLAS (Super Admins)
CREATE TABLE IF NOT EXISTS atlas_usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL, -- Hashed password
  funcao VARCHAR(100) DEFAULT 'Suporte', -- Super Administrador, Administrador, Suporte, Financeiro, Desenvolvedor
  avatar_url TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Planos (SaaS)
CREATE TABLE IF NOT EXISTS planos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  periodicidade VARCHAR(50) DEFAULT 'Mensal',
  limite_usuarios INTEGER DEFAULT 5,
  limite_clientes INTEGER DEFAULT 20,
  limite_ia INTEGER DEFAULT 100,
  limite_armazenamento INTEGER DEFAULT 10,
  integracoes JSONB DEFAULT '[]'::jsonb,
  automacoes INTEGER DEFAULT 0,
  conexoes_whatsapp INTEGER DEFAULT 1,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Atualização da Tabela de Agências (Tenants)
ALTER TABLE agencias
ADD COLUMN IF NOT EXISTS responsavel VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS telefone VARCHAR(50),
ADD COLUMN IF NOT EXISTS cnpj VARCHAR(50),
ADD COLUMN IF NOT EXISTS plano_id INTEGER REFERENCES planos(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Teste', -- Ativa, Teste, Suspensa, Cancelada, Inadimplente, Bloqueada
ADD COLUMN IF NOT EXISTS dominio VARCHAR(255),
ADD COLUMN IF NOT EXISTS subdominio VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS data_expiracao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS limite_usuarios INTEGER,
ADD COLUMN IF NOT EXISTS limite_clientes INTEGER,
ADD COLUMN IF NOT EXISTS limite_ia INTEGER,
ADD COLUMN IF NOT EXISTS limite_armazenamento INTEGER,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- 4. Tabela de Tickets de Suporte
CREATE TABLE IF NOT EXISTS suporte_tickets (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER REFERENCES agencias(id) ON DELETE CASCADE,
  assunto VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Aberto', -- Aberto, Em andamento, Resolvido
  prioridade VARCHAR(50) DEFAULT 'Baixa',
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Logs da Plataforma (Auditoria)
CREATE TABLE IF NOT EXISTS logs_plataforma (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER REFERENCES agencias(id) ON DELETE CASCADE, -- null para log global
  usuario VARCHAR(255) NOT NULL,
  acao VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir o Super Administrador padrão
INSERT INTO atlas_usuarios (nome, email, senha, funcao) 
VALUES ('Atlas Admin', 'atlasupi@gmail.com', '2606', 'Super Administrador')
ON CONFLICT (email) DO NOTHING;

-- Inserir alguns planos padrão
INSERT INTO planos (nome, valor, periodicidade, limite_usuarios, limite_clientes, limite_ia, limite_armazenamento, automacoes, conexoes_whatsapp)
VALUES 
  ('Starter', 97.00, 'Mensal', 5, 20, 100, 5, 0, 1),
  ('Pro', 197.00, 'Mensal', 15, 100, 500, 20, 5, 2),
  ('Enterprise', 497.00, 'Mensal', 999, 999, 5000, 100, 50, 10)
ON CONFLICT DO NOTHING;

-- Habilitar RLS (Segurança) e Políticas temporárias
ALTER TABLE atlas_usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo em atlas_usuarios" ON atlas_usuarios FOR ALL USING (true);

ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo em planos" ON planos FOR ALL USING (true);

ALTER TABLE suporte_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo em suporte_tickets" ON suporte_tickets FOR ALL USING (true);

ALTER TABLE logs_plataforma ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir tudo em logs_plataforma" ON logs_plataforma FOR ALL USING (true);
