import { supabase } from '@/lib/supabase';
import { Article, NewsSource } from '@/types/news';

interface NewsError extends Error {
  code?: string;
}

export class NewsServiceError extends Error {
  constructor(message: string, public originalError?: NewsError) {
    super(message);
    this.name = 'NewsServiceError';
  }
}

export const newsService = {
  async fetchNewsByTopics(topics: string[]): Promise<Article[]> {
    try {
      if (!topics.length) {
        return [];
      }

      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          url,
          source:news_sources(id, name, url),
          topic:predefined_topics(name),
          created_at
        `)
        .in('topic_id', topics)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        url: article.url,
        source: article.source,
        topic: article.topic.name,
        createdAt: article.created_at,
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new NewsServiceError(
        'Failed to fetch news articles',
        error as NewsError
      );
    }
  },

  async refreshNews(): Promise<void> {
    try {
      // This would typically call your backend service to trigger a news crawl
      const { error } = await supabase.functions.invoke('refresh-news');
      if (error) throw error;
    } catch (error) {
      console.error('Error refreshing news:', error);
      throw new NewsServiceError(
        'Failed to refresh news',
        error as NewsError
      );
    }
  },

  async searchNews(query: string): Promise<Article[]> {
    try {
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          url,
          source:news_sources(id, name, url),
          topic:predefined_topics(name),
          created_at
        `)
        .textSearch('title', query)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        url: article.url,
        source: article.source,
        topic: article.topic.name,
        createdAt: article.created_at,
      }));
    } catch (error) {
      console.error('Error searching news:', error);
      throw new NewsServiceError(
        'Failed to search news articles',
        error as NewsError
      );
    }
  }
}; 