-- =========================================================================
-- SCHEMA
-- =========================================================================
BEGIN;

CREATE TABLE users (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    address     TEXT         NOT NULL,
    ktp_number  CHAR(16)     NOT NULL UNIQUE CHECK (ktp_number ~ '^[0-9]{16}$'),
    phone       VARCHAR(20)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE books (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title             VARCHAR(200) NOT NULL,
    author            VARCHAR(100) NOT NULL,
    publisher         VARCHAR(100) NOT NULL,
    isbn              VARCHAR(13)  NOT NULL UNIQUE CHECK (isbn ~ '^([0-9]{9}[0-9X]|[0-9]{13})$'),
    publication_year  SMALLINT     NOT NULL CHECK (publication_year BETWEEN 1000 AND 9999),
    total_qty         INTEGER      NOT NULL CHECK (total_qty >= 0),
    available_qty     INTEGER      NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT books_available_qty_range CHECK (available_qty BETWEEN 0 AND total_qty)
);

CREATE TABLE book_categories (
    book_id      BIGINT NOT NULL REFERENCES books(id)      ON DELETE CASCADE,
    category_id  BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);
CREATE INDEX idx_book_categories_category_id ON book_categories(category_id);

CREATE TABLE loans (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    book_id      BIGINT      NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    borrowed_at  TIMESTAMPTZ NOT NULL,
    due_at       TIMESTAMPTZ NOT NULL,
    returned_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT loans_due_after_borrow      CHECK (due_at > borrowed_at),
    CONSTRAINT loans_return_after_borrow   CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_book_id ON loans(book_id);
CREATE INDEX idx_loans_open_due ON loans(due_at) WHERE returned_at IS NULL;

COMMIT;

-- =========================================================================
-- SEED
-- =========================================================================
BEGIN;

INSERT INTO users (name, address, ktp_number, phone, email) VALUES
    ('Budi Santoso',    'Jl. Merdeka No. 10, Jakarta Pusat',   '3171010101900001', '081234567801', 'budi.santoso@example.com'),
    ('Siti Rahmawati',  'Jl. Asia Afrika No. 25, Bandung',     '3273020202910002', '081234567802', 'siti.rahmawati@example.com'),
    ('Agus Prasetyo',   'Jl. Pemuda No. 7, Semarang',          '3374030303920003', '081234567803', 'agus.prasetyo@example.com'),
    ('Dewi Lestari',    'Jl. Malioboro No. 45, Yogyakarta',    '3471040404930004', '081234567804', 'dewi.lestari@example.com'),
    ('Rizky Ramadhan',  'Jl. Tunjungan No. 88, Surabaya',      '3578050505940005', '081234567805', 'rizky.ramadhan@example.com');

INSERT INTO categories (name) VALUES
    ('Fiksi'),
    ('Sejarah'),
    ('Teknologi'),
    ('Pengembangan Diri'),
    ('Sains');

INSERT INTO books (title, author, publisher, isbn, publication_year, total_qty, available_qty) VALUES
    ('Laskar Pelangi',             'Andrea Hirata',            'Bentang Pustaka',        '9789793062792', 2005, 5, 5), -- Book 1
    ('Bumi Manusia',               'Pramoedya Ananta Toer',    'Lentera Dipantara',      '9789799731234', 1980, 3, 3), -- Book 2
    ('Negeri 5 Menara',            'Ahmad Fuadi',              'Gramedia Pustaka Utama', '9789792248616', 2009, 4, 4), -- Book 3
    ('Sapiens',                    'Yuval Noah Harari',        'KPG',                    '9786024246945', 2017, 3, 3), -- Book 4
    ('Atomic Habits',              'James Clear',              'Gramedia Pustaka Utama', '9786020633176', 2019, 6, 6), -- Book 5
    ('Clean Code',                 'Robert C. Martin',         'Prentice Hall',          '9780132350884', 2008, 2, 2), -- Book 6
    ('The Pragmatic Programmer',   'Andrew Hunt, David Thomas','Addison-Wesley',         '9780135957059', 2019, 2, 2), -- Book 7
    ('Kosmos',                     'Carl Sagan',               'KPG',                    '9786024810115', 2016, 3, 3), -- Book 8
    ('Sejarah Indonesia Modern',   'M.C. Ricklefs',            'Serambi',                '9789790240889', 2008, 2, 2), -- Book 9
    ('Filosofi Teras',             'Henry Manampiring',        'Kompas',                 '9786024125163', 2018, 4, 4); -- Book 10, never borrowed

INSERT INTO book_categories (book_id, category_id) VALUES
    (1, 1),
    (2, 1), (2, 2),
    (3, 1), (3, 4),
    (4, 2), (4, 5),
    (5, 4),
    (6, 3),
    (7, 3),
    (8, 5),
    (9, 2),
    (10, 4);

INSERT INTO loans (user_id, book_id, borrowed_at, due_at, returned_at) VALUES
    -- User 1: Book 1-3
    (1, 1, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-07 14:00+07'),
    (1, 2, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-07 14:00+07'),
    (1, 3, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-08 09:30+07'),
    -- User 2: Book 4-6
    (2, 4, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-06 11:00+07'),
    (2, 5, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-06 11:00+07'),
    (2, 6, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-08 08:00+07'),
    -- User 3: Book 7-9, Book 9 returned 5 days late
    (3, 7, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-05 16:00+07'),
    (3, 8, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-05 16:00+07'),
    (3, 9, '2026-09-01 10:00+07', '2026-09-08 10:00+07', '2026-09-13 10:00+07');

COMMIT;

SELECT (SELECT count(*) FROM users) AS users,
       (SELECT count(*) FROM books) AS books,
       (SELECT count(*) FROM loans) AS loans;

SELECT u.id, u.name, count(l.id) AS total_loans
  FROM users u
  LEFT JOIN loans l ON l.user_id = u.id
 GROUP BY u.id, u.name
 ORDER BY u.id;

SELECT u.name, b.title, l.due_at, l.returned_at,
       (l.returned_at AT TIME ZONE 'Asia/Jakarta')::date
     - (l.due_at      AT TIME ZONE 'Asia/Jakarta')::date AS late_days
  FROM loans l
  JOIN users u ON u.id = l.user_id
  JOIN books b ON b.id = l.book_id
 WHERE l.returned_at > l.due_at;

SELECT b.title, string_agg(c.name, ', ' ORDER BY c.name) AS categories
  FROM books b
  LEFT JOIN book_categories bc ON bc.book_id = b.id
  LEFT JOIN categories c       ON c.id = bc.category_id
 GROUP BY b.id, b.title
 ORDER BY b.id;

SELECT * FROM loans WHERE returned_at IS NULL AND due_at < now();

-- 2. Tampilkan daftar buku yang tidak pernah dipinjam oleh siapapun.
-- Expected output:
-- +------------------+
-- | Buku             |
-- +------------------+
-- | Buku 10          |
-- +------------------+
SELECT b.title AS "Buku"
  FROM books b
  LEFT JOIN loans l ON l.book_id = b.id
 WHERE l.id IS NULL
 ORDER BY b.id;

-- 3. Tampilkan user yang pernah mengembalikan buku terlambat beserta dendanya.
-- Expected output:
-- +------------------+------------------+
-- | User             | Denda            |
-- +------------------+------------------+
-- | User 3           | Rp5000           |
-- +------------------+------------------+
SELECT u.name AS "User",
       'Rp' || SUM(
           ((l.returned_at AT TIME ZONE 'Asia/Jakarta')::date
          - (l.due_at      AT TIME ZONE 'Asia/Jakarta')::date) * 1000
       ) AS "Denda"
  FROM loans l
  JOIN users u ON u.id = l.user_id
 WHERE l.returned_at > l.due_at
 GROUP BY u.id, u.name
 ORDER BY u.id;

-- 4. Tampilkan user dengan daftar buku yang dipinjam nya.
-- Expected output:
-- +----+--------+------------------------+
-- | No | User   | Buku                   |
-- +----+--------+------------------------+
-- | 1  | User 1 | Buku 3, Buku 2, Buku 1 |
-- | 2  | User 2 | Buku 6, Buku 5, Buku 4 |
-- | 3  | User 3 | Buku 9, Buku 8, Buku 7 |
-- +----+--------+------------------------+
SELECT row_number() OVER (ORDER BY u.id) AS "No",
       u.name AS "User",
       string_agg(b.title, ', ' ORDER BY b.id DESC) AS "Buku"
  FROM loans l
  JOIN users u ON u.id = l.user_id
  JOIN books b ON b.id = l.book_id
 GROUP BY u.id, u.name
 ORDER BY u.id;
