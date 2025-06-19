import { render, screen } from '@testing-library/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { vi } from 'vitest';
import { ListboxBuilder } from './ListboxBuilder';
import { PageProvider } from '../../../providers';

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
        <PageProvider state={pageState}>
          <ListboxBuilder
            path="tenantId"
            query={{
              apiKey: 'tenants',
              valueField: 'id',
              labelField: 'name',
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
});
