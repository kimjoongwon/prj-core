# Inquiry Entity 기획서

> 생성일: 2026-02-25
> 수정일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/inquiry.entity.ts

## 역할

옴니채널 고객 문의를 관리하는 핵심 엔티티입니다. 문의 접수, 상태 관리, 담당자 배정, SLA 추적, 실시간 채팅 지원 등의 기능을 제공합니다. Space 기반 멀티테넌시를 지원합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| inquiryNumber | String | required, unique | - | 문의 번호 (예: INQ-2026-0225-001) |
| title | String | required | - | 문의 제목 |
| category | InquiryCategory | required | - | 문의 카테고리 |
| channel | InquiryChannel | required | - | 접수 채널 (WEB, EMAIL, CHAT, SMS, PHONE, WALK_IN) |
| source | InquirySource | required | ONLINE | 접수 유형 (ONLINE/OFFLINE) |
| status | InquiryStatus | required | NEW | 문의 상태 |
| priority | InquiryPriority | required | NORMAL | 우선순위 |
| customerId | UUID | FK, optional | - | 고객 User ID |
| assigneeId | UUID | FK, optional | - | 담당자 User ID |
| firstResponseAt | DateTime | optional | - | 첫 응답 일시 |
| resolvedAt | DateTime | optional | - | 해결 일시 |
| closedAt | DateTime | optional | - | 종료 일시 |
| slaResponseDue | DateTime | optional | - | SLA 응답 기한 |
| slaResolveDue | DateTime | optional | - | SLA 해결 기한 |
| isSlaResponseBreached | Boolean | required | false | SLA 응답 위반 여부 |
| isSlaResolveBreached | Boolean | required | false | SLA 해결 위반 여부 |
| sentiment | SentimentType | optional | - | 감정 분석 결과 |
| sentimentScore | Float | optional | - | 감정 분석 점수 (0~1) |
| aiResolutionAttempted | Boolean | required | false | AI 자동 해결 시도 여부 |
| aiResolved | Boolean | required | false | AI 자동 해결 여부 |
| isRealtimeChat | Boolean | required | false | 실시간 채팅 활성화 여부 |
| lastMessageAt | DateTime | optional | - | 마지막 메시지 일시 |
| unreadCount | Integer | required | 0 | 읽지 않은 메시지 수 (고객 기준) |
| metadata | Json | optional | - | 추가 메타데이터 (채널별 정보) |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## Enum

### InquiryCategory

| 값 | 설명 |
|-----|------|
| GENERAL | 일반 문의 |
| DELIVERY | 배송 문의 |
| PAYMENT | 결제 문의 |
| REFUND | 환불/취소 |
| PRODUCT | 상품 문의 |
| ACCOUNT | 계정 관련 |
| TECHNICAL | 기술 지원 |
| COMPLAINT | 불만/불편 |
| OTHER | 기타 |

### InquiryChannel

| 값 | 설명 |
|-----|------|
| WEB | 웹 폼 |
| EMAIL | 이메일 |
| CHAT | 실시간 채팅 |
| SMS | 문자 메시지 |
| PHONE | 전화 |
| WALK_IN | 방문 |

### InquirySource

| 값 | 설명 |
|-----|------|
| ONLINE | 온라인 (고객 직접 접수) |
| OFFLINE | 오프라인 (상담원 대리 접수) |

### InquiryStatus

| 값 | 설명 |
|-----|------|
| NEW | 신규 (미배정) |
| OPEN | 열림 (배정됨) |
| IN_PROGRESS | 처리 중 |
| WAITING_CUSTOMER | 고객 응답 대기 |
| RESOLVED | 해결됨 |
| CLOSED | 종료됨 |
| ESCALATED | 에스컬레이션 |

### InquiryPriority

| 값 | 설명 |
|-----|------|
| LOW | 낮음 |
| NORMAL | 보통 |
| HIGH | 높음 |
| URGENT | 긴급 |

### SentimentType

| 값 | 설명 |
|-----|------|
| POSITIVE | 긍정 |
| NEUTRAL | 중립 |
| NEGATIVE | 부정 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | User (customer) | N:0..1 | 고객 |
| belongsTo | User (assignee) | N:0..1 | 담당자 |
| hasMany | InquiryThread | 1:N | 문의 스레드 |
| hasMany | InquiryMessage | 1:N | 문의 메시지 |
| hasMany | InquiryParticipant | 1:N | 참여자 목록 |
| hasMany | InquiryTag | 1:N | 문의 태그 |
| hasOne | SentimentAnalysis | 1:0..1 | 감정 분석 결과 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isNew() | boolean | 신규 문의 여부 확인 |
| isOpen() | boolean | 열림 상태 여부 확인 |
| isInProgress() | boolean | 처리 중 여부 확인 |
| isResolved() | boolean | 해결됨 여부 확인 |
| isClosed() | boolean | 종료됨 여부 확인 |
| isEscalated() | boolean | 에스컬레이션 여부 확인 |
| isAssigned() | boolean | 담당자 배정 여부 확인 |
| isSlaBreached() | boolean | SLA 위반 여부 확인 |
| isRealtimeChatEnabled() | boolean | 실시간 채팅 활성화 여부 |
| canReopen() | boolean | 재오픈 가능 여부 확인 |
| assignTo(userId) | void | 담당자 배정 |
| startProgress() | void | 처리 시작 |
| markResolved() | void | 해결 완료 처리 |
| markClosed() | void | 종료 처리 |
| escalate() | void | 에스컬레이션 |
| recordFirstResponse() | void | 첫 응답 기록 |
| updateSlaStatus() | void | SLA 상태 업데이트 |
| enableRealtimeChat() | void | 실시간 채팅 활성화 |
| updateLastMessage() | void | 마지막 메시지 시간 업데이트 |
| incrementUnreadCount() | void | 읽지 않은 메시지 수 증가 |
| resetUnreadCount() | void | 읽지 않은 메시지 수 초기화 |

## 비즈니스 규칙

- 문의 번호는 날짜 기반 자동 생성 (INQ-YYYY-MMDD-NNN)
- 상태 전환: NEW → OPEN → IN_PROGRESS → WAITING_CUSTOMER ↔ RESOLVED → CLOSED
- RESOLVED 상태에서만 CLOSED로 전환 가능
- CLOSED 상태는 재오픈 불가
- 첫 응답 시 firstResponseAt 자동 설정
- 해결 시 resolvedAt 자동 설정
- SLA 위반 여부는 배치 또는 조회 시 실시간 계산
- Space 격리: 모든 조회/수정에 spaceId 조건 포함
- CHAT 채널은 자동으로 실시간 채팅 활성화 (isRealtimeChat=true)
- 실시간 채팅 시 참여자 상태를 InquiryParticipant에서 관리

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| Inquiry | CONCRETE | - | 0 (먼저) |
| InquiryThread | CONCRETE | Inquiry | 1 (병렬) |
| InquiryMessage | CONCRETE | InquiryThread | 2 |
| InquiryParticipant | CONCRETE | Inquiry, User | 1 (병렬) |
| InquiryAttachment | CONCRETE | InquiryMessage | 3 |
| InquiryTag | MATERIALIZATION | Inquiry | 1 (병렬) |
| SentimentAnalysis | MATERIALIZATION | Inquiry | 1 (병렬) |
| AIAgentLog | CONCRETE | Inquiry, InquiryMessage | 2 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| InquiryCategory | Inquiry |
| InquiryChannel | Inquiry, ChannelConfig |
| InquiryStatus | Inquiry |
| InquiryPriority | Inquiry, SLATemplate |
| InquirySource | Inquiry |
| SentimentType | Inquiry, SentimentAnalysis |
| InquiryParticipantRole | InquiryParticipant |
| SenderType | InquiryMessage |

### DTO 목록

| DTO | 타입 | Entity |
|-----|------|--------|
| CreateInquiryDto | Request | Inquiry |
| UpdateInquiryDto | Request | Inquiry |
| InquiryResponseDto | Response | Inquiry |
| InquiryListQueryDto | Request | Inquiry (목록 조회) |
| CreateInquiryMessageDto | Request | InquiryMessage |
| InquiryMessageResponseDto | Response | InquiryMessage |
| InquiryStatsDto | Response | Inquiry (통계) |

### 병렬 실행 DAG

```
Level 0: Inquiry (먼저)
    │
    ├── Level 1: InquiryThread, InquiryParticipant, InquiryTag, SentimentAnalysis (병렬)
    │     │
    │     └── Level 2: InquiryMessage
    │           │
    │           └── Level 3: InquiryAttachment
    │
    └── Level 2: AIAgentLog
```

## 구현 체크리스트

- [x] inquiry.entity.ts
- [x] inquiry-thread.entity.ts
- [x] inquiry-message.entity.ts
- [x] inquiry-participant.entity.ts (신규 - 실시간 채팅용)
- [x] inquiry-attachment.entity.ts
- [x] inquiry-tag.entity.ts
- [x] sentiment-analysis.entity.ts
- [x] ai-agent-log.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isNew/isOpen/isInProgress | 3 | 0 | 0 | 3 |
| isResolved/isClosed/isEscalated | 3 | 0 | 0 | 3 |
| isAssigned/canReopen | 2 | 0 | 1 | 3 |
| assignTo | 1 | 1 | 0 | 2 |
| markResolved/markClosed | 2 | 1 | 0 | 3 |
| isSlaBreached | 2 | 0 | 1 | 3 |
| isRealtimeChatEnabled | 2 | 0 | 0 | 2 |

### [TC-001] isAssigned - 담당자 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assigneeId가 설정된 Inquiry |
| **When** | isAssigned() 호출 |
| **Then** | true 반환 |

### [TC-002] assignTo - 담당자 배정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | NEW 상태의 Inquiry, assigneeId 없음 |
| **When** | assignTo(userId) 호출 |
| **Then** | assigneeId 설정, status=OPEN으로 변경 |

### [TC-003] markResolved - 해결 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | IN_PROGRESS 상태의 Inquiry |
| **When** | markResolved() 호출 |
| **Then** | status=RESOLVED, resolvedAt 설정 |

### [TC-004] markClosed - 종료 처리 (비정상)

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | IN_PROGRESS 상태의 Inquiry (RESOLVED 아님) |
| **When** | markClosed() 호출 |
| **Then** | 에러 발생 (RESOLVED 상태에서만 종료 가능) |

### [TC-005] isRealtimeChatEnabled - 채팅 채널

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | channel=CHAT인 Inquiry |
| **When** | isRealtimeChatEnabled() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-02-26 | 실시간 채팅 지원 필드 추가 (isRealtimeChat, lastMessageAt, unreadCount) | orch-requirement |
| 2026-02-26 | 관계에 InquiryParticipant 추가 | orch-requirement |
| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
