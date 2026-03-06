# 문의 목록 페이지 기획서

> 생성일: 2026-02-25
> 수정일: 2026-02-26
> 타입: page
> 경로: /inquiries

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 문의 관리                                                      [+ 문의 접수]    │
│ 고객 문의를 접수/처리/해결합니다。                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ [전체 카테고리 ▼] [전체 채널 ▼] [전체 상태 ▼] [전체 우선순위 ▼]             │ │
│ │ [담당자 ▼] [기간 선택] 🔍 검색어 입력...                    [초기화] [검색] │ │
│ ├────────────┬──────────┬────────┬────────┬────────┬────────┬─────────────────┤ │
│ │ 제목        │ 고객     │ 채널   │ 상태   │ 우선순위│ 담당자  │ 접수일         │ │
│ ├────────────┼──────────┼────────┼────────┼────────┼────────┼─────────────────┤ │
│ │ ⚠️ 배송 문의│ 홍길동   │ 💬    │ 진행중 │ ⭐⭐⭐  │ 김상담  │ 2026.02.25    │ │
│ │ SLA 위반!   │          │ 채팅   │        │ 높음    │ 🟢(2)  │ 14:30         │ │
│ │             │          │ 😐    │        │        │ 💬 3   │               │ │
│ ├────────────┼──────────┼────────┼────────┼────────┼────────┼─────────────────┤ │
│ │ 결제 오류   │ 이영희   │ 📧    │ 대기   │ ⭐⭐⭐⭐│ 미배정  │ 2026.02.25    │ │
│ │             │          │ EMAIL  │        │ 긴급    │        │ 13:15         │ │
│ │             │          │ 😠    │        │        │         │               │ │
│ ├────────────┼──────────┼────────┼────────┼────────┼────────┼─────────────────┤ │
│ │ 🆕 환불 요청│ 박철수   │ 🌐    │ 신규   │ ⭐⭐   │ 미배정  │ 2026.02.25    │ │
│ │             │          │ WEB    │        │ 보통    │        │ 12:00         │ │
│ ├────────────┼──────────┼────────┼────────┼────────┼────────┼─────────────────┤ │
│ │ 이용 문의   │ 최수진   │ 📱    │ 해결   │ ⭐     │ 박상담  │ 2026.02.24    │ │
│ │             │          │ SMS    │        │ 낮음    │        │ 18:45         │ │
│ ├────────────┴──────────┴────────┴────────┴────────┴────────┴─────────────────┤ │
│ │ 🔌 WebSocket: 🟢 연결됨                        < 1  2  3  ... 10 >          │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ 📊 SLA 현황                     │ │ 📈 금일 문의 현황                        │ │
│ │                                 │ │                                         │ │
│ │ 응답 시간 위반: 3건             │ │ 신규: 12  진행중: 45  해결: 89          │ │
│ │ 해결 시간 위반: 1건             │ │                                         │ │
│ │                                 │ │ 평균 응답: 2시간 35분                   │ │
│ │ ⚠️ 긴급: 2건 (부정 감정)        │ │ 😠 부정: 5  😐 중립: 30  😊 긍정: 55    │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

범례:
- ⚠️ SLA 위반: 빨간색 배경으로 하이라이트
- 🆕 신규: 파란색 배지
- 🟢(2): 온라인 참여자 수
- 💬 3: 읽지 않은 메시지 수
- 😠😐😊: 감정 분석 아이콘
```

## 사용자 시나리오

1. 관리자가 문의 목록 페이지에 접근하여 전체 문의 현황을 파악한다
2. 필터(카테고리, 채널, 상태, 우선순위, 담당자, 기간)를 사용하여 원하는 문의를 검색한다
3. 검색어를 입력하여 특정 고객명이나 문의 제목으로 검색한다
4. **WebSocket 연결 상태를 확인한다** (연결됨/끊김)
5. 채팅 채널 문의의 **실시간 상태(온라인 참여자 수, 읽지 않은 메시지 수)**를 확인한다
6. **SLA 위반 문의를 빨간색 하이라이트로 식별**한다
7. 감정 분석 결과(이모지)로 고객 감정 상태를 빠르게 파악한다
8. 문의 행을 클릭하여 상세 페이지로 이동한다
9. "문의 접수" 버튼을 클릭하여 새 문의를 수동 접수한다
10. SLA 현황 및 금일 통계를 확인하여 응답/해결 성과를 모니터링한다

## 레이아웃 구성

| 영역           | 컴포넌트                               | 기획서                                                                |
| -------------- | -------------------------------------- | --------------------------------------------------------------------- |
| 헤더           | `Page + PageTitleBar`    | -                                                                     |
| 필터 바        | InquiryFilterBar                       | `packages/fe-ui/src/widget/InquiryFilterBar/index.spec.md` |
| 문의 목록      | MetaDataGrid                           | `packages/fe-ui/src/feature/MetaDataGrid/index.spec.md` |
| 연결 상태      | ConnectionStatus                       | `packages/fe-ui/src/primitive/ConnectionStatus/index.spec.md`     |
| SLA 현황 카드  | SLAStatusCard                          | `packages/fe-ui/src/widget/SLAStatusCard/index.spec.md`    |
| 금일 현황 카드 | InquiryStatsCard                       | `packages/fe-ui/src/widget/InquiryStatsCard/index.spec.md` |

- 문의 현황 카드, 문의 목록 영역은 각각 `Section + PageTitleBar` 표면 위에 배치한다.

## 페이지 상태

| 상태      | 설명                | UI                        |
| --------- | ------------------- | ------------------------- |
| 로딩      | 초기 데이터 로딩 중 | 스켈레톤 UI               |
| 빈 목록   | 문의가 없음         | 빈 상태 안내 메시지       |
| 목록 표시 | 문의 목록 표시      | DataGrid + 통계 카드      |
| 필터링 중 | 필터 적용 중        | 로딩 인디케이터           |
| WebSocket 연결 중 | 실시간 연결 시도 중 | 🟡 연결 중 인디케이터 |
| WebSocket 연결됨 | 실시간 업데이트 활성 | 🟢 연결됨 |
| WebSocket 끊김 | 실시간 업데이트 비활성 | 🔴 연결 끊김, 재연결 버튼 |
| 에러      | API 에러 발생       | 에러 메시지 + 재시도 버튼 |

## API 호출

| 시점         | API                         | 캐싱                   |
| ------------ | --------------------------- | ---------------------- |
| 진입 시      | GET /api/v1/inquiries       | staleTime: 30s         |
| 진입 시      | GET /api/v1/inquiries/stats | staleTime: 60s         |
| 필터 변경 시 | GET /api/v1/inquiries       | staleTime: 30s         |
| 폴링 (30초)  | GET /api/v1/inquiries       | refetchInterval: 30000 |
| WebSocket 수신 | - (실시간 업데이트)       | -                      |

## WebSocket 연결

### 연결 시점
- 페이지 진입 시 자동 WebSocket 연결
- `inquiries:subscribe` 이벤트 전송 (목록 구독)

### 연결 해제 시점
- 페이지 이탈 시 `inquiries:unsubscribe` 이벤트 전송
- WebSocket 연결 해제

### 수신 이벤트

| 이벤트 | 동작 |
|--------|------|
| `inquiries:updated` | 목록 새로고침 (새 문의, 상태 변경 등) |
| `inquiries:stats:updated` | 통계 카드 업데이트 |
| `inquiries:sla:breach` | SLA 위반 알림, 해당 행 하이라이트 |
| `inquiries:new:message` | 새 메시지 배지 업데이트 |
| `inquiries:participant:changed` | 온라인 참여자 수 업데이트 |

## DataGrid 컬럼

| 컬럼 | 필드 | 설명 | Cell 컴포넌트 | 정렬 |
|------|------|------|---------------|------|
| 제목 | title | 문의 제목 + SLA 위반 표시 | InquiryTitleCell | O |
| 고객 | customerName | 고객 이름 + 이메일 | UserCell | O |
| 채널 | channel | 채널 아이콘 + 텍스트 | ChannelCell | - |
| 상태 | status | 상태 배지 + 신규 표시 | InquiryStatusCell | O |
| 우선순위 | priority | 우선순위 별 + 텍스트 | PriorityCell | O |
| 담당자 | assignee | 담당자 이름 + 온라인 수 | AssigneeCell | O |
| 접수일 | createdAt | 날짜 + 시간 | DateTimeCell | O |
| 메시지 | unreadCount | 새 메시지 수 (채팅만) | MessageCountCell | - |
| 감정 | sentiment | 감정 이모지 + 점수 | SentimentCell | - |

### 컬럼별 특수 표시

| 조건 | 표시 |
|------|------|
| SLA 응답/해결 위반 | 행 배경 빨간색 (#FFEBEE), 앞에 ⚠️ 아이콘 |
| 신규 문의 (NEW) | 상태 배지 파란색, 🆕 아이콘 |
| 채팅 채널 + 온라인 참여자 있음 | 담당자 옆에 🟢(N) 표시 |
| 읽지 않은 메시지 있음 | 💬 N 배지 (파란색) |
| 부정 감정 | 😠 아이콘 (빨간색) |
| 중립 감정 | 😐 아이콘 (회색) |
| 긍정 감정 | 😊 아이콘 (초록색) |

## 필터 구성

| 필터 | 필드 | 옵션 |
|------|------|------|
| 카테고리 | category | 전체, 일반, 배송, 결제, 환불, 상품, 계정, 기술, 불만, 기타 |
| 채널 | channel | 전체 채널, 웹, 이메일, 채팅, SMS, 전화, 방문 |
| 상태 | status | 전체 상태, 신규, 열림, 처리중, 고객대기, 해결됨, 종료됨, 에스컬레이션 |
| 우선순위 | priority | 전체 우선순위, 긴급, 높음, 보통, 낮음 |
| 담당자 | assigneeId | 전체 담당자, 미배정, [담당자 목록...] |
| 기간 | dateRange | 오늘, 7일, 30일, 90일, 직접 선택 |
| 검색 | search | 제목, 고객명, 문의번호 |

## 정렬 옵션

| 정렬 기준 | 기본값 |
|-----------|--------|
| 최신순 (createdAt DESC) | ✅ |
| 우선순위순 (priority DESC) | - |
| SLA 응답 기한순 (slaResponseDue ASC) | - |
| SLA 해결 기한순 (slaResolveDue ASC) | - |
| 마지막 메시지순 (lastMessageAt DESC) | - |

## 이벤트 핸들러

| 이벤트            | 동작                                   |
| ----------------- | -------------------------------------- |
| onClickNewInquiry | `/inquiries/new` 페이지로 이동         |
| onClickInquiryRow | `/inquiries/[inquiryId]` 페이지로 이동 |
| onChangeFilter    | 필터 상태 업데이트, API 재조회         |
| onSearch          | 검색어 디바운스(300ms) 후 API 재조회   |
| onRefresh         | 목록 새로고침                          |
| onResetFilters    | 모든 필터 초기화                       |
| onReconnect       | WebSocket 재연결                       |
| onSortChange      | 정렬 기준 변경, API 재조회             |

## L5-L12 레이어 기획

### L5: 화면 구조 (레이아웃)

```
페이지 헤더 영역 (title, description, actions)
├── InquiryFilterBar (필터 바)
│   ├── CategorySelect
│   ├── ChannelSelect
│   ├── StatusSelect
│   ├── PrioritySelect
│   ├── AssigneeSelect
│   ├── DateRangePicker
│   ├── SearchInput
│   └── ResetButton
├── MetaDataGrid (목록)
│   ├── ConnectionStatus (WebSocket 상태)
│   └── DataGrid
└── StatsRow (통계 카드)
    ├── SLAStatusCard
    └── InquiryStatsCard
```

### L6: 데이터 흐름 (API 호출)

```
1. SSR Prefetch
   - GET /api/v1/inquiries (초기 목록)
   - GET /api/v1/inquiries/stats (통계)

2. Client-side
   - React Query 캐시 관리
   - WebSocket 실시간 업데이트
   - 필터/정렬 변경 시 refetch

3. Polling (WebSocket 끊김 시)
   - 30초 간격 자동 새로고침
```

### L7: 인터랙션 (이벤트)

| 인터랙션 | 트리거 | 동작 |
|----------|--------|------|
| 필터 변경 | Select/Date 변경 | URL 쿼리 파라미터 업데이트 + API 호출 |
| 검색 | Input 입력 | 300ms 디바운스 + API 호출 |
| 행 클릭 | Row click | 상세 페이지 이동 |
| 새 문의 | Button click | 접수 페이지 이동 |
| 재연결 | Button click | WebSocket 재연결 |

### L8: Pure UI 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| ConnectionStatus | ui/ | WebSocket 연결 상태 표시 (🟢🟡🔴) |
| InquiryTitleCell | ui/data-display/cells/ | 제목 + SLA 위반 표시 |
| InquiryStatusCell | ui/data-display/cells/ | 상태 배지 + 신규 표시 |
| ChannelCell | ui/data-display/cells/ | 채널 아이콘 + 텍스트 |
| AssigneeCell | ui/data-display/cells/ | 담당자 + 온라인 수 |
| MessageCountCell | ui/data-display/cells/ | 읽지 않은 메시지 배지 |
| SentimentCell | ui/data-display/cells/ | 감정 분석 아이콘 |
| PriorityCell | ui/data-display/cells/ | 우선순위 표시 |

### L9: Widget 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| InquiryFilterBar | widgets/ | 필터 바 통합 |
| SLAStatusCard | widgets/ | SLA 현황 카드 |
| InquiryStatsCard | widgets/ | 금일 통계 카드 |

### L10: Feature 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| MetaDataGrid | feature/ | 공용 DataGrid + 문의 전용 컬럼/쿼리 상태 연동 |

### L11: Store 연결

| Store | 사용 필드/액션 |
|-------|----------------|
| Query State (nuqs) | inquiryStatus, search, take, skip |
| Page Handler | onClickStatusFilter, onClickInquiryRow, onClickNewInquiry |

### L12: 테스트 케이스

> 구현 도구: Playwright (E2E)

#### 테스트 커버리지

| 시나리오    | Happy Path | Error Path | Edge Case | 합계 |
| ----------- | :--------: | :--------: | :-------: | :--: |
| 목록 조회   |     1      |     1      |     1     |  3   |
| 필터링      |     3      |     0      |     1     |  4   |
| 검색        |     1      |     0      |     1     |  2   |
| 정렬        |     2      |     0      |     0     |  2   |
| 페이지 이동 |     2      |     0      |     0     |  2   |
| 실시간 상태 |     2      |     1      |     1     |  4   |
| SLA 위반    |     1      |     0      |     0     |  1   |

#### [TC-001] 문의 목록 조회 성공

**분류:** Happy Path

| 구분      | 내용                          |
| --------- | ----------------------------- |
| **Given** | 문의 데이터가 존재함          |
| **When**  | 문의 목록 페이지 접근         |
| **Then**  | 문의 목록이 DataGrid에 표시됨 |

#### [TC-002] 필터 적용 - 상태 필터

**분류:** Happy Path

| 구분      | 내용                        |
| --------- | --------------------------- |
| **Given** | 다양한 상태의 문의 존재     |
| **When**  | 상태 필터에서 "진행중" 선택 |
| **Then**  | 진행중 상태 문의만 표시됨   |

#### [TC-003] 필터 적용 - SLA 위반 필터

**분류:** Happy Path

| 구분      | 내용                              |
| --------- | --------------------------------- |
| **Given** | SLA 위반 문의 존재                |
| **When**  | SLA 위반 필터 선택 (있는 경우)    |
| **Then**  | SLA 위반 문의만 표시, 빨간 배경   |

#### [TC-004] 검색 - 고객명 검색

**분류:** Happy Path

| 구분      | 내용                        |
| --------- | --------------------------- |
| **Given** | 여러 고객의 문의 존재       |
| **When**  | 검색어 "홍길동" 입력        |
| **Then**  | 홍길동 고객의 문의만 표시됨 |

#### [TC-005] 문의 상세 이동

**분류:** Happy Path

| 구분      | 내용                         |
| --------- | ---------------------------- |
| **Given** | 문의 목록 표시 중            |
| **When**  | 문의 행 클릭                 |
| **Then**  | 해당 문의 상세 페이지로 이동 |

#### [TC-006] 실시간 상태 표시 - WebSocket 연결

**분류:** Happy Path

| 구분      | 내용                        |
| --------- | --------------------------- |
| **Given** | 문의 목록 페이지 접근       |
| **When**  | WebSocket 연결 완료         |
| **Then**  | 🟢 연결됨 표시              |

#### [TC-007] 실시간 상태 표시 - 온라인 참여자

**분류:** Happy Path

| 구분      | 내용                        |
| --------- | --------------------------- |
| **Given** | 채팅 채널 문의 존재         |
| **When**  | 목록 로드                   |
| **Then**  | 온라인 참여자 수(🟢N) 표시 |

#### [TC-008] SLA 위반 하이라이트

**분류:** Happy Path

| 구분      | 내용                          |
| --------- | ----------------------------- |
| **Given** | SLA 위반 문의 존재            |
| **When**  | 목록 로드                     |
| **Then**  | SLA 위반 행 빨간색 배경 표시  |

#### [TC-009] 감정 분석 표시

**분류:** Happy Path

| 구분      | 내용                          |
| --------- | ----------------------------- |
| **Given** | 감정 분석된 문의 존재         |
| **When**  | 목록 로드                     |
| **Then**  | 감정 이모지(😠/😐/😊) 표시됨 |

#### [TC-010] WebSocket 재연결

**분류:** Edge Case

| 구분      | 내용                        |
| --------- | --------------------------- |
| **Given** | WebSocket 연결 끊김         |
| **When**  | 재연결 버튼 클릭            |
| **Then**  | WebSocket 재연결 시도       |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트)
- [x] _client.tsx (클라이언트 컴포넌트)
- [x] _prefetch.ts (데이터 프리페치)
- [x] hooks/useHandlers.ts
- [ ] hooks/useInquiryListWebSocket.ts (WebSocket 연결)
- [x] E2E 테스트 (Playwright) - `page.e2e.ts`

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-02-26 | 실시간 상태 컬럼 추가 (온라인, 메시지 수) | orch-requirement |
| 2026-02-26 | 감정 분석 컬럼 및 통계 추가 | orch-requirement |
| 2026-02-26 | WebSocket 연결 상태 표시 추가 | orch-screen-planner |
| 2026-02-26 | SLA 위반 하이라이트 추가 | orch-screen-planner |
| 2026-02-26 | 담당자/기간 필터 추가 | orch-screen-planner |
| 2026-02-26 | 정렬 옵션 추가 (SLA 기한, 우선순위) | orch-screen-planner |
| 2026-02-26 | L5-L12 레이어 기획 추가 | orch-screen-planner |
| 2026-02-26 | 페이지 파일 생성 (page.tsx, _client.tsx, _prefetch.ts, hooks/useHandlers.ts) | fe-page-builder |
| 2026-02-27 | 목록 페이지 E2E 테스트 추가 (`page.e2e.ts`) | codex |
| 2026-02-28 | InquiryStore 의존 제거, 페이지 로컬 state 기준으로 L10/L11 갱신 | codex |
| 2026-03-01 | InquiryDataGrid 제거, MetaDataGrid 재사용 구조로 전환 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 적용 기준 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-06 | widget 경로 참조를 widgets 경로로 정리 | codex |
