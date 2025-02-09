import { act, render, waitFor } from '@testing-library/react-native';
import { expect, jest, test } from '@jest/globals';
import TestScreen from '../test';

test('TestScreen renders correctly', async () => {
  const { getByText } = render(<TestScreen />);
  
  // Check initial loading state
  expect(getByText('Supabase Connection Test')).toBeTruthy();
  expect(getByText('Status: loading')).toBeTruthy();
  
  // Wait for state updates to complete
  await waitFor(() => {
    expect(getByText('Status: success')).toBeTruthy();
  });
  
  // Check final state
  expect(getByText('Connected successfully! Found 0 topics.')).toBeTruthy();
}); 