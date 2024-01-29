import dayjs from 'dayjs';
import {useEffect} from 'react';
import {BackHandler, ToastAndroid} from 'react-native';
import {mySUNI, webviewRef} from 'src/App';
import {navigationRef} from 'src/RootNavigation';
import {useWebView} from 'src/providers';

export const useOnPressBackButton = () => {
  const {webViewNavigation} = useWebView();

  useEffect(() => {
    console.log('webViewNavigation', webViewNavigation);
    let backPressedLastTime = 0;
    const handleBackButtonPress = () => {
      try {
        const rootState = navigationRef.current?.getRootState();
        const currentIndex = rootState?.index;
        const currentRoute = rootState?.routes[currentIndex || 0];
        if (
          ['AuthConfig', 'Pin', 'Pattern', 'DevDashboard'].includes(
            currentRoute?.name || '',
          )
        ) {
          return false;
        }

        if (
          webViewNavigation?.url.includes('/suni-mobile/my-home') ||
          webViewNavigation?.url.includes('/suni-mobile/auth/login')
        ) {
          const now = dayjs().valueOf();
          if (now - backPressedLastTime > 2500) {
            backPressedLastTime = now;
            ToastAndroid.show(
              '뒤로가기 버튼을 한번 더 누르시면 종료됩니다.',
              ToastAndroid.BOTTOM,
            );
            return true;
          } else {
            mySUNI.exitApp();
          }
        } else {
          webviewRef.current?.goBack();
          return true;
        }
      } catch (err) {
        console.log('[handleBackButtonPress] Error');
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, [webViewNavigation]);
};
