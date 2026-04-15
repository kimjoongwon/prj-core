# providers ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: apps/admin/web/src/app/providers.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Providers | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/abilities | 기능 구현 의존성 |
| @cocrepo/store | AppStoreProvider, useStore 사용 |
| @cocrepo/type | AbilityApiResponse, AbilityRule 타입 사용 |
| @cocrepo/ui | DesignSystemProvider 사용 |
| @cocrepo/hook/nuqs | Nuqs Adapter 사용 |
| @tanstack/react-query | QueryClientProvider 사용 |
| mobx-react-lite | observer 사용 |
| next/navigation | useRouter 사용 |
| react | ReactNode, useEffect 사용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Ability bootstrap이 로딩 중 `manage all` fallback을 주입하지 않고, 오류/빈 응답 시 빈 규칙으로 수렴하도록 정리 | codex |
| 2026-03-23 | nuqs Adapter 의존을 @cocrepo/hook/nuqs 브리지로 전환 | codex |
| 2026-03-14 | AbilityStore bootstrap effect가 매 렌더 새 함수에 반응하지 않도록 `useStore` 기반의 안정적 store 참조로 변경 | codex |
| 2026-03-13 | `@cocrepo/api` root import를 split subpath import로 전환 | codex |
| 2026-03-06 | AbilityProvider(@cocrepo/hook) 의존을 제거하고 AppStore AbilityStore bootstrap 방식으로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
