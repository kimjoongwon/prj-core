# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/accounts/page.tsx

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
| @cocrepo/api/idp/auth | 잠긴 계정 잠금 해제 mutation |
| @cocrepo/api/idp/idp-accounts | 계정 목록 조회 및 상세 캐시 무효화 |
| @cocrepo/ui | `AccountListPage`, query input, `useMetaDataGridQueryStates` |
| @tanstack/react-query | 목록/상세 캐시 무효화 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.
- 기본 목록은 서버의 최신 생성 순과 페이지네이션을 그대로 따르므로, 테스트/검증은 특정 고정 이메일보다 현재 첫 페이지 응답 기준으로 확인합니다.
- 잠긴 계정 행에서만 `잠금 해제` 액션을 노출하며, 확인 후 실패 횟수와 잠금 상태를 함께 초기화합니다.
- 목록 컬럼 헤더는 field preset 기준으로 `활성`, `잠금 상태`, `실패 횟수`, `최종 로그인` 라벨을 사용합니다.
- 상세 이동 E2E는 행 액션 셀의 실제 링크(`/accounts/:userId`)를 기준으로 첫 계정 상세 진입을 검증합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(console)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/accounts/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 계정 목록 조회, query state, 잠금 해제 mutation만 담당하고 시각 조합은 `AccountListPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/AccountListPage/AccountListPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `AccountListPage` pure page와 thin route container 구조로 전환하고 page component path를 반영 | codex |
| 2026-03-28 | 목록 E2E가 실제 컬럼 라벨(`활성`)과 상세 링크 계약(`/accounts/:userId`)을 따르도록 검증 기준을 보강 | codex |
| 2026-03-23 | 목록 그리드에서 잠긴 계정을 직접 잠금 해제할 수 있는 row action + 확인 모달 계약 추가 | codex |
| 2026-03-22 | `PageTitleBar` + content-level `Surface` 기준으로 목록 페이지 계약을 동기화 | codex |
| 2026-03-23 | 첫 페이지 계정 검증 기준을 고정 시드 이메일에서 현재 API 응답 기준으로 정리 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 목록 페이지 E2E lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
