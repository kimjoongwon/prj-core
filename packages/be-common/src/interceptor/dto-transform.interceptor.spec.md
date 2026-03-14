# dto-transform.interceptor util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/interceptor/dto-transform.interceptor.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| DtoTransformInterceptor | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-14 | plain `{ data, meta }` 응답에서도 `data` 필드만 DTO 변환하도록 계약을 보강 | codex |
