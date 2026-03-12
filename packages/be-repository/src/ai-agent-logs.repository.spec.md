# AIAgentLogs Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/ai-agent-logs.repository.ts

## 역할

AIAgentLog 모델의 데이터 접근을 담당합니다. 문의/메시지 단위의 AI 실행 로그 조회와 삭제를 제공합니다.

## 엔티티

- **대상 Entity**: AIAgentLog (`@cocrepo/entity`)
- **Prisma 모델**: `aIAgentLog` (`AIAgentLog`)

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<AIAgentLog \| null>` | ID로 단건 조회 |
| `findByInquiryId(inquiryId)` | string | `Promise<AIAgentLog[]>` | 문의별 로그 목록 조회 |
| `findByMessageId(messageId)` | string | `Promise<AIAgentLog \| null>` | 메시지별 로그 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ logs: AIAgentLog[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.AIAgentLogUncheckedCreateInput | `Promise<AIAgentLog>` | 로그 생성 |
| `deleteById(id)` | string | `Promise<AIAgentLog>` | ID 기반 삭제 |
| `countByInquiryId(inquiryId)` | string | `Promise<number>` | 문의별 로그 개수 조회 |

## 구현 체크리스트

- [x] ai-agent-logs.repository.ts
- [x] aIAgentLog Prisma modelAccessor 기반 조회/조회수 카운트
- [x] @Injectable() 및 TransactionHost 주입

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(AIAgentLog) 신규 생성 | codex |

