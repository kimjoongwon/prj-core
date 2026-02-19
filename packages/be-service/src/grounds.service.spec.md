# Grounds Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/grounds.service.ts

## 역할

Ground(공간/장소)를 조회하는 서비스입니다.
Space와 연결된 Ground 목록을 제공합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `GroundsRepository` | Ground 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAll` | - | `Promise<Ground[]>` | 모든 Ground 목록 조회 |
| `getById` | `id: string` | `Promise<Ground \| null>` | ID로 Ground 조회 |
| `getMyGrounds` | `spaceId: string` | `Promise<Ground[]>` | 내 Space의 Ground 목록 조회 |

## 비즈니스 규칙

- 현재 조회 기능만 제공 (생성/수정/삭제 미구현)
- Space 기반 필터링 지원

## 에러 처리

- 별도 에러 처리 없음 (조회 전용)

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] grounds.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
