# OIDC Interaction 페이지 기획서

> 생성일: 2026-03-03
> 수정일: 2026-03-23
> 타입: page
> 경로: `/interaction/[uid]`

## 재사용 우선 점검

| 후보 | 판단 | 이유 |
|------|------|------|
| `useGetInteraction(uid)` | 재사용 | interaction 타입 분기와 만료 판별의 기준 데이터로 충분하다. |
| `IdpInteractionPage` | 재사용 | loading/error/login/consent의 page-level 시각 구성을 page 레이어로 위임할 수 있다. |
| 기존 `AuthCard` 기반 full-screen 콘텐츠 구조 | 재사용 불가 | route layout이 shell을 소유해야 하므로 page 내부에서 full-screen 카드 레이아웃을 계속 중첩하면 책임이 충돌한다. |

## 사용자 시나리오

1. 사용자는 외부 클라이언트에서 보호된 리소스 접근 후 OIDC interaction URL로 이동한다.
2. 페이지는 `uid` 기준으로 interaction 상태를 조회한다.
3. `type === "login"`이면 primary panel 안에 로그인 안내와 입력 폼을 노출한다.
4. 로그인 실패 시 입력한 이메일은 유지하고, 실패 사유에 따라 잔여 시도/잠금 복구 액션을 가장 가까운 위치에서 안내한다.
5. `type === "consent"`이면 권한 요청 정보를 보여주고 승인/거절을 진행한다.
6. interaction이 만료되었거나 찾을 수 없으면 현재 요청을 복구할 수 없는 상태임을 설명하고 `/auth/login` 재진입 액션을 제공한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| route shell | `(auth)/layout.tsx` | 전체 배경, 중앙 배치, support copy, primary panel frame |
| loading | `IdpInteractionPage` loading mode | interaction 데이터 조회 중 |
| login | `IdpInteractionPage` + `OidcLoginForm` | 로그인 폼, 에러, recovery action |
| consent | `IdpInteractionPage` + `OidcConsentPanel` | scope 승인/거절 |
| error | `IdpInteractionPage` error mode | 만료/오류 상태 설명과 복구 액션 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| `isLoading` | interaction 조회 중 | 중앙 spinner + "인증 정보를 확인하는 중..." |
| `login` | 로그인 필요 | 서비스명, 로그인 목적, 입력 폼, 복구 링크 |
| `consent` | 권한 동의 필요 | scope 목록, 승인/거절 버튼 |
| `expired` | 400/404 만료 또는 유효하지 않은 UID | 만료 안내, `/auth/login` 재진입 CTA |
| `error` | 기타 오류 | 일반 오류 메시지, 이전 페이지 또는 안전한 복귀 CTA |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 페이지 진입 | `useGetInteraction(uid)` | interaction type, client, prompt, dev mode 조회 |
| 로그인 제출 | `useSubmitLogin` | `IdpLogin`에서 위임 수행 |
| interaction 중단 | `useAbortInteraction` | `IdpLogin` 또는 `IdpConsent`에서 위임 수행 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| interaction 조회 성공 | `type` 값에 따라 `IdpLogin` 또는 `IdpConsent` 렌더링 |
| interaction 만료 오류 | `/auth/login`으로 안전하게 복귀 |
| 일반 오류 상태 CTA | 가능한 경우 `history.back()`, 불가 시 안전한 로그인 진입점으로 복귀 |

## 훅 및 하위 Feature 구성

| 항목 | 위치 | 역할 |
|------|------|------|
| `useGetInteraction` | `@cocrepo/api/idp/interaction` | interaction 데이터 조회 |
| `IdpInteractionPage` | `packages/fe-ui/src/page/IdpInteractionPage/IdpInteractionPage.tsx` | 상태별 page-level 시각 구성 |
| `OidcLoginForm` | `packages/fe-ui/src/form/OidcLoginForm/` | 로그인 폼 widget |
| `OidcConsentPanel` | `packages/fe-ui/src/form/OidcConsentPanel/` | 권한 동의 widget |

## 특이사항

- `page.tsx`는 interaction type 분기와 복구 흐름만 소유하고, 실제 form layout 세부는 하위 feature/widget spec을 따른다.
- 로그인 branch는 이번 재기획의 1차 대상이며, 동일 shell 계약을 비밀번호 찾기/재설정/에러 페이지에도 확장한다.
- 에러 상태에서도 사용자가 "무엇을 해야 하는지"를 즉시 이해할 수 있도록 기술적인 오류 문구보다 복구 행동을 우선 배치한다.

## 구현 체크리스트

- [ ] interaction loading/error/login/consent 상태 문구를 재기획안과 동기화
- [ ] `IdpLogin`이 route shell 내부 콘텐츠만 렌더링하도록 계약 정리
- [ ] 만료/오류 복귀 액션을 단일 정책으로 정리

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(auth)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(auth)/interaction/[uid]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`, full-screen auth shell |

- `page.tsx`는 route shell이 제공하는 primary panel 내부 콘텐츠만 담당합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `form`
- reusable target: `form`
- page component path: `packages/fe-ui/src/page/IdpInteractionPage/IdpInteractionPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | `IdpInteractionPage` 경로를 page 폴더 기반 sidecar 구조에 맞게 갱신 | codex |
| 2026-03-25 | `IdpInteractionPage`를 도입해 loading/error/login/consent 시각 구성을 page 레이어로 이동하고 route page는 API/handler wiring만 담당하도록 정리 | codex |
| 2026-03-23 | 로그인 UX 재기획에 맞춰 interaction page의 상태 분기, route shell 소비 계약, 복구 UX 기준을 구체화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | 존재하지 않는 계정 로그인 실패 시나리오를 공통 실패 처리 계약(에러 배너 또는 로그인 폼 재표시) 기준으로 정렬 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 E2E 시나리오 lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
