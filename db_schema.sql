-- DDL schema for Atlas OS — Agência
-- Execute this script in the Supabase SQL Editor

-- Disable triggers and drop tables if they exist (clean setup)
DROP TABLE IF EXISTS correcoes;
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS relatorios;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;

-- 1. Table for Team/Users (Usuarios)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    funcao VARCHAR(100) NOT NULL,
    avatar VARCHAR(255)
);

-- 2. Table for Clients (Clientes)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    servico VARCHAR(100) NOT NULL,
    responsavel_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    status_geral VARCHAR(50) DEFAULT 'em_dia', -- em_dia, atencao, atrasado, em_producao, em_correcao
    progresso INT DEFAULT 0,
    proxima_entrega DATE,
    pendencia_atual TEXT,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dados_metricas JSONB DEFAULT '{}'::jsonb
);

-- 3. Table for Tasks (Tarefas)
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE,
    responsavel_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    setor VARCHAR(50) NOT NULL, -- Design, Social Media, Secretária, Geral
    prioridade VARCHAR(50) NOT NULL, -- Baixa, Média, Alta, Urgente
    prazo DATE,
    status VARCHAR(50) DEFAULT 'A fazer', -- A fazer, Em andamento, Aguardando material, Aguardando revisão, Em correção, Aprovado, Publicado, Finalizado, Atrasado
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    comentarios JSONB DEFAULT '[]'::jsonb
);

-- 4. Table for Corrections (Correcoes)
CREATE TABLE correcoes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE,
    tarefa_id INT REFERENCES tarefas(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    responsavel_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Em andamento, Corrigido, Aprovado
    prazo DATE,
    comentarios JSONB DEFAULT '[]'::jsonb,
    historico JSONB DEFAULT '[]'::jsonb
);

-- 5. Table for Reports (Relatorios)
CREATE TABLE relatorios (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE,
    mes_ano VARCHAR(50) NOT NULL, -- Ex: 'Junho/2026'
    seguidores_crescimento INT DEFAULT 0,
    alcance INT DEFAULT 0,
    cliques_site INT DEFAULT 0,
    cliques_whatsapp INT DEFAULT 0,
    engajamento DECIMAL(5,2) DEFAULT 0.00,
    posts_publicados INT DEFAULT 0,
    observacoes TEXT
);

-- SEED DATA
-- Insert Users / Team
INSERT INTO usuarios (nome, email, senha, funcao, avatar) VALUES
('Gabi', 'gabi@atlas.com', 'admin123', 'Administradora', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('Ana', 'ana@atlas.com', 'ana123', 'Designer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
('Lucas', 'lucas@atlas.com', 'lucas123', 'Social Media', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
('Marina', 'marina@atlas.com', 'marina123', 'Secretária/Revisora', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'),
('João', 'joao@atlas.com', 'joao123', 'Videomaker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');

-- Insert Clients
INSERT INTO clientes (nome, servico, responsavel_id, status_geral, progresso, proxima_entrega, pendencia_atual, dados_metricas) VALUES
('Bella Store', 'Gestão Completa + Ads', 3, 'atencao', 75, '2026-07-05', 'Aguardando aprovação do carrossel de inverno há 3 dias', '{"cliques_site": 342, "cliques_whatsapp": 89, "origem": "Instagram", "crescimento": 18, "melhor_campanha": "Promoção de Inverno"}'),
('Clínica Vida', 'Branding + Redes Sociais', 2, 'atrasado', 40, '2026-07-02', 'Relatório mensal pendente e post de quinta atrasado', '{"cliques_site": 120, "cliques_whatsapp": 45, "origem": "Google", "crescimento": 5, "melhor_campanha": "Dicas de Saúde"}'),
('Rancharia Eventos', 'Social Media', 3, 'atrasado', 60, '2026-07-03', 'Aguardando envio das fotos do evento de sábado', '{"cliques_site": 80, "cliques_whatsapp": 30, "origem": "Facebook", "crescimento": -2, "melhor_campanha": "Show Sertanejo"}'),
('Studio Prime', 'Design Mensal', 2, 'em_producao', 20, '2026-07-08', 'Nenhuma pendência crítica', '{"cliques_site": 210, "cliques_whatsapp": 64, "origem": "Instagram", "crescimento": 12, "melhor_campanha": "Estética Premium"}'),
('Mercado Bom Preço', 'Design + Encartes', 2, 'em_dia', 90, '2026-07-04', 'Nenhuma pendência crítica', '{"cliques_site": 430, "cliques_whatsapp": 180, "origem": "WhatsApp", "crescimento": 25, "melhor_campanha": "Ofertas de Quinta"}');

-- Insert Tasks
INSERT INTO tarefas (titulo, cliente_id, responsavel_id, setor, prioridade, prazo, status, comentarios) VALUES
('Criar roteiro de reels', 1, 3, 'Social Media', 'Alta', '2026-07-04', 'Em andamento', '[]'),
('Revisar legenda da campanha', 1, 4, 'Secretária', 'Média', '2026-07-05', 'Aguardando revisão', '[]'),
('Criar arte para feed (Promoção Inverno)', 1, 2, 'Design', 'Alta', '2026-07-02', 'Aprovado', '[]'),
('Publicar carrossel de inverno', 1, 3, 'Social Media', 'Urgente', '2026-07-03', 'Aprovado', '[]'),
('Gerar relatório mensal', 2, 3, 'Social Media', 'Alta', '2026-07-01', 'Atrasado', '[{"autor": "Gabi", "texto": "Precisamos desse relatório urgente para enviar ao Dr. Roberto."}]'),
('Post institucional - Saúde do Coração', 2, 2, 'Design', 'Alta', '2026-07-02', 'Atrasado', '[]'),
('Editar vídeo do evento Rancharia', 3, 5, 'Design', 'Alta', '2026-07-06', 'Em andamento', '[]'),
('Cobrar material do cliente (Fotos do Evento)', 3, 4, 'Secretária', 'Baixa', '2026-07-01', 'Aguardando material', '[]'),
('Layout do novo encarte de ofertas', 5, 2, 'Design', 'Alta', '2026-07-03', 'Em andamento', '[]'),
('Arte do post de estética Studio Prime', 4, 2, 'Design', 'Alta', '2026-07-08', 'A fazer', '[]');

-- Insert Corrections
INSERT INTO correcoes (cliente_id, tarefa_id, descricao, responsavel_id, status, prazo, comentarios, historico) VALUES
(1, 3, 'Ajustar contraste do texto na última tela do carrossel.', 2, 'Pendente', '2026-07-03', '[]', '[{"data": "2026-07-02", "acao": "Correção aberta por Marina"}]'),
(2, 6, 'Substituir a foto de banco de imagens por uma foto real enviada no drive.', 2, 'Em andamento', '2026-07-03', '[]', '[]');

-- Insert Reports
INSERT INTO relatorios (cliente_id, mes_ano, seguidores_crescimento, alcance, cliques_site, cliques_whatsapp, engajamento, posts_publicados, observacoes) VALUES
(1, 'Junho/2026', 420, 15800, 342, 89, 4.80, 12, 'Campanha de inverno gerou o maior pico de engajamento do ano. Recomendável manter a linha visual.'),
(2, 'Junho/2026', 150, 4200, 120, 45, 3.20, 8, 'Atrasos no envio de materiais afetaram a consistência dos posts. Necessário alinhar cronograma com o cliente.'),
(5, 'Junho/2026', 890, 32000, 430, 180, 6.50, 20, 'O encarte digital no WhatsApp continua sendo o principal canal de conversão do mercado.');

-- Grant permissions to Supabase roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
