# InquiryStore 기획서

> 생성일: 2026-02-25
> 수정일: 2026-02-26
> 타입: store
> 위치: packages/fe-store/src/stores/inquiryStore.ts

## 역할

문의 관리와 관련된 UI 상태를 관리합니다. 문의 목록 필터, 선택된 문의, 답변 작성 상태, AI 초안 생성 상태, 실시간 채팅 상태 등을 관리합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| currentInquiryId | string \| null | null | 현재 조회 중인 문의 ID |
| currentThreadId | string \| null | null | 현재 선택된 스레드 ID |
| selectedInquiryIds | Set<string> | new Set() | 목록에서 선택된 문의 ID 목록 |
| filterStatus | InquiryStatus \| null | null | 필터: 상태 |
| filterChannel | InquiryChannel \| null | null | 필터: 채널 |
| filterCategory | InquiryCategory \| null | null | 필터: 카테고리 |
| filterPriority | InquiryPriority \| null | null | 필터: 우선순위 |
| filterAssigneeId | string \| null | null | 필터: 담당자 ID |
| searchKeyword | string | "" | 검색어 |
| isReplyFormOpen | boolean | false | 답변 작성 폼 열림 여부 |
| replyContent | string | "" | 작성 중인 답변 내용 |
| isGeneratingDraft | boolean | false | AI 초안 생성 중 여부 |
| isKnowledgeBaseModalOpen | boolean | false | 지식베이스 검색 모달 열림 여부 |
| isMetaEditModalOpen | boolean | false | 메타 정보 수정 모달 열림 여부 |
| page | number | 1 | 현재 페이지 번호 |
| pageSize | number | 20 | 페이지당 항목 수 |
| messages | InquiryMessage[] | [] | 실시간 메시지 목록 |
| participants | InquiryParticipant[] | [] | 실시간 참여자 목록 |
| isWebSocketConnected | boolean | false | WebSocket 연결 여부 |
| isTyping | boolean | false | 현재 사용자 타이핑 중 여부 |
| typingUsers | Map<string, boolean> | new Map() | 타이핑 중인 사용자 목록 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| hasSelection | boolean | selectedInquiryIds.size > 0 |
| selectionCount | number | selectedInquiryIds.size |
| isViewingInquiry | boolean | currentInquiryId !== null |
| hasActiveFilters | boolean | filterStatus \|\| filterChannel \|\| filterCategory \|\| filterPriority \|\| filterAssigneeId \|\| searchKeyword |
| filterParams | object | API 호출용 필터 파라미터 객체 |
| unreadCount | number | messages.filter(m => !m.readAt).length |
| onlineParticipants | InquiryParticipant[] | participants.filter(p => p.isOnline) |
| isAnyoneTyping | boolean | typingUsers.size > 0 |
| typingUserNames | string[] | 타이핑 중인 사용자 이름 목록 |

## 액션 (Action)

### 문의 관리

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setCurrentInquiry | inquiryId: string \| null | 현재 문의 설정 |
| setCurrentThread | threadId: string \| null | 현재 스레드 설정 |
| selectInquiry | inquiryId: string | 문의 선택 (토글) |
| selectAllInquiries | inquiryIds: string[] | 전체 선택 |
| clearSelection | - | 선택 초기화 |

### 필터 관리

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setFilterStatus | status: InquiryStatus \| null | 상태 필터 설정 |
| setFilterChannel | channel: InquiryChannel \| null | 채널 필터 설정 |
| setFilterCategory | category: InquiryCategory \| null | 카테고리 필터 설정 |
| setFilterPriority | priority: InquiryPriority \| null | 우선순위 필터 설정 |
| setFilterAssignee | assigneeId: string \| null | 담당자 필터 설정 |
| setSearchKeyword | keyword: string | 검색어 설정 |
| clearAllFilters | - | 모든 필터 초기화 |
| setPage | page: number | 페이지 설정 |
| setPageSize | size: number | 페이지 크기 설정 |

### 답변 작성

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| openReplyForm | - | 답변 폼 열기 |
| closeReplyForm | - | 답변 폼 닫기 |
| setReplyContent | content: string | 답변 내용 설정 |
| setGeneratingDraft | isGenerating: boolean | AI 초안 생성 상태 설정 |

### 모달 관리

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| openKnowledgeBaseModal | - | 지식베이스 모달 열기 |
| closeKnowledgeBaseModal | - | 지식베이스 모달 닫기 |
| openMetaEditModal | - | 메타 수정 모달 열기 |
| closeMetaEditModal | - | 메타 수정 모달 닫기 |

### 실시간 채팅 (신규)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setWebSocketConnected | connected: boolean | WebSocket 연결 상태 설정 |
| addMessage | message: InquiryMessage | 새 메시지 추가 |
| updateMessage | messageId: string, updates: Partial<InquiryMessage> | 메시지 업데이트 |
| removeMessage | messageId: string | 메시지 삭제 |
| setMessages | messages: InquiryMessage[] | 메시지 목록 설정 |
| markMessageRead | messageId: string | 메시지 읽음 처리 |
| setParticipants | participants: InquiryParticipant[] | 참여자 목록 설정 |
| addParticipant | participant: InquiryParticipant | 참여자 추가 |
| removeParticipant | userId: string | 참여자 제거 |
| updateParticipant | userId: string, updates: Partial<InquiryParticipant> | 참여자 상태 업데이트 |
| setTyping | userId: string, isTyping: boolean | 타이핑 상태 설정 |
| startTyping | - | 현재 사용자 타이핑 시작 |
| stopTyping | - | 현재 사용자 타이핑 중지 |

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
| fetchInquiries | params | GET /api/v1/inquiries | 캐시 업데이트 |
| fetchInquiryDetail | inquiryId | GET /api/v1/inquiries/{id} | 상세 데이터 업데이트 |
| fetchInquiryMessages | inquiryId | GET /api/v1/inquiries/{id}/messages | messages 상태 업데이트 |
| updateInquiryStatus | inquiryId, status | PATCH /api/v1/inquiries/{id} | 상태 변경, 캐시 무효화 |
| updateInquiryPriority | inquiryId, priority | PATCH /api/v1/inquiries/{id} | 우선순위 변경 |
| updateInquiryAssignee | inquiryId, assigneeId | PATCH /api/v1/inquiries/{id} | 담당자 변경 |
| generateAIDraft | inquiryId | POST /api/v1/inquiries/{id}/draft | 초안 내용을 replyContent에 설정 |
| sendMessage | inquiryId, content, attachments | POST /api/v1/inquiries/{id}/messages | 메시지 전송, 목록 새로고침 |
| searchKnowledgeBase | keyword | GET /api/v1/knowledge-base | 검색 결과 반환 |

## WebSocket 이벤트 핸들러 (신규)

| 이벤트 | 핸들러 | 동작 |
|--------|--------|------|
| inquiry:message:new | handleNewMessage | addMessage 호출 |
| inquiry:message:updated | handleMessageUpdated | updateMessage 호출 |
| inquiry:message:deleted | handleMessageDeleted | removeMessage 호출 |
| inquiry:message:delivered | handleMessageDelivered | updateMessage로 deliveredAt 설정 |
| inquiry:message:read | handleMessageRead | updateMessage로 readAt 설정 |
| inquiry:typing | handleTypingStatus | setTyping 호출 |
| inquiry:participant:joined | handleParticipantJoined | addParticipant 호출 |
| inquiry:participant:left | handleParticipantLeft | removeParticipant 호출 |
| inquiry:participant:online | handleParticipantOnline | updateParticipant로 isOnline=true |
| inquiry:participant:offline | handleParticipantOffline | updateParticipant로 isOnline=false |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | 앱 전체 상태 접근 |
| AuthStore | 현재 사용자 정보 (담당자 배정 시) |
| WebSocketStore | WebSocket 연결 관리 (선택적) |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| inquiryStore | InquiryStore |

## 구현 체크리스트

- [x] inquiryStore.ts
- [x] RootStore에 등록
- [x] 타입 정의
- [ ] WebSocket 이벤트 핸들러
- [ ] 타이핑 상태 관리 (5초 자동 해제)
- [ ] 단위 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest

### 테스트 커버리지

| Action / Computed | Happy Path | Error Path | Edge Case | 합계 |
|-------------------|:----------:|:----------:|:---------:|:----:|
| setFilterStatus | 1 | 0 | 1 | 2 |
| setFilterChannel | 1 | 0 | 0 | 1 |
| clearAllFilters | 1 | 0 | 0 | 1 |
| selectInquiry | 2 | 0 | 0 | 2 |
| hasActiveFilters | 2 | 0 | 0 | 2 |
| filterParams | 1 | 0 | 1 | 2 |
| addMessage | 1 | 0 | 1 | 2 |
| setTyping | 2 | 0 | 0 | 2 |
| onlineParticipants | 1 | 0 | 0 | 1 |

### [TC-001] setFilterStatus - 필터 설정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | filterStatus=null |
| **When** | setFilterStatus("IN_PROGRESS") 호출 |
| **Then** | filterStatus="IN_PROGRESS", page=1 (초기화) |

### [TC-002] clearAllFilters - 모든 필터 초기화

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 여러 필터가 설정됨 |
| **When** | clearAllFilters() 호출 |
| **Then** | 모든 필터 null, searchKeyword="", page=1 |

### [TC-003] selectInquiry - 선택 토글

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedInquiryIds=Set() |
| **When** | selectInquiry("inq-1") 호출 |
| **Then** | selectedInquiryIds=Set(["inq-1"]) |

### [TC-004] selectInquiry - 선택 해제

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedInquiryIds=Set(["inq-1"]) |
| **When** | selectInquiry("inq-1") 호출 |
| **Then** | selectedInquiryIds=Set() |

### [TC-005] hasActiveFilters - 필터 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | filterStatus="NEW" |
| **When** | hasActiveFilters 접근 |
| **Then** | true |

### [TC-006] hasActiveFilters - 필터 없음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 모든 필터 null, searchKeyword="" |
| **When** | hasActiveFilters 접근 |
| **Then** | false |

### [TC-007] addMessage - 메시지 추가

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | messages=[] |
| **When** | addMessage({ id: "msg-1", content: "안녕하세요" }) 호출 |
| **Then** | messages=[{ id: "msg-1", content: "안녕하세요" }] |

### [TC-008] setTyping - 타이핑 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | typingUsers=Map() |
| **When** | setTyping("user-1", true) 호출 |
| **Then** | typingUsers=Map({"user-1": true}), isAnyoneTyping=true |

### [TC-009] onlineParticipants - 온라인 참여자

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | participants=[{isOnline:true}, {isOnline:false}] |
| **When** | onlineParticipants 접근 |
| **Then** | [{isOnline:true}] |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-02-26 | 실시간 채팅 상태 추가 (messages, participants, isWebSocketConnected, isTyping, typingUsers) | orch-requirement |
| 2026-02-26 | WebSocket 이벤트 핸들러 추가 | orch-requirement |
| 2026-02-26 | InquiryStore 구현 완료 (fe-store-builder) | fe-store-builder |
