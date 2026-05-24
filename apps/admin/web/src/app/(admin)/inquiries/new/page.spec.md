# 문의 접수 페이지 기획서

> 생성일: 2026-02-25
> 수정일: 2026-03-01
> 타입: page
> 경로: /inquiries/new

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← 목록으로         문의 접수                                                     │
│ 전화, 현장 등 오프라인 문의를 수동으로 접수합니다.                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📋 기본 정보                                                                 │ │
│ │                                                                             │ │
│ │ 문의 제목 *                                                                  │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 제목을 입력하세요                                                        │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ 채널 *                     접수 유형                                        │ │
│ │ [전화 ▼]                   [오프라인 문의 ▼]                                │ │
│ │                                                                             │ │
│ │ 카테고리 *                 우선순위 *                                        │ │
│ │ [배송 ▼]                   [보통 ▼]                                         │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🤖 AI 분류 추천                                                          │ │ │
│ │ │ 입력된 내용을 바탕으로 AI가 추천하는 설정입니다.                          │ │ │
│ │ │ 카테고리: [배송 ✓]  우선순위: [높음 ✓]  예상 처리 시간: 2시간            │ │ │
│ │ │ [추천 적용]                                                              │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 고객 정보                                                                 │ │
│ │                                                                             │ │
│ │ ┌───────────────────────┐   ┌───────────────────────┐                       │ │
│ │ │ 🔍 기존 고객 검색     │   │ ➕ 신규 고객 등록     │                       │ │
│ │ └───────────────────────┘   └───────────────────────┘                       │ │
│ │                                                                             │ │
│ │ 고객명 *                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 홍길동                                                                  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ 연락처 *                   이메일                                           │ │
│ │ ┌─────────────────────┐   ┌─────────────────────────────────────────────┐   │ │
│ │ │ 010-1234-5678       │   │ hong@example.com                            │   │ │
│ │ └─────────────────────┘   └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 문의 내용                                                                 │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │                                                                         │ │ │
│ │ │ 고객이 문의한 내용을 상세히 입력하세요.                                  │ │ │
│ │ │                                                                         │ │ │
│ │ │                                                                         │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ 📎 첨부 파일                                                                 │ │
│ │ [파일 선택] 또는 드래그 앤 드롭                                              │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏷️ 추가 설정 (선택)                                                          │ │
│ │                                                                             │ │
│ │ 담당자                      태그                                            │ │
│ │ [미배정 ▼]                  [+ 태그 추가]                                   │ │
│ │                                                                             │ │
│ │ 비고                                                                         │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 내부 참고용 메모 (고객에게 보이지 않음)                                  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│                                          [취소]  [임시 저장]  [접수 완료]       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 "문의 접수" 버튼을 클릭하여 문의 접수 페이지로 이동한다
2. 기존 고객 검색 또는 신규 고객 정보를 입력한다
3. 문의 제목, 카테고리, 우선순위 등 기본 정보를 입력한다
4. 문의 내용을 상세히 작성한다
5. 상단 `AiForm`에서 스키마/필드를 선택하고 "채우기"를 실행한다
6. 서버가 반환한 patch가 폼(title/category/priority/content)에 즉시 반영된다
7. 필요시 첨부 파일을 업로드한다
8. 담당자를 배정하거나 태그를 추가한다
9. "접수 완료" 버튼을 클릭하여 문의를 등록한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| 헤더 | `Page + PageTitleBar` | - |
| 기본 정보 | InquiryBasicForm | `packages/fe-ui/src/widget/InquiryBasicForm/index.spec.md` |
| AI 폼 채움 | AiForm | `packages/fe-ui/src/feature/AiForm/index.spec.md` |
| 고객 정보 | CustomerSearchForm | `packages/fe-ui/src/feature/CustomerSearchForm/index.spec.md` |
| 문의 내용 | InquiryContentForm | `packages/fe-ui/src/widget/InquiryContentForm/index.spec.md` |
| 추가 설정 | InquirySettingsForm | `packages/fe-ui/src/widget/InquirySettingsForm/index.spec.md` |
| 버튼 영역 | FormActions | - |

- AiForm과 각 입력 묶음은 `Section + PageTitleBar` 표면을 사용해 서로 구분한다.

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 문의 접수 본문 전체를 raised 레이어로 묶음 |
| SectionSurface 대상 | `AiForm` 추천 블록, 문의 입력 블록 |
| SectionSurface padding | 기본 패딩 유지 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 폼 로드 완료 | 빈 폼 |
| 고객 검색 중 | 기존 고객 검색 | 검색 결과 드롭다운 |
| 고객 선택됨 | 기존 고객 선택 | 고객 정보 자동 입력 |
| 입력 중 | 폼 작성 중 | 입력값 실시간 검증 |
| AI 채움 중 | AI patch 생성 중 | 로딩 인디케이터 |
| AI 채움 완료 | patch 적용 완료 | 입력값 자동 반영 |
| 제출 중 | 접수 완료 API 호출 | 버튼 비활성화, 로딩 |
| 완료 | 접수 성공 | 상세 페이지로 리다이렉트 |
| 에러 | 유효성/API 에러 | 에러 메시지 표시 |

## API 호출

| 시점 | API | 캐싱 |
|------|-----|------|
| 진입 시 | GET /api/v1/inquiries/form/create | staleTime: 0 |
| 고객 검색 | GET /api/v1/users?search=xxx | staleTime: 1m |
| AI 폼 채움 | POST /api/v1/inquiries/form/ai-fill | no-cache |
| 접수 완료 | POST /api/v1/inquiries | no-cache |
| 파일 업로드 | POST /api/v1/uploads | no-cache |

## AiForm 채움

### 실행 트리거

| 트리거 | 동작 |
|--------|------|
| AiForm 스키마 선택 | 선택한 paths 체크 상태 갱신 |
| AiForm [채우기] 버튼 클릭 | 서버 `POST /form/ai-fill` 호출 |

### 적용 항목

| 항목 | 설명 | 신뢰도 표시 |
|------|------|------------|
| title | 문의 제목 자동 보정 | - |
| category | 문의 내용 기반 분류 | - |
| priority | 키워드/감정 기반 판단 | - |
| content | 문의 내용 보강 | - |

### AiForm UI 동작

1. 사용자가 스키마와 필드를 선택한다
2. `onFill` 호출 후 서버 patch를 받는다
3. `applyPatch`로 state를 즉시 갱신한다

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBack | `/inquiries` 페이지로 이동 |
| onSearchCustomer | 고객 검색 API 호출 |
| onSelectCustomer | 선택한 고객 정보로 폼 자동 채우기 |
| onAddAttachment | 파일 선택 다이얼로그 열기 |
| onRemoveAttachment | 첨부 파일 제거 |
| onFillAiForm | AiForm 채우기 API 호출 |
| onApplyAiPatch | AiForm patch를 폼 state에 적용 |
| onClickCancel | 확인 다이얼로그 후 목록으로 이동 |
| onClickSaveDraft | 임시 저장 (localStorage) |
| onSubmit | 문의 접수 API 호출 |

## L5-L12 레이어 기획

### L5: 화면 구조 (레이아웃)

```
페이지 헤더 영역 (title, description, actions)
├── InquiryBasicForm
│   ├── TitleInput
│   ├── ChannelSelect
│   ├── SourceSelect
│   ├── CategorySelect
│   ├── PrioritySelect
│   └── AIClassificationSuggestion
├── CustomerSearchForm
│   ├── TabSwitcher (기존/신규)
│   ├── CustomerSearchInput
│   ├── CustomerInfoFields
│   └── SelectedCustomerCard
├── InquiryContentForm
│   ├── ContentTextarea
│   └── AttachmentUploader
├── InquirySettingsForm
│   ├── AssigneeSelect
│   ├── TagInput
│   └── NotesTextarea
└── FormActions
    ├── CancelButton
    ├── SaveDraftButton
    └── SubmitButton
```

### L6: 데이터 흐름 (API 호출)

```
1. Client-side 초기 조회
   - GET /api/v1/inquiries/form/create

2. Client-side
   - 고객 검색: 디바운스 300ms
   - AI 채움: AiForm 채우기 버튼 클릭 시 호출
   - 폼 제출: 유효성 검증 후 API 호출

3. 임시 저장
   - localStorage에 5분마다 자동 저장
   - 페이지 새로고침 시 복원 프롬프트
```

### L7: 인터랙션 (이벤트)

| 인터랙션 | 트리거 | 동작 |
|----------|--------|------|
| 고객 검색 | Input 입력 | 300ms 디바운스 + API 호출 |
| 고객 선택 | List click | 폼 자동 채우기 |
| AiForm 채움 | Button click | API 호출 + patch 적용 |
| 폼 제출 | Button click | 유효성 검증 + API 호출 |
| 이탈 확인 | Browser back | 확인 다이얼로그 |

### L8: Pure UI 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| AiForm | feature/ | 스키마 선택 + 패치 적용 UI |
| CustomerSearchInput | ui/ | 고객 검색 입력 |
| SelectedCustomerCard | ui/ | 선택된 고객 정보 카드 |
| AttachmentUploader | ui/ | 파일 업로드 컴포넌트 |
| TagInput | ui/inputs/ | 태그 입력 필드 |
| NotesTextarea | ui/inputs/ | 비고 입력 필드 |

### L9: Widget 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| InquiryBasicForm | widgets/ | 기본 정보 폼 섹션 |
| InquiryContentForm | widgets/ | 문의 내용 폼 섹션 |
| InquirySettingsForm | widgets/ | 추가 설정 폼 섹션 |

### L10: Feature 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| CustomerSearchForm | feature/ | 고객 검색/선택 기능 |
| InquiryCreateForm | feature/ | 전체 폼 + 페이지 로컬 state + AiForm 연결 |

### L11: Store 연결

| Store | 사용 필드/액션 |
|-------|----------------|
| Page Local State | isSubmitting, formState, errors |
| Form State (컴포넌트 내부) | formData, setFormData, validate, reset |

### L12: 테스트 케이스

> 구현 도구: Playwright (E2E)

#### 테스트 커버리지

| 시나리오 | Happy Path | Error Path | Edge Case | 합계 |
|---------|:----------:|:----------:|:---------:|:----:|
| 기본 접수 | 1 | 0 | 0 | 1 |
| 기존 고객 선택 | 1 | 1 | 0 | 2 |
| AI 분류 추천 | 2 | 1 | 0 | 3 |
| 필수값 검증 | 0 | 1 | 0 | 1 |
| 첨부 파일 | 1 | 1 | 1 | 3 |
| 임시 저장 | 1 | 0 | 1 | 2 |

#### [TC-001] 문의 접수 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 접수 페이지 로드됨 |
| **When** | 모든 필수값 입력 후 접수 완료 클릭 |
| **Then** | 문의 등록 성공, 상세 페이지로 이동 |

#### [TC-002] 기존 고객 검색 및 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 기존 고객 존재 |
| **When** | 고객명 검색 후 선택 |
| **Then** | 고객 정보 자동 입력됨 |

#### [TC-003] AI 분류 추천 - 자동 트리거

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 접수 페이지 로드됨 |
| **When** | 제목과 내용 50자 이상 입력 |
| **Then** | AI 분류 추천 카드 표시됨 |

#### [TC-004] AI 분류 추천 - 적용

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AI 추천 카드 표시됨 |
| **When** | [전체 적용] 버튼 클릭 |
| **Then** | 카테고리, 우선순위 필드 자동 채워짐 |

#### [TC-005] 필수값 검증 실패

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 접수 페이지 로드됨 |
| **When** | 필수값 없이 접수 완료 클릭 |
| **Then** | 필수값 에러 메시지 표시 |

#### [TC-006] AI 분류 추천 - 실패

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 접수 페이지 로드됨 |
| **When** | AI 분류 API 실패 |
| **Then** | 에러 메시지 표시, 수동 선택 가능 |

#### [TC-007] 임시 저장 - 복원

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | 이전에 임시 저장된 데이터 있음 |
| **When** | 페이지 다시 로드 |
| **Then** | 복원 확인 다이얼로그 표시 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (legacy)
- [ ] hooks/useInquiryForm.ts (폼 상태 관리)
- [ ] hooks/useAIClassification.ts (legacy)
- [ ] hooks/useAutoSave.ts (임시 저장)
- [x] E2E 테스트 (Playwright) - `page.e2e.ts`

## 상위 기획서

- `apps/admin/web/src/app/(admin)//app.context.md`

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/inquiries/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/inquiries/new/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 create bootstrap, 고객 검색, AI fill, create mutation, 라우팅을 소유하고 `InquiryCreatePage`에는 props로 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-30 | create bootstrap/고객 검색/AI fill/mutation/라우팅을 route container가 소유하고 `InquiryCreatePage`는 pure screen로 소비하도록 반영 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-15 | 문의 접수 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-02-26 | AI 자동 분류 제안 기능 추가 | orch-screen-planner |
| 2026-02-26 | L5-L12 레이어 기획 추가 | orch-screen-planner |
| 2026-02-26 | 임시 저장 기능 추가 | orch-screen-planner |
| 2026-02-27 | 접수 페이지 E2E 테스트 추가 (`page.e2e.ts`) 및 구현 체크리스트 동기화 | codex |
| 2026-02-28 | InquiryStore 의존 제거, 페이지 로컬 state 기준으로 L10/L11 갱신 | codex |
| 2026-03-01 | Create Form Bootstrap + AiForm(`POST /form/ai-fill`) 기반으로 페이지 구조 전환, `_prefetch.ts` 추가 | codex |
| 2026-03-01 | 폼 입력 컴포넌트를 HeroUI(Input/Select/Textarea) 기반으로 정리하고 고객 검색을 페이지 로컬 결과 리스트 선택 방식으로 조정 | codex |
| 2026-03-01 | AiForm을 실제 입력 폼과 동일 위계로 분리하고 바깥 섹션 영역 래퍼를 제거해 Card 단일 표면 구조로 정리 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 기반 배치 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-06 | widget 경로 참조를 widgets 경로로 정리 | codex |
