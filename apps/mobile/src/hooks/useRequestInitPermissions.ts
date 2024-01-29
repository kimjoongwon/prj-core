import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {platform} from 'src/App';
import notifee from '@notifee/react-native';

export const useRequestInitPermissions = () => {
  useEffect(() => {
    const requestInitPermission = async () => {
      await notifee.requestPermission();
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled && platform.OS() === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        return;
      }
    };

    requestInitPermission();
  }, []);
};
