import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps } from '@shared/types';
import { useGetResourceQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { usePage } from '../../../provider';
import { capitalize } from 'lodash-es';
import { APIManager } from '@shared/api-client';

export const ResourceBuilder = observer((props: ResourceBuilderProps) => {
  const { resourceName: rn, sections } = props;
  const resourceName = capitalize(rn);
  const page = usePage();
  const state = page.state;
  const { data, isLoading, error, id, type } = useGetResourceQuery(props);
  // data가 있을 때 state의 form.inputs에 할당
  useEffect(() => {
    if (data && state && ['modify', 'detail'].includes(type)) {
      if (!state.form) {
        state.form = {};
      }
      state.form.inputs = data;
    }
  }, [data, state, type]);

  // type을 state.type에 설정
  useEffect(() => {
    if (type && state) {
      state.type = type;
    }
  }, [type, state]);
  // type이 add인 경우 id를 parentId로 설정
  useEffect(() => {
    if (type === 'add' && id && state) {
      if (!state.form) {
        state.form = {};
      }
      if (!state.form.inputs) {
        state.form.inputs = {};
      }
      state.form.inputs.parentId = id;
    }
  }, [type, id, state]);

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
