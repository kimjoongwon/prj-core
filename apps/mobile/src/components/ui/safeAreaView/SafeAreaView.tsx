import {screens} from '@meta';
import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children?: React.ReactNode;
}

export const SafeAreaView = (props: SafeAreaViewProps) => {
  const {children} = props;
  const insets = useSafeAreaInsets();
  const child: any = React.Children.only(children);
  const {route} = child?.props;

  const backgroundColor = route?.name === 'Pattern' ? '#38B1AD' : 'white';
  const screenNames = screens
    // .filter(screen => screen.props.name)
    .map(screen => screen.props.name);

  return (
    <>
      <View
        style={[
          styles.topSafeAreaView,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            paddingTop: screenNames.includes(route.name) ? insets.top : 0,
          },
        ]}
      />
      <View
        style={[
          styles.bottomSafeAreaView,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor,
            paddingBottom: screenNames.includes(route.name) ? insets.bottom : 0,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            animated
            backgroundColor={'white'}
          />
          {children}
        </View>
      </View>
    </>
  );
};

export const styles = StyleSheet.create({
  topSafeAreaView: {
    flex: 0,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSafeAreaView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
});
