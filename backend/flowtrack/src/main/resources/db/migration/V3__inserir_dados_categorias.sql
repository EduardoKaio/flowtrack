-- 1. Cria a tabela (que estava faltando)
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    user_id BIGINT,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) -- Ajuste 'users' se sua tabela de usuários tiver outro nome (ex: tb_users)
);

-- 2. Insere os dados
INSERT INTO categories (name, color, user_id) VALUES
    ('Trabalho', 'bg-blue-500', NULL),
    ('Estudo', 'bg-purple-500', NULL),
    ('Saúde', 'bg-green-500', NULL),
    ('Lazer', 'bg-orange-500', NULL),
    ('Pessoal', 'bg-pink-500', NULL);