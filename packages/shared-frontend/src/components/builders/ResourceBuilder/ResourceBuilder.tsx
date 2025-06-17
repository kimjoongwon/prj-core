import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps } from '@shared/types';
import { useGetResourceQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { usePageState } from '../../../providers';
import { capitalize } from 'lodash-es';
import { APIManager } from '@shared/api-client';

export const ResourceBuilder = observer((props: ResourceBuilderProps) => {
  const { resourceName: rn, sections } = props;
  const resourceName = capitalize(rn);
  const pageState = usePageState();
  const { data, isLoading, error, id, type } = useGetResourceQuery(props);
  // data가 있을 때 pageState의 form.inputs에 할당
  useEffect(() => {
    if (data && pageState && ['modify', 'detail'].includes(type)) {
      if (!pageState.form) {
        pageState.form = {};
      }
      console.log('ResourceBuilder data', data);
      pageState.form.inputs = data;
    }
  }, [data, pageState, type]);

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

  // add 타입이거나 id가 'new'인 경우는 데이터가 없어도 정상
  // modify/detail 타입에서만 데이터가 필요하고, 로딩이 완료된 후에만 체크
  if (
    !data &&
    !isLoading &&
    type &&
    ['modify', 'detail'].includes(type) &&
    id &&
    id !== 'new'
  ) {
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
    <div className="resource-builder-container relative">
      <div className="resource-builder">
        {sections?.map(section => {
          return <SectionBuilder key={v4()} sectionBuilder={section} />;
        })}
      </div>
    </div>
  );
});
