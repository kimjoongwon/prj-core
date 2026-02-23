# VideoDetailInfo Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/VideoDetailInfo/

## 역할

비디오 타입 에셋의 상세 정보(너비, 높이, 재생 시간, 프레임 레이트, 코덱, 비트레이트, 오디오)를 표시하는 컴포넌트입니다. 접기/펼치기 기능을 제공합니다.

## 디자인 목업

```
[펼쳐진 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 비디오 정보                                          [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 너비            1920 px         │ 프레임 레이트  30 fps          │
│ 높이            1080 px         │ 비디오 코덱    H.264           │
│ 재생 시간       02:30           │ 비트레이트      8.5 Mbps        │
│ 오디오          AAC             │                                │
└──────────────────────────────────────────────────────────────────┘

[접힌 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 비디오 정보 · 1920 x 1080 · 02:30                     [펼치기 ▼] │
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
interface VideoDetailInfoProps {
  video: Video;                           // 비디오 상세 데이터
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
| Badge | `ui/Badge` | 오디오 뱃지 |

## 상태 관리

**로컬 상태만 사용** (expanded/collapsed)

## 데이터 매핑

| 필드 | 라벨 | 포맷 |
|------|------|------|
| width | 너비 | `{value} px` |
| height | 높이 | `{value} px` |
| durationMs | 재생 시간 | `MM:SS` 또는 `HH:MM:SS` |
| frameRate | 프레임 레이트 | `{value} fps` |
| codec | 비디오 코덱 | 그대로 표시 |
| bitrate | 비트레이트 | `{value} Mbps` 또는 `{value} Kbps` |
| hasAudio | 오디오 | 코덱명 또는 "없음" |

## 시간 포맷팅

```typescript
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
```

## 비트레이트 포맷팅

```typescript
function formatBitrate(bps: number): string {
  if (bps >= 1000000) {
    return `${(bps / 1000000).toFixed(1)} Mbps`;
  }
  return `${(bps / 1000).toFixed(0)} Kbps`;
}
```

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 36px |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] 시간 포맷팅 유틸리티
- [ ] 비트레이트 포맷팅 유틸리티
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
| 시간 포맷팅 | 2 | 0 | 1 | 3 |
| 비트레이트 포맷팅 | 2 | 0 | 0 | 2 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | video 데이터 전달됨 |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | 모든 필드가 올바르게 표시됨 |

### [TC-002] 시간 포맷팅 (1분 미만)

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | durationMs=45000 (45초) |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | "00:45"로 표시 |

### [TC-003] 시간 포맷팅 (1시간 이상)

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | durationMs=3725000 (1시간 2분 5초) |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | "1:02:05"로 표시 |

### [TC-004] 비트레이트 포맷팅 (Mbps)

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | bitrate=8500000 |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | "8.5 Mbps"로 표시 |

### [TC-005] 비트레이트 포맷팅 (Kbps)

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | bitrate=512000 |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | "512 Kbps"로 표시 |

### [TC-006] 오디오 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | hasAudio=false |
| **When** | VideoDetailInfo 렌더링 |
| **Then** | "없음" 표시 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`
- `packages/fe-ui/src/components/widget/AssetTypeInfo/index.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-widget-planner |
