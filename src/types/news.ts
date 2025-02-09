export interface NewsSource {
  id: string;
  name: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  source: NewsSource;
  topic: string;
  createdAt: string;
} 