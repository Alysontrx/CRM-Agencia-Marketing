-- Habilita extensão para UUID, se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Atualização da Tabela de Clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS empresa VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS telefone VARCHAR(50),
ADD COLUMN IF NOT EXISTS cpf_cnpj VARCHAR(50),
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS estado VARCHAR(50),
ADD COLUMN IF NOT EXISTS cep VARCHAR(20),
ADD COLUMN IF NOT EXISTS data_renovacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS plano VARCHAR(100),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS segmento VARCHAR(100),
ADD COLUMN IF NOT EXISTS prioridade VARCHAR(50) DEFAULT 'Média',
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- 1. Projetos
CREATE TABLE IF NOT EXISTS projetos (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  responsavel_id INTEGER NOT NULL,
  progresso INTEGER DEFAULT 0,
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  prazo TIMESTAMP WITH TIME ZONE
);

-- 2. Conteúdos
CREATE TABLE IF NOT EXISTS conteudos (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- Post, Vídeo, Criativo, Story, Reel, Carrossel
  titulo VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Em produção',
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Financeiro
CREATE TABLE IF NOT EXISTS financeiro (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) DEFAULT 0.00,
  vencimento TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Pendente'
);

-- 4. Arquivos
CREATE TABLE IF NOT EXISTS arquivos (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  url TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Histórico
CREATE TABLE IF NOT EXISTS historico_clientes (
  id SERIAL PRIMARY KEY,
  agencia_id INTEGER NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  usuario VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Segurança)
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_clientes ENABLE ROW LEVEL SECURITY;

-- Políticas temporárias para permitir tudo (Apenas para desenvolvimento MVP, depois blindaremos isso)
CREATE POLICY "Permitir tudo em projetos" ON projetos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em conteudos" ON conteudos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em financeiro" ON financeiro FOR ALL USING (true);
CREATE POLICY "Permitir tudo em arquivos" ON arquivos FOR ALL USING (true);
CREATE POLICY "Permitir tudo em historico_clientes" ON historico_clientes FOR ALL USING (true);
