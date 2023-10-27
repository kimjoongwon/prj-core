'use client';

import { ServiceForm } from '@components';
import { useServiceEditPage } from './_hooks';

export default function ServiceEditPage() {
  const {
    meta: { isEditMode, form },
  } = useServiceEditPage();
  return (
    <ServiceForm
      state={
        isEditMode
          ? form.state.updateServiceInput
          : form.state.createServiceInput
      }
    />
  );
}
