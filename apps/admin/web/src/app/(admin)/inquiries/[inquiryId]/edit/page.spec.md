# 문의 수정 페이지 기획서

> 생성일: 2026-03-01
> 타입: page
> 경로: /inquiries/[inquiryId]/edit

## 역할

문의 메타 정보(`title`, `category`, `priority`)를 수정하는 전용 페이지.  
Create/Update Form Bootstrap 계약을 사용해 초기 폼을 렌더링하며, 상단 `AiForm`으로 필드 patch를 적용할 수 있다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 헤더 | `Page + PageTitleBar` | 페이지 제목/상세 이동 액션 |
| 폼 영역 | `Section + PageTitleBar` | 수정 폼 컨테이너 |
| AI 채움 | AiForm (Section surface) | mode=UPDATE, 선택 필드 patch 생성 |
| 수정 폼 | Input + Select | 제목/카테고리/우선순위 수정 |
| 액션 | Button 그룹 | 취소/저장 |

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/edit/_client.tsx` |
| PageSurface 역할 | 수정 페이지 본문 전체를 raised 레이어로 묶음 |
| SectionSurface 대상 | AI 추천 블록, 수정 입력 블록 |
| SectionSurface padding | 기본 패딩 유지 |
| 예외 | 없음. AiForm과 입력 폼이 별도 섹션으로 나뉘어도 surface owner는 `_client.tsx`가 직접 소유 |

## 데이터 흐름

| 시점 | API | 설명 |
|------|-----|------|
| SSR prefetch | GET /api/v1/inquiries/[inquiryId]/form/update | 수정 폼 bootstrap 로드 |
| AiForm 실행 | POST /api/v1/inquiries/form/ai-fill | UPDATE 모드 patch 생성 |
| 저장 | PATCH /api/v1/inquiries/[inquiryId] | title/category/priority 반영 |

## 폼 계약

- `defaultObject`: `title`, `category`, `priority`
- `options`: `category`, `priority` 옵션 제공
- `ui.hiddenPaths`: `content`, `channel`, `source`
- `aiSchemas`: `inquiry-update-basic`

## 이벤트

| 이벤트 | 동작 |
|--------|------|
| onFillAiForm | 선택한 schema/path로 ai-fill 요청 후 patch 적용 |
| onSubmit | 제목 검증 후 PATCH 저장 |
| onCancel | 상세 페이지로 이동 |
| onBackToDetail | 헤더 액션으로 상세 페이지 이동 |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트)
- [x] _prefetch.ts (bootstrap prefetch)
- [x] _client.tsx (AiForm + 수정 폼 + 저장)

## 상위 기획서

- `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-15 | 문의 수정 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시 | codex |
| 2026-03-01 | 초기 생성 (문의 수정 페이지 + AiForm UPDATE 흐름) | codex |
| 2026-03-01 | 수정 폼 입력을 HeroUI Select 기반으로 정리해 Form-state 전용 입력 컴포넌트 의존 제거 | codex |
| 2026-03-01 | AiForm을 수정 입력 폼과 동일 위계로 분리하고 바깥 섹션 영역 래퍼를 제거해 Card 단일 표면 구조로 정리 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 레이아웃 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
