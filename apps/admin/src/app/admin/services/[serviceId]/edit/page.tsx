'use client';

import { ServiceForm } from '@components';
import { observer } from 'mobx-react-lite';
import { useServiceEditPage } from './_hooks';

function ServiceEditPage() {
  const {
    meta: { form },
  } = useServiceEditPage();

  return <ServiceForm state={form.state} schema={form.schema} />;
}

export default observer(ServiceEditPage);
