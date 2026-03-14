# Users Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/users/users.module.ts

## 역할

`UsersController`가 `UserFacade`를 주입받도록 facade/service/context/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| UserFacade | Controller boundary 유즈케이스 및 응답 조립 |
| UserService | User 도메인 규칙 및 변경 처리 |
| UsersRepository | User 영속성 접근 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 및 접근 범위 제공 |
| AuthCacheService | 사용자 변경 후 인증 캐시 무효화 |

## exports

| export | 설명 |
|--------|------|
| UserFacade | 다른 모듈이 참조할 수 있는 User boundary 진입점 |
| UserService | JwtStrategy 등 전역 provider가 참조하는 User 도메인 서비스 |
| AuthCacheService | JwtStrategy와 사용자 갱신 흐름이 공유하는 인증 캐시 서비스 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | UsersModule export를 UserService 기준으로 정렬 | codex |
| 2026-03-11 | JwtStrategy 의존성 해결을 위해 UserService export를 추가 | codex |
| 2026-03-13 | UsersModule boundary provider/export를 `UserFacade` 기준으로 갱신 | codex |
| 2026-03-13 | AppModule의 JwtStrategy 주입 경로를 위해 AuthCacheService export를 추가 | codex |
