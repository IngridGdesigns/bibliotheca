
---- SCHEMA v2 ----

--              List of relations
--  Schema |      Name       | Type  |  Owner  
-- --------+-----------------+-------+---------
--  public | author          | table | me
--  public | book            | table | me
--  public | book_copy       | table | me
--  public | book_display    | table | me // not necessary
--  public | category        | table | me
--  public | fine            | table | me
--  public | holds           | table | me
--  public | library_account | table | me
--  public | library_staff   | table | me
--  public | publisher       | table | me
--  public | reports         | table | me
--  public | transaction     | table | me
--  public | users           | table | me

-- Table: Author
CREATE TABLE author (
author_id SERIAL PRIMARY KEY,
author_name VARCHAR(255) NOT NULL
);

-- Table: Publisher
CREATE TABLE publisher (
publisher_id SERIAL PRIMARY KEY,
publisher_name VARCHAR(255) NOT NULL
);

-- Table: Category
CREATE TABLE category (
category_id SERIAL PRIMARY KEY,
category_name VARCHAR(255) NOT NULL
);

-- Table: Book
CREATE TABLE book (
book_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
author_id INT NOT NULL,
publisher_id INT NOT NULL,
category_id INT NOT NULL,
description TEXT,
publication_year INT,
pages INT,
isbn VARCHAR(20) UNIQUE,
FOREIGN KEY (author_id) REFERENCES author(author_id),
FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id),
FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TYPE status_enum AS ENUM ('Available', 'Borrowed', 'Reserved');

-- Table: book_copy
CREATE TABLE book_copy (
copy_id SERIAL PRIMARY KEY,
book_id INT NOT NULL,
copy_number INT NOT NULL,
status status_enum AS ENUM('Available', 'Borrowed', 'Reserved', 'Lost', 'Damaged') DEFAULT 'Available',
UNIQUE (book_id, copy_number),
FOREIGN KEY (book_id) REFERENCES book(book_id)
);

-- Table for display - could join other tables, but was thinking of cascading - feature not included in app yet
CREATE TABLE book_display (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text,
    description text,
    publisher_name text,
    publication_year text,
    pages text,
    isbn text,
    language text,
    category text,
    author_name text
);

-- Table: Users
CREATE TABLE users (
member_id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(30) UNIQUE NOT NULL,
password VARCHAR(30),
member_role VARCHAR(50) NOT NULL
);

-- Table: LibraryAccount
CREATE TABLE library_account (
account_id SERIAL PRIMARY KEY,
member_id INT NOT NULL UNIQUE,
card_number VARCHAR(50) NOT NULL,
reserve_book BOOLEAN DEFAULT FALSE,
return_book BOOLEAN DEFAULT FALSE,
renew_book BOOLEAN DEFAULT FALSE,
num_checked_out_books INT DEFAULT 0,
fines_to_pay DECIMAL(10, 2) DEFAULT 0.00,
make_payment BOOLEAN DEFAULT FALSE,
registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (member_id) REFERENCES users(member_id)
);

-- Table: Holds
CREATE TABLE holds (
hold_id SERIAL PRIMARY KEY,
book_id INT NOT NULL,
member_id INT NOT NULL,
hold_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
expiry_date TIMESTAMP,
FOREIGN KEY (book_id) REFERENCES book(book_id),
FOREIGN KEY (member_id) REFERENCES users(member_id)
);

-- Table: LibraryStaff
CREATE TABLE library_staff (
staff_id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(30) UNIQUE NOT NULL,
password VARCHAR(30) NOT NULL,
role VARCHAR(50) NOT NULL
);

-- Table: Reports
CREATE TABLE reports (
report_id SERIAL PRIMARY KEY,
report_name VARCHAR(60) NOT NULL,
description TEXT,
generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
generated_by INT NOT NULL,
FOREIGN KEY (generated_by) REFERENCES library_staff(staff_id)
);

-- Table: Fine
CREATE TABLE fine (
fine_id SERIAL PRIMARY KEY,
amount DECIMAL(10, 2) NOT NULL,
reason TEXT,
member_id INT NOT NULL,
FOREIGN KEY (member_id) REFERENCES users(member_id),
);

-- Table: Transaction
CREATE TABLE transaction (
transaction_id SERIAL PRIMARY KEY,
member_id INT,
copy_id INT NOT NULL,
transaction_type VARCHAR(50) NOT NULL,
transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
due_date TIMESTAMP,
issued_by INT,
automated_transaction BOOLEAN DEFAULT FALSE,
automated_system VARCHAR(100),
fine_Id INT;
FOREIGN KEY (member_id) REFERENCES users(member_id),
FOREIGN KEY (copy_id) REFERENCES book_copy(copy_id) ON DELETE CASCADE ON UPDATE CASCADE, -- Update to handle books, music, and movies
FOREIGN KEY (issued_by) REFERENCES library_staff(staff_id)
FOREIGN KEY (fine_Id) REFERENCES fine(fine_id) ON DELETE CASCADE ON UPDATE CASCADE
);

add later
ALTER TABLE transaction ADD COLUMN fine_Id INT;
FOREIGN KEY (fine_Id) REFERENCES fine(fine_id) ON DELETE CASCADE ON UPDATE CASCADE




// 
--- transactions explanation of nice to have if music and movie is added...

FOREIGN KEY (copy_id) REFERENCES music_copy(copy_id) ON DELETE CASCADE, -- Update to handle books, music, and movies
FOREIGN KEY (copy_id) REFERENCES movie_copy(copy_id) ON DELETE CASCADE, -- Update to handle books, music, and movies

-- added column to track return date of books in transactions
ALTER TABLE transaction
ADD COLUMN return_timestamp TIMESTAMP WITHOUT TIME ZONE;



-- add later if want to include other media
-- Table: Music
CREATE TABLE music (
music_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
artist VARCHAR(255) NOT NULL,
genre VARCHAR(255) NOT NULL,
publisher_id INT NOT NULL,
description TEXT,
release_year INT,
duration_minutes INT,
FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

-- Table: music_copy
CREATE TABLE music_copy (
copy_id SERIAL PRIMARY KEY,
music_id INT NOT NULL,
copy_number INT NOT NULL,
status ENUM('Available', 'Borrowed', 'Reserved') DEFAULT 'Available',
UNIQUE (music_id, copy_number),
FOREIGN KEY (music_id) REFERENCES music(music_id)
);

-- Table: Movie
CREATE TABLE movie (
movie_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
director VARCHAR(255) NOT NULL,
genre VARCHAR(255) NOT NULL,
publisher_id INT NOT NULL,
description TEXT,
release_year INT,
duration_minutes INT,
FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

-- Table: movie_copy
CREATE TABLE movie_copy (
copy_id SERIAL PRIMARY KEY,
movie_id INT NOT NULL,
copy_number INT NOT NULL,
status ENUM('Available', 'Borrowed', 'Reserved') DEFAULT 'Available',
UNIQUE (movie_id, copy_number),
FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
);

-- Table: Ratings
CREATE TABLE ratings (
rating_id SERIAL PRIMARY KEY,
item_id INT NOT NULL, -- ID of the book, music, or movie
rating_value DECIMAL(3, 2) NOT NULL, -- Rating value (e.g., 4.5, 3.8)
reviewer_id INT, -- ID of the reviewer (optional)
rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date of the rating (optional)
FOREIGN KEY (item_id) REFERENCES book(book_id) ON DELETE CASCADE, -- Update for music and movie references
-- Add foreign key constraints for music and movie references if applicable
FOREIGN KEY (reviewer_id) REFERENCES users(member_id) -- Optional foreign key constraint for reviewer
);


-- function
-- CREATE OR REPLACE FUNCTION get_next_copy_number(book_id integer)
-- RETURNS integer AS $$
-- DECLARE
--     next_copy_number integer;
-- BEGIN
--     -- Get the maximum copy number for the given book_id
--     SELECT COALESCE(MAX(bc.copy_number), 0) + 1 INTO next_copy_number
--     FROM book_copy bc
--     JOIN book b ON bc.book_id = b.book_id
--     WHERE b.book_id = get_next_copy_number.book_id;

--     RETURN next_copy_number;
-- END;
-- $$ LANGUAGE plpgsql;

-- use in postgreql -- 
-- SELECT get_next_copy_number(12) AS next_copy_number; -- Replace 12 with book_id 

-- in query
    -- const getNextCopyNumberQuery = `SELECT get_next_copy_number($1) AS next_copy_number`;
-- function to get the next copy number