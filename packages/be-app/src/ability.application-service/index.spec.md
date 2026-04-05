# ability.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/ability.application-service/index.ts

## 역할

Ability 정의 조회/CRUD와 현재 로그인 사용자의 병합 권한 조회 유즈케이스를 조합하는 application service를 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityApplicationService | Ability 정의 조회/CRUD 유즈케이스 공개 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-05 | 현재 사용자용 `getMyAbilities` 유즈케이스를 복구하고 Auth/Space 컨텍스트 기반으로 병합 권한 조회를 재도입 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | Facade를 ApplicationService로 전환하고 책임을 재정의 | codex |
| 2026-03-13 | `ability.application-service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | frontend 런타임 미사용 `getMyAbilities` 유즈케이스와 UserService 의존을 제거 | codex |
