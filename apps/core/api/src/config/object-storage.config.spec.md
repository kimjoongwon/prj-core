# object-storage.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/core/api/src/config/object-storage.config.ts

## 역할

S3-compatible object storage 설정을 검증하고 `objectStorage` namespace로 등록합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 비즈니스 규칙

- 필수 env는 `OBJECT_STORAGE_PROVIDER`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`, `OBJECT_STORAGE_REGION`, `OBJECT_STORAGE_BUCKET`입니다.
- 선택 env는 `OBJECT_STORAGE_API_TOKEN`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_PUBLIC_BASE_URL`, `OBJECT_STORAGE_FORCE_PATH_STYLE`입니다.
- `OBJECT_STORAGE_API_TOKEN`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_PUBLIC_BASE_URL`, `OBJECT_STORAGE_FORCE_PATH_STYLE`의 공백 값은 미설정으로 정규화합니다.
- `OBJECT_STORAGE_PUBLIC_BASE_URL`은 trailing slash를 제거해 저장합니다.
- provider는 `aws-s3`, `backblaze-b2`, `cloudflare-r2` 중 하나만 허용합니다.
- `backblaze-b2`는 `OBJECT_STORAGE_FORCE_PATH_STYLE`가 비어 있으면 기본값 `true`를 사용합니다.
- `OBJECT_STORAGE_ENDPOINT`는 origin-only URL이어야 하며, bucket path가 섞이면 origin으로 정규화하고 그 외 path/query/hash는 설정 오류로 거부합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | B2 path-style 기본값과 endpoint origin normalization 규칙을 추가해 S3 signature mismatch 가능성을 줄임 | codex |
| 2026-03-15 | 로컬 프로젝트 env 키를 `OBJECT_STORAGE_ACCESS_KEY`/`OBJECT_STORAGE_SECRET_KEY`/`OBJECT_STORAGE_API_TOKEN` 규약에 맞춰 정리 | codex |
| 2026-03-15 | AWS 전용 config를 S3-compatible `objectStorage` namespace로 교체 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
