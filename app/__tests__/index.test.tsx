import { render } from '@testing-library/react-native';
import { expect, test } from '@jest/globals';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Index from '../index';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    {children}
  </SafeAreaProvider>
);

test('Index screen renders correctly', () => {
  const { getByText, getByTestId, debug } = render(<Index />, {
    wrapper: TestWrapper,
  });
  
  // Debug the rendered component
  debug();
  
  // Check main title
  expect(getByText('Welcome to NewsChain')).toBeTruthy();
  
  try {
    // Check button exists and has correct text
    const button = getByTestId('test-connection-button');
    expect(button).toBeTruthy();
    
    const buttonText = getByTestId('test-connection-text');
    expect(buttonText).toBeTruthy();
    expect(buttonText.props.children).toBe('Test Supabase Connection');
  } catch (error) {
    console.error('Failed to find button or text:', error);
    throw error;
  }
}); 