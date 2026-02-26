# InquiryThread Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/inquiry-thread.entity.ts

## 역할

문의 내 대화 스레드를 관리하는 엔티티입니다. 하나의 문의에 여러 스레드가 존재할 수 있으며, 각 스레드는 독립적인 대화 흐름을 가집니다. 실시간 채팅 시 스레드 단위로 참여자를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| inquiryId | UUID | FK, required | - | 소속 문의 ID |
| title | String | optional | - | 스레드 제목 (주제) |
| status | ThreadStatus | required | ACTIVE | 스레드 상태 |
| createdBy | UUID | FK, required | - | 스레드 생성자 User ID |
| lastMessageAt | DateTime | optional | - | 마지막 메시지 일시 |
| lastMessagePreview | String | optional | - | 마지막 메시지 미리보기 (100자) |
| messageCount | Integer | required | 0 | 메시지 수 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| closedAt | DateTime | optional | - | 종료 일시 |

## Enum

### ThreadStatus

| 값 | 설명 |
|-----|------|
| ACTIVE | 활성 |
| RESOLVED | 해결됨 |
| CLOSED | 종료됨 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Inquiry | N:1 | 소속 문의 |
| hasMany | InquiryMessage | 1:N | 스레드 메시지 |
| hasMany | InquiryParticipant | 1:N | 스레드 참여자 |
| belongsTo | User (createdBy) | N:1 | 생성자 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isActive() | boolean | 활성 상태 여부 |
| isResolved() | boolean | 해결됨 여부 |
| isClosed() | boolean | 종료됨 여부 |
| markResolved() | void | 해결 처리 |
| markClosed() | void | 종료 처리 |
| incrementMessageCount() | void | 메시지 수 증가 |
| updateLastMessage(preview) | void | 마지막 메시지 정보 업데이트 |

## 비즈니스 규칙

- 하나의 문의에 여러 스레드 생성 가능
- ACTIVE 상태에서만 새 메시지 작성 가능
- 스레드 종료 시 참여자 연결 해제
- 마지막 메시지 미리보기는 100자로 제한

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| InquiryThread | CONCRETE | Inquiry | 1 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| ThreadStatus | InquiryThread |

## 구현 체크리스트

- [x] inquiry-thread.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] isActive - 활성 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | status=ACTIVE인 스레드 |
| **When** | isActive() 호출 |
| **Then** | true 반환 |

### [TC-002] markResolved - 해결 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | ACTIVE 상태의 스레드 |
| **When** | markResolved() 호출 |
| **Then** | status=RESOLVED |

### [TC-003] updateLastMessage - 메시지 업데이트

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 스레드 존재 |
| **When** | updateLastMessage("안녕하세요") 호출 |
| **Then** | lastMessagePreview="안녕하세요", lastMessageAt=현재시간 |

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
