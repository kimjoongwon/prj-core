'use client';

import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

const DynamicPagination = dynamic(
  () => import('./Pagination').then(mod => observer(mod.Pagination)),
  {
    ssr: false,
  },
);

export default DynamicPagination;
