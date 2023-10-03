---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/usePage.ts
---

import { useContext } from 'react';
import { PageContext } from '..';

export const usePage = () => {
  return useContext(PageContext);
};
