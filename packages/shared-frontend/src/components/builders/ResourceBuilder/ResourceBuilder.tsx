import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps, IButtonBuilder } from '@shared/types';
import { useGetResourceQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { ButtonBuilder } from '../ButtonBuilder';
import { usePageState } from '../PageBuilder/PageBuilder';
import { APIManager } from '@shared/api-client';
import { capitalize, upperCase } from 'lodash-es';
import pluralize from 'pluralize';

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

  // 버튼 생성 로직
  const button: IButtonBuilder | null = useMemo(() => {
    if (!type || !resourceName) return null;

    // detail 타입은 버튼을 보여주지 않음
    if (type === 'detail') {
      return null;
    }

    // 버튼 기본 속성
    const baseButton: IButtonBuilder = {
      buttonType: 'form',
      color: 'primary',
      fullWidth: true,
      navigator: {
        type: 'back',
      },
    };

    // queryKey 함수 안전하게 가져오기
    let queryKey: string;
    try {
      const pluralResourceName = pluralize(resourceName);
      const queryKeyFunctionName = `getGet${pluralResourceName}ByQueryQueryKey`;
      const queryKeyFunction = (APIManager as any)[queryKeyFunctionName];
      if (typeof queryKeyFunction === 'function') {
        queryKey = queryKeyFunction()[0]; // 배열의 첫 번째 요소가 실제 queryKey
      } else {
        queryKey = `get${pluralResourceName}ByQuery`;
      }
    } catch (error) {
      console.warn(
        `QueryKey function not found for ${resourceName}, using fallback`,
      );
      queryKey = `get${resourceName}sByQuery`;
    }

    switch (type) {
      case 'add':
        return {
          ...baseButton,
          children: '추가',
          mutation: {
            name: `create${resourceName}`,
            path: 'form.inputs',
            queryKey: queryKey,
          },
        };
      case 'create':
        return {
          ...baseButton,
          children: '생성',
          mutation: {
            name: `create${resourceName}`,
            path: 'form.inputs',
            queryKey: queryKey,
          },
        };
      case 'modify':
        return {
          ...baseButton,
          children: '수정',
          mutation: {
            name: `update${resourceName}ById`,
            path: 'form.inputs',
            queryKey: queryKey,
          },
        };
      default:
        return null;
    }
  }, [type, resourceName]);
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

  // 헤더 제목 생성
  const getHeaderTitle = () => {
    // resourceName의 첫 글자를 대문자로 변환
    const resourceLabel = upperCase(resourceName);
    switch (type) {
      case 'add':
      case 'create':
        return `${resourceLabel} 생성`;
      case 'modify':
        return `${resourceLabel} 수정`;
      case 'detail':
        return `${resourceLabel} 상세`;
      default:
        return resourceLabel;
    }
  };

  return (
    <div className="resource-builder-container relative">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-divider">
        <h1 className="text-2xl font-bold text-foreground">
          {getHeaderTitle()}
        </h1>
        {/* 버튼을 헤더 오른쪽에 배치 */}
        {button && (
          <div className="z-10">
            <ButtonBuilder {...button} />
          </div>
        )}
      </div>

      <div className="resource-builder">
        {sections?.map(section => {
          return <SectionBuilder key={v4()} sectionBuilder={section} />;
        })}
      </div>
    </div>
  );
});
