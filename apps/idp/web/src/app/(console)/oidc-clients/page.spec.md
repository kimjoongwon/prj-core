# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/oidc-clients/page.tsx

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
┌────────────────────────────────────────────────────────────────────┐
│ OidcClientListPage                                                 │
│ OIDC 클라이언트                                  [+ 클라이언트 등록] │
│                                                                    │
│ [Client ID 또는 이름으로 검색...]                                  │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Client ID │ 이름 │ 인증 방식 │ Grant │ 신뢰 구분 │ Consent     │ │
│ │ admin-web │ ...  │ secret    │ code  │ First     │ 동의 생략   │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Tablet

```text
(console) layout > children
┌──────────────────────────────────────────────┐
│ OIDC 클라이언트                [+ 등록]       │
│ [검색 입력은 toolbar 첫 줄에 유지]            │
│ ┌──────────────────────────────────────────┐ │
│ │ DataGrid table                           │ │
│ │ 신뢰 구분 / Consent 컬럼 포함             │ │
│ │ 좁은 폭에서는 table wrapper가 overflow를  │ │
│ │ 처리한다.                                │ │
│ └──────────────────────────────────────────┘ │
│ 총 N건                         [pagination] │
└──────────────────────────────────────────────┘
```

### Mobile

```text
(console) layout > children
┌──────────────────────────────┐
│ OIDC 클라이언트               │
│ 시스템에 등록된 client 관리   │
│ [+ 클라이언트 등록]           │
│                              │
│ [검색...]                    │
│ ┌──────────────────────────┐ │
│ │ DataGrid table           │ │
│ │ Client ID / 신뢰 구분 /  │ │
│ │ Consent 컬럼은 가로 스캔 │ │
│ │ 가능해야 한다.           │ │
│ └──────────────────────────┘ │
│ 총 N건                       │
│ [pagination]                 │
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
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/oidc-clients/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 OIDC 클라이언트 조회, query state, 신규 등록 라우팅만 담당하고 first-party/consent 상태 컬럼을 포함한 시각 조합은 `OidcClientListPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/OidcClientListPage/OidcClientListPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 목록 route sidecar에 Desktop/Tablet/Mobile responsive 화면 러프와 DataGrid 컬럼 노출 기준을 추가 | codex |
| 2026-05-09 | 목록 화면에서 first-party 신뢰 구분과 consent 표시/생략 상태를 확인하는 계약을 추가 | codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure screen에 직접 주입하도록 정리 | codex |
| 2026-04-29 | 검색 E2E가 DataGrid 검색 입력의 Enter 커밋 계약을 검증하도록 갱신 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `OidcClientListPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-22 | parent `(console)` layout 참조와 content-level `Surface` 기준으로 OIDC 목록 계약을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 OIDC 클라이언트 목록 E2E lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
