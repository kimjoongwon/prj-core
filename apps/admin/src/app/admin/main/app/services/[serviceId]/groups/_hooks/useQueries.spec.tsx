import { getPROMISEServerMock, useGetGroupsByQuery } from '@shared/frontend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
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
  const { result } = renderHook(() => useGetGroupsByQuery(), {
    wrapper,
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
