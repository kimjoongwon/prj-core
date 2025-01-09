import { LayoutBuilder } from '@shared/types';

export const rootLayout: LayoutBuilder = {
  type: 'Root',
  page: {
    name: 'ROOT',
    type: 'Outlet',
  },
};
