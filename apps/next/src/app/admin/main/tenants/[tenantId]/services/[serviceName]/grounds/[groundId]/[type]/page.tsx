'use client';

import { PageBuilder } from '@/components';
import { usePageBuilder } from '@/hooks/usePageBuilder';
import { observer } from 'mobx-react-lite';

const GroundPage = observer(() => {
  const pageBuilder = usePageBuilder('GroundPage', 'ground');
  return <PageBuilder pageBuilder={pageBuilder} />;
});

export default GroundPage;
