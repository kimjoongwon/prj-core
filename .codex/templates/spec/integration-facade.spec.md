# {{name}} Integration Facade 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: integration-facade
> 위치: packages/be-integration/src/{{name}}.facade.ts

## 역할

외부 시스템 또는 복잡한 기술 서브시스템을 단순한 인터페이스로 캡슐화합니다.

## 외부 계약

| 항목 | 설명 |
|------|------|
{{#each contracts}}
| {{name}} | {{description}} |
{{/each}}

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
{{#each methods}}
| {{name}} | {{params}} | {{returnType}} | {{description}} |
{{/each}}

## 내부 처리 범위

- 외부 요청/응답 변환
- 인증 헤더/서명/endpoint 설정 캡슐화
- 공급자별 예외를 도메인 친화적 예외로 변환

## 금지 사항

- Repository/Prisma 직접 호출
- Aggregate 상태 전이 처리
- 여러 내부 Service를 조합한 비즈니스 유즈케이스 수행

## 오류 처리

| 상황 | 예외/처리 | 설명 |
|------|-----------|------|
{{#each errors}}
| {{situation}} | {{exception}} | {{description}} |
{{/each}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
