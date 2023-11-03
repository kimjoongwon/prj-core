'use client';
import { CategoryItemForm } from '@components';
import { observer } from 'mobx-react-lite';
import { usePage } from '../../../../../admin/categoryItems/[categoryItemId]/edit/_hooks';

function Page() {
  const {
    meta: {
      form: { state },
    },
  } = usePage();
  return <CategoryItemForm state={state} />;
}

export default observer(Page);
