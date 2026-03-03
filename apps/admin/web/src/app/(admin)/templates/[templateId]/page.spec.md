# 템플릿 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/templates/[templateId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                [미리보기] [발송테스트] [수정] [삭제] │
│ 템플릿 상세                                                       │
│ WELCOME_EMAIL · 회원가입 환영 이메일                              │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                         │
│                                                                   │
│  코드                       이름                                  │
│  WELCOME_EMAIL              회원가입 환영 이메일                  │
│                                                                   │
│  유형                       활성 상태                             │
│  [EMAIL]                    ●────── (활성)                        │
│                                                                   │
│  설명                                                             │
│  신규 가입자에게 발송되는 환영 이메일입니다.                       │
│                                                                   │
│  생성일                     수정일                                │
│  2026-01-01 09:00           2026-02-10 14:30                     │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역  콘텐츠                                            │
│                                                                   │
│  제목                                                             │
│  {{name}}님, 가입을 환영합니다!                                   │
│                                                                   │
│  본문                                                             │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 안녕하세요, {{name}}님.                                  │     │
│  │ 저희 서비스에 가입해 주셔서 감사합니다.                  │     │
│  └─────────────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역  변수 목록                                         │
│ ┌──────────┬──────────────┬──────────────┬──────┐               │
│ │ 변수명   │ 설명         │ 기본값       │ 필수 │               │
│ ├──────────┼──────────────┼──────────────┼──────┤               │
│ │ name     │ 사용자 이름  │ 사용자       │  ●   │               │
│ └──────────┴──────────────┴──────────────┴──────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 템플릿 목록에서 코드를 클릭하여 상세 페이지에 진입한다
2. 기본 정보(코드, 이름, 유형, 설명, 활성 상태, 생성일, 수정일)를 확인한다
3. 콘텐츠(제목, 본문)를 확인한다
4. 변수 목록을 확인한다
5. 수정/삭제/활성 토글/미리보기/발송 테스트 등 액션을 수행한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page(mode="content")` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageHeader` | title="템플릿 상세", description=동적, actions에 `TemplateActions` |
| 기본 정보 | `Section(mode="content") + SectionHeader(title="기본 정보")` | 2컬럼 Grid 레이아웃 |
| 콘텐츠 | `Section(mode="content") + SectionHeader(title="콘텐츠")` | `TemplateContentViewer` |
| 변수 목록 | `Section(mode="content") + SectionHeader(title="변수 목록")` | `VariableReadTable` 또는 빈 안내 |
| 삭제 모달 | `Modal` | 삭제 확인 다이얼로그 |
| 미리보기 모달 | `PreviewModal` | 변수 입력 + 미리보기 결과 |
| 발송 테스트 모달 | `SendTestModal` | 수신자 + 변수 입력 + 발송 결과 |

## 기본 정보 표시 필드

| 필드 | 라벨 | 표시 방식 |
|------|------|----------|
| code | 코드 | 모노스페이스 텍스트 |
| name | 이름 | 텍스트 |
| type | 유형 | `TemplateTypeBadge` |
| description | 설명 | 텍스트 ("-" 폴백) |
| isActive | 활성 상태 | `Switch` (토글 가능) |
| createdAt | 생성일 | `DateTimeCell` |
| updatedAt | 수정일 | `DateTimeCell` |

## 액션 버튼 (`TemplateActions`)

| 액션 | 버튼 | 동작 |
|------|------|------|
| 수정 | 수정 | `/templates/{templateId}/edit` 이동 |
| 삭제 | 삭제 | 삭제 확인 모달 열기 |
| 활성 토글 | 활성화/비활성화 | `toggleTemplateStatus` API 호출 |
| 미리보기 | 미리보기 | 미리보기 모달 열기 |
| 발송 테스트 | 발송 테스트 | 발송 테스트 모달 열기 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 템플릿 조회 중 | `Spinner` (size="lg") |
| 데이터 없음 | 템플릿을 찾을 수 없음 | 안내 메시지 + "목록으로" 버튼 |
| 데이터 표시 | 템플릿 정보 + 변수 목록 표시 | 기본 정보 + 콘텐츠 + 변수 |
| 삭제 중 | 삭제 API 호출 중 | 삭제 버튼 로딩 |
| 토글 중 | 상태 변경 API 호출 중 | Switch 비활성화 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetTemplateQuery(templateId)` | 템플릿 상세 프리페칭 |
| 클라이언트 | `useGetTemplate(templateId)` | 템플릿 상세 조회 |
| 삭제 시 | `useDeleteTemplate({ id: templateId })` | 템플릿 삭제 |
| 토글 시 | `useToggleTemplateStatus({ id: templateId })` | 활성 상태 토글 |
| 미리보기 시 | `usePreviewTemplate({ id, data: { variables } })` | 변수 치환 미리보기 |
| 발송 테스트 시 | `useSendTestTemplate({ id, data: { recipient, variables } })` | 테스트 발송 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/templates` 목록 페이지로 이동 |
| onClickEditButton | `/templates/{templateId}/edit` 수정 페이지로 이동 |
| onClickDeleteConfirm | DELETE API 호출 -> 성공 시 목록 이동 + 성공 토스트, 실패 시 에러 토스트 |
| onClickToggleButton | PATCH toggle-status API 호출 -> 성공 시 캐시 무효화 + 성공 토스트 |
| onSubmitPreviewTemplate | POST preview API 호출 -> PreviewResult 반환 |
| onSubmitSendTestTemplate | POST send-test API 호출 -> 결과 반환 |

## 모달 정의

### 삭제 확인 모달
- 제목: "템플릿 삭제"
- 본문: "{name} 템플릿을 삭제하시겠습니까?" + "이 작업은 되돌릴 수 없습니다." (danger)
- 버튼: 취소 / 삭제 (danger, 로딩)

### 미리보기 모달 (`PreviewModal`)
- 변수 입력 필드 (기본값 prefill)
- 유형별 렌더링 결과

### 발송 테스트 모달 (`SendTestModal`)
- 수신자 입력
- 변수 입력 필드
- 발송 결과 (성공/실패 + 시각)

## 특이사항

- `useDisclosure`로 3개 모달 상태 관리 (deleteModal, previewModal, sendTestModal)
- 캐시 무효화: `getGetTemplateQueryKey(templateId)` 사용
- FULL_ACCESS 권한 필요

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [x] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [x] _prefetch.ts (prefetchGetTemplateQuery 호출)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 페이지 이벤트 핸들러를 `on[Event][UI]` 규칙으로 정리 (`onSubmitPreviewTemplate`, `onSubmitSendTestTemplate`) | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더 제거를 위해 `Page/Section(mode=\"content\") + PageHeader/SectionHeader` 조합 적용 | codex |
