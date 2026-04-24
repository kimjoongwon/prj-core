# useAbilities util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/fe-hook/src/useAbilities.ts

## 역할

이 파일은 앱/route가 소유한 권한 query 결과를 Ability bootstrap에서 사용하기 쉬운 안정적인 shape으로 정규화합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UseAbilitiesOptions | 앱/route에서 주입하는 권한 목록, loading/error, disabled 상태 계약 |
| UseAbilitiesReturn | Ability bootstrap에서 소비하는 정규화된 반환 계약 |
| useAbilities | API, React Query, Next 라우터를 직접 import하지 않고 주입된 권한 상태만 정규화하는 hook |

## 동작 메모

- 권한 API 호출과 pathname 기반 skip 판정은 사용하는 앱/route가 소유합니다.
- `isDisabled`가 `true`이면 loading/error를 닫고 빈 권한 배열을 반환합니다.
- 이 hook은 `@cocrepo/api`, `@tanstack/react-query`, `next/navigation`에 의존하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | 권한 API/React Query/Next 라우터 직접 의존을 제거하고 사용하는 곳에서 결과를 주입받는 정규화 hook으로 변경 | codex |
| 2026-03-13 | `AbilityResponseDto`, `customInstance` 의존을 root barrel에서 `@cocrepo/api/core/*` subpath로 전환 | codex |
| 2026-03-06 | AbilityProvider 기준 설명을 제거하고 App Store Ability bootstrap 기준으로 문서화 정정 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
