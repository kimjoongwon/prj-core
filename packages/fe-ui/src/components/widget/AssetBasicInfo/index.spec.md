# AssetBasicInfo Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetBasicInfo/

## 역할

에셋의 기본 정보를 카드 형태로 표시하는 컴포넌트입니다. 파일명, MIME 타입, 크기, 상태, 폴더 경로, 등록일 등을 보여줍니다.

## 디자인 목업

```
┌─────────────────────────────────────────────┐
│ 기본 정보                                    │
├─────────────────────────────────────────────┤
│                                             │
│  파일명          banner.jpg                 │
│                                             │
│  MIME 타입       image/jpeg                 │
│                                             │
│  크기            2.4 MB                     │
│                                             │
│  상태            ● READY                    │
│                                             │
│  폴더            /이미지/배너               │
│                                             │
│  등록일          2024년 2월 22일 14:30      │
│                                             │
│  수정일          2024년 2월 22일 16:45      │
│                                             │
├─────────────────────────────────────────────┤
│  [다운로드]                    [폴더 이동]  │
└─────────────────────────────────────────────┘

[업로드 중 상태]
┌─────────────────────────────────────────────┐
│ 기본 정보                                    │
├─────────────────────────────────────────────┤
│  ...                                         │
│  상태            ◐ UPLOADING                │
│                  ████████░░░░░░░░  45%      │
│  ...                                         │
└─────────────────────────────────────────────┘

[에러 상태]
┌─────────────────────────────────────────────┐
│ 기본 정보                                    │
├─────────────────────────────────────────────┤
│  ...                                         │
│  상태            ⚠ FAILED                   │
│                  업로드 실패: 서버 오류     │
│  ...                                         │
└─────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `ready` | 업로드 완료 | READY 뱃지 (초록) |
| `uploading` | 업로드 중 | UPLOADING 뱃지 + 진행률 바 |
| `failed` | 업로드 실패 | FAILED 뱃지 (빨강) + 에러 메시지 |

## Props

```typescript
interface AssetBasicInfoProps {
  asset: Asset;                                // 에셋 데이터
  folderPath?: string;                         // 폴더 경로 (asset.folder.path)
  showDownload?: boolean;                      // 다운로드 버튼 표시
  showMove?: boolean;                          // 폴더 이동 버튼 표시
  showDates?: boolean;                         // 등록/수정일 표시
  onDownload?: (asset: Asset) => void;         // 다운로드 핸들러
  onMove?: (asset: Asset) => void;             // 폴더 이동 핸들러
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 카드 컨테이너 |
| Badge | `ui/Badge` | 상태 뱃지 |
| Button | `ui/Button` | 액션 버튼 |
| ProgressBar | `ui/ProgressBar` | 업로드 진행률 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `header` | 헤더 영역 커스터마이징 |
| `extraInfo` | 추가 정보 행 |
| `actions` | 하단 액션 버튼 영역 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 라벨 너비 | 100px |
| 행 간격 | py-3 |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |

## 정보 항목

| 항목 | 키 | 포맷 |
|------|-----|------|
| 파일명 | originalName | 문자열 |
| MIME 타입 | mimeType | 문자열 |
| 크기 | sizeBytes | 2.4 MB 형태 |
| 상태 | status | Badge |
| 폴더 | folder.path | 경로 문자열 |
| 등록일 | createdAt | YYYY년 M월 D일 HH:mm |
| 수정일 | updatedAt | YYYY년 M월 D일 HH:mm |

## 구현 체크리스트

- [ ] index.tsx
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 정보 표시 | 1 | 0 | 0 | 1 |
| 상태별 표시 | 3 | 0 | 0 | 3 |
| 액션 버튼 | 2 | 0 | 0 | 2 |

### [TC-001] 기본 정보 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset 데이터 존재 |
| **When** | AssetBasicInfo 렌더링 |
| **Then** | 파일명, MIME, 크기, 상태, 폴더, 날짜 표시 |

### [TC-002] 업로드 중 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.status="UPLOADING" |
| **When** | AssetBasicInfo 렌더링 |
| **Then** | UPLOADING 뱃지 + 진행률 바 표시 |

### [TC-003] 다운로드 버튼 클릭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | showDownload=true, onDownload 전달 |
| **When** | 다운로드 버튼 클릭 |
| **Then** | onDownload(asset) 호출 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화 | orch-screen-planner |
