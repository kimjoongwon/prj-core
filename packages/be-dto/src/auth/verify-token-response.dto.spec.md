# verify-token-response.dto dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/auth/verify-token-response.dto.ts

## 역할

이 파일은 dto 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| VerifyTokenResponseDto | 공개 계약 요소 |

## 필드 계약

| 필드 | 타입 | 설명 |
|------|------|------|
| `valid` | boolean | 현재 액세스 토큰 유효 여부 |
| `accessTokenExpiresAt` | number | 액세스 토큰 만료 시각(ms) |
| `refreshTokenExpiresAt` | number | 리프레시 토큰 만료 시각(ms) |
| `hasFullAccess` | boolean | 현재 사용자가 `FULL_ACCESS` tenant role을 보유하는지 여부 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @nestjs/swagger | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | `hasFullAccess`를 `manage all`이 아니라 tenant role `FULL_ACCESS` 의미로 단순화 | codex |
| 2026-04-06 | `hasFullAccess`를 tenant 역할명이 아닌 `manage all` 전역 권한 의미로 재정의 | codex |
| 2026-03-23 | IDP 웹 권한 bootstrap을 위해 `hasFullAccess` 필드를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
