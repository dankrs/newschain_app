import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS, STRINGS } from '@/constants';

export default function Welcome() {
  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            {STRINGS.welcome.title}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {STRINGS.welcome.subtitle}
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title={STRINGS.welcome.login}
            onPress={handleLogin}
            variant="primary"
          />
          <Text style={styles.orText}>{STRINGS.welcome.or}</Text>
          <Button
            title={STRINGS.welcome.signup}
            onPress={handleSignUp}
            variant="secondary"
          />
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
  },
  title: {
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  buttons: {
    gap: 16,
    alignItems: 'center',
  },
  orText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
}); 