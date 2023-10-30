'use client';

import { ServiceForm } from '@components';
import { observer } from 'mobx-react-lite';
import { useServiceEditPage } from '../../../../../admin/services/[serviceId]/edit/_hooks';

function Page() {
  const {
    meta: { form },
  } = useServiceEditPage();
  return <ServiceForm state={form.state} schema={form.schema} />;
}

export default observer(Page);
