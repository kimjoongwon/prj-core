# SectionSurface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/SectionSurface/

## 역할

섹션 단위로 콘텐츠를 그룹화하는 컴포넌트. 제목, 부제목, 액션 영역을 가진 헤더와 접기/펼치기 기능을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 - 헤더 + 콘텐츠 펼침 상태]
┌──────────────────────────────────────────────────────────────┐  ← elevation="elevated"
│  기본 정보          부제목 텍스트        [ 수정 버튼 ]  [v]  │  ← Header (title+subtitle+action+chevron)
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [콘텐츠 영역 (children)]                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

[collapsible=true - 접힘 상태]
┌──────────────────────────────────────────────────────────────┐
│  기본 정보          부제목 텍스트        [ 수정 버튼 ]  [>]  │  ← ChevronDown 90도 회전
└──────────────────────────────────────────────────────────────┘
  콘텐츠 숨김 (display: none or height: 0)

[collapsible=true - 펼침 상태]
┌──────────────────────────────────────────────────────────────┐
│  기본 정보                                            [v]    │  ← ChevronDown 정방향
├──────────────────────────────────────────────────────────────┤
│  [콘텐츠 영역]                                               │
└──────────────────────────────────────────────────────────────┘

[헤더 없음 (title/action 모두 없음)]
┌──────────────────────────────────────────────────────────────┐
│  [콘텐츠 영역 - 헤더 없이 바로 시작]                         │
└──────────────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (collapsible=false) | 헤더 + 콘텐츠 항상 표시 |
| collapsible=true, 펼침 | 헤더(ChevronDown) + 콘텐츠 표시 |
| collapsible=true, 접힘 | 헤더(ChevronDown 회전)만 표시 |
| 헤더 없음 | 콘텐츠만 표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
