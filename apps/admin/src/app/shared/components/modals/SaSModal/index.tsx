'use client';

import { observer } from 'mobx-react-lite';
import { SaSModal } from './SaSModal';
import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(observer(SaSModal)), {
  ssr: false,
});
