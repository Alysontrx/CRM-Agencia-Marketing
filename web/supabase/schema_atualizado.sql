-- Habilita extensão para UUID, se necessário (opcional para essas tabelas, pois usaremos serial)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criação das Tabelas

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  servico VARCHAR(255) NOT NULL,
  responsavel_id INTEGER NOT NULL,
  status_geral VARCHAR(50) DEFAULT 'em_dia',
  progresso INTEGER DEFAULT 0,
  proxima_entrega VARCHAR(255),
  pendencia_atual TEXT,
  logo TEXT,
  instagram VARCHAR(255),
  instagram_url TEXT,
  whatsapp VARCHAR(255),
  mrr DECIMAL(10, 2) DEFAULT 0.00,
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  nicho_mercado VARCHAR(255),
  entregas_mensais INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  empresa VARCHAR(255) NOT NULL,
  contato VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  origem VARCHAR(100),
  valor_estimado DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'Prospect',
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  responsavel_id INTEGER NOT NULL,
  setor VARCHAR(100) NOT NULL,
  prioridade VARCHAR(50) DEFAULT 'Média',
  prazo VARCHAR(100),
  status VARCHAR(50) DEFAULT 'A fazer',
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  comentarios JSONB DEFAULT '[]'::jsonb,
  checklists JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS metricas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  data_registro VARCHAR(100) NOT NULL,
  seguidores INTEGER DEFAULT 0,
  alcance INTEGER DEFAULT 0,
  engajamento DECIMAL(10, 2) DEFAULT 0.00,
  leads INTEGER DEFAULT 0,
  cliques_site INTEGER DEFAULT 0,
  tipo VARCHAR(50) DEFAULT 'mensal',
  anotacao TEXT
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id SERIAL PRIMARY KEY,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'info',
  lida BOOLEAN DEFAULT FALSE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  link VARCHAR(255)
);

-- Habilitar RLS (Segurança)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas temporárias para permitir tudo (Apenas para desenvolvimento MVP, depois blindaremos isso)
CREATE POLICY "Permitir tudo em clientes" ON clientes FOR ALL USING (true);
CREATE POLICY "Permitir tudo em leads" ON leads FOR ALL USING (true);
CREATE POLICY "Permitir tudo em tarefas" ON tarefas FOR ALL USING (true);
CREATE POLICY "Permitir tudo em metricas" ON metricas FOR ALL USING (true);
CREATE POLICY "Permitir tudo em notificacoes" ON notificacoes FOR ALL USING (true);
