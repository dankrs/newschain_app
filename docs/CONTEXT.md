# Customized News Aggregator App Specification

This document provides comprehensive specifications for the news aggregator app, covering both core functionality and additional features.

## Tech Stack

- Frontend: React Native 0.77 with TypeScript, Expo SDK 52 and Expo Router, Node 18 LTS
- Backend/Database: Supabase
- UI Framework: React Native Paper 5.13.1
- AI Processing: DeepSeek R1 via OpenRouter

## Core Application Flow

### 1. User Onboarding & Authentication

- **Welcome Screen**

  - Clean, minimal design
  - Clear sign-up/login calls-to-action
  - Email-based sign-up and login
- **Registration Process**
  - User inputs credentials
  - Successful sign-up/login redirects to the main dashboard

### 2. Main Dashboard & Topic Selection

- **Dashboard Interface**
  - Intuitive layout
  - Clear topic selection interface
- **Topic Options**
  - Predefined categories (Politics, Tech, Markets, etc.)
  - Custom topic input
  - Preference storage

### 3. News Feed & Content

- **Content Display**
  - Aggregated news from multiple sources
  - Headlines, summaries, and thumbnails
  - Source attribution and timestamps
- **Navigation**
  - Infinite scroll functionality
  - Responsive design for all devices
  - Dynamic content updates

### 4. User Interactions

- **Article Management**
  - In-app reading experience
  - Bookmarking system

- **Content Discovery**
  - Search functionality
  - Custom notifications
  - Content filtering options

### 5. Technical Architecture

- **Backend Systems**
  - News scraping engine
  - RESTful API services
  - Secure data handling

### 6. Database Schema

#### Users Table
```sql
users (
  id uuid primary key default auth.uid(),
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  full_name text,
  avatar_url text
)
```

#### Topics Table
```sql
topics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  is_custom boolean default false,
  created_at timestamp with time zone default now()
)
```

#### User Topics Table
```sql
user_topics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, topic_id)
)
```

#### Articles Table
```sql
articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  content text not null,
  source_url text not null,
  source_name text not null,
  published_at timestamp with time zone not null,
  thumbnail_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

#### Article Topics Table
```sql
article_topics (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references articles(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(article_id, topic_id)
)
```

#### Bookmarks Table
```sql
bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  article_id uuid references articles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, article_id)
)
```

### 7. Project Structure

```
newschain/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (main)/              # Main app routes
│   │   ├── index.tsx        # Dashboard
│   │   ├── topics/          # Topic management
│   │   ├── articles/        # Article views
│   │   └── bookmarks/       # Bookmarked articles
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   └── features/       # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   │   ├── supabase.ts    # Supabase client
│   │   └── news.ts        # News service
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── constants/         # App constants
├── assets/                # Static assets
├── docs/                  # Documentation
├── tests/                # Test files
├── .env.example          # Environment variables template
├── app.config.ts         # Expo config
├── package.json
└── tsconfig.json
```

The database schema is designed for optimal performance with Supabase, including proper indexing and relationships. The folder structure follows Expo Router conventions while maintaining a clean separation of concerns.  