# Roles Facade 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-facade/src/role.facade.ts

## 역할

Role 컨트롤러의 CRUD 호출을 Facade 경유로 일원화합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| RoleService | Role CRUD 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getRoles | 역할 목록 조회 |
| getRoleById | 역할 상세 조회 |
| createRole | 역할 생성 |
| updateRole | 역할 수정 |
| deleteRole | 역할 삭제 |

## 비즈니스 규칙

- 시스템 Role 보호, 연결 사용자 검증 등 실제 제약은 RoleService가 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Roles 도메인 thin wrapper facade 신규 생성 | codex |
| 2026-03-13 | RoleFacade boundary 조합을 `@cocrepo/facade`로 이관 | codex |
