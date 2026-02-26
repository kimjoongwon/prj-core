# InquiryParticipant Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/inquiry-participant.entity.ts

## 역할

문의/스레드 참여자의 실시간 상태를 관리하는 엔티티입니다. 온라인/오프라인 상태, 타이핑 여부, 마지막 접속 시간 등을 추적하여 실시간 채팅 경험을 제공합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| inquiryId | UUID | FK, required | - | 소속 문의 ID |
| threadId | UUID | FK, optional | - | 소속 스레드 ID (null이면 문의 전체) |
| userId | UUID | FK, required | - | 참여자 User ID |
| role | InquiryParticipantRole | required | VIEWER | 참여자 역할 |
| isOnline | Boolean | required | false | 온라인 여부 |
| isTyping | Boolean | required | false | 타이핑 중 여부 |
| lastSeenAt | DateTime | optional | - | 마지막 접속 시간 |
| lastReadAt | DateTime | optional | - | 마지막 읽은 시간 |
| unreadCount | Integer | required | 0 | 읽지 않은 메시지 수 |
| joinedAt | DateTime | required | now() | 참여 일시 |
| leftAt | DateTime | optional | - | 나간 일시 |

## Enum

### InquiryParticipantRole

| 값 | 설명 |
|-----|------|
| CUSTOMER | 고객 (문의 작성자) |
| AGENT | 상담원 (담당자) |
| SUPERVISOR | 감독관 (모니터링) |
| VIEWER | 조회만 가능 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Inquiry | N:1 | 소속 문의 |
| belongsTo | InquiryThread | N:0..1 | 소속 스레드 |
| belongsTo | User | N:1 | 참여자 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isCustomer() | boolean | 고객 여부 |
| isAgent() | boolean | 상담원 여부 |
| isSupervisor() | boolean | 감독관 여부 |
| isOnline() | boolean | 온라인 여부 |
| isTyping() | boolean | 타이핑 중 여부 |
| goOnline() | void | 온라인 상태로 변경 |
| goOffline() | void | 오프라인 상태로 변경 |
| startTyping() | void | 타이핑 시작 |
| stopTyping() | void | 타이핑 중지 |
| markAsRead() | void | 읽음 처리 (lastReadAt, unreadCount=0) |
| incrementUnread() | void | 읽지 않은 메시지 증가 |
| leave() | void | 참여 종료 |

## 비즈니스 규칙

- 한 사용자가 동일 문의/스레드에 중복 참여 불가 (unique: inquiryId+threadId+userId)
- 온라인 상태 변경 시 lastSeenAt 자동 업데이트
- 타이핑 상태는 5초 후 자동 false (클라이언트에서 처리)
- 참여자 나간 후 재접속 시 새 Participant 생성 또는 기존 것 재활성화
- AGENT는 isAssigned=true인 문의만 참여 가능
- SUPERVISOR는 모든 문의 참여 가능 (읽기 전용)

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| InquiryParticipant | CONCRETE | Inquiry, InquiryThread, User | 1 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| InquiryParticipantRole | InquiryParticipant |

## 구현 체크리스트

- [x] inquiry-participant.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] goOnline - 온라인 상태 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isOnline=false인 참여자 |
| **When** | goOnline() 호출 |
| **Then** | isOnline=true, lastSeenAt=현재시간 |

### [TC-002] goOffline - 오프라인 상태 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isOnline=true인 참여자 |
| **When** | goOffline() 호출 |
| **Then** | isOnline=false, isTyping=false |

### [TC-003] startTyping - 타이핑 시작

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 온라인 상태인 참여자 |
| **When** | startTyping() 호출 |
| **Then** | isTyping=true |

### [TC-004] markAsRead - 읽음 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | unreadCount=5인 참여자 |
| **When** | markAsRead() 호출 |
| **Then** | lastReadAt=현재시간, unreadCount=0 |

### [TC-005] isAgent - 상담원 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | role=AGENT인 참여자 |
| **When** | isAgent() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`
- `packages/be-entity/src/inquiry-thread.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
