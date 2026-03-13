# Redis Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/redis.service/index.ts

## 역할

Redis 클라이언트를 NestJS 라이프사이클에 통합하는 인프라 서비스입니다.
ioredis 기반으로 키-값 저장/조회/삭제, TTL 관리, 패턴 조회 등의 기본 Redis 작업을 제공합니다.
Redis 연결/재연결 상태를 상세히 로깅합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `ConfigService` | Redis 설정값 조회 |
| `Redis` (ioredis) | Redis 클라이언트 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getClient` | - | `Redis` | 원시 Redis 클라이언트 반환 |
| `set` | `key: string, value: string, ttlSeconds?: number` | `Promise<void>` | 값 저장 (TTL 옵션) |
| `get` | `key: string` | `Promise<string \| null>` | 값 조회 |
| `del` | `key: string` | `Promise<number>` | 키 삭제 |
| `exists` | `key: string` | `Promise<boolean>` | 키 존재 여부 확인 |
| `expire` | `key: string, ttlSeconds: number` | `Promise<boolean>` | TTL 설정 |
| `keys` | `pattern: string` | `Promise<string[]>` | 패턴으로 키 조회 |
| `delByPattern` | `pattern: string` | `Promise<number>` | 패턴으로 여러 키 삭제 |

## 비즈니스 규칙

- 재연결 전략: 최대 3회, 지수 백오프 (최대 2000ms)
- 3회 초과 시 재연결 중단
- TTL 있는 경우 `SETEX`, 없는 경우 `SET` 사용

## Redis 설정 환경변수

| 설정 경로 | 기본값 | 설명 |
|----------|--------|------|
| redis.host | localhost | Redis 호스트 |
| redis.port | 6379 | Redis 포트 |
| redis.password | - | Redis 비밀번호 |

## 에러 처리

| 에러 상황 | 처리 방식 |
|----------|-----------|
| Redis 연결 오류 | 에러 이벤트 로깅 |
| PING 실패 (초기화) | 에러 로그 (앱 중단 없음) |

## 권한 요구사항

- 내부 인프라 서비스 (다른 서비스에서 직접 주입받아 사용)

## 구현 체크리스트

- [x] redis.service.ts
- [x] `@Injectable()` 데코레이터
- [x] `OnModuleInit`, `OnModuleDestroy` 구현
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `redis.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
