# FileIcon UI 컴포넌트 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/FileIcon/

## 역할

파일 타입에 따른 아이콘을 표시하는 컴포넌트입니다. MIME 타입 또는 확장자를 기반으로 적절한 아이콘과 색상을 자동 선택합니다.

## 디자인 목업

```
파일 타입별 아이콘:

이미지:     🖼️ (primary 색상)
비디오:     🎬 (secondary 색상)
오디오:     🎵 (accent 색상)
문서:       📄 (default 색상)
PDF:        📕 (danger 색상)
엑셀:       📊 (success 색상)
PPT:        📊 (warning 색상)
압축:       📦 (default 색상)
코드:       💻 (primary 색상)
기타:       📄 (default 색상)

크기 변형:
  sm:   16px
  md:   24px (기본)
  lg:   32px
  xl:   48px
```

## Props

```typescript
interface FileIconProps {
  mimeType?: string;                         // MIME 타입 (예: "image/png")
  extension?: string;                        // 파일 확장자 (예: ".jpg")
  fileName?: string;                         // 파일명 (확장자 추출용)
  size?: "sm" | "md" | "lg" | "xl";          // 아이콘 크기
  color?: "auto" | "primary" | "secondary" | "success" | "warning" | "danger"; // 색상
  showLabel?: boolean;                       // 타입 라벨 표시 여부
  className?: string;                        // 추가 클래스
}
```

## 상태

| 상태 | 스타일 |
|------|--------|
| `default` | 기본 색상 |
| `hover` | (해당 없음 - 표시 전용) |

## 변형 (Variants)

| 변형 | 설명 | 사용 예시 |
|------|------|----------|
| `icon` | 아이콘만 표시 | 목록 항목 |
| `badge` | 배경과 함께 표시 | 카드 |

## 크기 (Sizes)

| 크기 | 값 |
|------|-----|
| `sm` | 16px |
| `md` | 24px |
| `lg` | 32px |
| `xl` | 48px |

## 파일 타입 매핑

| 타입 | MIME/확장자 | 아이콘 | 색상 |
|------|------------|--------|------|
| IMAGE | image/*, .jpg, .png, .gif, .webp, .svg | 🖼️ | primary |
| VIDEO | video/*, .mp4, .mov, .avi, .webm | 🎬 | secondary |
| AUDIO | audio/*, .mp3, .wav, .ogg | 🎵 | accent |
| PDF | application/pdf, .pdf | 📕 | danger |
| EXCEL | .xls, .xlsx, .csv | 📊 | success |
| WORD | .doc, .docx | 📝 | primary |
| PPT | .ppt, .pptx | 📊 | warning |
| ARCHIVE | .zip, .rar, .7z, .tar | 📦 | default |
| CODE | .js, .ts, .py, .java | 💻 | primary |
| DOCUMENT | application/* | 📄 | default |

## 접근성

- [ ] aria-label로 파일 타입 설명
- [ ] 색상만으로 정보 전달하지 않음 (아이콘 형태로 구분)

## HeroUI 매핑

기반: 순수 구현 (HeroUI 기반 없음)

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts
- [ ] file-type-map.ts (타입 매핑)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| MIME 타입 매핑 | 1 | 0 | 0 | 1 |
| 확장자 매핑 | 1 | 0 | 0 | 1 |
| 파일명에서 확장자 추출 | 1 | 0 | 1 | 2 |
| 알 수 없는 타입 | 0 | 0 | 1 | 1 |
| **합계** | **3** | **0** | **2** | **5** |

### [TC-001] MIME 타입 매핑

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | mimeType="image/png" |
| **When** | 렌더링 |
| **Then** | 이미지 아이콘 + primary 색상 |

### [TC-002] 확장자 매핑

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | extension=".pdf" |
| **When** | 렌더링 |
| **Then** | PDF 아이콘 + danger 색상 |

### [TC-003] 파일명에서 확장자 추출

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | fileName="document.pdf" |
| **When** | 렌더링 |
| **Then** | PDF 아이콘 표시 |

### [TC-004] 확장자 없는 파일명

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | fileName="README" |
| **When** | 렌더링 |
| **Then** | 기본 파일 아이콘 표시 |

### [TC-005] 알 수 없는 MIME 타입

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | mimeType="application/x-unknown" |
| **When** | 렌더링 |
| **Then** | 기본 파일 아이콘 표시 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/new/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | orch-screen-planner |
