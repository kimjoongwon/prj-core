'use client';

import { useServiceEditPage } from '@adminPages';
import { ServiceForm } from '@components';
import { observer } from 'mobx-react-lite';

function Page() {
  const {
    meta: {
      isEditMode,
      form: {
        state: { createServiceInput, updateServiceInput },
      },
    },
  } = useServiceEditPage();

  return (
    <ServiceForm state={isEditMode ? updateServiceInput : createServiceInput} />
  );
}

export default observer(Page);
