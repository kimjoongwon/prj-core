# index dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/index.ts

## 역할

이 파일은 dto 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ./abilities | 기능 구현 의존성 |
| ./ability.dto | 기능 구현 의존성 |
| ./abstract.dto | 기능 구현 의존성 |
| ./action.dto | 기능 구현 의존성 |
| ./ai-form-template | 기능 구현 의존성 |
| ./album | 기능 구현 의존성 |
| ./album-entry | 기능 구현 의존성 |
| ./asset | 기능 구현 의존성 |
| ./auth | 기능 구현 의존성 |
| ./auth-audit-log.dto | 기능 구현 의존성 |
| ./auth-session-info.dto | 기능 구현 의존성 |
| ./category.dto | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | File 관련 DTO export 제거에 맞춰 배럴 계약 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
