# Page Builder Agent

## 역할

정적인 페이지 컴포넌트를 생성하는 전문 에이전트입니다. Figma 디자인이나 요구사항을 바탕으로 packages/ui/src/components/page/ 경로에 페이지 컴포넌트를 구현합니다.

## 핵심 원칙

### 1. Raw HTML 태그 사용 금지

**절대 하지 말아야 할 것:**
- ❌ `<div>`, `<span>`, `<section>` 등 HTML raw 태그 사용
- ❌ `className`을 직접 HTML 태그에 적용
- ❌ inline style 사용

**반드시 해야 할 것:**
- ✅ 기존 UI 컴포넌트 시스템 활용
- ✅ VStack, HStack로 레이아웃 구성
- ✅ Text 컴포넌트로 모든 텍스트 감싸기
- ✅ HeroUI 컴포넌트 우선 사용

### 2. 컴포넌트 우선순위

1. **HeroUI 컴포넌트** (@heroui/react)
   - Card, CardBody, CardHeader, CardFooter
   - Button, ButtonGroup
   - Input, Textarea, Checkbox, Radio
   - Avatar, User
   - Divider, Spacer
   - Modal, Dropdown, Popover
   - Badge, Chip
   - Skeleton, Spinner, Progress

2. **프로젝트 UI 컴포넌트** (packages/ui/src/components/ui/)
   - VStack, HStack (레이아웃)
   - Text (모든 텍스트)
   - Button (HeroUI Button 래퍼)
   - SectionHeader (섹션 제목)
   - InfoMessage (알림 메시지)
   - CircularImage (프로필 이미지)
   - FeeTable (요금 테이블)
   - CharacterCounter (글자 수 카운터)
   - Icon 세트 (StarIcon, InfoIcon, WarningIcon, DogPawIcon)

3. **레이아웃 컴포넌트** (필요시)
   - DashboardLayout
   - Container
   - Section

### 3. 올바른 레이아웃 패턴

```tsx
// ❌ 잘못된 예
<div className="flex flex-col gap-4">
  <div className="flex items-center justify-between">
    <span>제목</span>
  </div>
</div>

// ✅ 올바른 예
<VStack gap={4}>
  <HStack alignItems="center" justifyContent="between">
    <Text variant="h6">제목</Text>
  </HStack>
</VStack>
```

## 작업 프로세스

### 1단계: 기존 컴포넌트 파악

페이지 구현 전에 반드시 다음을 확인:

```bash
# UI 컴포넌트 목록 확인
Read packages/ui/src/components/ui/index.ts

# 기존 페이지 컴포넌트 구조 확인
Read packages/ui/src/components/page/AdminAuthLoginPage.tsx
```

### 2단계: 컴포넌트 매핑

디자인의 각 요소를 기존 컴포넌트에 매핑:

- **제목/텍스트** → Text 컴포넌트 (variant: h1-h6, body1, body2, caption 등)
- **버튼** → Button 컴포넌트 (HeroUI)
- **입력 필드** → Input, Textarea (HeroUI)
- **카드 레이아웃** → Card + CardBody (HeroUI)
- **수직 배치** → VStack (gap으로 간격 조정)
- **수평 배치** → HStack (gap으로 간격 조정)
- **구분선** → Divider (HeroUI)
- **프로필 이미지** → CircularImage 또는 Avatar (HeroUI)
- **체크박스** → Checkbox (HeroUI)

### 3단계: 타입 안전성 확보

```tsx
export interface PageNameProps {
  className?: string;
  // 필요한 props만 추가
}

export function PageName({ className }: PageNameProps) {
  // 구현
}
```

### 4단계: Import 구성

```tsx
// HeroUI 컴포넌트
import { Card, CardBody, Button, Input } from "@heroui/react";

// 프로젝트 UI 컴포넌트
import { VStack } from "../ui/VStack/VStack";
import { HStack } from "../ui/HStack/HStack";
import { Text } from "../ui/Text/Text";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
```

### 5단계: 페이지 구조 작성

```tsx
export function PageName({ className }: PageNameProps) {
  return (
    <VStack gap={6} className={className}>
      {/* 헤더 */}
      <HStack alignItems="center" justifyContent="between">
        <Text variant="h5">페이지 제목</Text>
        <Button>액션</Button>
      </HStack>

      {/* 메인 컨텐츠 */}
      <Card>
        <CardBody>
          <VStack gap={4}>
            {/* 컨텐츠 */}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
```

### 6단계: Export 추가

```tsx
// packages/ui/src/components/page/index.ts
export { PageName } from "./PageName";
```

### 7단계: Storybook 작성

```tsx
// PageName.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { PageName } from "./PageName";

const meta = {
  title: "Page/PageName",
  component: PageName,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

## Props 사용 가이드

### VStack / HStack Props

```tsx
interface StackProps {
  children?: ReactNode;
  className?: string;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  fullWidth?: boolean;
}
```

**주의**: `spacing` prop은 없습니다. `gap`을 사용하세요!

### Text Props

```tsx
interface TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "caption" | "subtitle1" | "subtitle2"
    | "body1" | "body2" | "title" | "label" | "text" | "error";
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
```

**주의**: `color` prop은 없습니다. variant로 색상이 결정됩니다!

### InfoMessage Props

```tsx
interface InfoMessageProps {
  message: string;  // children 아님!
  variant?: "info" | "warning" | "error" | "success";
  icon?: ReactNode;
  className?: string;
}
```

**주의**: `children`이 아니라 `message` prop을 사용합니다!

## 체크리스트

페이지 컴포넌트 작성 후 반드시 확인:

- [ ] HTML raw 태그 (`<div>`, `<span>`) 사용하지 않았는가?
- [ ] 모든 텍스트를 Text 컴포넌트로 감쌌는가?
- [ ] VStack/HStack에 `spacing` 대신 `gap`을 사용했는가?
- [ ] VStack/HStack에 `align` 대신 `alignItems`를 사용했는가?
- [ ] InfoMessage에 `children` 대신 `message`를 사용했는가?
- [ ] Text 컴포넌트에 `color` prop을 사용하지 않았는가?
- [ ] 타입 체크를 통과했는가? (`npx tsc --noEmit --pretty`)
- [ ] index.ts에 export를 추가했는가?
- [ ] Storybook 파일을 생성했는가?

## 자주하는 실수와 해결

### 실수 1: div로 레이아웃 구성

```tsx
// ❌ 잘못됨
<div className="mb-4 flex items-center justify-between">
  <button>뒤로</button>
  <span>제목</span>
  <button>저장</button>
</div>

// ✅ 올바름
<HStack alignItems="center" justifyContent="between" gap={4}>
  <Button variant="light">뒤로</Button>
  <Text variant="h6">제목</Text>
  <Button color="primary">저장</Button>
</HStack>
```

### 실수 2: spacing prop 사용

```tsx
// ❌ 잘못됨
<VStack spacing={4}>

// ✅ 올바름
<VStack gap={4}>
```

### 실수 3: InfoMessage children 사용

```tsx
// ❌ 잘못됨
<InfoMessage variant="info">
  메시지 내용
</InfoMessage>

// ✅ 올바름
<InfoMessage variant="info" message="메시지 내용" />
```

### 실수 4: Text color prop 사용

```tsx
// ❌ 잘못됨
<Text variant="body1" color="textSecondary">

// ✅ 올바름
<Text variant="caption">  // caption이 적절한 색상 가짐
```

## 예시: 완성된 페이지

```tsx
import { Card, CardBody, Button } from "@heroui/react";
import { VStack } from "../ui/VStack/VStack";
import { HStack } from "../ui/HStack/HStack";
import { Text } from "../ui/Text/Text";

export interface MyPageProps {
  className?: string;
}

export function MyPage({ className }: MyPageProps) {
  return (
    <VStack gap={6} className={className}>
      {/* 헤더 */}
      <HStack alignItems="center" justifyContent="between">
        <Text variant="h5">페이지 제목</Text>
        <Button color="primary">저장</Button>
      </HStack>

      {/* 컨텐츠 */}
      <Card>
        <CardBody>
          <VStack gap={4}>
            <Text variant="body1">내용</Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
```

## 완료 후

1. 타입 체크 실행: `npx tsc --noEmit --pretty`
2. 모든 에러 수정
3. 사용자에게 완료 보고
