# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/oidc-clients/new/page.tsx

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

## 화면 러프

### Desktop

```text
(console) layout > children
┌──────────────────────────────────────────────────────────────┐
│ OidcClientCreatePage                                         │
│ [목록으로] OIDC 클라이언트 등록                              │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 클라이언트 설정                                          │ │
│ │ 기본 정보 / 인증 설정 / Redirect URIs                    │ │
│ │ □ First-party 클라이언트  □ 권한 동의 화면 생략          │ │
│ │ submit payload: isFirstParty + gated skipConsent         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Tablet

```text
(console) layout > children
┌──────────────────────────────────────────────┐
│ [목록으로] OIDC 클라이언트 등록              │
│ ┌──────────────────────────────────────────┐ │
│ │ FormPageSurface                          │ │
│ │ First-party / Consent 카드가 2열 또는    │ │
│ │ 좁은 폭에서 1열로 전환된다.              │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Mobile

```text
(console) layout > children
┌──────────────────────────────┐
│ OIDC 클라이언트 등록          │
│ [목록으로]                    │
│ ┌──────────────────────────┐ │
│ │ 기본 정보                │ │
│ │ 인증 설정                │ │
│ │ □ First-party            │ │
│ │ □ 권한 동의 화면 생략    │ │
│ │ First-party OFF면 false  │ │
│ │ Redirect URIs / 추가 설정│ │
│ └──────────────────────────┘ │
│ [취소] [등록]                │
└──────────────────────────────┘
```

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
| 참조 layout spec | `apps/idp/web/src/app/(console)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/oidc-clients/new/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 생성 mutation과 라우팅만 담당하고 `isFirstParty`, `skipConsent`, `loginUi` 기본값을 포함한 로컬 폼 상태와 시각 조합은 `OidcClientCreatePage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `form`
- reusable target: `form`
- screen component path: `packages/fe-ui/src/screen/OidcClientCreatePage/OidcClientCreatePage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 생성 route sidecar에 Desktop/Tablet/Mobile form 화면 러프와 first-party 기반 `skipConsent` 제출 기준을 추가 | codex |
| 2026-05-09 | 생성 route-local form state에 `isFirstParty` 기본값을 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 생성 폼 상태에 공통/커스텀 로그인 화면 설정 기본값을 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 생성 폼 상태에 `skipConsent` 기본값을 추가 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `OidcClientCreatePage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-22 | parent `(console)` layout 참조와 `form` 재사용 셸 기준으로 등록 페이지 계약을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
