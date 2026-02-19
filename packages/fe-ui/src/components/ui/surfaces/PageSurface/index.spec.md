# PageSurface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/PageSurface/

## 역할

페이지 전체 콘텐츠를 감싸는 래퍼 컴포넌트. Surface의 elevation을 "raised"로 고정하며, 제목/설명/액션 영역을 가진 헤더를 제공한다.

**주의: Page 컴포넌트에서만 사용. Layout에서 사용 금지.**

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[title + description + actions 모두 있음]
┌──────────────────────────────────────────────────────────────┐
│  회원 목록                         [ + 회원 등록 ]  [ 내보내기 ]│  ← Header
│  시스템에 등록된 회원을 관리합니다.                             │    좌: title+desc | 우: actions
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [콘텐츠 영역 (children)]                                    │  ← Content
│  (SectionSurface, DataGrid 등)                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
  elevation="raised" → shadow-sm, bg-content1

[title만 있음 (actions 없음)]
┌──────────────────────────────────────────────────────────────┐
│  역할 관리                                                    │  ← Header (title만)
├──────────────────────────────────────────────────────────────┤
│  [콘텐츠 영역]                                               │
└──────────────────────────────────────────────────────────────┘

[title 없음 (헤더 미표시)]
┌──────────────────────────────────────────────────────────────┐
│  [콘텐츠 영역]                                               │  ← 헤더 없이 바로 콘텐츠
└──────────────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| title + description + actions | 제목/설명 (좌) + 액션버튼 (우) 헤더 표시 |
| title만 | 제목만 있는 헤더 표시 |
| title 없음 | 헤더 미표시, 콘텐츠만 |

## Props

```typescript
type PageSurfaceProps = Omit<SurfaceProps, "elevation"> & {
  /** 페이지 제목 */
  title?: string;
  /** 페이지 설명 */
  description?: string;
  /** 우측 상단 액션 영역 (버튼 등) */
  actions?: ReactNode;
};
```

## 구조

```
Surface (elevation="raised", padding="none")
├── Header (title || actions 존재 시)
│   ├── 좌측: title + description
│   └── 우측: actions
└── Content (padding 적용)
```

## 엘리베이션

고정값 "raised" (shadow-sm, bg-content1)

## 내부 의존성

- `Surface` (surfaces/Surface)

## HeroUI 매핑

순수 구현. observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
