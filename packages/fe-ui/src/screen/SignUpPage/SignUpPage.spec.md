# SignUpPage

## 목적

idp 공개 회원가입 플로우의 순수 Page 컴포넌트입니다. route page가 소유한 MobX 상태, Orval mutation 핸들러, Space 선택 데이터를 받아 `SignUpForm`에 주입합니다.

## Props

| 이름 | 설명 |
|------|------|
| `state.signUpForm` | 이메일, 비밀번호, 이름, 전화번호, 주소, 선택 Space, 검증/제출 상태 |
| `spaceOptions` | 회원가입 가능한 Space select 옵션 |
| `isSpacesLoading` | Space 목록 로딩 상태 |
| `isSpacesError` | Space 목록 조회 실패 상태 |
| `onSubmitSignUpForm` | 회원가입 요청 submit 핸들러 |
| `onChange*` | route-local 상태 변경 핸들러 |
| `onClickUseAnotherEmailButton` | 발송 완료 후 다른 이메일로 다시 가입하기 핸들러 |
| `loginHref` | 로그인 화면 링크 |

## Composition

- `SignUpPage`는 `<form>` submit boundary만 소유합니다.
- 입력 UI와 성공/오류 상태 표현은 `SignUpForm`이 담당합니다.
- API 호출, `x-space-id` header 설정, validation 판단, address/spaceId payload 구성은 route page가 담당합니다.

## 상태 렌더링

| 상태 | 렌더링 |
|------|--------|
| Space 로딩 | Space select 비활성화 및 로딩 설명 표시 |
| Space 오류 | danger `AlertBanner` |
| Space 없음 | warning `AlertBanner` |
| 입력 오류 | 필드별 `errorMessage` |
| 제출 중 | submit 버튼 loading |
| 제출 완료 | 인증 메일 발송 완료 안내와 선택 Space 표시 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-06 | 회원가입 pure screen 신규 작성 | Codex |
| 2026-05-06 | address와 선택 Space payload 책임 명시 | Codex |
