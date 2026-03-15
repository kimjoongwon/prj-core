# UploadAssetDto DTO 기획서

> 생성일: 2026-03-15
> 타입: dto
> 위치: packages/be-dto/src/asset/upload-asset.dto.ts

## 역할

multipart 기반 에셋 업로드 요청에서 업로드 대상 폴더를 지정하는 최소 DTO입니다. 실제 파일 메타데이터는 업로드된 파일로부터 서버가 계산합니다.

## 필드

| 필드       | 타입     | 제약조건       | 설명                |
| ---------- | -------- | -------------- | ------------------- |
| `folderId` | `string` | required, UUID | 업로드 대상 폴더 ID |

## 비즈니스 메모

- 파일 바이너리는 `file` multipart part로 전달합니다.
- `originalName`, `mimeType`, `sizeBytes`, `storageKey`, `kind`는 서버가 업로드 파일에서 계산합니다.

## 구현 체크리스트

- [x] 업로드 대상 폴더 식별 필드 정의
- [x] Swagger/validator 결합 필드 데코레이터 적용

## 변경 이력

| 일자       | 내용                                                             | 작성자 |
| ---------- | ---------------------------------------------------------------- | ------ |
| 2026-03-15 | assets 목록 최소 upload 흐름을 위한 multipart 폴더 식별 DTO 추가 | codex  |
