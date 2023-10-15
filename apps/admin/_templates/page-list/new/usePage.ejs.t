---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/components/PageProvider/hooks/usePage.ts
---

import { useContext } from 'react';
import { PageContext } from '../PageProvider';

export const usePage = () => {
  return useContext(PageContext);
};

