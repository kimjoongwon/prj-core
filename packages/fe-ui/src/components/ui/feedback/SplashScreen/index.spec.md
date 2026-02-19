# SplashScreen UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/SplashScreen/

## 역할

앱 초기화 중 표시하는 스플래시 화면. 전체 화면을 덮으며 로고, 타이틀, 프로그레스 바, 장식 블러 오브를 포함한다.

## Props

```typescript
interface SplashScreenProps {
  /** 메인 타이틀 @default "앱을 준비하고 있습니다" */
  title?: string;
  /** 서브 타이틀 @default "잠시만 기다려주세요..." */
  subtitle?: string;
  /** 진행률 (0-100, 미제공시 무한 로딩) */
  progress?: number;
  /** 프로그레스 바 표시 여부 @default true */
  showProgress?: boolean;
}
```

## 상태

| 상태 | 동작 |
|------|------|
| progress 미제공 | isIndeterminate 무한 로딩 바 |
| progress 제공 | 퍼센티지 표시 Chip + 진행률 바 |
| showProgress=false | 프로그레스 바 숨김 |

## 내부 의존성

- `Logo` (data-display/Logo)
- `Text` (data-display/Text)
- `VStack` (surfaces/VStack)

## HeroUI 매핑

기반: `import { Card, CardBody, Chip, Progress } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
