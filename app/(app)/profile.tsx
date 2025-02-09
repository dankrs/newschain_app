import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Avatar, Button, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import { router, useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';
import { showConfirmDialog } from '@/utils/dialogs';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
      setFullName(profile.full_name);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    return isEditing && fullName !== profile?.full_name;
  }, [isEditing, fullName, profile?.full_name]);

  const handleBackNavigation = useCallback(async () => {
    if (!hasUnsavedChanges()) {
      return false;
    }

    const confirmed = await showConfirmDialog({
      title: 'Discard Changes?',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      confirmText: 'Discard',
      destructive: true,
    });

    if (confirmed) {
      setIsEditing(false);
      setFullName(profile?.full_name || '');
      return false;
    }

    return true;
  }, [hasUnsavedChanges, profile?.full_name]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackNavigation
    );

    return () => backHandler.remove();
  }, [handleBackNavigation]);

  useEffect(() => {
    if (hasUnsavedChanges()) {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (!e.data.action) return;

        e.preventDefault();

        handleBackNavigation().then((shouldPrevent) => {
          if (!shouldPrevent) {
            navigation.dispatch(e.data.action);
          }
        });
      });

      return unsubscribe;
    }
  }, [navigation, hasUnsavedChanges, handleBackNavigation]);

  const handleCancelEditing = useCallback(async () => {
    if (hasUnsavedChanges()) {
      const confirmed = await showConfirmDialog({
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        destructive: true,
      });

      if (confirmed) {
        setIsEditing(false);
        setFullName(profile?.full_name || '');
      }
    } else {
      setIsEditing(false);
    }
  }, [hasUnsavedChanges, profile?.full_name]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    const confirmed = await showConfirmDialog({
      title: 'Save Changes',
      message: 'Are you sure you want to save these changes to your profile?',
      confirmText: 'Save',
    });

    if (confirmed) {
      setIsLoading(true);
      setError(null);

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (error) throw error;

        setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
            style={styles.avatar}
          />
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.form}>
          {isEditing ? (
            <>
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.buttonGroup}>
                <Button
                  mode="contained"
                  onPress={handleUpdateProfile}
                  loading={isLoading}
                  disabled={isLoading || !fullName.trim()}
                  style={styles.button}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancelEditing}
                  disabled={isLoading}
                  style={styles.button}
                >
                  Cancel
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{profile?.full_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{profile?.email}</Text>
              </View>
              <Button
                mode="contained"
                onPress={handleStartEditing}
                style={styles.button}
              >
                Edit Profile
              </Button>
            </>
          )}

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
            textColor={COLORS.error}
          >
            Logout
          </Button>
        </View>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: COLORS.primary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    borderColor: COLORS.error,
    marginTop: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    marginTop: 8,
    textAlign: 'center',
  },
}); 