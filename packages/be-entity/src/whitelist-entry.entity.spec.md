# WhitelistEntry Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/whitelist-entry.entity.ts

## 역할

IP 주소, 이메일 도메인, CORS Origin에 대한 화이트리스트 항목을 관리하는 엔티티입니다. SecurityPolicy에서 화이트리스트 활성화 여부를 설정하고, 실제 허용 목록은 이 엔티티에서 관리합니다. AbstractEntity를 상속하지 않습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| type | WhitelistType | required | - | 화이트리스트 유형 (IP, EMAIL_DOMAIN, CORS_ORIGIN) |
| value | string | required | - | 화이트리스트 값 (IP 주소, 이메일 도메인, CORS URL) |
| isActive | boolean | required | - | 활성화 여부 |
| description | string \| null | nullable | null | 설명 |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| WhitelistType | IP | IP 주소 화이트리스트 |
| WhitelistType | EMAIL_DOMAIN | 이메일 도메인 화이트리스트 |
| WhitelistType | CORS_ORIGIN | CORS Origin 화이트리스트 |

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isIpEntry() | boolean | IP 화이트리스트 항목 여부 확인 |
| isEmailDomainEntry() | boolean | 이메일 도메인 화이트리스트 항목 여부 확인 |
| isCorsOriginEntry() | boolean | CORS Origin 화이트리스트 항목 여부 확인 |

## 비즈니스 규칙

- SecurityPolicy에서 해당 유형의 화이트리스트가 활성화된 경우에만 이 항목들이 적용됩니다.
- `isActive=false`이면 해당 항목은 화이트리스트에서 제외됩니다.
- IP 화이트리스트: 허용된 IP에서만 접근 가능합니다.
- 이메일 도메인 화이트리스트: 허용된 도메인의 이메일로만 가입/로그인 가능합니다.
- CORS Origin 화이트리스트: 허용된 도메인에서만 API 요청이 가능합니다.
- `removedAt` 필드가 없어 소프트 삭제를 지원하지 않습니다.
- AbstractEntity를 상속하지 않습니다.

## 구현 체크리스트

- [x] whitelist-entry.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma WhitelistEntryModel 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
