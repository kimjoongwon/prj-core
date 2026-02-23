# DropZone UI 컴포넌트 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/DropZone/

## 역할

파일 드래그앤드롭 영역을 제공하는 컴포넌트입니다. 파일 드래그 시 시각적 피드백을 제공하며, 클릭으로 파일 선택 다이얼로그를 열 수 있습니다.

## 디자인 목업

```
[기본 상태]
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         📤                                       │
│              파일을 드래그하여 업로드하세요                       │
│                    또는                                          │
│                  [파일 선택]                                     │
│                                                                 │
│          지원 포맷: JPG, PNG, GIF, MP4, PDF (최대 100MB)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

[드래그 중 (dragOver)]
┌─────────────────────────────────────────────────────────────────┐
│ ▲ primary border                                                │
│ ▲                                                               │
│ ▲                   여기에 놓으세요!                            │
│ ▲                                                               │
│ ▲              (전체 영역 primary/20 배경)                      │
│ ▲                                                               │
└─────────────────────────────────────────────────────────────────┘

[비활성 상태 (disabled)]
┌─────────────────────────────────────────────────────────────────┐
│                          (회색 배경)                             │
│                         📤 (회색 아이콘)                         │
│              업로드를 사용할 수 없습니다                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

[에러 상태 (error)]
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         ⚠️                                       │
│              지원하지 않는 파일 형식입니다                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Props

```typescript
interface DropZoneProps {
  onDrop: (files: File[]) => void;           // 파일 드롭 핸들러
  onDragOver?: () => void;                   // 드래그 진입 핸들러
  onDragLeave?: () => void;                  // 드래그 이탈 핸들러
  accept?: string[];                         // 허용 파일 타입 (예: ["image/*", ".pdf"])
  maxFileSize?: number;                      // 최대 파일 크기 (bytes)
  multiple?: boolean;                        // 다중 파일 허용 여부
  disabled?: boolean;                        // 비활성화 여부
  title?: string;                            // 메시지 제목
  description?: string;                      // 보조 메시지
  error?: string;                            // 에러 메시지
  className?: string;                        // 추가 클래스
}
```

## 상태

| 상태 | 스타일 |
|------|--------|
| `idle` | border-dashed border-divider bg-content1 |
| `dragOver` | border-solid border-primary bg-primary/10 |
| `disabled` | opacity-50 cursor-not-allowed |
| `error` | border-danger bg-danger/10 |

## 변형 (Variants)

| 변형 | 설명 | 사용 예시 |
|------|------|----------|
| `default` | 기본 드래그 영역 | 파일 업로드 |
| `compact` | 작은 크기 | 인라인 업로드 |
| `card` | 카드 형태 | 모달 내 업로드 |

## 크기 (Sizes)

| 크기 | 값 |
|------|-----|
| `sm` | min-height: 120px |
| `md` | min-height: 200px (기본) |
| `lg` | min-height: 300px |

## 접근성

- [ ] 키보드로 포커스 가능
- [ ] Enter/Space로 파일 선택 다이얼로그 오픈
- [ ] 드래그 상태 변경 시 스크린 리더 알림
- [ ] aria-label로 영역 목적 설명

## HeroUI 매핑

기반: `import { Card } from '@heroui/react'` (배경용)

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts
- [ ] Storybook 스토리
- [ ] 접근성 테스트
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 파일 드롭 | 1 | 0 | 0 | 1 |
| 드래그 상태 | 1 | 0 | 0 | 1 |
| 파일 선택 | 1 | 0 | 0 | 1 |
| 파일 타입 검증 | 0 | 1 | 0 | 1 |
| 파일 크기 검증 | 0 | 1 | 0 | 1 |
| 비활성 상태 | 0 | 0 | 1 | 1 |
| **합계** | **3** | **2** | **1** | **6** |

### [TC-001] 파일 드롭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | DropZone 렌더링됨 |
| **When** | 파일 드래그 → 드롭 |
| **Then** | onDrop 호출 (files 배열) |

### [TC-002] 드래그 상태 변화

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | DropZone 렌더링됨 |
| **When** | 파일 드래그 진입 → 이탈 |
| **Then** | onDragOver → onDragLeave 호출 |

### [TC-003] 파일 선택 버튼

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | DropZone 렌더링됨 |
| **When** | 영역 클릭 |
| **Then** | 파일 선택 다이얼로그 오픈 |

### [TC-004] 파일 타입 검증

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | accept=["image/*"] |
| **When** | .exe 파일 드롭 |
| **Then** | onDrop 호출되지 않음 |

### [TC-005] 파일 크기 검증

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | maxFileSize=10485760 (10MB) |
| **When** | 20MB 파일 드롭 |
| **Then** | 에러 상태 표시 |

### [TC-006] 비활성 상태

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | disabled=true |
| **When** | 파일 드래그 → 드롭 |
| **Then** | onDrop 호출되지 않음 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/new/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | orch-screen-planner |
