import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {isExternalLink, reset} from '@utils';
import {Linking} from 'react-native';

export const useForegroundPushListener = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!remoteMessage) {
        return null;
      }
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      const link = remoteMessage.data?.link || '';

      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || '',
        body: remoteMessage.notification?.body || '',
        data: {
          link,
        },
        android: {
          channelId,
          smallIcon: 'ic_launcher',
        },
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          const data = detail.notification?.data;
          const link = data?.link as string;

          if (isExternalLink(link)) {
            Linking.openURL(link);
          } else {
            reset('Gateway', {link});
          }
          break;
      }
    });
  }, []);
};
