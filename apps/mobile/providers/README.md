# ThemeProvider

React Native용 다크모드와 라이트모드를 지원하는 테마 시스템입니다.

## 특징

- 🌙 다크모드 및 라이트모드 지원
- 🎨 완전한 색상 팔레트 (Primary, Secondary, Success, Warning, Danger 등)
- 📱 시스템 테마 자동 감지
- 🔄 런타임 테마 전환
- 💡 TypeScript 완전 지원
- ✅ 컴포넌트 테스트 포함

## 설치

이미 프로젝트에 포함되어 있습니다. 추가 설치가 필요한 경우:

```bash
# React Native 기본 의존성들
npm install react react-native

# 개발 의존성
npm install --save-dev @testing-library/react-native
```

## 기본 사용법

### 1. 앱 루트에 ThemeProvider 설정

```tsx
import { ThemeProvider } from './src/providers/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* 앱의 나머지 컴포넌트들 */}
    </ThemeProvider>
  );
}
```

### 2. 컴포넌트에서 테마 사용

```tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../providers/theme-provider';

export const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    text: {
      color: theme.colors.foreground,
      fontSize: 16,
    },
    button: {
      backgroundColor: theme.colors.primary.DEFAULT,
      padding: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: theme.colors.primary.foreground,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        현재 테마: {isDark ? '다크' : '라이트'}
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>테마 전환</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## API 레퍼런스

### ThemeProvider Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 자식 컴포넌트들 |
| `initialTheme` | `'light' \| 'dark'` | 시스템 설정 | 초기 테마 설정 |

### useTheme Hook

```tsx
const {
  theme,      // 현재 테마 객체
  isDark,     // 다크모드 여부 (boolean)
  toggleTheme, // 테마 토글 함수
  setTheme,   // 특정 테마 설정 함수
} = useTheme();
```

## 색상 팔레트

각 색상은 50부터 900까지의 스케일과 DEFAULT, foreground 값을 제공합니다.

### 사용 가능한 색상

- `default` - 기본 회색 팔레트
- `primary` - 메인 브랜드 색상 (#006fee)
- `secondary` - 보조 색상 (#7828c8)  
- `success` - 성공 색상 (#17c964)
- `warning` - 경고 색상 (#f5a524)
- `danger` - 위험 색상 (#f31260)

### 색상 사용 예제

```tsx
// 기본 사용
backgroundColor: theme.colors.primary.DEFAULT

// 다양한 강도
backgroundColor: theme.colors.primary[100]  // 매우 연한
backgroundColor: theme.colors.primary[500]  // 중간
backgroundColor: theme.colors.primary[900]  // 매우 진한

// 전경색 (텍스트 색상)
color: theme.colors.primary.foreground
```

### 컨텐츠 색상

배경색으로 사용하기 적합한 컨텐츠 색상들:

```tsx
// 카드나 컨테이너 배경
backgroundColor: theme.colors.content1.DEFAULT  // 가장 밝음
backgroundColor: theme.colors.content2.DEFAULT  
backgroundColor: theme.colors.content3.DEFAULT  
backgroundColor: theme.colors.content4.DEFAULT  // 가장 어두움
```

### 기타 색상

```tsx
// 앱 전체 배경
backgroundColor: theme.colors.background

// 기본 텍스트 색상  
color: theme.colors.foreground

// 포커스 색상 (input focus 등)
borderColor: theme.colors.focus

// 오버레이 색상 (모달 배경 등)
backgroundColor: theme.colors.overlay
```

## 테스트

```bash
npm test -- --testPathPattern=theme-provider
```

테스트는 다음을 검증합니다:
- 기본 라이트모드 설정
- 다크모드 전환
- 테마 토글 기능
- 컨텍스트 에러 처리
- 모든 색상 토큰 로드

## 예제

프로젝트에는 `ThemeExample` 컴포넌트가 포함되어 있어 모든 색상과 기능을 확인할 수 있습니다:

```tsx
import { ThemeExample } from './src/components/ThemeExample';

// 앱의 Theme 탭에서 확인 가능
```

## 타입 정의

```tsx
interface Theme {
  colors: ThemeColors;
  layout: {
    disabledOpacity: string;
  };
}

interface ColorScale {
  50: string;
  100: string;
  // ... 200-800
  900: string;
  foreground: string;
  DEFAULT: string;
}
```

## 모범 사례

1. **일관성**: 정의된 색상 토큰만 사용하고 하드코딩된 색상 피하기
2. **접근성**: `foreground` 색상을 사용해 적절한 대비 확보
3. **반응성**: `isDark` 값으로 테마별 다른 로직 처리
4. **성능**: StyleSheet.create()와 함께 사용해 스타일 최적화

## 브라우저 지원

- iOS Safari
- Android Chrome  
- Expo Go
- 웹 브라우저 (React Native Web)

이 테마 시스템으로 일관되고 아름다운 다크/라이트 모드를 쉽게 구현할 수 있습니다!
