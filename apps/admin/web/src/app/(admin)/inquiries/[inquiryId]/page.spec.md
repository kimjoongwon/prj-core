# 문의 상세 페이지 기획서

> 생성일: 2026-02-25
> 수정일: 2026-03-03
> 타입: page
> 경로: /inquiries/[inquiryId]

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← 목록으로     배송 문의相关问题                                  [수정] [삭제]  │
│ 문의 상세 정보를 확인하고 답변을 작성합니다.                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ 📋 문의 정보                          │ │ 🏷️ 메타 정보                       │ │
│ │                                       │ │                                   │ │
│ │ 문의번호: INQ-2026-0225-001          │ │ 상태: [진행중 ▼]                  │ │
│ │ 제목: 배송 일정 문의                  │ │ 우선순위: [높음 ▼]                │ │
│ │ 채널: 💬 채팅 (실시간)               │ │ 카테고리: [배송 ▼]                │ │
│ │ 접수일: 2026.02.25 14:30             │ │ 담당자: [김상담 ▼]                │ │
│ │                                       │ │ 태그: [+ 추가] #배송 #긴급        │ │
│ │ 💡 감정 분석: 😐 중립 (신뢰도 85%)   │ │                                   │ │
│ │ 🟢 온라인: 홍길동, 김상담            │ │                                   │ │
│ └───────────────────────────────────────┘ └───────────────────────────────────┘ │
│                                                                                 │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ 📞 고객 정보                          │ │ 👥 참여자 (3)                      │ │
│ │                                       │ │                                   │ │
│ │ 홍길동 (hong@example.com)            │ │ 🟢 홍길동 (고객) - 타이핑 중...   │ │
│ │ 📱 010-1234-5678  |  📅 가입일: 2025   │ │ 🟢 김상담 (담당자)                │ │
│ │ 📋 문의 이력: 5건                     │ │ ⚪ 이감독 (감독관)                 │ │
│ └───────────────────────────────────────┘ └───────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 💬 실시간 채팅                                              🟢 연결됨      │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 👤 홍길동 (고객)                                    2026.02.25 14:30    │ │ │
│ │ │ 안녕하세요, 2월 20일에 주문한 상품 배송 일정이 어떻게 되나요?          │ │ │
│ │ │ 주문번호는 ORD-2026-0220-123입니다.                                    │ │ │
│ │ │ 📎 첨부: 주문확인서.pdf                                 ✓✓ 읽음        │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 👨‍💼 김상담 (담당자)                                  2026.02.25 15:00    │ │ │
│ │ │ 안녕하세요, 고객님. 주문하신 상품은 현재 배송 준비 중입니다.            │ │ │
│ │ │ 2월 27일 출고 예정이며, 2월 28~29일 수령 가능합니다.                    │ │ │
│ │ │                                                                         │ │ │
│ │ │ [AI 초안 사용됨 ✨]                                       ✓✓ 읽음      │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 👤 홍길동 (고객)                                    2026.02.25 15:30    │ │ │
│ │ │ 네, 확인 감사합니다. 혹시 배송지 변경이 가능할까요?      ✓ 전달됨      │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🔵 홍길동님이 타이핑 중입니다...                                        │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ ✏️ 답변 작성                                                                 │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │                                                                         │ │ │
│ │ │ 답변을 입력하세요...                                                    │ │ │
│ │ │                                                                         │ │ │
│ │ │                                                                         │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ [🤖 AI 초안 생성] [📚 지식베이스 참조]  [😊😊]   [📎 첨부]    [전송]       │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⏱️ SLA 추적                                                                  │ │
│ │                                                                             │ │
│ │ 첫 응답: 30분 (목표: 1시간) ✅   |   경과 시간: 1시간 30분 (목표: 4시간) ⚠️ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 문의 상세 페이지에 접근하여 문의 내용과 대화 이력을 확인한다
2. 실시간 채팅 연결 상태를 확인한다 (연결됨/끊김)
3. 참여자 목록에서 온라인/오프라인 상태와 타이핑 중인 사용자를 확인한다
4. 새 메시지가 실시간으로 화면에 표시된다
5. 메시지 전달/읽음 상태를 확인한다 (✓ 전달됨, ✓✓ 읽음)
6. AI 채우기 버튼을 클릭하여 답변 content 초안을 생성한다
7. 지식베이스 참조를 통해 관련 문서를 검색하고 답변에 활용한다
8. 답변을 작성하고 전송하여 고객에게 실시간 응답한다
9. 감정 분석 결과를 확인하여 고객 상태를 파악한다
10. SLA 추적 정보를 확인하여 응답/해결 시간을 모니터링한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| 페이지 래퍼 | `Page` | - |
| 헤더 | `PageTitleBar` | - |
| 상단/중단 배치 | `VStack` + `HStack` | - |
| 문의 정보 카드 | InquiryInfoCard | `packages/fe-ui/src/widget/InquiryInfoCard/index.spec.md` |
| 메타 정보 패널 | InquiryMetaPanel | `packages/fe-ui/src/widget/InquiryMetaPanel/index.spec.md` |
| 빠른 수정 + AiForm | AiForm + title/category/priority 편집 | `packages/fe-ui/src/feature/AiForm/index.spec.md` |
| 고객 정보 카드 | CustomerInfoCard | `packages/fe-ui/src/widget/CustomerInfoCard/index.spec.md` |
| 참여자 목록 | ParticipantList | `packages/fe-ui/src/widget/ParticipantList/index.spec.md` |
| 실시간 채팅 | RealtimeChatPanel | `packages/fe-ui/src/feature/RealtimeChatPanel/index.spec.md` |
| 답변 작성 | InquiryReplyForm | `packages/fe-ui/src/feature/InquiryReplyForm/index.spec.md` |
| SLA 추적 | SLATracker | `packages/fe-ui/src/widget/SLATracker/index.spec.md` |

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 문의 상세 본문 전체를 raised 레이어로 묶고 실시간 채팅/메타 편집 블록을 동일 배경 위에 정렬 |
| SectionSurface 대상 | 상단 정보 블록, 고객/참여자 블록, AI 메타 추천, 메타 수정, 실시간 채팅, SLA 추적 |
| SectionSurface padding | 기본 패딩 유지 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 문의 데이터 로딩 중 | 스켈레톤 UI |
| 조회 | 문의 상세 조회 완료 | 전체 UI 표시 |
| 메타 편집 bootstrap 로딩 | 수정 폼 bootstrap 조회 중 | 빠른 수정 섹션 로딩 |
| WebSocket 연결 중 | 실시간 채팅 연결 중 | 연결 상태 인디케이터 |
| WebSocket 연결됨 | 실시간 채팅 활성 | 🟢 연결됨 |
| WebSocket 끊김 | 실시간 채팅 비활성 | 🔴 연결 끊김, 재연결 버튼 |
| 메타 수정 중 | 상태/우선순위 등 수정 | 인라인 편집 |
| 답변 작성 중 | 답변 입력 중 | 폼 활성화, 타이핑 브로드캐스트 |
| AI 초안 생성 중 | AI 초안 생성 로딩 | 로딩 인디케이터 |
| 전송 중 | 답변 전송 중 | 버튼 비활성화 |
| 에러 | API 에러 발생 | 에러 메시지 |

## API 호출

| 시점 | API | 캐싱 |
|------|-----|------|
| 진입 시 | GET /api/v1/inquiries/[inquiryId]/form/update | staleTime: 0 |
| 진입 시 | GET /api/v1/inquiries/[inquiryId] | staleTime: 0 |
| 진입 시 | GET /api/v1/inquiries/[inquiryId]/messages | staleTime: 0 |
| 진입 시 | GET /api/v1/inquiries/[inquiryId]/participants | staleTime: 0 |
| 상태 변경 시 | PATCH /api/v1/inquiries/[inquiryId] | invalidate |
| AI 폼 채움 | POST /api/v1/inquiries/form/ai-fill | no-cache |
| 답변 전송 | POST /api/v1/inquiries/[inquiryId]/messages | WebSocket으로 실시간 |
| 참여 | POST /api/v1/inquiries/[inquiryId]/participants/join | - |

## WebSocket 연결

### 연결 시점

- 페이지 진입 시 자동 WebSocket 연결
- `inquiry:join` 이벤트 전송

### 연결 해제 시점

- 페이지 이탈 시 `inquiry:leave` 이벤트 전송
- WebSocket 연결 해제

### 이벤트 핸들링

| 이벤트 | 핸들러 | 동작 |
|--------|--------|------|
| `inquiry:message:new` | handleNewMessage | 메시지 목록에 추가, 스크롤 |
| `inquiry:message:delivered` | handleDelivered | 전달 상태 업데이트 |
| `inquiry:message:read` | handleRead | 읽음 상태 업데이트 |
| `inquiry:typing` | handleTyping | 타이핑 표시 업데이트 |
| `inquiry:participant:joined` | handleJoined | 참여자 목록 추가 |
| `inquiry:participant:left` | handleLeft | 참여자 목록 제거 |
| `inquiry:participant:online` | handleOnline | 온라인 상태로 변경 |
| `inquiry:participant:offline` | handleOffline | 오프라인 상태로 변경 |
| `inquiry:status:changed` | handleStatusChanged | 문의 상태 업데이트 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBack | `/inquiries` 페이지로 이동 |
| onChangeStatus | 문의 상태 변경 API 호출 |
| onChangePriority | 우선순위 변경 API 호출 |
| onChangeAssignee | 담당자 변경 API 호출 |
| onClickGenerateDraft | AI Fill API 호출(`selectedPaths=["content"]`), 결과를 답변 폼에 입력 |
| onFillMetaWithAi | 상세 상단 빠른 수정 섹션에서 title/category/priority patch 생성 |
| onSubmitMeta | 빠른 수정 필드를 PATCH로 저장 |
| onClickSearchKnowledge | 지식베이스 검색 모달 열기 |
| onAttachFile | 파일 선택 다이얼로그 열기 |
| onSendInquiryMessage | WebSocket으로 메시지 전송 |
| onTypingStart | `inquiry:typing:start` 이벤트 전송 |
| onTypingStop | `inquiry:typing:stop` 이벤트 전송 |
| onClickEdit | 문의 수정 페이지로 이동 |
| onClickDelete | 삭제 확인 모달 표시 |
| onClickReconnectButton | WebSocket 재연결 |

## L5-L12 레이어 기획

### L5: 화면 구조 (레이아웃)

```
페이지 헤더 영역 (title, description, actions)
├── TopSection (2-column grid)
│   ├── InquiryInfoCard
│   │   ├── InquiryNumber
│   │   ├── Title
│   │   ├── Channel
│   │   ├── CreatedAt
│   │   ├── SentimentBadge
│   │   └── OnlineParticipants
│   └── InquiryMetaPanel
│       ├── StatusSelect
│       ├── PrioritySelect
│       ├── CategorySelect
│       ├── AssigneeSelect
│       └── TagInput
├── QuickEditSection
│   ├── AiForm (mode=UPDATE)
│   ├── TitleInput
│   ├── CategorySelect
│   ├── PrioritySelect
│   └── SaveButton
├── MiddleSection (2-column grid)
│   ├── CustomerInfoCard
│   │   ├── CustomerName
│   │   ├── ContactInfo
│   │   └── InquiryHistory
│   └── ParticipantList
│       └── ParticipantItem[] (online status, typing)
├── RealtimeChatPanel
│   ├── ConnectionStatus
│   ├── MessageList
│   │   └── MessageItem[] (sender, content, timestamp, status)
│   └── TypingIndicator
├── InquiryReplyForm
│   ├── ReplyTextarea
│   ├── AIActions
│   │   ├── GenerateDraftButton
│   │   └── KnowledgeBaseButton
│   ├── AttachmentButton
│   └── SendButton
└── SLATracker
    ├── FirstResponseProgress
    └── ResolutionProgress
```

### L6: 데이터 흐름 (API 호출)

```
1. Client-side 초기 조회
   - GET /api/v1/inquiries/[inquiryId]/form/update
   - GET /api/v1/inquiries/[inquiryId]
   - GET /api/v1/inquiries/[inquiryId]/messages
   - GET /api/v1/inquiries/[inquiryId]/participants

2. Client-side
   - React Query 캐시 관리
   - WebSocket 실시간 메시지 수신
   - 상태 변경 시 invalidate

3. WebSocket Events
   - inquiry:join (진입)
   - inquiry:message:new (수신)
   - inquiry:typing:start/stop (송신)
   - inquiry:leave (이탈)
```

### L7: 인터랙션 (이벤트)

| 인터랙션 | 트리거 | 동작 |
|----------|--------|------|
| 메시지 전송 | Button click | WebSocket 전송 + 화면 추가 |
| AI 채움(답변) | Button click | `/form/ai-fill` 호출 + content patch 적용 |
| AI 채움(메타) | Button click | `/form/ai-fill` 호출 + title/category/priority patch 적용 |
| 타이핑 시작 | Input focus | WebSocket 이벤트 전송 |
| 타이핑 중지 | 3초 무입력 | WebSocket 이벤트 전송 |
| 상태 변경 | Select change | API 호출 + invalidate |
| 참여자 초대 | Button click | API 호출 |
| 재연결 | Button click | WebSocket 재연결 |

### L8: Pure UI 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| ConnectionStatus | ui/ | WebSocket 연결 상태 (🟢🟡🔴) |
| MessageItem | ui/ | 개별 메시지 버블 |
| MessageStatus | ui/ | 전달/읽음 상태 표시 (✓, ✓✓) |
| TypingIndicator | ui/ | 타이핑 중 표시 |
| SentimentBadge | ui/ | 감정 분석 배지 |
| ParticipantItem | ui/ | 참여자 상태 아이템 |
| SLAProgressBar | ui/ | SLA 진행 바 |

### L9: Widget 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| InquiryInfoCard | widgets/ | 문의 정보 카드 |
| InquiryMetaPanel | widgets/ | 메타 정보 편집 패널 |
| CustomerInfoCard | widgets/ | 고객 정보 카드 |
| ParticipantList | widgets/ | 참여자 목록 |
| SLATracker | widgets/ | SLA 추적 위젯 |

### L10: Feature 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| RealtimeChatPanel | feature/ | 실시간 채팅 + 페이지 로컬 state 연동 |
| InquiryReplyForm | feature/ | 답변 작성 + AI 기능 (페이지 핸들러 주입) |

### L11: Store 연결

| Store | 사용 필드/액션 |
|-------|----------------|
| Page Local State | currentInquiryId, messages, participants, isWebSocketConnected, isTyping, typingUsers, replyContent, isGeneratingDraft |
| Page Local State (액션) | setCurrentInquiry, addMessage, updateMessage, setParticipants, setTyping, setWebSocketConnected, setReplyContent |

### L12: 테스트 케이스

> 구현 도구: Playwright (E2E)

#### 테스트 커버리지

| 시나리오 | Happy Path | Error Path | Edge Case | 합계 |
|---------|:----------:|:----------:|:---------:|:----:|
| 문의 조회 | 1 | 1 | 0 | 2 |
| WebSocket 연결 | 2 | 1 | 1 | 4 |
| 실시간 메시지 | 2 | 0 | 1 | 3 |
| 상태 변경 | 2 | 1 | 0 | 3 |
| AI 초안 | 1 | 1 | 0 | 2 |
| 답변 작성 | 2 | 1 | 1 | 4 |
| 타이핑 표시 | 2 | 0 | 0 | 2 |

#### [TC-001] 문의 상세 조회 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 ID로 접근 |
| **When** | 페이지 로드 |
| **Then** | 문의 정보, 스레드, SLA 정보 표시 |

#### [TC-002] WebSocket 연결 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | CHAT 채널 문의 상세 페이지 |
| **When** | 페이지 로드 완료 |
| **Then** | WebSocket 연결, 🟢 연결됨 표시 |

#### [TC-003] 실시간 메시지 수신

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | WebSocket 연결됨 |
| **When** | 상대방이 메시지 전송 |
| **Then** | 메시지가 실시간으로 화면에 추가됨 |

#### [TC-004] 타이핑 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | WebSocket 연결됨 |
| **When** | 상대방이 타이핑 시작 |
| **Then** | "홍길동님이 타이핑 중입니다..." 표시 |

#### [TC-005] 메시지 전송

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 답변 텍스트 입력됨, WebSocket 연결됨 |
| **When** | 전송 버튼 클릭 |
| **Then** | WebSocket으로 메시지 전송, 화면에 메시지 추가 |

#### [TC-006] AI 초안 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 상세 페이지 로드됨 |
| **When** | AI 초안 생성 버튼 클릭 |
| **Then** | 로딩 후 답변 폼에 초안 텍스트 입력됨 |

#### [TC-007] 상태 변경 - 해결로 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문의 상태가 진행중 |
| **When** | 상태를 해결로 변경 |
| **Then** | 상태가 업데이트되고 SLA 추적 완료 |

#### [TC-008] WebSocket 재연결

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | WebSocket 연결 끊김 |
| **When** | 재연결 버튼 클릭 |
| **Then** | WebSocket 재연결, 메시지 동기화 |

#### [TC-009] 메시지 읽음 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 메시지 전송됨, 상대방이 읽음 |
| **When** | 읽음 이벤트 수신 |
| **Then** | ✓✓ 아이콘으로 변경 |

#### [TC-010] 참여자 온라인 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 참여자 목록 표시 중 |
| **When** | 참여자가 접속/종료 |
| **Then** | 온라인/오프라인 상태 업데이트 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] hooks/useHandlers.ts
- [ ] hooks/useInquiryWebSocket.ts (WebSocket 연결 관리)
- [ ] hooks/useTypingIndicator.ts (타이핑 상태 관리)
- [ ] hooks/useMessageStatus.ts (전달/읽음 상태)
- [x] E2E 테스트 (Playwright) - `page.e2e.ts`

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/inquiries/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 조회/실시간 메시지/참여자 동기화, WebSocket 연결 관리, 메타 mutation, 삭제 modal state, 라우팅을 소유하고 `AdminInquiriesInquiryIdPage`에는 정규화된 props를 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 실시간/WebSocket/mutation/delete modal state를 route container로 이동하고 `AdminInquiriesInquiryIdPage`를 pure page props contract로 재정의 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-15 | 문의 상세 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-02-26 | 실시간 채팅 UI 추가 (WebSocket 연결 상태, 타이핑 표시, 참여자 목록) | orch-requirement |
| 2026-02-26 | 메시지 전달/읽음 상태 표시 추가 | orch-requirement |
| 2026-02-26 | WebSocket 이벤트 핸들링 추가 | orch-requirement |
| 2026-02-26 | 감정 분석 표시 추가 | orch-requirement |
| 2026-02-26 | L5-L12 레이어 기획 추가 | orch-screen-planner |
| 2026-02-27 | 상세 페이지 E2E 테스트 추가 (`page.e2e.ts`) 및 구현 체크리스트 동기화 | codex |
| 2026-02-28 | InquiryStore 의존 제거, 페이지 로컬 state 기준으로 L10/L11 갱신 | codex |
| 2026-03-01 | 상세 빠른 수정 섹션(AiForm + title/category/priority 저장) 추가, 답변 초안 생성 API를 `/form/ai-fill`로 전환 | codex |
| 2026-03-01 | 빠른 수정 폼 입력을 HeroUI Select 기반으로 정리해 Form-state 전용 입력 컴포넌트 의존 제거 | codex |
| 2026-03-01 | 빠른 수정에서 AiForm을 메타 입력 폼과 동급 위계로 분리하고 바깥 섹션 영역 래퍼를 제거해 Card 단일 표면 구조로 정리 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 페이지 이벤트 핸들러 네이밍을 `on[Event][UI]` 규칙에 맞춰 정리 (`onSendInquiryMessage`, `onClickReconnectButton`) | codex |
| 2026-03-03 | `_client.tsx` 헤더 반복 마크업을 `Page + PageTitleBar` 조합으로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-06 | widget 경로 참조를 widgets 경로로 정리 | codex |
