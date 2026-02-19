# SectionSurface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/SectionSurface/

## 역할

섹션 단위로 콘텐츠를 그룹화하는 컴포넌트. 제목, 부제목, 액션 영역을 가진 헤더와 접기/펼치기 기능을 제공한다.

## Props

```typescript
type SectionSurfaceProps = Omit<SurfaceProps, "as"> & {
  /** 섹션 제목 */
  title?: string;
  /** 섹션 부제목/설명 */
  subtitle?: string;
  /** 우측 액션 영역 */
  action?: ReactNode;
  /** 접기/펼치기 가능 여부 */
  collapsible?: boolean;
  /** 기본 펼침 상태 @default true */
  defaultExpanded?: boolean;
};
```

## 상태

| 상태 | 동작 |
|------|------|
| collapsible=true + isExpanded | 콘텐츠 표시 + ChevronDown 아이콘 |
| collapsible=true + !isExpanded | 콘텐츠 숨김 + ChevronDown 90도 회전 |
| title/action 없음 | 헤더 영역 미표시 |

## 엘리베이션

기본값 "elevated" (shadow-md, bg-content1 + border)

## 내부 의존성

- `Surface` (surfaces/Surface)
- `lucide-react` (ChevronDown)
- `useLocalObservable` (mobx-react-lite)

## HeroUI 매핑

기반: `import { Button } from '@heroui/react'`

observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
