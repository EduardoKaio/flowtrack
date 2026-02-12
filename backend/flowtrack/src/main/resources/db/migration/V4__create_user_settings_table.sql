-- Criar tabela de configuracoes do usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'light',
    notifications BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    language VARCHAR(10) DEFAULT 'pt-BR',
    enabled_modules TEXT DEFAULT '{"tarefas":true,"categorias":true,"foco":true,"habitos":true,"bem-estar":true,"notas":false,"rotina":false,"lembretes":false,"relatorios":false}',
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar indices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
