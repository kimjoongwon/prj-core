# index widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/form/index.ts

## 역할

폼 입력, 생성/수정 모달, 폼 섹션을 `widget/form` 하위에서 단일 진입점으로 공개합니다.
도메인 하위에 흩어져 있던 form 계열 widget도 이 배럴로 통합합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `FormPage` | form route 콘텐츠용 page wrapper |
| `FormPageSurface` | form 본문 surface wrapper |
| `FormSection` | form 섹션 배치 wrapper |
| `FormSectionCard` | form 섹션 surface wrapper |
| `LoginForm` | 로그인 폼 위젯 export |
| `ForgotPasswordForm` | 비밀번호 찾기 폼 위젯 export |
| `OidcClientForm` | OIDC 클라이언트 폼 위젯 export |
| `OidcConsentPanel` | OIDC 동의 패널 export |
| `OidcLoginForm` | OIDC 로그인 폼 위젯 export |
| `PromptForm` | 프롬프트 입력 폼 위젯 export |
| `ResetPasswordForm` | 비밀번호 재설정 폼 위젯 export |
| `AbilityFormModal` | 권한 규칙 생성/수정 폼 모달 export |
| `CategoryFormSection` | 카테고리 편집 폼 섹션 export |
| `GroupFormSection` | 그룹 편집 폼 섹션 export |
| `InquiryForm` | 문의 접수 폼 export |
| `InquiryReplyForm` | 문의 답변 입력 폼 export |
| `RoleFormModal` | 역할 생성/수정 폼 모달 export |
| `TemplateForm` | 템플릿 폼 위젯 export |
| `UserFormWidget` | 이용자 생성/수정 폼 위젯 export |
| `VariableEditTable` | 변수 인라인 편집 폼 테이블 export |
| `VariableInputForm` | 변수 값 입력 폼 export |

## 의존성

| 모듈 | 용도 |
|------|------|
| ./LoginForm/LoginForm | 기능 구현 의존성 |
| ./ForgotPasswordForm | 기능 구현 의존성 |
| ./FormPage | 기능 구현 의존성 |
| ./FormPageSurface | 기능 구현 의존성 |
| ./FormSection | 기능 구현 의존성 |
| ./FormSectionCard | 기능 구현 의존성 |
| ./OidcClientForm | 기능 구현 의존성 |
| ./OidcConsentPanel | 기능 구현 의존성 |
| ./OidcLoginForm | 기능 구현 의존성 |
| ./PromptForm | 기능 구현 의존성 |
| ./ResetPasswordForm | 기능 구현 의존성 |
| ./AbilityFormModal | 기능 구현 의존성 |
| ./CategoryFormSection | 기능 구현 의존성 |
| ./GroupFormSection | 기능 구현 의존성 |
| ./InquiryForm | 기능 구현 의존성 |
| ./InquiryReplyForm | 기능 구현 의존성 |
| ./RoleFormModal | 기능 구현 의존성 |
| ./TemplateForm | 기능 구현 의존성 |
| ./UserFormWidget | 기능 구현 의존성 |
| ./VariableEditTable | 기능 구현 의존성 |
| ./VariableInputForm | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 도메인별 form widget과 `Inquiry*Form`, `PromptForm`, `Variable*Form`를 `widget/form` 배럴로 통합 | codex |
| 2026-03-21 | form page primitive 치환용 thin wrapper를 추가 | codex |
| 2026-03-21 | `UserFormWidget` 소유를 `widget/form`으로 이동하고 form 공개 계약에 추가 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
