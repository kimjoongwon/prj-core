# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/page.tsx

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
| `@cocrepo/api/idp/auth` | 세션 검증 |
| `@cocrepo/ui` | `DetailPage`, `DetailSectionCard`, `PageTitleBar` |
| `next/navigation` | 검증 완료 후 route 이동 |

## 동작 흐름

1. 루트 경로 진입 시 세션 검증 API를 호출합니다.
2. 검증 중에는 전체 화면 로딩 상태만 유지합니다.
3. 유효 세션이면 `/dashboard`로, 아니면 `/auth/login`으로 이동합니다.

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
| 참조 layout spec | `apps/idp/web/src/app/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 `detail/view`의 detail shell 안에서 루트 진입 판별과 리다이렉트용 로딩 콘텐츠만 담당합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- page component path: `packages/fe-ui/src/page/SessionCheckPage/SessionCheckPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | `SessionCheckPage` 경로를 page 폴더 기반 sidecar 구조에 맞게 갱신 | codex |
| 2026-03-25 | `SessionCheckPage`로 시각 구성을 page 레이어로 이동하고 route page를 thin container로 정리 | codex |
| 2026-03-22 | 루트 리다이렉트 로딩 상태를 `DetailPage`/`DetailSectionCard` 기반 detail/view shell로 정리 | codex |
| 2026-03-21 | 루트 진입 page를 `_client.tsx` 없는 단일 CSR 리다이렉트로 정리하고 계약을 detail/view 기준으로 보정 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-20 | 루트 진입 시 비인증 사용자를 `/auth/login`으로 바로 보내도록 인증 쿠키 분기 추가 | codex |
