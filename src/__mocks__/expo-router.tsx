import React from 'react';
import { Text } from 'react-native';

export function Link(props: any) {
  return props.children;
}

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

export default {
  Link,
  router,
}; 