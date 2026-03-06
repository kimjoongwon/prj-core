# Copyright UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/primitive/data-display/Copyright/

## 역할

저작권 표시 텍스트를 렌더링하는 컴포넌트. 현재 연도와 회사명을 조합하여 표시한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 기본 ]

  © 2026 주식회사 플레이트. All rights reserved.
  (text-sm, text-default-500 등 중립 색상)

[ 푸터 영역에서 사용 예시 ]

┌──────────────────────────────────────────────────┐
│                                                  │
│  © 2026 주식회사 플레이트. All rights reserved.  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | © {연도} {companyName}. All rights reserved. |

## Props

```typescript
interface CopyrightProps {
  /** 회사명 */
  companyName: string;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 출력 형식

```
(c) {현재 연도} {companyName}. All rights reserved.
```

## 의존성

- `getYear()` from `@cocrepo/toolkit`

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
