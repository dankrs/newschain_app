// Type definitions
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  is_custom: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  summary?: string;
  content: string;
  source_url: string;
  source_name: string;
  published_at: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}
