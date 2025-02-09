import { supabase } from '@/lib/supabase';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async register({ email, password, name }: RegisterData) {
    try {
      // Sign up the user - profile will be created automatically via trigger
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: 'newschain://verify-email',
        },
      });

      if (authError) {
        console.error('Auth Error:', authError);
        throw new AuthError(
          authError.message || 'Failed to create account',
          authError
        );
      }

      if (!authData.user) {
        throw new AuthError('No user data returned from signup');
      }

      // Check if email confirmation is required
      if (authData.session === null) {
        // Email confirmation is required
        return {
          ...authData,
          message: 'Please check your email for verification link',
        };
      }

      return authData;
    } catch (error) {
      console.error('Registration Error:', error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'An unexpected error occurred during registration',
        error
      );
    }
  },

  async login({ email, password }: { email: string; password: string }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new AuthError(error.message);
      }

      if (!data.session) {
        throw new AuthError('No session created after login');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('An unexpected error occurred during login');
    }
  },
}; 