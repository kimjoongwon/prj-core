# casl-ability.factory util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/casl/casl-ability.factory.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| CaslAbilityFactory | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | space context가 없을 때 첫 tenant를 fallback으로 사용하도록 규칙을 명시 | codex |
| 2026-04-06 | polymorphic GrantsRepository 대신 RoleGrantsRepository/UserGrantsRepository를 주입받도록 갱신 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | lint 에러 대응을 위한 `buildUserContext` 타입 안정화 처리 | codex |
| 2026-04-14 | CASL 현재 tenant 해석 설명을 selectedSpace cookie 대신 x-space-id header 기준으로 갱신 | codex |
