# {{name}} DTO 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: dto
> 위치: packages/be-dto/src/{{domain}}/{{name}}.dto.ts

## 역할

{{description}}

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
{{#each fields}}
| {{name}} | {{type}} | {{constraints}} | {{default}} | {{description}} |
{{/each}}

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
{{#each validationRules}}
| {{field}} | {{rule}} | {{message}} |
{{/each}}

## 변환 로직

### toEntity (생성 시)
```typescript
// DTO → Entity 변환 로직
```

### fromEntity (응답 시)
```typescript
// Entity → DTO 변환 로직
```

## 사용 예시

### 요청
```json
{
  {{#each exampleRequest}}
  "{{name}}": {{value}},
  {{/each}}
}
```

### 응답
```json
{
  {{#each exampleResponse}}
  "{{name}}": {{value}},
  {{/each}}
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
{{#each dependencies}}
| {{type}} | {{target}} | {{usage}} |
{{/each}}

## 구현 체크리스트

- [ ] {{name}}.dto.ts
- [ ] class-validator 데코레이터
- [ ] class-transformer 데코레이터
- [ ] Swagger @ApiProperty 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
