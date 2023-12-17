'use client';

import dynamic from 'next/dynamic';
import { SelectModalView } from './SelectModalView';

const SelectModal = dynamic(
  () => import('./SelectModalView').then(mod => mod.SelectModalView),
  {
    ssr: false,
  },
) as typeof SelectModalView;

export default SelectModal;
