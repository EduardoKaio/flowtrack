INSERT INTO categories (name, color, user_id)
SELECT v.name, v.color, v.user_id
FROM (
    VALUES
        ('Trabalho', 'bg-blue-500', NULL),
        ('Estudo', 'bg-purple-500', NULL),
        ('Saúde', 'bg-green-500', NULL),
        ('Lazer', 'bg-orange-500', NULL),
        ('Pessoal', 'bg-pink-500', NULL)
) AS v(name, color, user_id BIGINT)
WHERE NOT EXISTS (
    SELECT 1
    FROM categories c
    WHERE c.name = v.name
      AND (
            (c.user_id IS NULL AND v.user_id IS NULL)
            OR c.user_id = v.user_id
          )
);
