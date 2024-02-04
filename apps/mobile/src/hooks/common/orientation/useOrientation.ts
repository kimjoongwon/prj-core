import {useEffect, useState} from 'react';
import Orientation, {OrientationType} from 'react-native-orientation-locker';

export function useOrientation() {
  const [orientation, setOrientation] = useState(
    Orientation.getInitialOrientation(),
  );

  useEffect(() => {
    const initialOrientation = Orientation.getInitialOrientation();
    setOrientation(initialOrientation);

    const orientationDidChange = (newOrientation: OrientationType) => {
      setOrientation(newOrientation);
    };

    Orientation.addDeviceOrientationListener(orientationDidChange);

    return () => {
      Orientation.removeOrientationListener(orientationDidChange);
    };
  }, []);

  return orientation;
}
