# SecurityPolicies Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/security-policies.repository.ts

## 역할

보안 정책(SecurityPolicy) 엔티티의 데이터 접근을 담당합니다. 비밀번호 정책, 로그인 시도 횟수, 세션 만료 시간 등 시스템 전체에 적용되는 보안 설정값을 key-value 방식으로 관리합니다.

## 엔티티

- **대상 Entity**: SecurityPolicy (`@cocrepo/entity`)
- **Prisma 모델**: `securityPolicy`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findByKey(key)` | string | `Promise<SecurityPolicy \| null>` | 정책 키로 단건 조회 |
| `updateByKey(key, data)` | string, Prisma.SecurityPolicyUncheckedUpdateInput | `Promise<SecurityPolicy>` | 정책 키로 수정 |
| `create(data)` | Prisma.SecurityPolicyUncheckedCreateInput | `Promise<SecurityPolicy>` | 보안 정책 생성 (시드 데이터용) |

## 특이사항

- **key 기반 관리**: SecurityPolicy는 고정된 key 집합으로 관리 (ID 기반 아님)
- **시드 전용 생성**: `create()`는 초기 데이터 설정(시드)에만 사용
- **목록 조회 없음**: 정책은 key로 직접 접근 (findAll 불필요)
- **삭제 없음**: 보안 정책은 삭제 불가 (항상 존재해야 함)

## 보안 정책 키 예시

| 키 | 설명 |
|----|------|
| password.min_length | 비밀번호 최소 길이 |
| password.max_attempts | 최대 로그인 시도 횟수 |
| session.timeout | 세션 만료 시간 |
| lock.duration | 계정 잠금 시간 |

## 구현 체크리스트

- [x] security-policies.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
