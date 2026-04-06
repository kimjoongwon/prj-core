# batch-assign-role-grant.dto dto 기획서

> 생성일: 2026-04-06
> 타입: dto
> 위치: packages/be-dto/src/grants/batch-assign-role-grant.dto.ts

## 역할

RoleGrant 배치 저장 요청 계약을 정의합니다. 역할 상세 화면이 선택한 Ability 집합을 `roleGrants` 배열로 전달할 때 사용하는 DTO입니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| BatchAssignRoleGrantItemDto | 개별 RoleGrant 저장 항목 |
| BatchAssignRoleGrantRequestDto | RoleGrant 전체 동기화 요청 본문 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @nestjs/swagger | Swagger 스키마 노출 |
| class-transformer | 배열 항목 타입 변환 |
| class-validator | 입력 검증 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 BatchGrantRequestDto를 RoleGrant 전용 요청 계약으로 교체 | codex |
