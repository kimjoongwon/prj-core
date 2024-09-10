import { expect, test } from 'vitest';
import { getActionManager } from './actionManager';

test('actionManager', () => {
  const actionManager = getActionManager();
  const result = actionManager.getPath(
    {
      skip: 0,
      take: 10,
    },
    () => ['test'],
  );

  expect(result).toBe('test?skip=0&take=10');
});
