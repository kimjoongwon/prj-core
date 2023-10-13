import { PageProvider, UsersPage } from './components';

export default function Page() {
  return (
    <PageProvider>
      <UsersPage />
    </PageProvider>
  );
}
