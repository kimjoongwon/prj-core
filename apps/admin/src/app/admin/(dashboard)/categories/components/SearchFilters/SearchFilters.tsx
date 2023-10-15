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
