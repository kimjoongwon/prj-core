# role-grant-response.dto dto 기획서

> 생성일: 2026-04-06
> 타입: dto
> 위치: packages/be-dto/src/grants/role-grant-response.dto.ts

## 역할

RoleGrant 저장 결과를 응답으로 반환하는 직렬화 계약입니다. 다형성 `granteeType/granteeId` 대신 `roleId`를 명시해 역할 권한 할당임을 응답에서 직접 드러냅니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| RoleGrantResponseDto | RoleGrant 응답 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @nestjs/swagger | Swagger 스키마 노출 |
| class-transformer | 응답 직렬화 |
| ../abilities/ability-response.dto | Ability 상세 포함 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 GrantResponseDto를 RoleGrant 전용 응답 계약으로 교체 | codex |
