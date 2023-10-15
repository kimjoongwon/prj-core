---
to: src/app/admin/(dashboard)/<%= h.inflection.pluralize(name) %>/components/SearchFilters/SearchFilters.tsx
unless_exists: true
---
'use client';

import { Search } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { usePage } from '../PageProvider/hooks';

export const SearchFilters = observer(() => {
  const page = usePage();
  return (
    <Search
      state={page.state.search}
      queryState={page.state.query}
      path="email"
    />
  );
});
