'use client';

import { createContext } from 'react';
import { CoCModalProps } from '../components/ui';

export const ModalContext = createContext<CoCModalProps>({} as CoCModalProps);
