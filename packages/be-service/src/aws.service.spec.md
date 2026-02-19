# AWS Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/aws.service.ts

## 역할

AWS S3에 파일(이미지)을 업로드하는 인프라 서비스입니다.
`@Global()` 데코레이터로 전역 모듈에 등록되어 애플리케이션 전체에서 사용 가능합니다.
ConfigService에서 AWS 설정(region, accessKeyId, secretAccessKey, s3BucketName)을 읽어 S3Client를 초기화합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `ConfigService` | AWS 설정값 조회 |
| `S3Client` (@aws-sdk/client-s3) | AWS S3 클라이언트 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `uploadToS3` | `fileName: string, file: unknown, ext: string` | `Promise<string>` | S3에 파일 업로드 후 URL 반환 |

## 비즈니스 규칙

- 업로드된 파일 URL 형식: `https://s3.{AWS_REGION}.amazonaws.com/{S3_BUCKET}/{fileName}`
- ContentType은 `image/{ext}` 형태로 자동 설정
- AWS 설정이 없으면 초기화 시 에러 발생

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| AWS 설정 누락 | `Error` | "AWS configuration is missing" |

## 권한 요구사항

- AWS IAM S3 업로드 권한 필요 (인프라 레벨)

## 구현 체크리스트

- [x] aws.service.ts
- [x] `@Global()` 데코레이터
- [x] `@Injectable()` 데코레이터
- [x] 전역 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
