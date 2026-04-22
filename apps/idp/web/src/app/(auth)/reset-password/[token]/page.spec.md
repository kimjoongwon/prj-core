# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(auth)/reset-password/[token]/page.tsx

## 역할

이 파일은 page 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|

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

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(auth)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(auth)/reset-password/[token]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.
- route page가 `ResetPasswordRoutePageState` class를 선언하고 `makeAutoObservable`로 `state.resetPasswordPage` 구조를 소유합니다.
- route page에서는 `useLocalObservable(() => new ResetPasswordRoutePageState())`로 인스턴스화하고 step/token/passwordRules와 `resetPasswordForm` slice를 함께 pure page로 주입합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `form`
- reusable target: `form`
- page component path: `packages/fe-ui/src/page/ResetPasswordPage/ResetPasswordPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | route page state를 `ResetPasswordRoutePageState` class + `makeAutoObservable` + `useLocalObservable(() => new ...)` 패턴으로 정리 | codex |
| 2026-04-22 | route page가 `resetPasswordPage` 자체를 `useLocalObservable` 기반 observable slice로 소유하도록 기준을 보강 | codex |
| 2026-04-22 | `fe-page-builder` 기준에 맞춰 route state root를 `resetPasswordPage`로 두고 form slice를 `resetPasswordForm`으로 정리 | codex |
| 2026-04-22 | 비밀번호 재설정 field state와 제출/완료 상태를 route page가 소유하고 pure page에 주입하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-26 | `ResetPasswordPage` 경로를 page 폴더 기반 sidecar 구조에 맞게 갱신 | codex |
| 2026-03-25 | `ResetPasswordPage`로 시각 구성을 page 레이어로 이동하고 토큰 검증/제출 핸들러를 route page가 소유하도록 정리 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
