# Inquiries Repository 기획서

> 생성일: 2026-02-25
> 타입: repository
> 위치: apps/server/src/module/inquiries/repositories/inquiries.repository.ts

## 역할

문의(Inquiry) 및 관련 엔티티의 데이터베이스 접근을 담당합니다. Prisma 클라이언트를 사용하여 CRUD 및 복잡한 조회 쿼리를 수행합니다.

## 의존성

| 서비스 | 역할 |
|--------|------|
| `PrismaService` | Prisma 클라이언트 |

## 문의 Repository 메서드

### findMany(params)

- **파라미터**: `{ spaceId: string, skip: number, take: number, status?: InquiryStatus, channel?: InquiryChannel, category?: InquiryCategory, priority?: InquiryPriority, assigneeId?: string, customerId?: string, search?: string, orderBy?: object }`
- **반환값**: `{ inquiries: Inquiry[], total: number }`
- **Prisma 쿼리**:
  ```prisma
  inquiry.findMany({
    where: {
      spaceId,
      removedAt: null,
      status: status ?? undefined,
      channel: channel ?? undefined,
      category: category ?? undefined,
      priority: priority ?? undefined,
      assigneeId: assigneeId ?? undefined,
      customerId: customerId ?? undefined,
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } }
      ] : undefined
    },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true, tags: true } }
    },
    orderBy: orderBy ?? { createdAt: 'desc' },
    skip,
    take
  })
  ```

### findById(inquiryId, spaceId)

- **파라미터**: `inquiryId: string, spaceId: string`
- **반환값**: `Inquiry | null`
- **Prisma 쿼리**:
  ```prisma
  inquiry.findFirst({
    where: { id: inquiryId, spaceId, removedAt: null },
    include: {
      customer: true,
      assignee: true,
      tags: { include: { tag: true } },
      sentimentAnalysis: true,
      threads: {
        include: {
          messages: {
            include: {
              sender: true,
              attachments: true
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      }
    }
  })
  ```

### create(data)

- **파라미터**: `CreateInquiryInput`
- **반환값**: `Inquiry`
- **Prisma 쿼리**:
  ```prisma
  inquiry.create({
    data: {
      spaceId,
      inquiryNumber,
      title,
      category,
      channel,
      status: InquiryStatus.NEW,
      priority,
      source,
      customerId,
      slaResponseDue,
      slaResolveDue,
      metadata
    }
  })
  ```

### update(inquiryId, data)

- **파라미터**: `inquiryId: string, UpdateInquiryInput`
- **반환값**: `Inquiry`
- **Prisma 쿼리**:
  ```prisma
  inquiry.update({
    where: { id: inquiryId },
    data: {
      status,
      priority,
      assigneeId,
      firstResponseAt,
      resolvedAt,
      closedAt,
      isSlaResponseBreached,
      isSlaResolveBreached,
      sentiment,
      sentimentScore,
      aiResolutionAttempted,
      aiResolved
    }
  })
  ```

### softDelete(inquiryId)

- **파라미터**: `inquiryId: string`
- **반환값**: `Inquiry`
- **Prisma 쿼리**:
  ```prisma
  inquiry.update({
    where: { id: inquiryId },
    data: { removedAt: new Date() }
  })
  ```

### countByStatus(spaceId)

- **파라미터**: `spaceId: string`
- **반환값**: `Record<InquiryStatus, number>`
- **Prisma 쿼리**:
  ```prisma
  inquiry.groupBy({
    by: ['status'],
    where: { spaceId, removedAt: null },
    _count: true
  })
  ```

### countSLABreaches(spaceId)

- **파라미터**: `spaceId: string`
- **반환값**: `{ response: number, resolve: number }`
- **Prisma 쿼리**:
  ```prisma
  inquiry.count({
    where: { spaceId, removedAt: null, isSlaResponseBreached: true }
  })
  inquiry.count({
    where: { spaceId, removedAt: null, isSlaResolveBreached: true }
  })
  ```

### generateInquiryNumber(spaceId, date)

- **파라미터**: `spaceId: string, date: Date`
- **반환값**: `string` (예: INQ-2026-0225-001)
- **로직**:
  1. 오늘 날짜의 해당 Space 문의 수 조회
  2. 순번 계산 (N + 1)
  3. 형식: `INQ-YYYY-MMDD-NNN`

## 문의 메시지 Repository 메서드

### findMessages(inquiryId, params)

- **파라미터**: `inquiryId: string, { skip: number, take: number }`
- **반환값**: `{ messages: InquiryMessage[], total: number }`
- **Prisma 쿼리**:
  ```prisma
  inquiryMessage.findMany({
    where: { inquiryId },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      attachments: true,
      aiAgentLog: true
    },
    orderBy: { createdAt: 'asc' },
    skip,
    take
  })
  ```

### createMessage(data)

- **파라미터**: `CreateInquiryMessageInput`
- **반환값**: `InquiryMessage`
- **Prisma 쿼리**:
  ```prisma
  inquiryMessage.create({
    data: {
      inquiryId,
      threadId,
      senderId,
      senderType,
      content,
      isAIGenerated,
      metadata
    }
  })
  ```

## 통계 Repository 메서드

### getStats(spaceId, startDate, endDate)

- **파라미터**: `spaceId: string, startDate?: Date, endDate?: Date`
- **반환값**: `InquiryStatsRaw`
- **Prisma 쿼리**:
  ```prisma
  // 기간 내 문의 수
  inquiry.count({
    where: { spaceId, removedAt: null, createdAt: { gte: startDate, lte: endDate } }
  })

  // 평균 응답 시간 (firstResponseAt - createdAt)
  inquiry.aggregate({
    where: { spaceId, firstResponseAt: { not: null } },
    _avg: { /* calculated field */ }
  })

  // 채널별 분포
  inquiry.groupBy({
    by: ['channel'],
    where: { spaceId, removedAt: null },
    _count: true
  })
  ```

## 구현 체크리스트

- [ ] inquiries.repository.ts
- [ ] inquiry-messages.repository.ts
- [ ] Prisma 쿼리 최적화
- [ ] 트랜잭션 처리 (필요 시)
- [ ] 단위 테스트 (Jest)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
