'use client';

import { GetUserQuery } from '@__generated__/graphql';
import { useUserQuery } from '@hooks';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { createContext } from 'react';

interface PageProviderProps {
  children: React.ReactNode;
}

interface PageContext {
  query: GetUserQuery | undefined;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: PageProviderProps) => {
  const { children } = props;
  const { userId = '' } = useParams();
  const query = useUserQuery(userId as string);

  return (
    <PageContext.Provider
      value={{
        query: query.data,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
