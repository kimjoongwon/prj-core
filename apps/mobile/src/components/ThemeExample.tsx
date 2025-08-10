import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../providers/theme-provider';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const ThemeExample = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.foreground,
      marginBottom: 20,
      textAlign: 'center',
    },
    colorCard: {
      width: '100%',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      alignItems: 'center',
    },
    colorLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    colorValue: {
      fontSize: 14,
      fontFamily: 'monospace',
    },
    toggleButton: {
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    toggleButtonText: {
      color: theme.colors.primary.foreground,
      fontSize: 16,
      fontWeight: '600',
    },
    themeIndicator: {
      fontSize: 18,
      color: theme.colors.foreground,
      marginBottom: 20,
      textAlign: 'center',
    },
  });

  const colorCards = [
    { name: 'Primary', color: theme.colors.primary.DEFAULT, foreground: theme.colors.primary.foreground },
    { name: 'Secondary', color: theme.colors.secondary.DEFAULT, foreground: theme.colors.secondary.foreground },
    { name: 'Success', color: theme.colors.success.DEFAULT, foreground: theme.colors.success.foreground },
    { name: 'Warning', color: theme.colors.warning.DEFAULT, foreground: theme.colors.warning.foreground },
    { name: 'Danger', color: theme.colors.danger.DEFAULT, foreground: theme.colors.danger.foreground },
    { name: 'Content1', color: theme.colors.content1.DEFAULT, foreground: theme.colors.content1.foreground },
    { name: 'Content2', color: theme.colors.content2.DEFAULT, foreground: theme.colors.content2.foreground },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.title}>테마 시스템 예제</Text>
        
        <Text style={styles.themeIndicator}>
          현재 테마: {isDark ? '다크 모드' : '라이트 모드'}
        </Text>

        {/* 컴포넌트 예제 섹션 */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[styles.title, { fontSize: 20, marginBottom: 15 }]}>컴포넌트 예제</Text>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={[styles.colorLabel, { color: theme.colors.foreground, marginBottom: 8 }]}>Button 예제</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Button variant="solid" color="primary" size="sm">Primary</Button>
              <Button variant="bordered" color="secondary" size="sm">Secondary</Button>
              <Button variant="light" color="success" size="sm">Success</Button>
              <Button variant="flat" color="warning" size="sm">Warning</Button>
              <Button variant="faded" color="danger" size="sm">Danger</Button>
            </View>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={[styles.colorLabel, { color: theme.colors.foreground, marginBottom: 8 }]}>Input 예제</Text>
            <Input 
              label="이름" 
              placeholder="이름을 입력하세요" 
              variant="flat" 
              color="primary" 
              style={{ marginBottom: 8 }}
            />
            <Input 
              label="이메일" 
              placeholder="이메일을 입력하세요" 
              variant="bordered" 
              color="secondary"
            />
          </View>
        </View>

        {/* 색상 팔레트 섹션 */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[styles.title, { fontSize: 20, marginBottom: 15 }]}>색상 팔레트</Text>

        {colorCards.map((card) => (
          <View 
            key={card.name}
            style={[
              styles.colorCard,
              { backgroundColor: card.color }
            ]}
          >
            <Text style={[styles.colorLabel, { color: card.foreground }]}>
              {card.name}
            </Text>
            <Text style={[styles.colorValue, { color: card.foreground }]}>
              {card.color}
            </Text>
          </View>
        ))}
        </View>

        <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
          <Text style={styles.toggleButtonText}>
            {isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
