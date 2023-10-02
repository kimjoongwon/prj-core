'use client';

import { UserForm } from '@components';
import { useUserEditPage } from './provider/hooks/useUserEditPage';

export default function UserEditPage() {
  const userEditPage = useUserEditPage();

  return <UserForm schema={userEditPage.schema} state={userEditPage.state} />;
}
