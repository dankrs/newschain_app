import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Chip, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { TopicCategory, PredefinedTopic, UserTopic } from '@/types/topics';

export default function Topics() {
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [predefinedTopics, setPredefinedTopics] = useState<PredefinedTopic[]>([]);
  const [userTopics, setUserTopics] = useState<UserTopic[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // Fetch categories and predefined topics
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('topic_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch predefined topics with categories
      const { data: predefined, error: predefinedError } = await supabase
        .from('predefined_topics')
        .select(`
          *,
          category:topic_categories(*)
        `)
        .order('name');

      if (predefinedError) throw predefinedError;
      setPredefinedTopics(predefined || []);

      // Fetch user's topics
      const { data: userTopicsData, error: userTopicsError } = await supabase
        .from('user_topics')
        .select('*');

      if (userTopicsError) throw userTopicsError;
      setUserTopics(userTopicsData || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Failed to load topics');
    }
  };

  const isTopicSelected = (topicId: string) => {
    return userTopics.some(ut => ut.predefined_topic_id === topicId);
  };

  const toggleTopic = async (topicId: string) => {
    try {
      if (isTopicSelected(topicId)) {
        // Remove topic
        const { error } = await supabase
          .from('user_topics')
          .delete()
          .eq('predefined_topic_id', topicId);

        if (error) throw error;
        setUserTopics(prev => prev.filter(t => t.predefined_topic_id !== topicId));
      } else {
        // Add topic
        const { data, error } = await supabase
          .from('user_topics')
          .insert({
            predefined_topic_id: topicId,
          })
          .select()
          .single();

        if (error) throw error;
        setUserTopics(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling topic:', error);
      Alert.alert('Error', 'Failed to update topic');
    }
  };

  const addCustomTopic = async () => {
    if (!customTopic.trim()) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_topics')
        .insert({
          custom_topic_name: customTopic.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setUserTopics(prev => [...prev, data]);
      setCustomTopic('');
      Alert.alert('Success', 'Custom topic added');
    } catch (error) {
      console.error('Error adding custom topic:', error);
      Alert.alert('Error', 'Failed to add custom topic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            News Topics
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Select topics you're interested in
          </Text>
        </View>

        {categories.map(category => (
          <View key={category.id} style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {category.name}
            </Text>
            <View style={styles.topicsGrid}>
              {predefinedTopics
                .filter(topic => topic.category_id === category.id)
                .map(topic => (
                  <Chip
                    key={topic.id}
                    selected={isTopicSelected(topic.id)}
                    onPress={() => toggleTopic(topic.id)}
                    style={styles.topicChip}
                  >
                    {topic.name}
                  </Chip>
                ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Add Custom Topic
          </Text>
          <View style={styles.customTopicForm}>
            <TextInput
              label="Topic Name"
              value={customTopic}
              onChangeText={setCustomTopic}
              mode="outlined"
              style={styles.input}
            />
            <Button
              title={isLoading ? 'Adding...' : 'Add Topic'}
              onPress={addCustomTopic}
              variant="primary"
              disabled={isLoading || !customTopic.trim()}
            />
          </View>
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    marginBottom: 8,
  },
  customTopicForm: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
  },
}); 