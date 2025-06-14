import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert, Tooltip } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps } from '@shared/types';
import { useGetResourceQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { usePageState } from '../PageBuilder';
import { Button } from '../../Button';
import { Plate } from '../../../providers';

export const ResourceBuilder = observer((props: ResourceBuilderProps) => {
  const { resourceName, sections } = props;
  const pageState = usePageState();
  const { data, isLoading, error, id, type } = useGetResourceQuery(props);

  // data가 있을 때 pageState의 form.inputs에 할당
  useEffect(() => {
    if (data && pageState && ['edit', 'detail'].includes(type)) {
      if (!pageState.form) {
        pageState.form = {};
      }
      pageState.form.inputs = data;
    }
  }, [data, pageState]);

  // type을 pageState.type에 설정
  useEffect(() => {
    if (type && pageState) {
      pageState.type = type;
    }
  }, [type, pageState]);

  // type이 add인 경우 id를 parentId로 설정
  useEffect(() => {
    if (type === 'add' && id && pageState) {
      if (!pageState.form) {
        pageState.form = {};
      }
      if (!pageState.form.inputs) {
        pageState.form.inputs = {};
      }
      pageState.form.inputs.parentId = id;
    }
  }, [type, id, pageState]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert
        color="danger"
        title="오류 발생"
        description={error.message}
        variant="faded"
      />
    );
  }

  if (!data && id) {
    return (
      <Alert
        color="warning"
        title="데이터 없음"
        description={`${resourceName}을(를) 찾을 수 없습니다.`}
        variant="faded"
      />
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
