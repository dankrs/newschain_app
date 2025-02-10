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
│   │   ├── _layout.tsx      # Auth layout configuration
│   │   ├── login.tsx        # Login screen
│   │   ├── register.tsx     # Registration screen
│   │   ├── verify-email.tsx # Email verification screen
│   │   └── welcome.tsx      # Welcome screen
│   ├── (app)/               # Main app routes
│   │   ├── _layout.tsx      # App layout with bottom tabs
│   │   ├── home.tsx         # News feed screen
│   │   ├── profile.tsx      # User profile screen
│   │   └── topics.tsx       # Topic management screen
│   ├── __tests__/           # Test files
│   │   ├── index.test.tsx
│   │   └── test.test.tsx
│   ├── _layout.tsx          # Root layout configuration
│   ├── index.tsx            # Entry redirect
│   └── test.tsx             # Test screen
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   │   └── Button.tsx  # Custom button component
│   │   └── NewsCard.tsx    # News card component
│   ├── constants/          # App constants
│   │   └── index.ts        # Colors, fonts, sizes, strings
│   ├── lib/               # Core libraries
│   │   └── supabase.ts    # Supabase client configuration
│   ├── services/          # API and external services
│   │   ├── auth.ts        # Authentication service
│   │   └── news.ts        # News service
│   ├── types/             # TypeScript types
│   │   ├── env.d.ts       # Environment variables types
│   │   ├── news.ts        # News-related types
│   │   └── topics.ts      # Topic-related types
│   └── utils/             # Utility functions
│       └── dialogs.ts     # Dialog helper functions
├── docs/                  # Documentation
│   ├── CONTEXT.md         # App specification
│   └── Development_Plan.md # Development roadmap
├── assets/               # Static assets
├── .env                  # Environment variables
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── app.config.ts        # Expo config
├── app.json             # Expo app manifest
├── babel.config.js      # Babel configuration
├── jest.setup.ts        # Jest test setup
├── package.json         # Project dependencies
├── README.md           # Project documentation
└── tsconfig.json       # TypeScript configuration
```

The database schema is designed for optimal performance with Supabase, including proper indexing and relationships. The folder structure follows Expo Router conventions while maintaining a clean separation of concerns.  