import { render, screen } from '@testing-library/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { vi } from 'vitest';
import { ListboxBuilder } from './ListboxBuilder';
import { PageProvider } from '../../../provider';

const mockData = [
  { id: '1', name: 'Tenant 1' },
  { id: '2', name: 'Tenant 2' },
];

vi.mock('@shared/api-client', () => ({
  APIManager: {
    tenants: {
      apply: () => ({
        data: {
          data: mockData,
        },
        isLoading: false,
      }),
    },
  },
}));

describe('ListboxBuilder', () => {
  it('should render correctly with fetched data', async () => {
    const TestComponent = observer(() => {
      const pageState = useLocalObservable(() => ({ tenantId: '' }));

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <ListboxBuilder
            path="tenantId"
            query={{
              type: 'list',
              query: {
                name: 'tenants',
                params: {},
              },
              listOptions: {
                valueField: 'id',
                labelField: 'name',
              },
            }}
            label="Tenants"
          />
        </PageProvider>
      );
    });

    render(<TestComponent />);

    expect(screen.getByText('Tenant 1')).toBeDefined();
    expect(screen.getByText('Tenant 2')).toBeDefined();
  });

  it('should support both light and dark themes', async () => {
    const TestComponent = observer(() => {
      const pageState = useLocalObservable(() => ({ tenantId: '' }));

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <div className="dark">
            <ListboxBuilder
              path="tenantId"
              query={{
                type: 'list',
                query: {
                  name: 'tenants',
                  params: {},
                },
                listOptions: {
                  valueField: 'id',
                  labelField: 'name',
                },
              }}
              label="Tenants (Dark Mode)"
            />
          </div>
          <div className="light">
            <ListboxBuilder
              path="tenantId"
              query={{
                type: 'list',
                query: {
                  name: 'tenants',
                  params: {},
                },
                listOptions: {
                  valueField: 'id',
                  labelField: 'name',
                },
              }}
              label="Tenants (Light Mode)"
            />
          </div>
        </PageProvider>
      );
    });

    render(<TestComponent />);

    expect(screen.getByText('Tenants (Dark Mode)')).toBeDefined();
    expect(screen.getByText('Tenants (Light Mode)')).toBeDefined();
    expect(screen.getAllByText('Tenant 1')).toHaveLength(2);
    expect(screen.getAllByText('Tenant 2')).toHaveLength(2);
  });

  it('should handle loading state', async () => {
    // Mock loading state
    vi.mocked(require('@shared/api-client').APIManager.tenants.apply).mockReturnValueOnce({
      data: null,
      isLoading: true,
    });

    const TestComponent = observer(() => {
      const pageState = useLocalObservable(() => ({ tenantId: '' }));

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <ListboxBuilder
            path="tenantId"
            query={{
              type: 'list',
              query: {
                name: 'tenants',
                params: {},
              },
              listOptions: {
                valueField: 'id',
                labelField: 'name',
              },
            }}
            label="Tenants"
          />
        </PageProvider>
      );
    });

    render(<TestComponent />);

    // Should show spinner during loading
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  it('should handle error state', async () => {
    // Mock error state
    vi.mocked(require('@shared/api-client').APIManager.tenants.apply).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error('Network error'),
    });

    const TestComponent = observer(() => {
      const pageState = useLocalObservable(() => ({ tenantId: '' }));

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <ListboxBuilder
            path="tenantId"
            query={{
              type: 'list',
              query: {
                name: 'tenants',
                params: {},
              },
              listOptions: {
                valueField: 'id',
                labelField: 'name',
              },
            }}
            label="Tenants"
          />
        </PageProvider>
      );
    });

    render(<TestComponent />);

    expect(screen.getByText('데이터를 불러오는 중 오류가 발생했습니다.')).toBeDefined();
  });

  it('should handle empty state', async () => {
    // Mock empty data
    vi.mocked(require('@shared/api-client').APIManager.tenants.apply).mockReturnValueOnce({
      data: {
        data: [],
      },
      isLoading: false,
    });

    const TestComponent = observer(() => {
      const pageState = useLocalObservable(() => ({ tenantId: '' }));

      return (
        <PageProvider pageBuilder={{ state: pageState }}>
          <ListboxBuilder
            path="tenantId"
            query={{
              type: 'list',
              query: {
                name: 'tenants',
                params: {},
              },
              listOptions: {
                valueField: 'id',
                labelField: 'name',
              },
            }}
            label="Tenants"
          />
        </PageProvider>
      );
    });

    render(<TestComponent />);

    expect(screen.getByText('표시할 데이터가 없습니다.')).toBeDefined();
  });
});
