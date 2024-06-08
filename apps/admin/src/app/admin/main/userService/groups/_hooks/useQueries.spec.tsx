import {
  getGetCategoriesMockHandler,
  getPROMISEServerMock,
  useFindGroupsByPageOptions,
} from '@shared/frontend';
import { getQueryClient } from '@shared/frontend/src/providers/ReactQuery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { expect, test } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('Admin Groups Page useFindGroupsByPageOptions는 성공해야한다.', async () => {
  getPROMISEServerMock();
  const { result, waitFor } = renderHook(() => useFindGroupsByPageOptions(), {
    wrapper,
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
