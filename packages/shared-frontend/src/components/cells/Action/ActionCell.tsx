import React, { useEffect } from 'react';
import { CellContext } from '@tanstack/react-table';
import { IButtonBuilder } from '@shared/types';
import { ButtonBuilder } from '../../builders/ButtonBuilder';
import { usePageState } from '../../builders';
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
  let pageState: any;

  // PageProvider 에러 처리
  try {
    pageState = usePageState();
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
              console.log(
                '📊 Row data before selection:',
                pageState?.selectedRow,
              );

              // 행 데이터가 있는지 확인
              if (!row) {
                console.warn('⚠️ No row data available for selection');
                addToast({
                  title: '데이터 오류',
                  description: '선택된 행 데이터가 없습니다.',
                  color: 'warning',
                });
                return;
              }

              // navigator가 있는 경우에만 처리
              if (button.navigator?.route) {
                // ID가 없는 경우 처리
                if (!row.id) {
                  console.warn('⚠️ Row data has no ID');
                  addToast({
                    title: '데이터 오류',
                    description: '선택된 항목의 ID가 없습니다.',
                    color: 'warning',
                  });
                  return;
                }

                // paramsPath가 없는 경우 처리
                if (!button.navigator.route.paramsPath) {
                  console.warn('⚠️ Navigator route paramsPath is missing');
                  addToast({
                    title: '네비게이션 오류',
                    description: '경로 설정이 올바르지 않습니다.',
                    color: 'warning',
                  });
                  return;
                }

                // 페이지 상태 업데이트
                if (!pageState) {
                  console.warn('⚠️ PageState is null or undefined');
                  addToast({
                    title: '상태 업데이트 오류',
                    description: '페이지 상태를 업데이트할 수 없습니다.',
                    color: 'danger',
                  });
                  return;
                }

                try {
                  pageState.params = row;
                  set(pageState, button.navigator.route.paramsPath, {
                    id: row.id,
                  });

                  console.log('✅ Row selected:', row);
                  console.log(
                    '📊 Page state after selection:',
                    pageState.selectedRow,
                  );
                } catch (setError) {
                  console.error('❌ Error setting page state:', setError);
                  addToast({
                    title: '상태 업데이트 오류',
                    description: '페이지 상태를 업데이트할 수 없습니다.',
                    color: 'danger',
                  });
                  return;
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
