# MobX 컴포넌트 분리 패턴 가이드

## 📖 개요

shared-frontend 패키지의 모든 컴포넌트는 **순수 React 컴포넌트**와 **MobX 래퍼 컴포넌트**로 분리되어 있습니다. 이 패턴을 통해 재사용성을 높이고, 테스트 가능성을 개선하며, 관심사의 분리를 달성합니다.

## 🏗️ 아키텍처 패턴

```
컴포넌트폴더/
├── Component.tsx         # 순수 React 컴포넌트
├── Component.stories.tsx # Storybook (순수 React 컴포넌트 참조)
└── index.tsx             # MobX 래퍼 컴포넌트
```

### 역할 분담

- **Component.tsx**: 순수 React 컴포넌트, UI 로직만 담당
- **index.tsx**: MobX 통합, 상태 관리 담당
- **Component.stories.tsx**: Storybook 문서화, 순수 React 컴포넌트 사용

## 📝 구현 패턴

### 1. 순수 React 컴포넌트 (Component.tsx)

```typescript
import { SomeUILibrary } from "@heroui/react";

export interface ComponentProps<T extends object> 
  extends Omit<SomeUILibraryProps, "value" | "onChange"> {
  value?: SomeType;
  onChange?: (value: SomeType) => void;
}

export const Component = <T extends object>(props: ComponentProps<T>) => {
  const { value, onChange, ...rest } = props;

  const handleChange = (newValue: SomeType) => {
    onChange?.(newValue);
  };

  return (
    <SomeUILibrary
      {...rest}
      value={value}
      onChange={handleChange}
    />
  );
};
```

**특징:**
- ✅ **순수 함수**: 외부 의존성 없음
- ✅ **표준 Props**: `value/onChange` 패턴
- ✅ **재사용 가능**: 어떤 상태 관리 라이브러리와도 호환
- ✅ **테스트 용이**: 단순한 props → output 테스트

### 2. MobX 래퍼 컴포넌트 (index.tsx)

```typescript
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
  Component as ComponentComponent,
  ComponentProps as BaseComponentProps,
} from "./Component";

export interface ComponentProps<T>
  extends MobxProps<T>,
    Omit<BaseComponentProps<T>, "value" | "onChange"> {}

export const Component = observer(
  <T extends object>(props: ComponentProps<T>) => {
    const { state, path, ...rest } = props;

    const initialValue = get(state, path) || defaultValue;
    const { localState } = useFormField({ initialValue, state, path });

    const handleChange = action((value: SomeType) => {
      localState.value = value;
    });

    return (
      <ComponentComponent
        {...rest}
        value={localState.value}
        onChange={handleChange}
      />
    );
  },
);
```

**특징:**
- ✅ **MobX 통합**: `observer`, `action`, `useFormField` 사용
- ✅ **상태 관리**: `state/path` → `value/onChange` 변환
- ✅ **타입 안전**: `MobxProps<T>` 확장
- ✅ **반응형**: MobX 상태 변경에 자동 리렌더링

### 3. Storybook 문서화 (Component.stories.tsx)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Component } from "./Component"; // 순수 React 컴포넌트 참조

const meta: Meta<typeof Component> = {
  title: "Category/Component",
  component: Component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default Component",
  },
  render: (args) => {
    const [value, setValue] = useState(defaultValue);
    return <Component {...args} value={value} onChange={setValue} />;
  },
};
```

**특징:**
- ✅ **MobX 독립**: 순수 React 컴포넌트만 사용
- ✅ **React State**: `useState` 훅으로 상태 관리
- ✅ **상호작용**: 실제 동작하는 컴포넌트 시연

## 🎯 핵심 원칙

### 1. 관심사의 분리
- **UI 로직**: 순수 React 컴포넌트
- **상태 관리**: MobX 래퍼 컴포넌트
- **문서화**: Storybook

### 2. 의존성 방향
```
index.tsx (MobX) → Component.tsx (Pure React)
Component.stories.tsx → Component.tsx (Pure React)
```

### 3. Import 규칙
```typescript
// ✅ 올바른 Import
import { Component } from "./Component";           // 순수 React (Storybook용)
import { Component } from "./index";               // MobX 래퍼 (앱에서 사용)
import { Component } from "../inputs/Component";   // 자동으로 index.tsx 참조

// ❌ 잘못된 Import  
import { Component } from "./index";               // Storybook에서 MobX 래퍼 사용 금지
```

## 📋 체크리스트

### 새 컴포넌트 작성 시
- [ ] `Component.tsx`: 순수 React 컴포넌트 (`value/onChange` 패턴)
- [ ] `index.tsx`: MobX 래퍼 (`MobxProps<T>` 확장, `useFormField` 사용)
- [ ] `Component.stories.tsx`: 순수 React 컴포넌트 참조, `useState` 사용

### 기존 컴포넌트 리팩터링 시
- [ ] MobX 의존성을 `index.tsx`로 분리
- [ ] 순수 React 컴포넌트를 `Component.tsx`로 분리
- [ ] Storybook이 순수 React 컴포넌트를 참조하는지 확인
- [ ] `useLocalObservable` → `useState` 변경

## 🛠️ 도구 및 유틸리티

### useFormField Hook
```typescript
const { localState } = useFormField({
  initialValue: defaultValue,
  state,
  path,
});
```

### MobxProps 타입
```typescript
export interface MobxProps<T> {
  state?: T;
  path?: keyof T | string;
}
```

### 표준 Import 패턴
```typescript
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
```

## 🔍 예제: DateRangePicker

### 순수 React 컴포넌트
```typescript
// DateRangePicker.tsx
export interface DateRangePickerProps<T extends object>
  extends Omit<HeroUiDateRangePickerProps, "value" | "onChange"> {
  value?: any;
  onChange?: (value: any) => void;
}

export const DateRangePicker = <T extends object>(props: DateRangePickerProps<T>) => {
  const { value, onChange, ...rest } = props;
  
  const handleDateChange = (value: any) => {
    onChange?.(value);
  };

  return (
    <HeroUiDateRangePicker
      {...rest}
      value={value}
      onChange={handleDateChange}
    />
  );
};
```

### MobX 래퍼 컴포넌트
```typescript
// index.tsx
export interface DateRangePickerProps<T>
  extends MobxProps<T>,
    Omit<BaseDateRangePickerProps<T>, "value" | "onChange"> {}

export const DateRangePicker = observer(<T extends object>(props: DateRangePickerProps<T>) => {
  const { state, path, ...rest } = props;
  
  // 특수 로직: startPath, endPath 분리
  const [startPath, endPath] = useMemo(() => (path as string)?.split(","), [path]);
  
  const initialValue = {
    start: parseAbsoluteToLocal(get(state, startPath) || new Date().toISOString()),
    end: parseAbsoluteToLocal(get(state, endPath) || new Date().toISOString()),
  };

  const { localState } = useFormField({ initialValue, state, path });

  const handleDateChange = action((value: any) => {
    if (value && startPath && endPath) {
      set(state, startPath, value.start.toString());
      set(state, endPath, value.end.toString());
    }
    localState.value = value;
  });

  return (
    <DateRangePickerComponent
      {...rest}
      value={localState.value}
      onChange={handleDateChange}
    />
  );
});
```

## 🎉 이점

1. **재사용성**: 순수 React 컴포넌트는 어떤 상태 관리 라이브러리와도 사용 가능
2. **테스트 용이성**: 순수 함수는 테스트하기 쉬움
3. **문서화**: Storybook이 MobX 없이 동작
4. **유지보수성**: 관심사가 명확히 분리됨
5. **성능**: MobX 최적화는 필요한 곳에만 적용

이 패턴을 따르면 유연하고 maintainable한 컴포넌트 라이브러리를 구축할 수 있습니다! 🚀