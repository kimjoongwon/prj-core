# create-program.dto dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/create/create-program.dto.ts

## 역할

이 파일은 Program 생성 요청 DTO를 정의합니다.
쓰기 요청에서는 `routineId` 중심의 운영 메타만 받고, session 연결값과 snapshot read model 필드는 제외합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| CreateProgramDto | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @nestjs/swagger | 기능 구현 의존성 |
| ../constant | 기능 구현 의존성 |
| ../program.dto | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program 생성 DTO에서 routine snapshot 및 execution summary/detail 필드를 제외하는 쓰기 계약으로 갱신 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
