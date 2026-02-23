# MoveFolderDto DTO 기획서

> 생성일: 2026-02-23
> 타입: dto
> 위치: packages/be-dto/src/folder/move-folder.dto.ts

## 역할

폴더 이동 API의 요청 데이터를 검증하는 DTO입니다. 폴더를 다른 상위 폴더로 이동할 때 사용합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| targetFolderId | string \| null | optional, UUID | - | 이동할 대상 폴더 ID (null이면 루트로 이동) |

## 비즈니스 규칙

1. **targetFolderId가 null인 경우**: 폴더를 루트 레벨로 이동
2. **targetFolderId가 있는 경우**: 해당 폴더의 하위로 이동
3. **자기 자신으로 이동 불가**: targetFolderId가 이동하려는 폴더의 ID와 같으면 안 됨
4. **하위 폴더로 이동 불가**: 자신의 하위 폴더를 상위 폴더로 지정할 수 없음

## 사용 예시

### 폴더 이동 (다른 폴더 하위로)
```json
{
  "targetFolderId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 폴더 이동 (루트로)
```json
{
  "targetFolderId": null
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Decorator | @cocrepo/decorator | UUIDFieldOptional |

## 구현 체크리스트

- [x] move-folder.dto.ts
- [x] Swagger @ApiPropertyOptional 데코레이터
- [x] index.ts export 추가

## 상위 기획서

- `apps/server/src/module/assets/controllers/folder.controller.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-controller-builder |
