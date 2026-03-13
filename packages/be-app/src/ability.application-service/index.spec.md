# ability.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/ability.application-service/index.ts

## 역할

Ability 유즈케이스를 조합하는 application service를 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityApplicationService | User/Ability 조합 유즈케이스 공개 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | Facade를 ApplicationService로 전환하고 책임을 재정의 | codex |
| 2026-03-13 | `ability.application-service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
