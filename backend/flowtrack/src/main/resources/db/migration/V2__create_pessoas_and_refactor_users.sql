-- Criacao da tabela pessoas
CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    endereco VARCHAR(200)
);

-- Migrar dados de nome dos users para pessoas (apenas se a coluna nome existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'nome') THEN
        INSERT INTO pessoas (nome)
        SELECT DISTINCT nome FROM users WHERE nome IS NOT NULL
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Adicionar coluna pessoa_id na tabela users (se nao existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'pessoa_id') THEN
        ALTER TABLE users ADD COLUMN pessoa_id INTEGER;
    END IF;
END $$;

-- Atualizar users com pessoa_id baseado no nome (se a coluna nome existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'nome') THEN
        UPDATE users u
        SET pessoa_id = p.id
        FROM pessoas p
        WHERE u.nome = p.nome AND u.pessoa_id IS NULL;
    END IF;
END $$;

-- Tornar pessoa_id NOT NULL apos popular todos (se houver dados)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'pessoa_id') THEN
        IF NOT EXISTS (SELECT 1 FROM users WHERE pessoa_id IS NULL) THEN
            ALTER TABLE users ALTER COLUMN pessoa_id SET NOT NULL;
        END IF;
    END IF;
END $$;

-- Adicionar foreign key (se nao existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_user_pessoa') THEN
        ALTER TABLE users 
        ADD CONSTRAINT fk_user_pessoa 
        FOREIGN KEY (pessoa_id) REFERENCES pessoas(id);
    END IF;
END $$;

-- Remover coluna nome da tabela users (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'nome') THEN
        ALTER TABLE users DROP COLUMN nome;
    END IF;
END $$;
