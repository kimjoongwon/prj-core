# Subjects Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/subject/subjects.controller.ts`

## 역할

Subject(대상) 관련 읽기 전용 API를 제공합니다. Subject는 CASL 기반 권한 시스템에서 권한의 대상(entity, menu, feature, ui)을 정의하며, entity 그룹 Subject의 경우 Prisma DMMF에서 필드 정보를 조회할 수 있습니다.

## 베이스 경로

`/api/v1/subjects`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | Query: `group?`, `type?` (string) | `SubjectDto[]` | Subject 목록 조회. group 파라미터로 필터링 가능 |
| GET | `/:id` | Param: `id` (UUID) | `SubjectDto` | Subject 상세 조회 |
| GET | `/:id/fields` | Param: `id` (UUID) | `SubjectFieldDto[]` | Subject 필드 목록 조회 (entity 그룹만 DMMF 필드 반환) |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET `/` | X (`@Public()`) | 없음 |
| GET `/:id` | X (`@Public()`) | 없음 |
| GET `/:id/fields` | X (`@Public()`) | 없음 |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `SubjectsService` | Subject 조회, 필드 조회 로직 |

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| GET `/` | `common.subject.list.success` |
| GET `/:id` | `common.subject.read.success` |
| GET `/:id/fields` | `common.subject.fields.success` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| GET `/` | 500 | 서버 에러 |
| GET `/:id` | 404 | Subject 미존재 |
| GET `/:id` | 500 | 서버 에러 |
| GET `/:id/fields` | 404 | Subject 미존재 |
| GET `/:id/fields` | 500 | 서버 에러 |

## 특이사항

- 모든 엔드포인트가 `@Public()` (인증 불필요)
- 필드 조회 시 ID로 Subject를 먼저 조회하여 name을 가져온 후, name으로 DMMF 필드를 조회
- entity 그룹이 아닌 Subject의 필드 조회 시 빈 배열 반환
- API 태그: `SUBJECTS`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
