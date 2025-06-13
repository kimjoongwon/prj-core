import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps } from '@shared/types';
import { useGetResourceQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { usePageState } from '../PageBuilder';

export const ResourceBuilder = observer((props: ResourceBuilderProps) => {
  const { resourceName, sections } = props;
  const pageState = usePageState();

  const { data, isLoading, error, id } = useGetResourceQuery(props);

  console.log('ResourceBuilder data:', id);

  // data가 있을 때 pageState의 form.inputs에 할당
  useEffect(() => {
    if (data && pageState) {
      if (!pageState.form) {
        pageState.form = {};
      }
      pageState.form.inputs = data;
    }
  }, [data, pageState]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>오류가 발생했습니다.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data && id) {
    return (
      <div className="text-center text-gray-500">
        <p>{resourceName}을(를) 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="resource-builder">
      {sections?.map(section => {
        return <SectionBuilder key={v4()} sectionBuilder={section} />;
      })}
    </div>
  );
});
