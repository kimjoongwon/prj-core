# AIAgentLog Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/ai-agent-log.entity.ts

## 역할

AI 에이전트의 활동 로그를 기록하는 엔티티입니다. AI 초안 생성, 자동 분류, 감정 분석, 자동 응답 등 AI 기능 사용 내역을 추적하여 AI 성능 모니터링 및 감사 로그를 제공합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| inquiryId | UUID | FK, required | - | 소속 문의 ID |
| messageId | UUID | FK, optional | - | 관련 메시지 ID |
| action | AIAgentAction | required | - | AI 작업 유형 |
| input | Json | optional | - | 입력 데이터 |
| output | Json | optional | - | 출력 결과 |
| confidence | Float | optional | - | AI 신뢰도 (0~1) |
| wasAccepted | Boolean | optional | - | 사용자 수락 여부 |
| wasModified | Boolean | optional | - | 사용자 수정 여부 |
| responseTimeMs | Integer | optional | - | 응답 시간 (ms) |
| model | String | optional | - | 사용된 AI 모델 |
| tokenCount | Integer | optional | - | 사용된 토큰 수 |
| errorMessage | String | optional | - | 에러 메시지 |
| createdAt | DateTime | required | now() | 생성 일시 |

## Enum

### AIAgentAction

| 값 | 설명 |
|-----|------|
| DRAFT_GENERATION | 답변 초안 생성 |
| AUTO_CLASSIFICATION | 자동 카테고리 분류 |
| SENTIMENT_ANALYSIS | 감정 분석 |
| AUTO_RESPONSE | 자동 응답 |
| KNOWLEDGE_SEARCH | 지식베이스 검색 |
| SUMMARIZATION | 요약 생성 |
| TRANSLATION | 번역 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Inquiry | N:1 | 소속 문의 |
| belongsTo | InquiryMessage | N:0..1 | 관련 메시지 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isSuccessful() | boolean | 성공 여부 (errorMessage 없음) |
| wasAcceptedByUser() | boolean | 사용자 수락 여부 |
| wasModifiedByUser() | boolean | 사용자 수정 여부 |
| isHighConfidence() | boolean | 높은 신뢰도 (confidence > 0.8) |
| wasFast() | boolean | 빠른 응답 (responseTimeMs < 2000) |

## 비즈니스 규칙

- 모든 AI 작업은 로그 기록 필수
- 로그는 수정/삭제 불가 (감사 로그)
- 사용자가 AI 초안을 수정한 경우 wasModified=true
- responseTimeMs로 AI 응답 시간 모니터링
- tokenCount로 비용 추적

## input/output JSON 구조 예시

### DRAFT_GENERATION

```json
// input
{
  "inquiryContent": "배송이 언제 되나요?",
  "category": "DELIVERY",
  "history": [...]
}

// output
{
  "draft": "안녕하세요, 주문하신 상품은...",
  "suggestions": ["배송 조회 링크", "연락처"]
}
```

### AUTO_CLASSIFICATION

```json
// input
{
  "title": "배송 문의합니다",
  "content": "주문한 상품이 언제 오나요?"
}

// output
{
  "category": "DELIVERY",
  "confidence": 0.92,
  "alternatives": [
    { "category": "PRODUCT", "confidence": 0.05 }
  ]
}
```

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| AIAgentLog | CONCRETE | Inquiry, InquiryMessage | 2 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| AIAgentAction | AIAgentLog |

## 구현 체크리스트

- [x] ai-agent-log.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] isSuccessful - 성공 여부

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | errorMessage=null인 로그 |
| **When** | isSuccessful() 호출 |
| **Then** | true 반환 |

### [TC-002] wasAcceptedByUser - 수락 여부

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | wasAccepted=true인 로그 |
| **When** | wasAcceptedByUser() 호출 |
| **Then** | true 반환 |

### [TC-003] isHighConfidence - 높은 신뢰도

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | confidence=0.9인 로그 |
| **When** | isHighConfidence() 호출 |
| **Then** | true 반환 |

### [TC-004] wasFast - 빠른 응답

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | responseTimeMs=1500인 로그 |
| **When** | wasFast() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
