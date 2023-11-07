'use client';

import { observer } from 'mobx-react-lite';
import { useWorkspacesPage } from '../../hooks';

const Page = () => {
  const workspacesPage = useWorkspacesPage();
  console.log('workspacesPage', workspacesPage);
  return <div>text?</div>;
};

export default observer(Page);
