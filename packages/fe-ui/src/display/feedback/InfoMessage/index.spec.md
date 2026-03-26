# InfoMessage UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/feedback/InfoMessage/

## 역할

다양한 상태(info, warning, error, success)의 알림 메시지를 표시하는 컴포넌트. cva 기반으로 variant별 배경/아이콘/텍스트 색상이 자동 적용된다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[info - 기본]
┌─────────────────────────────────────────┐
│  ℹ  이 항목은 수정 후 즉시 반영됩니다.  │
└─────────────────────────────────────────┘
  bg-blue-50 / dark: bg-blue-950

[warning]
┌─────────────────────────────────────────┐
│  ⚠  저장하기 전에 변경사항을 확인하세요. │
└─────────────────────────────────────────┘
  bg-yellow-50 / dark: bg-yellow-950

[error]
┌─────────────────────────────────────────┐
│  ✕  필수 항목을 입력해 주세요.           │
└─────────────────────────────────────────┘
  bg-red-50 / dark: bg-red-950

[success]
┌─────────────────────────────────────────┐
│  ✓  변경사항이 성공적으로 저장되었습니다. │
└─────────────────────────────────────────┘
  bg-green-50 / dark: bg-green-950
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| info | 파란 배경, ℹ 아이콘, 파란 텍스트 |
| warning | 노란 배경, ⚠ 아이콘, 노란 텍스트 |
| error | 빨간 배경, ✕ 아이콘, 빨간 텍스트 |
| success | 초록 배경, ✓ 아이콘, 초록 텍스트 |

## Props

```typescript
interface InfoMessageProps {
  /** 메시지 본문 */
  message: string;
  /** 메시지 유형 @default "info" */
  variant?: "info" | "warning" | "error" | "success";
  /** 커스텀 아이콘 */
  icon?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 변형 (Variants)

| 변형 | 배경 | 아이콘 | 기본 이모지 |
|------|------|--------|-------------|
| info | bg-blue-50 / bg-blue-950 | text-blue-600 | 정보(i) |
| warning | bg-yellow-50 / bg-yellow-950 | text-yellow-600 | 경고 |
| error | bg-red-50 / bg-red-950 | text-red-600 | X |
| success | bg-green-50 / bg-green-950 | text-green-600 | 체크 |

## 내부 의존성

- `Text` (data-display/Text)
- `HStack` (layouts/HStack)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | 내부 의존성 경로 표기를 `layouts/HStack` 기준으로 정리 | codex |
