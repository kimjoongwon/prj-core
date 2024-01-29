import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import RNActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Text} from '../text/Text';

export interface ActionSheetOption {
  text: string;
  onPress: () => void;
  color?: string;
}

export const ActionSheet = (
  props: SheetProps<{options: ActionSheetOption[]}>,
) => {
  const {payload} = props;
  const options = payload?.options || [];
  const closeActionSheet = () => {
    SheetManager.hide('actionSheet');
  };

  return (
    <RNActionSheet containerStyle={styles.container}>
      {options?.map(option => {
        return (
          <TouchableOpacity
            style={styles.option}
            key={option.text}
            onPress={() => {
              closeActionSheet();
              option.onPress();
            }}>
            <Text
              style={[{color: option.color || '#007AFF'}, styles.optionText]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.option}
        onPress={() => SheetManager.hide('actionSheet')}>
        <Text style={[{color: '#007AFF'}, styles.optionText]}>닫기</Text>
      </TouchableOpacity>
    </RNActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 60,
    borderBottomWidth: 0.3,
    borderBottomColor: '#d3d3d3',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
