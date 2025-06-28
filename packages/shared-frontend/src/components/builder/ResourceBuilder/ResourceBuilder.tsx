import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { v4 } from 'uuid';
import { ResourceBuilderProps } from '@shared/types';
import { useApiQuery } from '../../../hooks';
import { SectionBuilder } from '../SectionBuilder';
import { usePage } from '../../../provider';
import { capitalize } from 'lodash-es';

// 🎯 Debug logger utility for ResourceBuilder
const logPrefix = '[ResourceBuilder]';
const logger = {
  info: (message: string, data?: any) => {
    console.log(`🔍 ${logPrefix} ${message}`, data || '');
  },
  success: (message: string, data?: any) => {
    console.log(`✅ ${logPrefix} ${message}`, data || '');
  },
  warning: (message: string, data?: any) => {
    console.warn(`⚠️ ${logPrefix} ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`❌ ${logPrefix} ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`🐛 ${logPrefix} ${message}`, data || '');
  },
};

export const ResourceBuilder = observer((props: ResourceBuilderProps) => {
  const { resourceName: rn, sections } = props;
  const resourceName = capitalize(rn);
  const page = usePage();
  const state = page.state;

  logger.info('🚀 Initializing ResourceBuilder', {
    resourceName,
    sectionsCount: sections?.length || 0,
    props: { ...props, sections: sections ? `${sections.length} sections` : 'no sections' }
  });

  // props 자체가 ApiQueryBuilder를 확장하므로 그대로 사용
  const { data, isLoading, error, id, type } = useApiQuery(props);

  // 🔍 상태 변화 로깅
  useEffect(() => {
    logger.debug('📊 API Query State Changed', {
      isLoading,
      hasData: !!data,
      hasError: !!error,
      type,
      id
    });
  }, [data, isLoading, error, id, type]);

  // 📝 Form inputs 초기화 - modify/detail 타입일 때 데이터를 form.inputs에 할당
  useEffect(() => {
    if (data && state && type && ['modify', 'detail'].includes(type)) {
      try {
        if (!state.form) {
          state.form = {};
          logger.debug('📝 Created form object in state');
        }
        
        state.form.inputs = data;
        logger.success('📝 Form inputs initialized with data', {
          type,
          dataKeys: Object.keys(data || {})
        });
      } catch (err) {
        logger.error('📝 Failed to initialize form inputs', err);
      }
    }
  }, [data, state, type]);

  // 🏷️ 페이지 타입 설정
  useEffect(() => {
    if (type && state) {
      try {
        state.type = type;
        logger.info('🏷️ Page type set', { type });
      } catch (err) {
        logger.error('🏷️ Failed to set page type', err);
      }
    }
  }, [type, state]);

  // 👨‍👩‍👧‍👦 부모 ID 설정 - add 타입일 때 id를 parentId로 설정
  useEffect(() => {
    if (type === 'add' && id && state) {
      try {
        if (!state.form) {
          state.form = {};
          logger.debug('📝 Created form object for parentId');
        }
        if (!state.form.inputs) {
          state.form.inputs = {};
          logger.debug('📝 Created form inputs object for parentId');
        }
        
        state.form.inputs.parentId = id;
        logger.success('👨‍👩‍👧‍👦 Parent ID set for add operation', { parentId: id });
      } catch (err) {
        logger.error('👨‍👩‍👧‍👦 Failed to set parent ID', err);
      }
    }
  }, [type, id, state]);

  // 🔄 로딩 상태 처리
  if (isLoading) {
    logger.info('🔄 Rendering loading spinner');
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" label={`${resourceName} 로딩 중...`} />
      </div>
    );
  }

  // ❌ 에러 상태 처리
  if (error) {
    logger.error('❌ Rendering error state', error);
    return (
      <Alert
        color="danger"
        title="🚨 오류 발생"
        description={`${resourceName} 처리 중 오류가 발생했습니다: ${error.message}`}
        variant="faded"
        className="m-4"
      />
    );
  }

  // 📭 데이터 없음 상태 처리
  const shouldHaveData = !isLoading && type && ['modify', 'detail'].includes(type) && id && id !== 'new';
  if (!data && shouldHaveData) {
    logger.warning('📭 No data found for resource', { 
      resourceName, 
      type, 
      id,
      shouldHaveData 
    });
    
    return (
      <Alert
        color="warning"
        title="📭 데이터 없음"
        description={`요청하신 ${resourceName}을(를) 찾을 수 없습니다. ID: ${id}`}
        variant="faded"
        className="m-4"
      />
    );
  }

  // ✅ 정상 렌더링
  logger.success('✅ Rendering ResourceBuilder with sections', {
    sectionsCount: sections?.length || 0,
    resourceName,
    hasData: !!data
  });

  return (
    <div className="resource-builder-container relative">
      <div className="resource-builder space-y-4">
        {sections?.map((section, index) => {
          logger.debug(`🏗️ Rendering section ${index + 1}/${sections.length}`, {
            sectionName: section.name || `Section ${index + 1}`,
            stacksCount: section.stacks?.length || 0
          });
          
          return (
            <SectionBuilder 
              key={v4()} 
              sectionBuilder={section} 
            />
          );
        })}
        
        {(!sections || sections.length === 0) && (
          <Alert
            color="default"
            title="📄 섹션 없음"
            description={`${resourceName}에 표시할 섹션이 없습니다.`}
            variant="flat"
            className="m-4"
          />
        )}
      </div>
    </div>
  );
});
