-- Criação da tabela users (PostgreSQL)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Inserção de usuários iniciais, ignorando duplicados pelo email
INSERT INTO users (nome, email, senha, role) VALUES
('Admin Master', 'admin@flowtrack.com', '123456', 'ADMIN'),
('Maria Silva', 'maria@flowtrack.com', '123456', 'USER'),
('João Souza', 'joao@flowtrack.com', '123456', 'USER'),
('Ana Lima', 'ana@flowtrack.com', '123456', 'USER'),
('Carlos Santos', 'carlos@flowtrack.com', '123456', 'USER')
ON CONFLICT (email) DO NOTHING;
