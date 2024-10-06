import { renderHook } from '@testing-library/react';
import { test, expect, vi, Mock } from 'vitest';
import { usePage } from './usePage';
import { useQueries } from './useQueries';
import { useMeta } from './useMeta';
import { GroupDto } from '@shared/frontend';

vi.mock('./useMeta');
vi.mock('./useQueries');

test('Data와 Columns을 리턴한다.', () => {
  (useQueries as Mock).mockReturnValue({
    groups: [
      {
        id: '1',
        name: 'Group 1',
        createdAt: new Date().toString(),
        removedAt: new Date().toString(),
        serviceId: 'serviceId',
        spaceId: 'spaceId',
        updatedAt: new Date().toString(),
      },
    ] as GroupDto[],
  });

  (useMeta as Mock).mockReturnValue({
    columns: [],
  });

  const { result } = renderHook(usePage);

  expect(result.current.dataGrid.data).toBeDefined();
  expect(result.current.dataGrid.columns).toBeDefined();
});
