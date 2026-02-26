# InquiryMessage Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/inquiry-message.entity.ts

## 역할

문의 스레드 내 개별 메시지를 관리하는 엔티티입니다. 실시간 채팅 지원을 위해 메시지 상태(전달, 읽음) 추적, 타이핑 표시, AI/시스템 메시지 구분 등의 기능을 제공합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| threadId | UUID | FK, required | - | 소속 스레드 ID |
| inquiryId | UUID | FK, required | - | 소속 문의 ID (직접 참조) |
| senderId | UUID | FK, optional | - | 발신자 User ID (AI/SYSTEM의 경우 null) |
| senderType | SenderType | required | USER | 발신자 유형 |
| clientMessageId | String | optional | - | 클라이언트 메시지 ID (중복 방지용) |
| content | Text | required | - | 메시지 내용 |
| contentType | MessageContentType | required | TEXT | 콘텐츠 유형 |
| deliveredAt | DateTime | optional | - | 전달 완료 시간 |
| readAt | DateTime | optional | - | 읽음 확인 시간 |
| editedAt | DateTime | optional | - | 수정 일시 |
| isEdited | Boolean | required | false | 수정 여부 |
| isDeleted | Boolean | required | false | 삭제 여부 (soft delete) |
| metadata | Json | optional | - | 추가 메타데이터 (AI 신뢰도 등) |
| createdAt | DateTime | required | now() | 생성 일시 |

## Enum

### SenderType

| 값 | 설명 |
|-----|------|
| USER | 일반 사용자 (고객/담당자) |
| AI | AI 에이전트 |
| SYSTEM | 시스템 메시지 |

### MessageContentType

| 값 | 설명 |
|-----|------|
| TEXT | 텍스트 |
| HTML | HTML 콘텐츠 |
| MARKDOWN | 마크다운 |
| IMAGE | 이미지 |
| FILE | 파일 |
| SYSTEM | 시스템 알림 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | InquiryThread | N:1 | 소속 스레드 |
| belongsTo | Inquiry | N:1 | 소속 문의 |
| belongsTo | User (sender) | N:0..1 | 발신자 |
| hasMany | InquiryAttachment | 1:N | 첨부파일 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isFromUser() | boolean | 사용자 메시지 여부 |
| isFromAI() | boolean | AI 메시지 여부 |
| isFromSystem() | boolean | 시스템 메시지 여부 |
| isDelivered() | boolean | 전달 완료 여부 |
| isRead() | boolean | 읽음 여부 |
| markDelivered() | void | 전달 완료 처리 |
| markRead() | void | 읽음 처리 |
| edit(newContent) | void | 내용 수정 |
| softDelete() | void | 소프트 삭제 |

## 비즈니스 규칙

- clientMessageId로 클라이언트 중복 전송 방지
- AI/SYSTEM 메시지는 senderId가 null
- 메시지 수정 시 isEdited=true, editedAt 기록
- 소프트 삭제 시 isDeleted=true, 내용은 유지하되 표시하지 않음
- deliveredAt은 상대방에게 전달된 시점 기록
- readAt은 상대방이 읽은 시점 기록

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| InquiryMessage | CONCRETE | InquiryThread, Inquiry | 2 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| SenderType | InquiryMessage |
| MessageContentType | InquiryMessage |

## 구현 체크리스트

- [x] inquiry-message.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] isFromUser - 사용자 메시지

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | senderType=USER인 메시지 |
| **When** | isFromUser() 호출 |
| **Then** | true 반환 |

### [TC-002] isFromAI - AI 메시지

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | senderType=AI인 메시지 |
| **When** | isFromAI() 호출 |
| **Then** | true 반환 |

### [TC-003] markDelivered - 전달 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | deliveredAt=null인 메시지 |
| **When** | markDelivered() 호출 |
| **Then** | deliveredAt=현재시간 |

### [TC-004] markRead - 읽음 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | readAt=null인 메시지 |
| **When** | markRead() 호출 |
| **Then** | readAt=현재시간 |

### [TC-005] edit - 메시지 수정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 기존 메시지 |
| **When** | edit("새 내용") 호출 |
| **Then** | content="새 내용", isEdited=true, editedAt 기록 |

### [TC-006] softDelete - 소프트 삭제

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 기존 메시지 |
| **When** | softDelete() 호출 |
| **Then** | isDeleted=true |

## 상위 기획서

- `packages/be-entity/src/inquiry-thread.entity.spec.md`
- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
