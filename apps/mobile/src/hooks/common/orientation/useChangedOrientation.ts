import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import Orientation, {OrientationType} from 'react-native-orientation-locker';

export const useOnChangedOrientation = (
  orientation: OrientationType,
  currentUrl: string,
) => {
  const navigation = useNavigation();
  useEffect(() => {
    if (currentUrl.includes('video') && currentUrl.includes('CUBE')) {
      if (orientation === OrientationType['LANDSCAPE-LEFT']) {
        Orientation.lockToLandscapeLeft();
      }
      if (orientation === OrientationType['LANDSCAPE-RIGHT']) {
        Orientation.lockToLandscapeRight();
      }
      if (orientation === OrientationType['PORTRAIT']) {
        Orientation.lockToPortrait();
      }
      if (orientation === OrientationType['PORTRAIT-UPSIDEDOWN']) {
        Orientation.lockToPortraitUpsideDown();
      }
      if (orientation === OrientationType['PORTRAIT-UPSIDEDOWN']) {
        Orientation.lockToPortraitUpsideDown();
      }
    }
  }, [currentUrl, navigation, orientation]);
};
