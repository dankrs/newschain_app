import { StyleSheet, View } from 'react-native';
import { Text, TextInput, IconButton, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS, STRINGS } from '@/constants';
import { useState } from 'react';
import { authService, AuthError } from '@/services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleLogin = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await authService.login({ email, password });
      console.log('Login successful');
      router.replace('/(app)/home');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof AuthError) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('invalid login credentials')) {
          setErrors({
            general: 'Incorrect email or password. Please try again.',
          });
        } else if (errorMessage.includes('email')) {
          setErrors({
            email: err.message,
          });
        } else if (errorMessage.includes('password')) {
          setErrors({
            password: err.message,
          });
        } else {
          setErrors({
            general: err.message,
          });
        }
      } else {
        setErrors({
          general: STRINGS.errors.generalError,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
          style={styles.backButton}
        />
        
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {STRINGS.login.title}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {STRINGS.login.subtitle}
          </Text>
        </View>

        <View style={styles.form}>
          {errors.general && (
            <Text style={styles.errorText}>
              {errors.general}
            </Text>
          )}
          <View>
            <TextInput
              label={STRINGS.login.emailLabel}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          </View>

          <View>
            <TextInput
              label={STRINGS.login.passwordLabel}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          </View>

          <Button
            title={isSubmitting ? 'Logging in...' : STRINGS.login.loginButton}
            onPress={handleLogin}
            variant="primary"
            style={styles.button}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {STRINGS.login.noAccount}{' '}
            <Text
              style={styles.link}
              onPress={() => router.push('/(auth)/register')}
            >
              {STRINGS.login.signupLink}
            </Text>
          </Text>
          <Text style={[styles.link, styles.forgotPassword]} onPress={() => {}}>
            {STRINGS.login.forgotPassword}
          </Text>
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
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 16,
  },
  footerText: {
    color: COLORS.textSecondary,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    margin: 0,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
}); 