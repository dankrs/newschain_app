import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, STRINGS } from '@/constants';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function VerifyEmail() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {STRINGS.verification.title}
        </Text>
        <Text style={styles.message}>
          {STRINGS.verification.message}
        </Text>

        <Button
          title="Back to Login"
          onPress={() => router.push('/(auth)/login')}
          variant="primary"
          style={{ marginTop: 24 }}
        />
      </View>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 16,
  },
}); 