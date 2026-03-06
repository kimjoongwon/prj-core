# index dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/create/index.ts

## 역할

이 파일은 dto 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ./create-action.dto | 기능 구현 의존성 |
| ./create-assignment.dto | 기능 구현 의존성 |
| ./create-category.dto | 기능 구현 의존성 |
| ./create-exercise.dto | 기능 구현 의존성 |
| ./create-ground.dto | 기능 구현 의존성 |
| ./create-group.dto | 기능 구현 의존성 |
| ./create-oidc-client.dto | 기능 구현 의존성 |
| ./create-program.dto | 기능 구현 의존성 |
| ./create-role.dto | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | File 도메인 제거에 따라 create-file* export 의존성 제거 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
