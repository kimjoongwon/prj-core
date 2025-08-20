# GluestackUI Provider

NativeWind CSS 변수 기반의 통합 테마 시스템입니다.

## 마이그레이션 공지

기존 `theme-provider` 시스템이 제거되었습니다. 
이제 `@/components/ui/gluestack-ui-provider`를 사용하세요.

## 새로운 특징

- 🌙 다크모드 및 라이트모드 지원
- 🎨 NativeWind CSS 변수 기반 색상 시스템
- 📱 시스템 테마 자동 감지
- 🔄 런타임 테마 전환
- 💡 TypeScript 완전 지원
- 🌐 웹/네이티브 완전 호환

## 기본 사용법

### 1. 앱 루트에 Provider 설정

```tsx
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function App() {
  return (
    <GluestackUIProvider mode="system">
      {/* 앱의 나머지 컴포넌트들 */}
    </GluestackUIProvider>
  );
}
```

### 2. CSS 변수로 스타일링

```tsx
import { View, Text } from 'react-native';

export const MyComponent = () => {
  return (
    <View className="bg-[rgb(var(--color-background))] p-5">
      <Text className="text-[rgb(var(--color-foreground))] text-base">
        안녕하세요!
      </Text>
      
      <View className="bg-[rgb(var(--color-primary-500))] p-3 rounded-lg mt-4">
        <Text className="text-[rgb(var(--color-primary-50))] font-bold">
          버튼 텍스트
        </Text>
      </View>
    </View>
  );
};
```

## 사용 가능한 CSS 변수

### Primary 색상
- `--color-primary-50` ~ `--color-primary-950`
- `--color-primary-500` (기본값)

### Secondary 색상  
- `--color-secondary-50` ~ `--color-secondary-950`
- `--color-secondary-500` (기본값)

### Semantic 색상
- `--color-success-*` (초록색)
- `--color-warning-*` (노란색/오렌지)
- `--color-danger-*` (빨간색)
- `--color-info-*` (하늘색)

### Background & Typography
- `--color-background` (앱 전체 배경)
- `--color-foreground` (기본 텍스트)
- `--color-content1` ~ `--color-content4` (컨테이너 배경)
- `--color-border` (테두리)

## 색상 사용 예제

```tsx
// Tailwind 클래스로 사용
className="bg-[rgb(var(--color-primary-500))]"
className="text-[rgb(var(--color-foreground))]"
className="border-[rgb(var(--color-border))]"

// StyleSheet에서 사용
StyleSheet.create({
  container: {
    backgroundColor: 'rgb(var(--color-background))',
  },
  text: {
    color: 'rgb(var(--color-foreground))',
  },
  button: {
    backgroundColor: 'rgb(var(--color-primary-500))',
  },
});
```

## API 레퍼런스

### GluestackUIProviderProps

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `mode` | `'light' \| 'dark' \| 'system'` | `'system'` | 테마 모드 |
| `children` | `ReactNode` | - | 자식 컴포넌트들 |

## 기존 코드 마이그레이션

### Before (theme-provider)
```tsx
const { theme } = useTheme();
backgroundColor: theme.colors.primary.DEFAULT
```

### After (gluestack-ui-provider)
```tsx
// Tailwind 사용
className="bg-[rgb(var(--color-primary-500))]"

// 또는 StyleSheet 사용  
backgroundColor: 'rgb(var(--color-primary-500))'
```

## 컴포넌트에서 활용

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

export const ThemedButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      className="bg-[rgb(var(--color-primary-500))] px-4 py-2 rounded-lg"
      onPress={onPress}
    >
      <Text className="text-[rgb(var(--color-primary-50))] font-medium text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

이 새로운 시스템은 더 간단하고 일관된 테마 관리를 제공합니다!
