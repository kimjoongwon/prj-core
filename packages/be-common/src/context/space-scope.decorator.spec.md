# space-scope.decorator util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/context/space-scope.decorator.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceScope | 공개 계약 요소 |
| SPACE_SCOPE_KEY | 공개 계약 요소 |
| OnlyMySpace | 공개 계약 요소 |
| AccessibleSpaces | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-04-14 | CURRENT scope 설명을 selectedSpace cookie 대신 x-space-id header 기준으로 정리 | codex |
