import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemeMode } from '../../src/components/providers/theme-provider';

interface ThemeToggleButtonProps {
  onToggle: () => void;
  currentTheme: ThemeMode;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ 
  onToggle, 
  currentTheme 
}) => {
  const insets = useSafeAreaInsets();
  const isDark = currentTheme === 'dark';

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDark ? '#ffffff' : '#000000',
            borderColor: isDark ? '#000000' : '#ffffff',
          }
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.icon,
            { color: isDark ? '#000000' : '#ffffff' }
          ]}
        >
          {isDark ? '☀️' : '🌙'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
  },
});