import { StyleSheet, View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { supabase } from '@/lib/supabase';
import { useState, useCallback } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { newsService } from '@/services/news';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: {
    full_name: string;
  };
  created_at: string;
  likes_count: number;
}

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // First get user's topics
      const { data: userTopics } = await supabase
        .from('user_topics')
        .select('*');

      // Then fetch news based on those topics
      const news = await newsService.fetchNewsByTopics(userTopics.map(topic => topic.topic));
      setNews(news);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  }, []);

  // Fetch news on mount
  useState(() => {
    fetchNews();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          NewsChain
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : news.length === 0 ? (
          <Text style={styles.emptyText}>
            No news articles found. Try selecting some topics in the Define News tab.
          </Text>
        ) : (
          news.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              author={item.author.full_name}
              createdAt={item.created_at}
              likes={item.likes_count}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyText: {
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 16,
  },
}); 