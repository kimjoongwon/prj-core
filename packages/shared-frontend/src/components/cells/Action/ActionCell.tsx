import React, { useEffect } from 'react';
import { CellContext } from '@tanstack/react-table';
import { IButtonBuilder } from '@shared/types';
import { ButtonBuilder } from '../../builders/ButtonBuilder';
import { usePageState } from '../../builders';
import { action } from 'mobx';
import { set } from 'lodash-es';

interface ActionCellProps<T extends unknown> extends CellContext<T, unknown> {
  buttons?: IButtonBuilder[];
}

export const ActionCell = <T extends { id?: string }>({
  row: { original: row },
  buttons,
}: ActionCellProps<T>) => {
  const pageState = usePageState();
  const isDebugMode =
    process.env.NODE_ENV === 'development' ||
    process.env.REACT_APP_DEBUG === 'true';

  // 디버그: 컴포넌트 렌더링 정보
  useEffect(() => {
    if (!isDebugMode) return;

    console.group('🔧 ActionCell Debug');
    console.log('📊 Row data:', row);
    console.log('🔘 Buttons config:', buttons);
    console.log('📄 Page state:', pageState);
    console.log('🔢 Buttons count:', buttons?.length || 0);
    console.groupEnd();
  }, [row, buttons, pageState, isDebugMode]);

  // 디버그: 버튼이 없는 경우
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
        // 디버그: 각 버튼 정보
        return (
          <ButtonBuilder
            key={button.key || `action-button-${index}`}
            {...button}
            onPress={action(event => {
              console.group('🎯 ActionCell Button Press');
              console.log('📌 Button pressed:', button);
              console.log('�️ Press event:', event);
              console.log(
                '�📊 Row data before selection:',
                pageState.selectedRow,
              );

              if (row) {
                pageState.params = row;
                set(pageState, button.navigator.route.paramsPath, {
                  id: row?.id,
                });
                console.log('✅ Row selected:', row);
                console.log(
                  '📊 Page state after selection:',
                  pageState.selectedRow,
                );
              } else {
                console.warn('⚠️ No row data available for selection');
              }

              console.groupEnd();

              // 원래 onPress 핸들러 실행
              if (button.onPress) {
                console.log('🔄 Executing original onPress handler');
                button.onPress(event);
              }
            })}
          />
        );
      })}
    </div>
  );
};
