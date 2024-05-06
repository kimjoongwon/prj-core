'use client';

import { FormLayout, ServiceForm } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { usePage } from './_hooks';

const ServiceEditPage = observer(() => {
  const {
    state,
    meta: { rightButtons, leftButtons },
  } = usePage();

  return (
    <div>
      <div>{state.form.name}</div>

      <FormLayout
        title={'서비스 생성'}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
      >
        <ServiceForm state={state.form} />
      </FormLayout>
    </div>
  );
});

export default ServiceEditPage;
