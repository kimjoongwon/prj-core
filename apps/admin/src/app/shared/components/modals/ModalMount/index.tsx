'use client';

import dynamic from 'next/dynamic';
import { ModalMountView } from './ModalMountView';

const ModalMount = dynamic(
  () => import('./ModalMountView').then(mod => mod.ModalMountView),
  {
    ssr: false,
  },
) as typeof ModalMountView;

export default ModalMount;
