# Object Storage Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-15
> 타입: service
> 위치: packages/be-service/src/object-storage.service/index.ts

## 역할

S3-compatible object storage를 추상화하는 인프라 서비스입니다.
`ObjectStorageService` 추상 token과 `S3CompatibleStorageService` 구현체를 함께 제공하며,
ConfigService에서 `objectStorage` 설정(provider, endpoint, bucket, credentials, apiToken, publicBaseUrl)을 읽어 S3Client를 초기화합니다.

## 의존성

| 의존 서비스/리포지토리          | 역할              |
| ------------------------------- | ----------------- |
| `ConfigService`                 | objectStorage 설정값 조회 |
| `S3Client` (@aws-sdk/client-s3) | S3-compatible 클라이언트 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|------|------|------|------|
| `putObject` | `PutObjectInput` | `Promise<PutObjectResult>` | object 업로드 후 key/publicUrl/etag 반환 |
| `deleteObject` | `key: string` | `Promise<void>` | object 삭제 |
| `getPublicUrl` | `key: string` | `string \| null` | `publicBaseUrl` 기준 public URL 계산 |

## 비즈니스 규칙

- endpoint/provider 차이는 설정으로만 흡수하고 구현체는 AWS SDK v3 하나만 사용합니다.
- `publicBaseUrl`이 없으면 `getPublicUrl()`은 `null`을 반환합니다.
- checksum이 있으면 object metadata에 `checksumSha256`로 기록합니다.
- object metadata 값에 비ASCII 문자가 포함되면 S3-compatible provider 서명 불일치를 피하기 위해 ASCII-safe percent-encoding으로 정규화합니다.
- object storage 설정이 없으면 초기화 시 에러를 발생시킵니다.
- `cloudflare-r2` provider는 region 값이 `auto`, `wnam`, `enam`, `weur`, `eeur`, `apac`, `oc` 중 하나가 아니면 `auto`로 보정합니다.

## 에러 처리

| 에러 상황     | 에러 타입 | 메시지                         |
| ------------- | --------- | ------------------------------ |
| 설정 누락 | `Error`   | "Object storage configuration is missing" |

## 권한 요구사항

- 선택한 S3-compatible provider에 대한 object put/delete 권한 필요

## 구현 체크리스트

- [x] `ObjectStorageService` 추상 token
- [x] `S3CompatibleStorageService` 구현체
- [x] `putObject` / `deleteObject` / `getPublicUrl`

## 변경 이력

| 일자       | 내용                                                                                    | 작성자               |
| ---------- | --------------------------------------------------------------------------------------- | -------------------- |
| 2026-04-08 | 한글 파일명 metadata가 Cloudflare R2 서명을 깨뜨리던 이슈를 막기 위해 비ASCII metadata 값을 ASCII-safe percent-encoding으로 정규화 | codex |
| 2026-03-15 | Cloudflare R2가 AWS region 문자열을 거부하는 런타임 이슈를 흡수하기 위해 provider 전용 region normalization(`auto`) 규칙 추가 | codex |
| 2026-03-15 | AWS 전용 업로드 서비스를 S3-compatible object storage 추상 레이어로 교체 | codex |
| 2026-02-19 | 초기 생성 (역기획)                                                                      | req-reverse-engineer |
| 2026-03-13 | `aws.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치       | codex                |
