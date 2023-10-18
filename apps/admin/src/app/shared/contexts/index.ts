'use client';

import { CoCModalProps } from '@types';
import { createContext } from 'react';

export const ModalContext = createContext<CoCModalProps>({} as CoCModalProps);
