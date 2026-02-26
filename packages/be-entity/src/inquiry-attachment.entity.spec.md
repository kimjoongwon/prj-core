# InquiryAttachment Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/inquiry-attachment.entity.ts

## 역할

문의 메시지에 첨부된 파일을 관리하는 엔티티입니다. 이미지, 문서, 동영상 등 다양한 파일 형식을 지원하며, 실시간 채팅에서 파일 업로드/다운로드를 처리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| messageId | UUID | FK, required | - | 소속 메시지 ID |
| fileName | String | required | - | 원본 파일명 |
| fileSize | BigInt | required | - | 파일 크기 (bytes) |
| mimeType | String | required | - | MIME 타입 |
| fileType | AttachmentFileType | required | - | 파일 유형 |
| url | String | required | - | 파일 접근 URL |
| thumbnailUrl | String | optional | - | 썸네일 URL (이미지/동영상) |
| width | Integer | optional | - | 너비 (이미지/동영상) |
| height | Integer | optional | - | 높이 (이미지/동영상) |
| duration | Integer | optional | - | 재생 시간 (초, 동영상/오디오) |
| isDeleted | Boolean | required | false | 삭제 여부 |
| createdAt | DateTime | required | now() | 생성 일시 |

## Enum

### AttachmentFileType

| 값 | 설명 |
|-----|------|
| IMAGE | 이미지 (jpg, png, gif, webp) |
| VIDEO | 동영상 (mp4, webm) |
| AUDIO | 오디오 (mp3, wav) |
| DOCUMENT | 문서 (pdf, doc, docx, xls, xlsx) |
| ARCHIVE | 압축파일 (zip, rar) |
| OTHER | 기타 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | InquiryMessage | N:1 | 소속 메시지 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isImage() | boolean | 이미지 여부 |
| isVideo() | boolean | 동영상 여부 |
| isAudio() | boolean | 오디오 여부 |
| isDocument() | boolean | 문서 여부 |
| hasThumbnail() | boolean | 썸네일 존재 여부 |
| getFileExtension() | string | 파일 확장자 추출 |
| getFormattedSize() | string | 파일 크기 포맷팅 (KB, MB) |
| softDelete() | void | 소프트 삭제 |

## 비즈니스 규칙

- 최대 파일 크기: 50MB
- 이미지 최대 크기: 10MB
- 허용 MIME 타입 제한 (보안)
- 이미지/동영상은 자동 썸네일 생성
- 파일 삭제 시 S3 등 스토리지에서도 삭제
- fileName은 XSS 방지 위해 sanitization

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| InquiryAttachment | CONCRETE | InquiryMessage | 3 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| AttachmentFileType | InquiryAttachment |

## 구현 체크리스트

- [x] inquiry-attachment.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] isImage - 이미지 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | fileType=IMAGE인 첨부파일 |
| **When** | isImage() 호출 |
| **Then** | true 반환 |

### [TC-002] hasThumbnail - 썸네일 존재

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | thumbnailUrl="https://..."인 첨부파일 |
| **When** | hasThumbnail() 호출 |
| **Then** | true 반환 |

### [TC-003] getFormattedSize - 크기 포맷팅

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | fileSize=1536000 (1.5MB) |
| **When** | getFormattedSize() 호출 |
| **Then** | "1.5 MB" 반환 |

## 상위 기획서

- `packages/be-entity/src/inquiry-message.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
