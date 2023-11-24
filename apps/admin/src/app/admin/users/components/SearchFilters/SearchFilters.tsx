'use client';

import { observer } from 'mobx-react-lite';
import { usePage } from '../../hooks';
import { Search } from '@coc/ui';

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
