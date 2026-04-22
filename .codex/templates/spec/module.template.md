# {{name}} Module 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: module
> 위치: apps/core/api/src/module/{{module}}/{{name}}.module.ts

## 역할

aggregate root 기준으로 Controller와 ApplicationService wiring을 구성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
{{#each contracts}}
| {{name}} | {{description}} |
{{/each}}

## 의존성

| 계층 | 대상 | 용도 |
|------|------|------|
{{#each dependencies}}
| {{layer}} | {{target}} | {{purpose}} |
{{/each}}

## 구성 규칙

- module 폴더는 aggregate root 기준으로 유지합니다.
- Controller는 기본적으로 `@cocrepo/app`의 ApplicationService를 진입점으로 사용합니다.
- 단일 aggregate-root 전달형 유즈케이스는 동일 Service로 직접 전달할 수 있습니다.
- Service/Repository provider는 각각 `@cocrepo/service`, `@cocrepo/repository`에서 연결합니다.
- child resource는 독립 top-level module로 분리하지 않고 root module 아래에서 다룹니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
