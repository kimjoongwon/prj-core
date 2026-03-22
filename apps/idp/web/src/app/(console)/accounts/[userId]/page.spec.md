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
| `@cocrepo/api/idp/idp-accounts` | 계정 상세 조회, 활성 상태 전환, 실패 횟수 초기화 |
| `@cocrepo/api/idp/auth` | 잠금 해제, 비밀번호 강제 변경, 세션 무효화 |
| `@cocrepo/ui` | `DetailPage`, `DetailSection`, `ConfirmModal` 등 상세 본문 조합 |

## 동작 흐름

1. 계정 상세 데이터를 조회하고 잠금/세션/비밀번호 액션 mutation을 준비합니다.
2. 로딩/없음/정상 상태를 `DetailPage`와 `DetailSectionCard` 조합으로 분기합니다.
3. 보안 정보와 관리 액션을 읽기 전용 detail 본문으로 렌더링합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `DetailPage` + `PageTitleBar` | 계정 이름/이메일과 목록 복귀 액션 |
| 보안 정보 | `DetailSectionCard` + `DetailSection` | 잠금 상태, 로그인 실패 횟수, 마지막 로그인, 가입일 |
| 관리 액션 | `DetailSectionCard` + `ConfirmModal` | 잠금 해제, 비밀번호 강제 변경, 세션 무효화 |

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
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 `feature/detail/view`의 detail shell 안에서 계정 읽기 전용 본문과 관리 액션만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `feature/detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 계정 상세를 `DetailPage`/`DetailSectionCard` 기반 detail/view shell로 정리하고 spec 의존성을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 상세 페이지 E2E lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
