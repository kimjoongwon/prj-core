# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/accounts/[userId]/page.tsx

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
| `@cocrepo/api/idp/idp-accounts` | 계정 상세 조회, 접근 권한 부여 폼 조회/부여, 활성 상태 전환, 실패 횟수 초기화 |
| `@cocrepo/api/idp/auth` | 잠금 해제, 비밀번호 강제 변경, 세션 무효화 |
| `@cocrepo/ui` | `AccountDetailPage` pure screen 조합 |
| `@tanstack/react-query` | 상세 캐시 무효화 |
| `next/navigation` | 상세 라우팅과 목록 복귀 |

## 동작 흐름

1. 계정 상세 데이터를 조회하고 잠금/세션/비밀번호 액션 mutation을 준비합니다.
2. 접근 권한 부여 폼 bootstrap을 조회해 Space/Role 선택 기본값과 옵션을 구성합니다.
3. 로딩/없음/정상 상태를 `DetailPage`와 `DetailSectionCard` 조합으로 분기합니다.
4. 보안 정보, 관리 액션, 접근 권한 목록과 권한 부여 폼을 detail 본문으로 렌더링합니다.
5. 접근 권한 부여 성공 시 계정 상세와 권한 부여 폼 query를 무효화합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.
- 상세 진입 E2E는 목록 행 액션 셀의 실제 링크(`/accounts/:userId`)를 기준으로 첫 계정 상세 페이지에 진입합니다.
- 접근 권한 부여 폼 옵션이 비어 있으면 권한 부여 버튼을 비활성화합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `DetailPage` + `PageTitleBar` | 계정 이름/이메일과 목록 복귀 액션 |
| 보안 정보 | `DetailSectionCard` + `DetailSection` | 잠금 상태, 로그인 실패 횟수, 마지막 로그인, 가입일 |
| 관리 액션 | `DetailSectionCard` + `ConfirmModal` | 잠금 해제, 비밀번호 강제 변경, 세션 무효화 |
| 접근 권한 | `DetailSectionCard` + `Select` | 기존 Space/Role 권한 목록과 관리자 권한 부여 폼 |

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(console)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/accounts/[userId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 계정 상세 조회, 접근 권한 부여 query/mutation, 보안 mutation, 라우팅만 담당하고 시각 조합은 `AccountDetailPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- screen component path: `packages/fe-ui/src/screen/AccountDetailPage/AccountDetailPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 접근 신청을 별도 메뉴가 아닌 계정 상세 내 Space/Role 권한 부여 흐름으로 전환하고 query/mutation/E2E 관점을 반영 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-04-08 | pure screen에서 사용하지 않는 개별 보안 action callback 전달을 제거하고 confirm modal 단일 진입점만 유지 | codex |
| 2026-03-29 | `AccountDetailPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-28 | 상세 진입 E2E가 `aria-label` 대신 실제 계정 상세 링크 계약(`/accounts/:userId`)을 사용하도록 기준을 정리 | codex |
| 2026-03-22 | `(console)` layout contract 변경에 맞춰 primitive skeleton 범위를 보정 | codex |
| 2026-03-22 | 계정 상세를 `DetailPage`/`DetailSectionCard` 기반 detail/view shell로 정리하고 spec 의존성을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 상세 페이지 E2E lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
