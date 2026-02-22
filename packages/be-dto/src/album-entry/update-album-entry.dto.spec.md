# UpdateAlbumEntryDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album-entry/update-album-entry.dto.ts

## 역할

앨범 내 에셋의 캡션이나 순서를 수정할 때 사용하는 DTO입니다. 모든 필드가 선택사항입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| caption | string | optional, max 500자 | - | 에셋 캡션 |
| position | number | optional, min 0 | - | 앨범 내 순서 |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| caption | 문자열 길이 0-500 | "캡션은 500자 이하여야 합니다" |
| position | 0 이상의 정수 | "순서 값이 올바르지 않습니다" |

## 비즈니스 규칙

- position 변경 시 기존 항목들의 position이 조정됨
- 캡션에 빈 문자열을 지정하면 캡션 제거

## 사용 예시

### 요청 - 캡션 추가
```json
{
  "caption": "해녀 체험 사진"
}
```

### 요청 - 순서 변경
```json
{
  "position": 5
}
```

### 요청 - 복합 변경
```json
{
  "caption": "해녀 체험 사진 - 수정됨",
  "position": 3
}
```

## 의존성

없음

## 구현 체크리스트

- [ ] update-album-entry.dto.ts
- [ ] class-validator 데코레이터 (@IsString, @IsNumber, @MaxLength, @Min)
- [ ] Swagger @ApiPropertyOptional 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album-entry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
