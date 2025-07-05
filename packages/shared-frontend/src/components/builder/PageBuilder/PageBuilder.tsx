import React from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { v4 } from 'uuid';
import { SectionBuilder } from '../SectionBuilder';
import { ElementBuilder } from '../ElementBuilder';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;

  return (
    <>
      {/* 새로운 ElementBuilder 구조 지원 */}
      {pageBuilder?.elements && (
        <div className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.elements?.map(element => {
            return <ElementBuilder key={v4()} elementBuilder={element} />;
          })}
        </div>
      )}
      
      {/* 기존 SectionBuilder 구조 하위 호환성 지원 */}
      {pageBuilder?.sections && !pageBuilder?.elements && (
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
