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
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 수정 페이지 본문 전체를 raised 레이어로 묶음 |
| SectionSurface 대상 | AI 추천 블록, 수정 입력 블록 |
| SectionSurface padding | 기본 패딩 유지 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

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

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)

## 상위 기획서

- `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/page.spec.md`

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/inquiries/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 update bootstrap, AI fill, 저장 mutation, 라우팅을 소유하고 `InquiryEditPage`에는 props로 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-30 | update bootstrap/AI fill/저장 mutation/라우팅을 route container가 소유하고 `InquiryEditPage`는 pure screen로 소비하도록 반영 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-15 | 문의 수정 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시 | codex |
| 2026-03-01 | 초기 생성 (문의 수정 페이지 + AiForm UPDATE 흐름) | codex |
| 2026-03-01 | 수정 폼 입력을 HeroUI Select 기반으로 정리해 Form-state 전용 입력 컴포넌트 의존 제거 | codex |
| 2026-03-01 | AiForm을 수정 입력 폼과 동일 위계로 분리하고 바깥 섹션 영역 래퍼를 제거해 Card 단일 표면 구조로 정리 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 레이아웃 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
