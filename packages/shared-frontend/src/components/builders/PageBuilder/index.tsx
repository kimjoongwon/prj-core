'use client';

import React, { createContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { v4 } from 'uuid';
import { observable, isObservable } from 'mobx';
import { SectionBuilder } from '../SectionBuilder';
import { APIManager } from '@shared/api-client';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  isFetchedAfterMount?: boolean;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

const PageProvder = observer((props: PageProviderProps) => {
  const [state] = useState(() => {
    const initialState = props.state || {};
    return isObservable(initialState) ? initialState : observable(initialState);
  });

  return (
    <PageContext.Provider value={state}>
      <div className={`hi-${v4()}`} />
      {props.children}
    </PageContext.Provider>
  );
});

PageContext.displayName = 'PageContext';
PageProvder.displayName = 'PageProvider';

export const usePageState = (): PageBuilderInterface['state'] => {
  const state = React.useContext(PageContext);
  if (!state) {
    throw new Error('useState must be used within a PageProvider');
  }
  return state;
};

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;

  return (
    <PageProvder state={pageBuilder?.state}>
      {pageBuilder?.sections && (
        <div className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.sections?.map(section => {
            return <SectionBuilder key={v4()} sectionBuilder={section} />;
          })}
        </div>
      )}
    </PageProvder>
  );
});

PageBuilder.displayName = 'PageBuilder';
