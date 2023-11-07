---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/hooks/usePage.ts
---

import { useContext } from 'react';
import { <%= Name %>sPageContext } from '../provider';

export const use<%= Name %>sPage = () => {
  return useContext(<%= Name %>sPageContext);
};
