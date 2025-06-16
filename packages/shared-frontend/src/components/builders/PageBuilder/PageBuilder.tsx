'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { v4 } from 'uuid';
import { SectionBuilder } from '../SectionBuilder';
import { PageProvider } from '../../../providers';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;

  return (
    <PageProvider state={pageBuilder?.state}>
      {pageBuilder?.sections && (
        <div className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.sections?.map(section => {
            return <SectionBuilder key={v4()} sectionBuilder={section} />;
          })}
        </div>
      )}
    </PageProvider>
  );
});

PageBuilder.displayName = 'PageBuilder';
