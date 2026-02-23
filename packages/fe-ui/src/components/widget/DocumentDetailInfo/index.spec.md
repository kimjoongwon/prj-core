# DocumentDetailInfo Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/DocumentDetailInfo/

## 역할

문서 타입 에셋의 상세 정보(페이지 수, 단어 수, 작성자, 제목, 주제, 키워드)를 표시하는 컴포넌트입니다. 접기/펼치기 기능을 제공합니다.

## 디자인 목업

```
[펼쳐진 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 문서 정보                                            [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 페이지 수       15              │ 제목          2024년 가이드    │
│ 단어 수         3,240           │ 주제          사용자 매뉴얼    │
│ 작성자          홍길동          │ 키워드        가이드, 매뉴얼    │
└──────────────────────────────────────────────────────────────────┘

[접힌 상태]
┌──────────────────────────────────────────────────────────────────┐
│ 문서 정보 · 15페이지 · 3,240단어                      [펼치기 ▼] │
└──────────────────────────────────────────────────────────────────┘

[데이터 없는 경우]
┌──────────────────────────────────────────────────────────────────┐
│ 문서 정보                                            [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 페이지 수       -               │ 제목          -                │
│ 단어 수         -               │ 주제          -                │
│ 작성자          -               │ 키워드        -                │
└──────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `expanded` | 펼쳐진 상태 | 모든 정보 표시 |
| `collapsed` | 접힌 상태 | 요약 정보만 표시 |
| `loading` | 로딩 중 | Skeleton |
| `empty` | 데이터 없음 | "-" 표시 |

## Props

```typescript
interface DocumentDetailInfoProps {
  document: Document;                     // 문서 상세 데이터
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
| Chip | `ui/Chip` | 키워드 표시 |

## 상태 관리

**로컬 상태만 사용** (expanded/collapsed)

## 데이터 매핑

| 필드 | 라벨 | 포맷 |
|------|------|------|
| pageCount | 페이지 수 | `{value}페이지` 또는 `-` |
| wordCount | 단어 수 | `{value.toLocaleString()}` 또는 `-` |
| author | 작성자 | 그대로 표시 또는 `-` |
| title | 제목 | 그대로 표시 또는 `-` |
| subject | 주제 | 그대로 표시 또는 `-` |
| keywords | 키워드 | Chip으로 분리 표시 또는 `-` |

## 키워드 표시

```typescript
// keywords가 "가이드, 매뉴얼, 튜토리얼" 형태의 문자열인 경우
const keywordChips = keywords?.split(',').map(k => k.trim()).filter(Boolean);
```

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 36px |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |
| Chip 간격 | gap-2 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] 키워드 파싱 및 Chip 렌더링
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
| 키워드 Chip | 1 | 0 | 1 | 2 |
| 데이터 없음 | 1 | 0 | 0 | 1 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | document 데이터 전달됨 |
| **When** | DocumentDetailInfo 렌더링 |
| **Then** | 모든 필드가 올바르게 표시됨 |

### [TC-002] 키워드 Chip 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | keywords="가이드, 매뉴얼, 튜토리얼" |
| **When** | DocumentDetailInfo 렌더링 |
| **Then** | 3개의 Chip이 표시됨 |

### [TC-003] 키워드 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | keywords=null 또는 빈 문자열 |
| **When** | DocumentDetailInfo 렌더링 |
| **Then** | "-" 표시 |

### [TC-004] 접기/펼치기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | collapsible=true, defaultExpanded=true |
| **When** | 접기 버튼 클릭 |
| **Then** | 요약 정보만 표시됨 |

### [TC-005] 페이지 수/단어 수 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | pageCount=null, wordCount=null |
| **When** | DocumentDetailInfo 렌더링 |
| **Then** | "-" 표시 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`
- `packages/fe-ui/src/components/widget/AssetTypeInfo/index.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-widget-planner |
