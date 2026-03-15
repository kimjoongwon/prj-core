# config.types util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-type/src/config.types.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AppConfig | 공개 계약 요소 |
| ObjectStorageProvider | 공개 계약 요소 |
| ObjectStorageConfig | 공개 계약 요소 |
| SMTPConfig | 공개 계약 요소 |
| CorsConfig | 공개 계약 요소 |
| AppleConfig | 공개 계약 요소 |
| AuthConfig | 공개 계약 요소 |
| DatabaseConfig | 공개 계약 요소 |
| FacebookConfig | 공개 계약 요소 |
| FileConfig | 공개 계약 요소 |
| GoogleConfig | 공개 계약 요소 |
| MailConfig | 공개 계약 요소 |
| TwitterConfig | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | object storage 설정 타입에 선택 필드 `apiToken`을 추가하고 env 키 규약을 access/secret key 기준으로 정리 | codex |
| 2026-03-15 | AWS 전용 설정 타입을 S3-compatible `ObjectStorageConfig`/`ObjectStorageProvider`로 교체 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
