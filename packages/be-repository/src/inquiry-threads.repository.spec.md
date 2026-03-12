# InquiryThreads Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/inquiry-threads.repository.ts

## 역할

InquiryThread 모델의 데이터 접근을 담당합니다. 문의별/메시지 단위 조회와 스레드 CRUD를 제공합니다.

## 엔티티

- **대상 Entity**: InquiryThread (`@cocrepo/entity`)
- **Prisma 모델**: `inquiryThread`
- **보조 Entity**: InquiryMessage, InquiryParticipant

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<InquiryThread \| null>` | ID로 단건 조회 |
| `findByIdWithMessagesAndParticipants(id)` | string | `Promise<InquiryThread \| null>` | 메시지/참여자 포함 조회 |
| `findByInquiryId(inquiryId)` | string | `Promise<InquiryThread[]>` | 문의별 스레드 목록 조회 |
| `findMessagesByThreadId(threadId)` | string | `Promise<InquiryMessage[]>` | 스레드 메시지 목록 조회 |
| `findParticipantsByThreadId(threadId)` | string | `Promise<InquiryParticipant[]>` | 스레드 참여자 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ threads: InquiryThread[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.InquiryThreadUncheckedCreateInput | `Promise<InquiryThread>` | 스레드 생성 |
| `updateById(id, data)` | string, Prisma.InquiryThreadUncheckedUpdateInput | `Promise<InquiryThread>` | ID 기반 수정 |
| `removeById(id)` | string | `Promise<InquiryThread>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] inquiry-threads.repository.ts
- [x] 메시지/참여자 관계 include 적용
- [x] 문의별 조회/커서 페이징 가능한 findMany 제공

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(InquiryThread) 신규 생성 | codex |

