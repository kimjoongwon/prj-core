'use client';

import { UserForm } from '@components';
import { usePage } from './provider/hooks/usePage';

export default function UserEditPage() {
  const userEditPage = usePage();

  return <UserForm schema={userEditPage.schema} state={userEditPage.state} />;
}
