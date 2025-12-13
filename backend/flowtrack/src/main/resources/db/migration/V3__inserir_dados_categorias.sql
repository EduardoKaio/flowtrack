-- 1. Cria a tabela (que estava faltando)
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    user_id BIGINT,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 2. Insere os dados apenas se nao existirem
INSERT INTO categories (name, color, user_id) 
SELECT * FROM (VALUES
    ('Trabalho', 'bg-blue-500', NULL),
    ('Estudo', 'bg-purple-500', NULL),
    ('Saúde', 'bg-green-500', NULL),
    ('Lazer', 'bg-orange-500', NULL),
    ('Pessoal', 'bg-pink-500', NULL)
) AS v(name, color, user_id)
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.name = v.name 
    AND (categories.user_id IS NULL AND v.user_id IS NULL OR categories.user_id = v.user_id)
);