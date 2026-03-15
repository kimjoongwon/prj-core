# config.type util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/core/api/src/config/config.type.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `@cocrepo/type` re-export | core-api config 타입 재노출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `AwsConfig` re-export를 `ObjectStorageConfig`/`ObjectStorageProvider`로 교체 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
