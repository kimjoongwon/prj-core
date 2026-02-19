# AuthAuditLog Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/auth-audit-log.entity.ts

## 역할

인증(로그인/로그아웃) 시도에 대한 감사 로그를 기록하는 엔티티입니다. 성공·실패·계정 잠금 등 인증 결과를 이메일, IP 주소, User-Agent와 함께 저장하여 보안 감사 및 이상 징후 탐지에 활용됩니다. AbstractEntity를 상속하지 않고 독립적으로 구현되며 updatedAt, removedAt 필드가 없습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 로그 생성 일시 |
| email | string | required | - | 인증 시도 이메일 |
| result | AuthAuditResult | required | - | 인증 결과 (SUCCESS, FAILED, LOCKED 등) |
| ipAddress | string | required | - | 요청 IP 주소 |
| userId | string \| null | nullable | null | 사용자 ID (실패 시 null 가능) |
| failureReason | string \| null | nullable | null | 실패 사유 |
| userAgent | string \| null | nullable | null | 브라우저/클라이언트 정보 |
| clientId | string \| null | nullable | null | OIDC 클라이언트 ID |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| AuthAuditResult | SUCCESS | 로그인 성공 |
| AuthAuditResult | FAILED | 로그인 실패 |
| AuthAuditResult | LOCKED | 계정 잠금으로 인한 실패 |

## 관계

해당 없음 (User 엔티티에서 OneToMany로 참조)

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isSuccess() | boolean | 로그인 성공 여부 확인 |
| isLockedOut() | boolean | 계정 잠금으로 인한 실패 여부 확인 |

## 비즈니스 규칙

- 감사 로그는 수정·삭제하지 않습니다 (불변 레코드). `updatedAt`, `removedAt` 필드가 없습니다.
- AbstractEntity를 상속하지 않아 소프트 삭제 기능이 없습니다.
- 로그인 실패 시에도 `userId`가 null일 수 있습니다 (존재하지 않는 이메일로 시도).
- OIDC 클라이언트를 통한 로그인 시 `clientId`에 클라이언트 정보를 기록합니다.
- 보안 감사 목적으로 영구 보존이 권장됩니다.

## 구현 체크리스트

- [x] auth-audit-log.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma AuthAuditLogEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
