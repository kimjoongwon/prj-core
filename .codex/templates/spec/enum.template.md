# {{name}} Enum 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: enum
> 위치: packages/common-enum/src/{{kebabCase name}}.ts

## 역할

{{description}}

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
{{#each values}}
| {{prismaValue}} | {{code}} | "{{name}}" | {{description}} |
{{/each}}

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class {{name}} extends BaseEnum {
{{#each values}}
  static readonly {{constantCase code}} = new {{name}}("{{code}}", "{{name}}");
{{/each}}

  private static readonly _values = [
{{#each values}}
    {{name}}.{{constantCase code}},
{{/each}}
  ] as const;

  static values(): {{name}}[] {
    return [...{{name}}._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum {{prismaEnumName}} {
{{#each values}}
  {{prismaValue}}
{{/each}}
}
```

## 매핑 규칙

| Prisma 값 | TypeScript Code | 변환 방식 |
|-----------|-----------------|----------|
{{#each values}}
| `{{prismaValue}}` | `{{name}}.{{constantCase code}}` | 직접 매핑 |
{{/each}}

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
{{#each usages}}
| {{domain}} | {{usage}} | {{description}} |
{{/each}}

## 비즈니스 규칙

{{#each businessRules}}
- {{this}}
{{/each}}

## 구현 체크리스트

- [ ] `{{kebabCase name}}.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
