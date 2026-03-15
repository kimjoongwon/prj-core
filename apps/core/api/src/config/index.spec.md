# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: apps/core/api/src/config/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| appConfig | app namespace loader |
| authConfig | auth namespace loader |
| corsConfig | cors namespace loader |
| objectStorageConfig | objectStorage namespace loader |
| redisConfig | redis namespace loader |
| smtpConfig | smtp namespace loader |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `awsConfig` export를 제거하고 `objectStorageConfig` export로 교체 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
