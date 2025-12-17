INSERT INTO
    users (login_id, password)
VALUES ('test_id', 'password');

INSERT INTO categories (user_id, name) VALUES (1, '食費'), (1, '交通費');

INSERT INTO
    expenses (
        user_id,
        category_id,
        amount,
        date,
        memo
    )
VALUES (
        1,
        1,
        1200,
        '2025-01-15',
        '昼食'
    );