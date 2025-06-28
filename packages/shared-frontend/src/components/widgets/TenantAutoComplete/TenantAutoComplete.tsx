import { useGetMyTenants } from '@shared/api-client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { LoggerUtil } from '@shared/utils';
import type { TenantAutoCompleteProps } from '@shared/types';

interface Props extends TenantAutoCompleteProps {}

// 쿠키에서 tenantId를 읽는 함수
const getTenantIdFromCookie = (): string => {
  const cookies = document.cookie.split(';');
  const tenantCookie = cookies.find(cookie =>
    cookie.trim().startsWith('tenantId='),
  );
  return tenantCookie ? tenantCookie.split('=')[1].trim() : '';
};

export const TenantAutoComplete = observer(
  ({ className = 'max-w-xs', onTenantSelect, ...rest }: Props) => {
    const { data: getMyTenantsResponse } = useGetMyTenants();
    const tenants = getMyTenantsResponse?.data || [];

    const state = useLocalObservable(() => ({
      selectedKey: getTenantIdFromCookie(),
      setSelectedKey(key: string) {
        this.selectedKey = key;
        // Cookie에 tenantId 저장
        if (key) {
          document.cookie = `tenantId=${key}; path=/; max-age=${
            60 * 60 * 24 * 30
          }`; // 30일 유효
          LoggerUtil.info('Tenant selected and saved to cookie', {
            tenantId: key,
          });
          // 부모 컴포넌트에 알림
          onTenantSelect?.(key);
        }
      },
    }));

    return (
      <Autocomplete
        placeholder="테넌트를 검색하고 선택하세요"
        selectedKey={state.selectedKey}
        onSelectionChange={key => {
          if (key) {
            state.setSelectedKey(key.toString());
          }
        }}
        className={className}
        {...rest}
      >
        {tenants.map(tenant => (
          <AutocompleteItem key={tenant.id}>
            {tenant.space?.ground.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    );
  },
);

TenantAutoComplete.displayName = 'TenantAutoComplete';
