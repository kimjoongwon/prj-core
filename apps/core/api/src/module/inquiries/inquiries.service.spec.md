# Inquiries Service 기획서

> 생성일: 2026-02-25
> 타입: service
> 위치: apps/server/src/module/inquiries/inquiries.service.ts

## 역할

문의(Inquiry) 도메인의 비즈니스 로직을 담당합니다. Repository를 통해 데이터에 접근하며, SLA 추적, AI 기능 연동, 감정 분석 등을 처리합니다.

## 의존성

| 서비스/Repository | 역할 |
|----------|------|
| `InquiriesRepository` | 문의 데이터 접근 |
| `InquiryMessagesRepository` | 문의 메시지 데이터 접근 |
| `UsersService` | 고객/담당자 정보 조회 |
| `SLAService` | SLA 계산 및 추적 |
| `AIService` | AI 초안 생성, 자동 해결 |
| `SentimentService` | 감정 분석 |
| `NotificationService` | 알림 발송 |

## 문의 관리 메서드

### findInquiries(params)

- **파라미터**: `{ spaceId: string, skip: number, take: number, status?: InquiryStatus, channel?: InquiryChannel, category?: InquiryCategory, priority?: InquiryPriority, assigneeId?: string, search?: string }`
- **반환값**: `{ inquiries: Inquiry[], total: number, stats: InquiryStats }`
- **로직**:
  1. 현재 Space의 문의 목록 조회
  2. 필터 조건 적용 (상태, 채널, 카테고리, 우선순위, 담당자)
  3. 검색어로 제목, 고객명 검색 (LIKE 검색)
  4. 각 문의의 `_count.messages`, customer, assignee 포함
  5. `createdAt` 내림차순 정렬
  6. 통계 정보 함께 반환 (상태별 카운트, SLA 위반 수 등)

### findInquiryById(inquiryId, spaceId)

- **파라미터**: `inquiryId: string, spaceId: string`
- **반환값**: `InquiryDetailDto`
- **로직**:
  1. inquiryId + spaceId로 문의 조회
  2. customer, assignee, tags, sentimentAnalysis 관계 포함
  3. 없으면 `NotFoundException(INQUIRY_ERRORS.INQUIRY_NOT_FOUND)`

### createInquiry(dto, spaceId, creatorId)

- **파라미터**: `CreateInquiryDto, spaceId: string, creatorId: string`
- **반환값**: `Inquiry`
- **로직**:
  1. 문의 번호 자동 생성 (INQ-YYYY-MMDD-NNN)
  2. SLA 기한 계산 (SLAService.calculateSLADeadlines)
  3. 고객 ID 제공 시 고객 존재 확인
  4. 문의 생성
  5. 감정 분석 비동기 실행 (SentimentService.analyze)
  6. AI 자동 분류 추천 비동기 실행 (선택적)

### updateInquiry(inquiryId, dto, spaceId, userId)

- **파라미터**: `inquiryId: string, UpdateInquiryDto, spaceId: string, userId: string`
- **반환값**: `Inquiry`
- **로직**:
  1. 문의 존재 및 Space 소유 확인
  2. CLOSED 상태면 수정 불가
  3. 상태 변경 시 상태 전환 규칙 검증:
     - NEW → OPEN: 담당자 배정 시 자동
     - OPEN → IN_PROGRESS: 답변 시작 시
     - IN_PROGRESS ↔ WAITING_CUSTOMER: 양방향 가능
     - → RESOLVED: 해결 처리
     - RESOLVED → CLOSED: 종료만 가능
  4. 담당자 변경 시 알림 발송
  5. 상태 변경 이력 기록
  6. 업데이트 실행

### deleteInquiry(inquiryId, spaceId)

- **파라미터**: `inquiryId: string, spaceId: string`
- **반환값**: `void`
- **로직**:
  1. 문의 존재 확인
  2. IN_PROGRESS 상태면 삭제 불가
  3. Soft Delete (`removedAt` 설정)
  4. 관련 리소스 정리 (첨부 파일 등)

## AI 기능 메서드

### generateAIDraft(inquiryId, spaceId)

- **파라미터**: `inquiryId: string, spaceId: string`
- **반환값**: `AIDraftDto`
- **로직**:
  1. 문의 및 최근 메시지 조회
  2. 지식베이스 관련 문서 검색 (KnowledgeBaseService.search)
  3. AI 초안 생성 요청 (AIService.generateDraft)
  4. 로그 기록 (AIAgentLog)
  5. 초안 반환

### attemptAutoResolve(inquiryId, spaceId)

- **파라미터**: `inquiryId: string, spaceId: string`
- **반환값**: `AutoResolveResultDto`
- **로직**:
  1. 문의 내용 분석
  2. 지식베이스 매칭 문서 찾기
  3. AI 자동 응답 생성
  4. 신뢰도 점수 계산
  5. 임계값 이상(0.85) 시 자동으로 메시지 전송 및 상태 변경
  6. 결과 반환

## 통계 메서드

### getInquiryStats(spaceId, params)

- **파라미터**: `spaceId: string, { startDate?: Date, endDate?: Date }`
- **반환값**: `InquiryStatsDto`
- **로직**:
  1. 기간 내 문의 수 집계
  2. 상태별 분포 계산
  3. 채널별 분포 계산
  4. 평균 응답 시간 계산
  5. 평균 해결 시간 계산
  6. SLA 위반 수 계산
  7. AI 해결률 계산

## 비즈니스 규칙

- **Space 격리**: 모든 문의 조회/수정/삭제에 `spaceId` 조건 포함
- **상태 전환 규칙**: 상태 머신에 따른 전환만 허용
- **SLA 추적**: 문의 생성 시 SLA 기한 설정, 조회 시 실시간 위반 여부 계산
- **감정 분석**: 새 문의 생성 시 비동기로 감정 분석 실행
- **알림**: 담당자 배정, 상태 변경, SLA 위반 시 알림 발송

## 에러 상수 (INQUIRY_ERRORS)

| 상수 | 설명 |
|------|------|
| `INQUIRY_NOT_FOUND` | 문의 미발견 (404) |
| `INQUIRY_CLOSED` | 종료된 문의 수정 시도 (400) |
| `INQUIRY_IN_PROGRESS` | 처리 중 문의 삭제 시도 (400) |
| `INQUIRY_INVALID_STATUS_TRANSITION` | 잘못된 상태 전환 (400) |
| `INQUIRY_NUMBER_GENERATION_FAILED` | 문의 번호 생성 실패 (500) |

## 구현 체크리스트

- [ ] inquiries.service.ts
- [ ] INQUIRY_ERRORS 상수 정의
- [ ] 상태 전환 규칙 검증 로직
- [ ] SLA 계산 로직
- [ ] AI 서비스 연동
- [ ] 감정 분석 연동

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
