'use client';

import { usePage } from './providers/page/hooks/usePage';
import { UserForm } from '@components';

export default function Page() {
  const page = usePage();

  return <UserForm schema={page.form.schema} state={page.form.state} />;
}
