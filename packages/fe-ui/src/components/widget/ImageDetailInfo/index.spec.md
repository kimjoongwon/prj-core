# ImageDetailInfo Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ImageDetailInfo/

## 역할

이미지 타입 에셋의 상세 정보(너비, 높이, 방향, 색상 공간, 알파 채널)를 표시하는 컴포넌트입니다. 접기/펼치기 기능을 제공합니다.

## 디자인 목업

```
[펼쳐진 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 이미지 정보                                          [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 너비            1920 px         │ 색상 공간      sRGB            │
│ 높이            1080 px         │ 알파 채널      예              │
│ 방향            1 (정방향)      │                                │
└──────────────────────────────────────────────────────────────────┘

[접힌 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 이미지 정보 · 1920 x 1080                             [펼치기 ▼] │
└──────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `expanded` | 펼쳐진 상태 | 모든 정보 표시 |
| `collapsed` | 접힌 상태 | 요약 정보만 표시 |
| `loading` | 로딩 중 | Skeleton |

## Props

```typescript
interface ImageDetailInfoProps {
  image: Image;                           // 이미지 상세 데이터
  collapsible?: boolean;                  // 접기/펼치기 가능 여부 (기본값: true)
  defaultExpanded?: boolean;              // 기본 펼침 상태 (기본값: true)
  className?: string;                     // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 패널 컨테이너 |
| Button | `ui/Button` | 접기/펼치기 버튼 |
| Badge | `ui/Badge` | 알파 채널 뱃지 |

## 상태 관리

**로컬 상태만 사용** (expanded/collapsed)

## 데이터 매핑

| 필드 | 라벨 | 포맷 |
|------|------|------|
| width | 너비 | `{value} px` |
| height | 높이 | `{value} px` |
| orientation | 방향 | `{value} ({설명})` |
| colorSpace | 색상 공간 | 그대로 표시 |
| hasAlpha | 알파 채널 | 예/아니오 |

## 방향(Orientation) 매핑

| 값 | 설명 |
|----|------|
| 1 | 정방향 |
| 2 | 좌우 반전 |
| 3 | 180도 회전 |
| 4 | 상하 반전 |
| 5 | 90도 회전 + 좌우 반전 |
| 6 | 90도 회전 |
| 7 | 270도 회전 + 좌우 반전 |
| 8 | 270도 회전 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 36px |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |
| 아이콘 | Heroicons |

## 구현 체크리스트

- [ ] index.tsx
- [ ] 접기/펼치기 애니메이션
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 기본 렌더링 | 1 | 0 | 0 | 1 |
| 접기/펼치기 | 2 | 0 | 0 | 2 |
| 방향 매핑 | 1 | 0 | 0 | 1 |
| 알파 채널 | 2 | 0 | 0 | 2 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | image 데이터 전달됨 |
| **When** | ImageDetailInfo 렌더링 |
| **Then** | 모든 필드가 올바르게 표시됨 |

### [TC-002] 접기/펼치기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | collapsible=true, defaultExpanded=true |
| **When** | 접기 버튼 클릭 |
| **Then** | 요약 정보만 표시됨 |

### [TC-003] 접힌 상태에서 펼치기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 접힌 상태 |
| **When** | 펼치기 버튼 클릭 |
| **Then** | 모든 정보 표시됨 |

### [TC-004] 알파 채널 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | hasAlpha=true |
| **When** | ImageDetailInfo 렌더링 |
| **Then** | "예" 뱃지 표시 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`
- `packages/fe-ui/src/components/widget/AssetTypeInfo/index.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-widget-planner |
