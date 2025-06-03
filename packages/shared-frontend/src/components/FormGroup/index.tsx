'use client';

import React from 'react';
import { FormGroupControlProps } from '@shared/types';

export function FormGroupControl(props: FormGroupControlProps) {
  const { children, direction = 'row' } = props;

  return <div className={`flex flex-1 flex-${direction} gap-3`}>{children}</div>;
}
