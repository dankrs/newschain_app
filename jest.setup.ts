import { expect } from '@jest/globals';
import '@testing-library/jest-native';
import { View } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => require('./__mocks__/expo-router'));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
  };
});

/* eslint-disable @typescript-eslint/no-empty-function */
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: async () => {},
  getItem: async () => null,
  removeItem: async () => {},
  clear: async () => {},
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => {},
  multiRemove: async () => {},
  multiMerge: async () => {},
}));

// Mock Supabase
jest.mock('@/services/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  },
})); 