-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase Auth)
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('parent', 'child', 'own')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT,
    reading_level VARCHAR(50),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent-child relationships
CREATE TABLE parent_child_relations (
    id SERIAL PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, child_id)
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    language VARCHAR(50) DEFAULT 'swahili',
    description TEXT,
    cover_image_url TEXT,
    age_group VARCHAR(50),
    level VARCHAR(50) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    pages JSONB,  -- Add this column for storing pages as JSONB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book pages table
CREATE TABLE book_pages (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    content_text TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, page_number)
);

-- Reading progress table
CREATE TABLE reading_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    last_page_read INT,
    completed BOOLEAN DEFAULT FALSE,
    time_spent_seconds INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, book_id)
);

-- Reading activity log (for detailed tracking)
CREATE TABLE reading_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    page_number INT,
    duration_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vocabularies tracked from books
CREATE TABLE vocabulary (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    definition TEXT,
    example_usage TEXT,
    difficulty_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements and badges
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book ratings and reviews
CREATE TABLE book_ratings (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create RLS policies for security
-- We'll define policies to restrict access based on user roles

-- Example policy for books
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Anyone can read published books
CREATE POLICY book_read_policy ON books 
    FOR SELECT USING (status = 'published');

-- Authors can only create/update/delete their own books
CREATE POLICY book_write_policy ON books 
    FOR ALL USING (auth.uid()::text = author_id::text);

-- Example policy for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and parents can read their children's profiles
CREATE POLICY profile_read_policy ON user_profiles 
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR
        EXISTS (
            SELECT 1 FROM parent_child_relations 
            WHERE parent_id = auth.uid() AND child_id = user_id
        )
    );

-- Users can only update their own profile
CREATE POLICY profile_update_policy ON user_profiles 
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create indexes for performance
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_book_pages_book_id ON book_pages(book_id);
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_book_id ON reading_progress(book_id);
CREATE INDEX idx_parent_child_parent_id ON parent_child_relations(parent_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- Create a view for book recommendations
CREATE VIEW book_recommendations AS
SELECT 
    b.id,
    b.title,
    b.description,
    b.cover_image_url,
    b.age_group,
    b.level,
    b.category,
    COALESCE(AVG(br.rating), 0) as average_rating,
    COUNT(DISTINCT rp.user_id) as read_count
FROM 
    books b
LEFT JOIN 
    book_ratings br ON b.id = br.book_id
LEFT JOIN 
    reading_progress rp ON b.id = rp.book_id
WHERE 
    b.status = 'published'
GROUP BY 
    b.id;

-- Create a view for user reading statistics
CREATE VIEW user_reading_stats AS
SELECT 
    up.user_id,
    up.name,
    COUNT(DISTINCT rp.book_id) as books_read,
    SUM(CASE WHEN rp.completed THEN 1 ELSE 0 END) as books_completed,
    SUM(rp.time_spent_seconds) as total_reading_time,
    MAX(rp.completed_at) as last_completed_date,
    COALESCE(COUNT(DISTINCT a.id), 0) as achievements_count
FROM 
    user_profiles up
LEFT JOIN 
    reading_progress rp ON up.user_id = rp.user_id
LEFT JOIN 
    achievements a ON up.user_id = a.user_id
WHERE 
    up.user_type = 'child'
GROUP BY 
    up.user_id, up.name;

-- Create functions for commonly used operations

-- Function to get all books read by a child
CREATE OR REPLACE FUNCTION get_child_books(child_uuid UUID)
RETURNS TABLE (
    book_id INT,
    title VARCHAR,
    cover_image_url TEXT,
    completed BOOLEAN,
    last_page_read INT,
    time_spent_seconds INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id as book_id,
        b.title,
        b.cover_image_url,
        rp.completed,
        rp.last_page_read,
        rp.time_spent_seconds
    FROM 
        books b
    JOIN 
        reading_progress rp ON b.id = rp.book_id
    WHERE 
        rp.user_id = child_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended books based on age group and reading history
CREATE OR REPLACE FUNCTION get_recommendations(user_uuid UUID)
RETURNS TABLE (
    book_id INT,
    title VARCHAR,
    cover_image_url TEXT,
    level VARCHAR,
    average_rating NUMERIC
) AS $$
DECLARE
    user_age_group VARCHAR;
    user_reading_level VARCHAR;
BEGIN
    -- Get user age group and reading level
    SELECT 
        age_group, reading_level INTO user_age_group, user_reading_level
    FROM 
        user_profiles
    WHERE 
        user_id = user_uuid;
        
    -- Return recommendations
    RETURN QUERY
    SELECT 
        b.id as book_id,
        b.title,
        b.cover_image_url,
        b.level,
        COALESCE(AVG(br.rating), 0) as average_rating
    FROM 
        books b
    LEFT JOIN 
        book_ratings br ON b.id = br.book_id
    WHERE 
        b.age_group = user_age_group
        AND b.level = user_reading_level
        AND b.status = 'published'
        AND NOT EXISTS (
            SELECT 1 FROM reading_progress
            WHERE book_id = b.id AND user_id = user_uuid
        )
    GROUP BY 
        b.id
    ORDER BY 
        average_rating DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamps automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_books_timestamp
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_book_pages_timestamp
BEFORE UPDATE ON book_pages
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_book_ratings_timestamp
BEFORE UPDATE ON book_ratings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
