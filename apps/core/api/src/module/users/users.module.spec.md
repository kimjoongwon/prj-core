# Users Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/users/users.module.ts

## 역할

`UsersController`가 Service와 User service/context/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| UsersService | Controller 진입용 User 유즈케이스 |
| UsersService | User 도메인 서비스 |
| UsersRepository | User 영속성 접근 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 및 접근 범위 제공 |
| AuthCacheService | 사용자 변경 후 인증 캐시 무효화 |

## exports

| export | 설명 |
|--------|------|
| UsersService | 다른 모듈이 참조할 수 있는 User application 진입점 |
| UsersService | JwtStrategy 등 AppModule 전역 provider가 참조하는 User 도메인 서비스 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | UsersModule export를 UsersService 기준으로 정렬 | codex |
| 2026-03-11 | JwtStrategy 의존성 해결을 위해 UsersService export를 추가 | codex |
