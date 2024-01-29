import {useCallback} from 'react';
import {storage} from 'src/App';
import {mySUNIAlert} from '@utils';

export function useAlertPossibleFailureExceed() {
  const alertPossibleFailureExceed = (callback: () => void) => {
    storage.set('multi_factor', {
      enable: false,
      type: '',
      data: '',
      salt: null,
    });
    mySUNIAlert(
      '',
      '시도 횟수가 3회를 초과하여 간편 로그인 설정이 초기화됩니다.',
      [
        {
          text: '확인',
          onPress: () => {
            callback();
          },
        },
      ],
    );
  };

  return useCallback(alertPossibleFailureExceed, []);
}
