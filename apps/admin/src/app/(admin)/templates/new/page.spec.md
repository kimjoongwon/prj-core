# 템플릿 등록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/templates/new`

## 사용자 시나리오

1. 관리자가 "템플릿 등록" 버튼을 클릭하여 등록 페이지에 진입한다
2. 유형(EMAIL/SMS/PUSH), 코드, 이름, 설명, 제목, 본문을 입력한다
3. 필요한 경우 변수를 추가하여 템플릿 변수를 정의한다
4. "등록" 버튼을 클릭하면 유효성 검증 후 API를 호출한다
5. 등록 성공 시 상세 페이지로 이동한다
6. "취소" 버튼 클릭 시 목록 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title="템플릿 등록", description="새로운 메시지 템플릿을 등록합니다." |
| 폼 영역 | `TemplateForm` (mode="create") | 공통 템플릿 폼 컴포넌트 |

## 폼 필드

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|------------|
| type | RadioGroup | O | EMAIL/SMS/PUSH 중 택1 (기본값: EMAIL) |
| code | Input | O | 영문 대문자+언더스코어 (`/^[A-Z][A-Z0-9_]*$/`) |
| name | Input | O | 빈 값 불가 |
| description | Textarea | X | - |
| subject | Input | EMAIL/PUSH일 때 O | PUSH는 50자 이하 |
| content | Textarea | O | PUSH는 200자 이하 |
| variables | VariableEditTable | X | 변수 추가/수정/삭제 |

## 변수 편집

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 변수명 |
| description | string | 설명 (선택) |
| defaultValue | string | 기본값 (선택) |
| isRequired | boolean | 필수 여부 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 빈 폼 표시 | 기본값 type="EMAIL" |
| 입력 중 | 사용자 입력 진행 | 실시간 유효성 검증, 에러 클리어 |
| 제출 중 | API 호출 중 | 등록 버튼 로딩 상태 |
| 성공 | 등록 완료 | 성공 토스트 + 상세 페이지 이동 |
| 실패 | 등록 실패 | 에러 토스트 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 등록 제출 시 | `useCreateTemplate` | CreateTemplateDto (변수 배열 포함) 전송 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onFormDataChange | 폼 데이터 업데이트 + 해당 필드 에러 클리어 |
| onVariablesChange | 변수 목록 업데이트 |
| onSubmitForm | 유효성 검증 -> createTemplate API 호출 |
| onClickCancelButton | `/templates` 목록 페이지로 이동 |

## 유효성 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| code | 빈 값 | "코드를 입력해주세요." |
| code | 형식 불일치 | "영문 대문자와 언더스코어(_)만 사용 가능합니다." |
| name | 빈 값 | "이름을 입력해주세요." |
| content | 빈 값 | "본문을 입력해주세요." |
| subject | EMAIL/PUSH인데 빈 값 | "제목을 입력해주세요." |
| subject | PUSH + 50자 초과 | "제목은 50자 이하로 입력해주세요." |
| content | PUSH + 200자 초과 | "본문은 200자 이하로 입력해주세요." |

## 특이사항

- 로컬 상태 관리: `useLocalObservable` (MobX)
- 프리페칭 없음 (등록은 데이터 로드 불필요)
- 성공 시 응답의 `response.data.id`로 상세 페이지 이동
- `TemplateForm`은 `@cocrepo/ui` 공통 컴포넌트 (등록/수정 공유)

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, HydrationBoundary만)
- [x] _client.tsx (클라이언트 컴포넌트, observer 래핑)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
