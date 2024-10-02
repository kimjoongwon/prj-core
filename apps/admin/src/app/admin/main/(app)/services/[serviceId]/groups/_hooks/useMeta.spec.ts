import { test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMeta } from './useMeta';

test('useMeta', () => {
  const meta = renderHook(useMeta);

  expect(meta).toBeDefined();
});
