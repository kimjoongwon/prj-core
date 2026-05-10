# {{name}} ApplicationService Contract 섹션 템플릿

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: application-service-contract
> 구현 위치: packages/be-app/src/{{name}}.application-service.ts

> 사용 규칙: 이 내용은 route `page.spec.md` 또는 app handoff 문서의 ApplicationService Contract 섹션에 삽입합니다. ApplicationService 전용 `*.spec.md` 파일은 생성하지 않습니다.

## 역할

Controller가 호출하는 유즈케이스를 조정하고, 내부 Service 및 외부 Integration Facade 호출 순서를 관리합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
{{#each services}}
| {{name}} | {{usage}} |
{{/each}}

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
{{#each methods}}
| {{name}} | {{params}} | {{returnType}} | {{description}} |
{{/each}}

## 유즈케이스 흐름

```text
Controller
  ↓
ApplicationService
  ├─ Service
  ├─ Service
  └─ Integration Facade (optional)
```

## 비즈니스 규칙

{{#each businessRules}}
- {{this}}
{{/each}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
