# IdpLogin Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-03-23
> 타입: feature
> 위치: packages/fe-ui/src/feature/idp/IdpLogin/

## 역할

OIDC interaction의 로그인 branch를 담당하는 feature입니다.
로그인 제출과 interaction 중단 API를 연결하되, route shell이나 full-screen 레이아웃은 소유하지 않습니다.
이 feature의 목표는 "왜 로그인해야 하는지"와 "다음 행동이 무엇인지"를 최소 정보로 명확하게 전달하는 것입니다.

## 재사용 우선 점검

| 후보 | 판단 | 이유 |
|------|------|------|
| `useSubmitLogin`, `useAbortInteraction` | 재사용 | 인증 프로토콜과 redirect 처리 계약이 이미 맞다. |
| `OidcLoginForm` | 개선 후 재사용 | 폼 로직과 에러 타입은 유지 가능하지만, 현재는 `AuthCard`에 과도하게 의존해 shell 책임이 섞여 있다. |
| `packages/fe-ui/src/page/LoginPage/LoginPage.tsx` | 재사용 불가 | 구형 state binding 기반이고 잠금/복구/OIDC client context를 지원하지 않는다. |

## 사용자 가치

- 사용자는 어떤 서비스에 로그인하는지 즉시 이해할 수 있어야 합니다.
- 실패 시 "다시 해보라" 수준이 아니라 잔여 시도, 잠금, 비밀번호 재설정 등 실제 복구 경로를 바로 알아야 합니다.
- 취소 액션은 존재하되 primary CTA를 방해하지 않도록 시각적 우선순위를 낮춥니다.

## 화면 구성

| 영역 | 구성 | 설명 |
|------|------|------|
| identity header | 서비스 로고/이름, 짧은 설명 | 현재 인증 대상과 맥락 전달 |
| form body | 이메일, 비밀번호, 로그인 상태 유지 | 핵심 입력 |
| recovery row | 비밀번호 찾기, 취소 | 보조 행동 |
| alert area | 실패/잠금/DEV 모드 안내 | 제출 직전 맥락과 복구 행동 연결 |

## 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 기본 | 첫 진입 | 서비스명 + 입력 폼 + 보조 링크 |
| 제출 중 | 로그인 mutation 진행 | primary button loading, 중복 제출 방지 |
| 실패 | 잘못된 자격 증명 | 이메일 유지, 에러/잔여 시도 배너 |
| 일시 잠금 | 실패 횟수 초과 | 잠금 배너 + 비밀번호 재설정 CTA |
| 영구 잠금 | 관리자 개입 필요 | 강한 경고 tone + 재설정/문의 안내 |
| DEV 모드 | 개발 환경 | 자동 입력 사실을 낮은 우선순위 warning으로 고지 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api/idp/interaction` > `useSubmitLogin` | 로그인 제출 |
| API | `@cocrepo/api/idp/interaction` > `useAbortInteraction` | interaction 중단 |
| API Type | `@cocrepo/api/idp/interaction` > `LoginErrorDto` | 로그인 에러 응답 |
| Library | `axios` > `AxiosError` | 에러 응답 캐스팅 |
| Widget | `OidcLoginForm` | 실제 폼 UI와 상태 표시 |

## Props

```typescript
interface IdpLoginProps {
  uid: string;
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  isDev?: boolean;
}
```

## 이벤트

| 이벤트 | 발생 조건 | 동작 |
|--------|----------|------|
| `handleSubmit` | 로그인 폼 제출 | `useSubmitLogin` 호출 후 성공 시 redirect, 실패 시 구조화된 에러 반환 |
| `handleAbort` | 취소 클릭 | `useAbortInteraction` 호출 후 redirect |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `OidcLoginForm` | form | 로그인 입력, 상태 배너, recovery action |

## 구현 체크리스트

- [ ] feature가 route shell이나 배경 wrapper를 직접 소유하지 않음
- [ ] 로그인 성공/실패/중단 redirect 흐름이 유지됨
- [ ] `clientName`, `logoUri`, `isDev`가 UI 우선순위에 맞게 노출됨
- [ ] 보조 액션이 primary CTA보다 과하게 강조되지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | 비교 대상 `LoginPage` 경로를 page 폴더 규칙에 맞게 갱신 | codex |
| 2026-03-23 | 로그인 UX 재기획에 맞춰 feature 책임을 API orchestration으로 재정의하고 shell/폼 책임 분리를 명시 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
