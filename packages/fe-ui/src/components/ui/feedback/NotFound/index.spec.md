# NotFound UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/NotFound/

## 역할

404 페이지를 찾을 수 없을 때 표시하는 전체 페이지 컴포넌트. 대형 404 텍스트, 제목, 설명, 네비게이션 버튼을 포함한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[전체 화면 구조]
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                     4 0 4                        │  ← 대형 텍스트 (text-9xl, bold)
│                                                  │
│           페이지를 찾을 수 없습니다               │  ← title
│                                                  │
│   요청하신 페이지가 존재하지 않거나               │
│   이동되었을 수 있습니다.                         │  ← description
│                                                  │
│       [ 홈으로 돌아가기 ]  [ 이전 페이지 ]        │  ← 버튼 2개 (horizontal)
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
  전체 화면 중앙 정렬 (min-h-screen, 수직/수평 center)

[커스텀 아이콘 있음]
┌──────────────────────────────────────────────────┐
│                                                  │
│                  [커스텀 아이콘]                  │  ← icon prop
│                                                  │
│              페이지를 찾을 수 없습니다             │
│                   ...                            │
└──────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 대형 "404" 텍스트 + 제목 + 설명 + 버튼 2개 |
| 커스텀 아이콘 | icon prop으로 "404" 대신 커스텀 아이콘 표시 |
| 추가 액션 | actions prop으로 버튼 2개 외에 추가 액션 영역 |

## Props

```typescript
interface NotFoundProps {
  /** 페이지 제목 @default "페이지를 찾을 수 없습니다" */
  title?: string;
  /** 페이지 설명 @default "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다." */
  description?: string;
  /** 홈으로 돌아가기 버튼 텍스트 @default "홈으로 돌아가기" */
  homeButtonText?: string;
  /** 이전 페이지로 돌아가기 버튼 텍스트 @default "이전 페이지" */
  backButtonText?: string;
  /** 홈으로 돌아가기 클릭 핸들러 */
  onHomeClick?: () => void;
  /** 이전 페이지로 돌아가기 클릭 핸들러 */
  onBackClick?: () => void;
  /** 추가 액션 버튼들 */
  actions?: React.ReactNode;
  /** 커스텀 아이콘 */
  icon?: React.ReactNode;
}
```

## 내부 의존성

- `Text` (data-display/Text)
- `Container` (surfaces/Container)
- `Spacer` (surfaces/Spacer)
- `VStack` (surfaces/VStack)

## HeroUI 매핑

기반: `import { Button, Card, CardBody } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
