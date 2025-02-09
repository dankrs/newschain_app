import { StyleSheet, View } from 'react-native';
import { Text, TextInput, IconButton, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS, STRINGS } from '@/constants';
import { useState, useCallback } from 'react';
import { authService, AuthError } from '@/services/auth';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = STRINGS.validation.nameRequired;
    } else if (name.length < 2) {
      newErrors.name = STRINGS.validation.nameLength;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = STRINGS.validation.emailRequired;
    } else if (!emailRegex.test(email)) {
      newErrors.email = STRINGS.validation.emailInvalid;
    }

    // Validate password
    if (!password) {
      newErrors.password = STRINGS.validation.passwordRequired;
    } else if (password.length < 8) {
      newErrors.password = STRINGS.validation.passwordLength;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = STRINGS.validation.confirmPasswordRequired;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = STRINGS.validation.passwordsDoNotMatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (isSubmitting) return;

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const result = await authService.register({
        email,
        password,
        name,
      });
      
      console.log('Registration successful:', result);

      // Always redirect to verification screen since email confirmation is required
      router.push('/(auth)/verify-email');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof AuthError) {
        if (error.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: error.message }));
        } else if (error.message.includes('password')) {
          setErrors(prev => ({ ...prev, password: error.message }));
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError(STRINGS.errors.generalError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {STRINGS.register.title}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {STRINGS.register.subtitle}
          </Text>
        </View>

        <View style={styles.form}>
          {generalError && (
            <Text style={styles.errorText}>{generalError}</Text>
          )}
          <View>
            <TextInput
              label={STRINGS.register.nameLabel}
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          </View>

          <View>
            <TextInput
              label={STRINGS.register.emailLabel}
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
              label={STRINGS.register.passwordLabel}
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

          <View>
            <TextInput
              label={STRINGS.register.confirmPasswordLabel}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={styles.input}
              error={!!errors.confirmPassword}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          </View>

          <Button
            title={STRINGS.register.registerButton}
            onPress={handleRegister}
            variant="primary"
            style={styles.button}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {STRINGS.register.haveAccount}{' '}
            <Text
              style={styles.link}
              onPress={() => router.push('/(auth)/login')}
            >
              {STRINGS.register.loginLink}
            </Text>
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
    gap: 8,
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
  },
  footerText: {
    color: COLORS.textSecondary,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
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