-- =========================================================================
-- ATUALIZAÇÃO SENSE: PREFERÊNCIAS DE LAYOUT E MENU
-- =========================================================================

-- Adiciona a coluna de preferências na tabela de usuários
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS preferencias JSONB DEFAULT '{}'::jsonb;
