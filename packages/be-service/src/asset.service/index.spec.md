# Asset Service 기획서

> 생성일: 2026-03-15
> 타입: service
> 위치: packages/be-service/src/asset.service/index.ts

## 역할

현재 선택된 Space 범위 안에서 에셋 목록/상세/업로드/이동/삭제를 처리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할                     |
| ---------------------- | ------------------------ |
| `AssetsRepository`     | 에셋 조회/생성/이동/삭제 |
| `FoldersRepository`    | 대상 폴더 검증           |
| `ObjectStorageService` | 파일 바이너리 object 업로드/삭제 |
| `SpaceContext`         | 현재 요청 Space 식별     |

## 메서드

| 메서드         | 설명                                                 |
| -------------- | ---------------------------------------------------- |
| `getAssets`    | 현재 Space의 에셋 목록과 totalCount 반환             |
| `getAssetById` | 현재 Space 소유 에셋 상세 조회                       |
| `uploadAsset`  | 선택 폴더에 파일을 업로드하고 에셋 메타데이터를 생성 |
| `moveAsset`    | 현재 Space 내부 폴더 이동                            |
| `deleteAsset`  | 현재 Space 소유 에셋 삭제                            |

## 비즈니스 규칙

- `X-Space-ID`가 없으면 요청을 거부합니다.
- 목록/상세는 현재 선택된 Space의 활성 에셋만 노출합니다.
- 업로드는 현재 Space 안의 활성 폴더에만 허용하고, MIME 타입으로 에셋 kind를 결정합니다.
- multipart 업로드에서 비 ASCII 파일명이 latin1 모지바케로 들어오면 UTF-8 파일명으로 복원한 뒤 저장/응답합니다.
- 업로드 성공 시 object storage에 파일을 저장하고 storageKey/checksum을 계산해 상태를 `READY`로 저장합니다.
- 폴더 이동은 현재 Space 안의 활성 폴더로만 허용합니다.
- 동일 폴더 재이동 요청은 `400`으로 거부합니다.
- 삭제는 object storage 삭제가 성공해야 DB 삭제를 진행합니다.

## 변경 이력

| 일자       | 내용                                                                                  | 작성자 |
| ---------- | ------------------------------------------------------------------------------------- | ------ |
| 2026-04-08 | multipart `originalname` 모지바케를 UTF-8 파일명으로 복원하는 정규화 규칙을 추가      | codex  |
| 2026-03-15 | `AwsService` 의존을 제거하고 공용 `ObjectStorageService` 기반 업로드/삭제 흐름으로 전환 | codex  |
| 2026-03-15 | assets 남은 범위를 위해 multipart upload 처리와 S3 업로드/메타데이터 생성 흐름을 추가 | codex  |
| 2026-03-15 | admin assets 목록/상세 복구를 위한 AssetService 신규 추가                             | codex  |
| 2026-04-14 | AssetService의 필수 Space 입력 안내를 x-space-id header 기준으로 갱신 | codex |
