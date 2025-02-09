import { StyleSheet, View, Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { COLORS } from '@/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

export function NewsCard({ id, title, content, author, createdAt, likes }: NewsCardProps) {
  const handlePress = () => {
    router.push(`/news/${id}`);
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.content} numberOfLines={3}>
          {content}
        </Text>
        <View style={styles.footer}>
          <View style={styles.authorInfo}>
            <Text variant="bodySmall" style={styles.author}>
              {author}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.stats}>
            <MaterialCommunityIcons name="heart-outline" size={16} color={COLORS.textSecondary} />
            <Text variant="bodySmall" style={styles.likesCount}>
              {likes}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  content: {
    color: COLORS.text,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'column',
  },
  author: {
    color: COLORS.textSecondary,
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesCount: {
    color: COLORS.textSecondary,
  },
}); 