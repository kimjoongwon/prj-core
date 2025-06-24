import React from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { v4 } from 'uuid';
import { SectionBuilder } from '../SectionBuilder';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;

  return (
    <>
      {pageBuilder?.sections && (
        <div className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.sections?.map(section => {
            return <SectionBuilder key={v4()} sectionBuilder={section} />;
          })}
        </div>
      )}
    </>
  );
});

PageBuilder.displayName = 'PageBuilder';
