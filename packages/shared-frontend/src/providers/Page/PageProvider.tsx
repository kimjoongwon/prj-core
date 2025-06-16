'use client';

import React, { createContext, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { v4 } from 'uuid';
import { defaultTo } from 'lodash-es';

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  isFetchedAfterMount?: boolean;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

export const PageProvider = observer((props: PageProviderProps) => {
  const state = useLocalObservable(() => ({
    ...props.state,
    setState: (newState: any) => defaultTo(state, newState),
  }));

  return (
    <PageContext.Provider value={state}>
      <div className={`hi-${v4()}`} />
      {props.children}
    </PageContext.Provider>
  );
});

PageContext.displayName = 'PageContext';
PageProvider.displayName = 'PageProvider';

export const usePageState = (): PageBuilderInterface['state'] => {
  const state = React.useContext(PageContext);
  if (!state) {
    throw new Error('useState must be used within a PageProvider');
  }
  return state;
};
