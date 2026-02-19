# Subjects Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/subjects.service.ts

## 역할

CASL Subject(권한 대상 엔티티)를 관리합니다.
DB의 Subject 테이블에서 Subject를 조회하고, Prisma DMMF에서 엔티티 필드 정보를 가져옵니다.
DMMF 기반 필드 정보는 인스턴스 레벨에서 캐싱합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `SubjectsRepository` | Subject DB 조회 |
| `getDmmfParser` (@cocrepo/prisma) | Prisma 스키마 DMMF 파싱 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getSubjects` | - | `Promise<SubjectInfo[]>` | 모든 Subject 조회 |
| `getSubjectsByGroup` | `group: string` | `Promise<SubjectInfo[]>` | 그룹별 Subject 조회 |
| `getSubjectById` | `id: string` | `Promise<SubjectInfo \| null>` | Subject ID로 조회 |
| `getSubjectByName` | `name: string` | `Promise<SubjectInfo \| null>` | Subject 이름으로 조회 |
| `getSubjectNames` | - | `Promise<string[]>` | Subject 이름 목록 조회 |
| `getSubjectFields` | `subjectName: string` | `Promise<SubjectFieldInfo[]>` | 특정 Subject의 필드 목록 조회 |
| `isValidSubject` | `subjectName: string` | `Promise<boolean>` | 유효한 Subject인지 확인 |
| `getSubjectNameById` | `id: string` | `Promise<string \| null>` | Subject ID로 이름 조회 |
| `getSubjectIdByName` | `name: string` | `Promise<string \| null>` | Subject 이름으로 ID 조회 |
| `clearCache` | - | `void` | DMMF 필드 캐시 초기화 |

## 비즈니스 규칙

- Subject 그룹: `all`, `entity`, `menu`, `feature`
- `entity:User` 형태의 Subject는 `User` 모델명으로 DMMF에서 필드 조회
- DMMF 파싱 실패 시 경고 로그, 필드 정보 빈 배열 반환 (서비스 중단 없음)
- 캐시: 인스턴스 레벨(싱글턴), 서버 재시작 또는 `clearCache()` 호출 시 초기화

## 인터페이스

```typescript
interface SubjectInfo {
  id: string;
  name: string;
  displayName: string | null;
  icon: string | null;
  group: string | null;
  order: number;
  isSystem: boolean;
  fields: SubjectFieldInfo[];
}

interface SubjectFieldInfo {
  name: string;
  displayName: string | null;
  type: string;
  isRequired: boolean;
  isRelation: boolean;
}
```

## 에러 처리

- DMMF 파싱 실패: 경고 로그, 빈 배열 반환

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] subjects.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
