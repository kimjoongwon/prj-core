import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View} from '../view/View';
import {back} from '@utils';
import {navigationRef} from 'src/RootNavigation';

interface BackButtonProps {
  onPress?: () => void;
}

export const BackButton = (props: BackButtonProps) => {
  const {onPress} = props;

  const onPressBackButton = () => {
    navigationRef.isReady() && back();
    onPress && onPress();
  };

  return (
    <TouchableOpacity
      style={styles.backButtonCotnainer}
      onPress={onPressBackButton}>
      <View style={styles.arrow_1} />
      <View style={styles.arrow_2} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrow_1: {
    borderTopWidth: 2,
    borderRightWidth: 13,
    borderColor: 'black',
    transform: [{rotate: '130deg'}, {translateY: 5.5}, {translateX: 0}],
  },
  arrow_2: {
    borderTopWidth: 2,
    borderRightWidth: 13,
    borderColor: 'black',
    transform: [{rotate: '230deg'}, {translateY: -5.5}, {translateX: 0}],
  },
  backButtonCotnainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    width: 50,
  },
});
