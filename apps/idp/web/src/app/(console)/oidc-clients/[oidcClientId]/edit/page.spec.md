# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/edit/page.tsx

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
| @tanstack/react-query | 기능 구현 의존성 |
| next/headers | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 화면 러프

### Desktop

```text
(console) layout > children
┌──────────────────────────────────────────────────────────────┐
│ OidcClientEditPage                                           │
│ [상세로 돌아가기] OIDC 클라이언트 수정                       │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 클라이언트 설정                                          │ │
│ │ Client ID readonly                                       │ │
│ │ ☑ First-party 클라이언트  ☑ 권한 동의 화면 생략          │ │
│ │ OFF 변경 시 skipConsent=false로 제출                     │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Tablet

```text
(console) layout > children
┌──────────────────────────────────────────────┐
│ [상세로 돌아가기] OIDC 클라이언트 수정       │
│ ┌──────────────────────────────────────────┐ │
│ │ FormPageSurface                          │ │
│ │ 조회 완료 전: 로딩 카드                  │ │
│ │ 조회 실패: 목록 복귀 CTA                 │ │
│ │ 조회 성공: first-party/consent form      │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Mobile

```text
(console) layout > children
┌──────────────────────────────┐
│ OIDC 클라이언트 수정          │
│ [상세로 돌아가기]             │
│ ┌──────────────────────────┐ │
│ │ Client ID readonly       │ │
│ │ 기본 정보 / 인증 설정    │ │
│ │ ☑ First-party            │ │
│ │ ☑ 권한 동의 화면 생략    │ │
│ │ First-party OFF면 해제   │ │
│ └──────────────────────────┘ │
│ [취소] [저장]                │
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
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 상세 조회, 저장 mutation, 라우팅만 담당하고 `isFirstParty`, `skipConsent`, `loginUi`를 포함한 시각 조합과 로컬 폼 상태는 `OidcClientEditPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `form`
- reusable target: `form`
- screen component path: `packages/fe-ui/src/screen/OidcClientEditPage/OidcClientEditPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 수정 route sidecar에 Desktop/Tablet/Mobile form 화면 러프와 first-party off 시 consent 해제 기준을 추가 | codex |
| 2026-05-09 | OIDC 클라이언트 수정 폼 초기화와 제출 계약에 `isFirstParty` 전달 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 수정 폼 초기화와 제출 계약에 공통/커스텀 로그인 화면 설정 전달 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 수정 폼 초기화와 제출 계약에 `skipConsent` 전달 추가 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `OidcClientEditPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-22 | parent `(console)` layout 참조와 `form` 재사용 셸 기준으로 수정 페이지 계약을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
