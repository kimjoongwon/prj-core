import {firebase} from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {storage} from 'src/App';

export const useGetFcmToken = () => {
  useEffect(() => {
    const getFcmToken = async () => {
      const apnsToken = await firebase.messaging().getAPNSToken();
      if (apnsToken === undefined) {
        // we do not appear to have an APNS token.
        // possible misconfiguration, possibly user did not grant permission, possible network timeout, possibly non-APNS Simulator
        // if you *really* know you are in a dev environment on Simulator, maybe setAPNSToken to some string to continue
        // if this is a real environment then maybe try a few times with sleeps to see if it comes in?
      }

      // How to register
      if (apnsToken !== undefined) {
        let token = '';
        try {
          token = await firebase.messaging().getToken();
        } catch (error) {
          console.error(error);
        }

        if (token) {
          await storage.set('fcmToken', token);
        }
      }
    };
    getFcmToken();
  }, []);
};
