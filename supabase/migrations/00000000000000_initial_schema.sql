-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth, we'll add profile data)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  full_name text,
  avatar_url text
);

-- Topics table
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  is_custom boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- User Topics table
CREATE TABLE user_topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  summary text,
  content text NOT NULL,
  source_url text NOT NULL,
  source_name text NOT NULL,
  published_at timestamp with time zone NOT NULL,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Article Topics table
CREATE TABLE article_topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(article_id, topic_id)
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Topics policies
CREATE POLICY "Topics are viewable by everyone" 
  ON topics FOR SELECT 
  USING (true);

-- User Topics policies
CREATE POLICY "Users can view their topic subscriptions" 
  ON user_topics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their topic subscriptions" 
  ON user_topics FOR ALL 
  USING (auth.uid() = user_id);

-- Articles policies
CREATE POLICY "Articles are viewable by everyone" 
  ON articles FOR SELECT 
  USING (true);

-- Article Topics policies
CREATE POLICY "Article topics are viewable by everyone" 
  ON article_topics FOR SELECT 
  USING (true);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" 
  ON bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks" 
  ON bookmarks FOR ALL 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 