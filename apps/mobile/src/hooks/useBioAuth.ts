import {useCallback} from 'react';
import {Alert} from 'react-native';
import TouchID from 'react-native-touch-id';

export const useBioAuth = () => {
  const authenticate = async (onSuccess: () => void, onError?: () => void) => {
    TouchID.authenticate('계속하기 위해 지문을 인식해주세요.', {
      title: '지문 인증',
      sensorDescription: '센서를 터치해주세요.',
      sensorErrorDescription: '지문인식에 실패하였습니다.',
      fallbackLabel: '지문인증에 실패하였습니다.',
      passcodeFallback: false,
      cancelText: '취소',
    })
      .then(() => {
        onSuccess();
      })
      .catch((e: any) => {
        if (e.code === 'NOT_ENROLLED') {
          Alert.alert('등록된 지문이 존재하지 않습니다.');
        }
        onError && onError();
      });
  };

  return {authenticate: useCallback(authenticate, [])};
};
