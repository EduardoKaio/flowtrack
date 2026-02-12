-- Adicionar campos de perfil na tabela pessoas
ALTER TABLE pessoas 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(200);

-- Criar indice para melhor performance em buscas
CREATE INDEX IF NOT EXISTS idx_pessoas_avatar_url ON pessoas(avatar_url) WHERE avatar_url IS NOT NULL;
