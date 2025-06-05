import { useGetTenantsByQuery } from '@shared/api-client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Listbox } from '../../Listbox';

export const WorkspaceSelect = observer(() => {
  const { data: getTenantsByQueryResponse } = useGetTenantsByQuery();
  const tenants = getTenantsByQueryResponse?.data || [];
  const state = useLocalObservable(() => ({
    value: '',
  }));

  return (
    <Listbox
      state={state}
      path="value"
      options={tenants.map(tenant => ({
        text: tenant.space.name,
        value: tenant.id,
      }))}
    />
  );
});

WorkspaceSelect.displayName = 'WorkspaceSelect';
