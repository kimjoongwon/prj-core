'use client';

import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite';
import { BaseButton } from './Button';
import { forwardRef } from 'react';
import Skeleton from '../Skeleton';

const DynamicButton = dynamic(
  () => import('./Button').then(mod => observer(forwardRef(mod.BaseButton))),
  {
    loading() {
      return <Skeleton className="h-[32px] w-full" />;
    },
    ssr: false,
  },
);

const Button = DynamicButton as typeof BaseButton;

export default Button;
