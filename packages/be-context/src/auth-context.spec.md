# auth-context util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-context/src/auth-context.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthContext | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Nest DI가 `ClsService`를 주입할 수 있도록 패키지 빌드가 decorator metadata를 유지해야 한다는 런타임 전제를 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
