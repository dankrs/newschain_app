import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Avatar, Button, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

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

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
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
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

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
                  onPress={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || '');
                  }}
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
                onPress={() => setIsEditing(true)}
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