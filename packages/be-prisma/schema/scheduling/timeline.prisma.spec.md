# timeline.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/scheduling/timeline.prisma

## 역할

Timeline/Session/Program과 세션 enum을 포함한 일정 실행 도메인을 정의합니다.
`Program`은 실제 운영 단위를, `ProgramActivity`는 생성 시점의 실행 운동 계획 snapshot을 표현합니다.

## 운영 규칙

- `timeline.prisma` 변경 시 `timeline.prisma.spec.md`를 함께 갱신합니다.
- Session enum과 Session 모델 필드의 일관성을 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.
- `Program`은 `routineId` live reference와 `routineNameSnapshot`/`routineLabelSnapshot`을 함께 보관합니다.
- `ProgramActivity`는 `Activity`와 `Exercise`를 Program 운영 문맥으로 번역한 snapshot child로 유지합니다.
- `ProgramActivity`는 `programId + taskId` 조합을 유일하게 유지해 하나의 Program 안에서 동일 Task snapshot이 중복 저장되지 않도록 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | `ProgramActivity` 실행 snapshot child와 `Program` routine snapshot 필드를 추가해 운영 aggregate가 실제 실행 계획을 고정하도록 확장 | codex |
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용으로 task.prisma에서 timeline 도메인 분리 | codex |
