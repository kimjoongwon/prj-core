'use client';

import React, { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/specs';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { v4 } from 'uuid';
import { observable } from 'mobx';
import { FormButtonBuilder } from '../FormButtonBuilder/FormButtonBuilder';
import { SectionBuilder } from '../SectionBuilder';

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
  const state = observable(props.state || {});

  return (
    <PageContext.Provider value={state}>{props.children}</PageContext.Provider>
  );
});

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
      {pageBuilder?.form && (
        <div className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.form?.sections?.map(section => {
            return <SectionBuilder key={v4()} sectionBuilder={section} />;
          })}
        </div>
      )}
    </PageProvder>
  );
});
