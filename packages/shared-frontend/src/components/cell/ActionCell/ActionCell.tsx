import React, { useEffect } from 'react';
import { CellContext } from '@tanstack/react-table';
import { IButtonBuilder } from '@shared/types';
import { ButtonBuilder } from '../../builder/ButtonBuilder';
import { usePage } from '../../builder';
import { action } from 'mobx';
import { set } from 'lodash-es';
import { addToast } from '@heroui/react';

interface ActionCellProps<T extends unknown> extends CellContext<T, unknown> {
  buttons?: IButtonBuilder[];
}

export const ActionCell = <T extends { id?: string }>({
  row: { original: row },
  buttons,
}: ActionCellProps<T>) => {
  let page: any;
  let state: any;

  // PageProvider 에러 처리
  try {
    page = usePage();
    state = page.state;
  } catch (error) {
    console.error('ActionCell: PageProvider error:', error);
    addToast({
      title: '시스템 오류',
      description: 'PageProvider가 초기화되지 않았습니다.',
      color: 'danger',
    });
    return null;
  }

  const isDebugMode =
    process.env.NODE_ENV === 'development' ||
    process.env.REACT_APP_DEBUG === 'true';

  // 버튼이 없는 경우 처리
  if (!buttons || buttons.length === 0) {
    if (isDebugMode) {
      console.warn(
        '⚠️ ActionCell: No buttons provided or buttons array is empty',
      );
    }
    return null;
  }

  return (
    <div className="flex space-x-1">
      {buttons.map((button, index) => {
        return (
          <ButtonBuilder
            key={button.key || `action-button-${index}`}
            {...button}
            onPress={action(event => {
              console.group('🎯 ActionCell Button Press');
              console.log('📌 Button pressed:', button);
              console.log('🖱️ Press event:', event);
              console.log('📊 Row data before selection:', state?.selectedRow);

              // 행 데이터가 있는지 확인
              if (!row) {
                console.warn('⚠️ No row data available for selection');
                addToast({
                  title: '데이터 오류',
                  description: '선택된 행 데이터가 없습니다.',
                  color: 'warning',
                });
                console.groupEnd();
                return;
              }

              // ActionButton을 누르면 항상 selectedRow 설정
              if (!state) {
                console.warn('⚠️ State is null or undefined');
                addToast({
                  title: '상태 업데이트 오류',
                  description: '페이지 상태를 업데이트할 수 없습니다.',
                  color: 'danger',
                });
                console.groupEnd();
                return;
              }

              try {
                state.selectedRow = row;
                console.log('✅ Row selected:', row);
                console.log(
                  '📊 Page state after selection:',
                  state.selectedRow,
                );
              } catch (setError) {
                console.error('❌ Error setting page state:', setError);
                addToast({
                  title: '상태 업데이트 오류',
                  description: '페이지 상태를 업데이트할 수 없습니다.',
                  color: 'danger',
                });
                console.groupEnd();
                return;
              }

              // navigator가 있는 경우 추가 검증
              if (button.navigator?.route) {
                // ID가 없는 경우 처리
                if (!row.id) {
                  console.warn('⚠️ Row data has no ID');
                  addToast({
                    title: '데이터 오류',
                    description: '선택된 항목의 ID가 없습니다.',
                    color: 'warning',
                  });
                  console.groupEnd();
                  return;
                }

                // pathParams가 있는 경우 검증
                if (button.navigator.route.pathParams && button.navigator.route.relativePath) {
                  // 라우트 패턴에서 파라미터 키 추출
                  const paramKeys = button.navigator.route.relativePath.match(/:(\w+)/g)?.map(param => param.slice(1)) || [];
                  
                  // pathParams에 모든 필요한 매핑이 있는지 확인
                  for (const paramKey of paramKeys) {
                    if (!button.navigator.route.pathParams[paramKey]) {
                      console.warn(`⚠️ Missing pathParams mapping for param: ${paramKey}`);
                      addToast({
                        title: '네비게이션 오류',
                        description: `경로 파라미터 매핑이 누락되었습니다: ${paramKey}`,
                        color: 'warning',
                      });
                      console.groupEnd();
                      return;
                    }
                  }
                }
              }

              console.groupEnd();

              // 원래 onPress 핸들러 실행
              if (button.onPress) {
                try {
                  console.log('🔄 Executing original onPress handler');
                  button.onPress(event);
                } catch (onPressError) {
                  console.error('❌ Error in onPress handler:', onPressError);
                  addToast({
                    title: '버튼 실행 오류',
                    description: '버튼 동작 중 오류가 발생했습니다.',
                    color: 'danger',
                  });
                }
              }
            })}
          />
        );
      })}
    </div>
  );
};
