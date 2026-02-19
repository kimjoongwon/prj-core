# Copyright UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Copyright/

## 역할

저작권 표시 텍스트를 렌더링하는 컴포넌트. 현재 연도와 회사명을 조합하여 표시한다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
