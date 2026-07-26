# Seed 데이터 운영 가이드: 처음 보는 사람용

이 문서는 DB에 미리 넣어 두는 데이터를 **어떤 종류로 나누고, 개발과 운영에서 어떻게 안전하게 넣는지** 설명합니다.

아래 한 줄만 먼저 기억하면 됩니다.

> 운영에서 계속 같아야 하는 데이터, 처음 한 번 필요한 데이터, 개발용 가짜 데이터를 서로 섞지 않습니다.

Prisma 파일 배치 규칙은
[schema-file-conventions.md](./schema-file-conventions.md)를 봅니다.

필드 추가와 backfill 순서는
[schema-change-playbook.md](./schema-change-playbook.md)를 봅니다.

## 1. 이 문서는 언제 보나요?

다음 작업을 할 때 봅니다.

- `seed.ts`나 `data-migrate.ts`를 수정할 때
- Role, Action, Subject, OIDC Client 같은 값을 추가할 때
- 기본 관리자, 기본 템플릿, 기본 정책을 추가할 때
- 개발용 샘플 사용자를 만들 때
- 어떤 데이터를 운영 배포 때 자동으로 넣을지 정할 때
- 기존 seed 데이터를 reference, bootstrap, demo 중 어디로 옮길지 판단할 때

## 2. Seed 데이터가 무엇인가요?

Seed 데이터는 시스템을 시작하거나 개발하기 위해 DB에 미리 넣는 데이터입니다.

하지만 “미리 넣는다”는 이유만으로 모두 같은 종류는 아닙니다.

학교를 새로 연다고 비유해 보겠습니다.

- **Reference Data**는 학교 전체가 따라야 하는 학년 코드와 권한 규칙입니다.
- **Bootstrap Data**는 개교할 때 만드는 교장 계정과 기본 교실입니다.
- **Demo/Test Data**는 수업 연습을 위해 만든 가짜 학생 명단입니다.

세 가지를 한꺼번에 다시 넣으면 어떻게 될까요?

- 운영 중인 교장 계정이 덮어써질 수 있습니다.
- 실제 학생 사이에 가짜 학생이 생길 수 있습니다.
- 누가 언제 규칙을 바꿨는지 알기 어렵습니다.

그래서 데이터 종류마다 파일 위치와 실행 방법을 나눕니다.

## 3. 세 종류를 먼저 구분합니다

### A. Reference Data: 코드가 정답인 운영 기준 데이터

DB에 저장되지만 Git 저장소의 정의가 정답이어야 하는 데이터입니다.

예:

- `Role`
- `Action`
- `Subject`
- `Ability`, `PolicyEntry`, `RoleAssignment`
- `OidcClient`
- 코드가 소유하는 `Translation`
- system space의 일부 taxonomy

Reference Data의 특징:

- 운영 환경마다 같은 안정적인 key가 필요합니다.
- 운영자가 임의로 바꾸면 코드 계약과 충돌할 수 있습니다.
- 새 환경에는 생성해야 합니다.
- 기존 환경에는 변경된 값을 갱신해야 합니다.
- 언제 무엇을 반영했는지 이력이 필요합니다.
- 같은 migration을 다시 실행해도 안전해야 합니다.

### B. Bootstrap Data: 처음 환경을 만들 때 필요한 데이터

시스템을 처음 세울 때 넣는 초기 구조와 기본값입니다.

예:

- 최초 관리자 계정
- system space
- 최초 tenant 연결
- system fitness center
- 기본 보안 정책
- 기본 메시지 템플릿

Bootstrap Data의 특징:

- 처음 시작할 때는 필요합니다.
- 시작 후 운영자가 수정할 수 있습니다.
- 운영 중 계속 코드 값으로 덮어쓰면 안 될 수 있습니다.
- 자동 배포마다 다시 실행하지 않습니다.
- 필요한 사람이 명시적으로 실행합니다.

### C. Demo/Test Data: 개발과 테스트용 가짜 데이터

화면 확인, 데모, E2E 테스트를 위해 만든 샘플 데이터입니다.

예:

- 샘플 일반 사용자
- 샘플 fitness center
- 샘플 timeline과 exercise
- 샘플 asset
- 샘플 inquiry

Demo/Test Data의 특징:

- 실제 운영 의미가 없습니다.
- 개발이나 테스트가 편해지도록 만듭니다.
- 운영 DB에는 자동으로 넣지 않습니다.

### Prisma model 분류와는 다른 판단입니다

이 문서의 **Reference Data**와 메타데이터 가이드의 Prisma model 분류는 판단 단위가 다릅니다.

| 구분                       | 기준 문서 또는 답하는 질문                                | 판단 단위       |
| -------------------------- | --------------------------------------------------------- | --------------- |
| Prisma model 분류          | `schema-metadata-guide.md`의 데이터 타입 판단 기준         | model 전체      |
| Seed 운영의 Reference Data | 이 row의 정답을 Git 코드가 소유하고 운영 DB에 동기화할까? | row와 운영 정책 |

model 분류만 보고 모든 row를 자동 동기화하면 안 됩니다. 운영자가 만드는 row가 같은 테이블에 함께 있을 수 있기 때문입니다.

어떤 model 분류에서도 일부 row를 코드 계약으로 소유해야 할 수 있습니다. 이때 그 row는 Seed 운영상 Reference Data가 될 수 있지만 model 분류를 바꿀 이유는 아닙니다.

항상 두 질문을 따로 답합니다.

1. model의 업무 성격은 무엇인가?
2. 어떤 row의 값을 누가 소유하고 어떻게 배포하는가?

모델 타입의 자세한 기준은
[schema-metadata-guide.md](./schema-metadata-guide.md)를 봅니다.

## 4. 30초 분류 질문

새 데이터를 추가하려면 아래 질문을 순서대로 봅니다.

### 질문 1

앱이 모든 운영 환경에서 이 데이터의 같은 key와 의미를 기대하나요?

- 예: Reference Data일 가능성이 큽니다.

### 질문 2

운영자가 값을 바꿔도 되나요?

- 예: Bootstrap Data 또는 일반 업무 데이터일 가능성이 큽니다.
- 아니요: Reference Data일 가능성이 큽니다.

### 질문 3

시스템을 처음 만들 때만 필요한가요?

- 예: Bootstrap Data입니다.

### 질문 4

화면 확인이나 테스트를 위한 가짜 예시인가요?

- 예: Demo/Test Data입니다.

### 질문 5

기존 운영 row도 새 코드 기준에 맞춰 update해야 하나요?

- 예: Bootstrap만으로 처리하면 안 됩니다.
- 코드 계약이라면 Reference Data로 관리합니다.
- 일반 업무 데이터라면 별도 backfill을 계획합니다.

## 5. 한눈에 비교하기

| 구분      | 정답을 소유하는 곳           | 운영 자동 반영 | 기존 row update | 대표 실행 방법             |
| --------- | ---------------------------- | -------------- | --------------- | -------------------------- |
| Reference | Git의 코드 정의              | 허용           | 필요            | `db:data:migrate`          |
| Bootstrap | 초기화 코드와 이후 운영 상태 | 금지           | 보통 하지 않음  | `db:bootstrap`을 명시 실행 |
| Demo/Test | 개발·테스트 코드             | 금지           | 의미 없음       | dev/test에서만 실행        |

## 6. 현재 저장소의 파일 구조

```text
packages/be-prisma/
├── schema/                         # 하위 폴더 없는 Prisma 설계도
│   ├── _base.prisma               # generator와 datasource
│   ├── _enums.prisma              # 모든 enum
│   └── reference-data-migration-history.prisma # 적용 이력 model 하나
├── migrations/                     # schema migration SQL
├── seed.ts                         # bootstrap 실행 입구
├── data-migrate.ts                 # reference-data migration 실행 입구
└── src/
    ├── reference-data/
    │   ├── definitions/            # 코드가 정답인 기준값
    │   ├── migrations/             # 순서와 ID가 있는 변경 기록
    │   ├── sync-reference-data.ts  # 정의와 실제 DB를 맞추는 로직
    │   └── run-reference-data-migrations.ts
    ├── bootstrap/
    │   ├── data/                   # 처음 넣는 기본값
    │   └── *.ts                    # 초기 적재 실행 흐름
    └── demo-data/                  # 개발·스테이징 샘플 데이터
```

중요한 점:

- `seed.ts` 자체에는 복잡한 로직을 쌓지 않습니다.
- 실제 bootstrap 흐름은 `src/bootstrap/**`가 담당합니다.
- Reference Data 정의는 `src/reference-data/definitions/**`에 둡니다.
- 적용된 Reference Data migration은 `reference_data_migration_history`에 기록됩니다.
- Bootstrap과 Demo는 Reference Data처럼 버전별 적용 이력을 자동으로 남기지 않습니다.

## 7. 현재 실행 흐름

### Reference Data 경로

```text
src/reference-data/definitions/**
            +
src/reference-data/migrations/**
            |
            v
       data-migrate.ts
            |
            v
pnpm db:data:migrate[:환경]
            |
            v
reference_data_migration_history
```

### Bootstrap과 Demo 경로

```text
src/bootstrap/data/**
src/demo-data/**
            |
            v
src/bootstrap/**
            |
            v
          seed.ts
            |
            v
pnpm db:bootstrap
또는 pnpm db:bootstrap:stg
```

두 경로가 같은 패키지 안에 있어도 목적은 다릅니다. 운영 자동 배포에서 허용하는 것은 Reference Data 경로뿐입니다.

## 8. 왜 운영에서 전체 seed를 다시 실행하면 위험한가요?

운영 DB에는 실제 사용자가 만든 데이터와 운영자가 조정한 값이 있습니다.

전체 seed나 bootstrap을 다시 실행하면 다음 문제가 생길 수 있습니다.

1. 운영 기준 데이터와 샘플 데이터가 섞입니다.
2. 운영자가 바꾼 기본 정책이나 템플릿이 덮어써질 수 있습니다.
3. 가짜 사용자와 샘플 문의가 운영 DB에 들어갈 수 있습니다.
4. 어떤 변경만 반영됐는지 추적하기 어렵습니다.
5. 여러 앱이 같은 DB를 사용할 때 실행 시점이 어긋날 수 있습니다.

쉽게 말하면, 이미 사람이 사는 집에 “처음 입주용 가구 트럭”을 매번 다시 부르는 것과 같습니다.

운영에서는 전체 트럭을 다시 부르지 않습니다. 이번에 바뀐 운영 규칙만 번호가 붙은 migration으로 반영합니다.

## 9. Reference Data 운영 규칙

### 규칙 1. Git의 코드가 정답입니다

Reference Data는 DB에서 손으로 맞추는 것이 아니라 `src/reference-data/definitions/**`의 정의를 기준으로 맞춥니다.

### 규칙 2. 바뀌지 않는 key로 찾습니다

화면에 보이는 이름은 바뀔 수 있습니다. Reference Data는 오래 유지되는 key로 찾습니다.

예:

- `role.name`
- `action.name`
- `subject.name`
- `oidcClient.clientId`
- `translation.languageCode + key`

표시 문구처럼 자주 바뀌는 값을 식별자로 사용하지 않습니다.

### 규칙 3. 새 환경과 기존 환경을 모두 처리합니다

sync 로직은 보통 두 경우를 모두 다룹니다.

- row가 없으면 `create`
- row가 있으면 `update`

create만 수정하면 기존 운영 DB가 바뀌지 않습니다. update만 수정하면 새 환경 생성이 실패하거나 값이 빠질 수 있습니다.

### 규칙 4. 변경마다 새 migration을 추가합니다

이미 적용된 migration 파일을 수정하지 않습니다.

잘못된 방법:

```text
예전에 실행된 20260317190000_initial-reference-data.ts 내용을 수정
```

올바른 방법:

```text
새 ID를 가진 migration 파일 추가
-> migrations/index.ts에 등록
-> db:data:migrate 실행
```

DB는 예전 migration ID가 이미 실행됐다고 기억합니다. 파일만 고쳐도 그 DB에서 다시 실행되지 않습니다.

### 규칙 5. 기본 동작은 생성과 수정만 허용합니다

운영 데이터 삭제는 위험합니다. 일반 sync는 insert/update만 수행합니다.

삭제가 정말 필요하면 다음 내용을 명확히 한 별도 migration으로 처리합니다.

- 어떤 key를 삭제하는가
- 그 row를 참조하는 데이터가 있는가
- 앱이 더 이상 사용하지 않는가
- 재실행해도 안전한가
- 실패했을 때 어떻게 복구하는가

### 규칙 6. 다시 실행해도 안전해야 합니다

같은 `db:data:migrate` 명령이 두 번 실행되어도 중복 row가 생기거나 값이 망가지면 안 됩니다.

이를 idempotent하다고 합니다.

## 10. Reference Data를 바꾸는 실제 순서

예를 들어 새 Role을 추가한다고 가정합니다.

1. 이 Role이 정말 모든 운영 환경에 필요한 코드 계약인지 확인합니다.
2. 안정적인 immutable key를 정합니다.
3. `src/reference-data/definitions/**`에 정의를 추가합니다.
4. sync 로직의 create와 update 동작을 확인합니다.
5. 새 migration 파일을 `src/reference-data/migrations/`에 추가합니다.
6. `src/reference-data/migrations/index.ts`에 등록합니다.
7. 관련 테스트를 작성하거나 갱신합니다.
8. 로컬에서 `db:data:migrate`를 실행합니다.
9. 같은 명령을 한 번 더 실행해도 안전한지 확인합니다.
10. 실제 row 값과 migration history를 확인합니다.
11. 운영에서는 schema migration 다음에 data migration을 실행합니다.
12. 마지막에 새 앱을 배포합니다.

schema 변경도 함께 있다면 순서는 아래와 같습니다.

```text
1. prisma migrate deploy
2. reference-data migration apply
3. app rollout
```

운영 명령:

```bash
pnpm --filter=@cocrepo/prisma db:migrate:deploy:prod
pnpm --filter=@cocrepo/prisma db:data:migrate:prod
```

## 11. Bootstrap Data 운영 규칙

### 규칙 1. 처음 환경을 만들 때 사용합니다

Bootstrap은 빈 환경에 기본 구조를 만드는 도구입니다. 운영 중인 모든 값을 계속 코드와 같게 만드는 도구가 아닙니다.

### 규칙 2. 자동 운영 배포에서 실행하지 않습니다

운영에는 `db:seed:prod`나 `db:bootstrap:prod` 같은 자동 실행 경로를 만들지 않습니다.

### 규칙 3. 운영자가 수정할 수 있는 값을 덮어쓰지 않습니다

기본 보안 정책이나 템플릿은 처음에는 필요하지만 이후 운영자가 수정할 수 있습니다. 이런 값은 bootstrap 재실행으로 되돌리지 않습니다.

### 규칙 4. 운영 계약으로 굳으면 Reference Data로 승격합니다

처음에는 bootstrap이었어도 아래 신호가 생기면 분류를 다시 봅니다.

1. 기존 운영 row를 코드 기준으로 계속 맞춰야 한다.
2. `없으면 create`만으로 부족하고 update도 필요하다.
3. 앱이 특정 key나 row 존재를 전제로 동작한다.
4. 배포 이력과 재실행 안전성이 필요하다.

모두 Reference Data 승격 신호입니다.

## 12. Demo/Test Data 운영 규칙

- dev, test, 필요한 경우 명시적인 stg에서만 사용합니다.
- 실제 사람이나 회사로 오해할 수 없는 샘플 값을 사용합니다.
- 운영 자동 배포 경로에 포함하지 않습니다.
- Reference Data 정의와 같은 파일에 섞지 않습니다.
- 테스트가 끝난 뒤 남아 있어도 운영 의미가 생기지 않게 설계합니다.

Demo/Test Data가 없으면 앱이 동작하지 않는다면 그것은 demo가 아니라 Reference 또는 Bootstrap일 가능성이 큽니다.

## 13. 현재 코드의 권장 분류

### Reference Data

| 현재 이름                    | 이유                          |
| ---------------------------- | ----------------------------- |
| `roleSeedData`               | 시스템 역할 계약              |
| `roleCategorySeedData`       | 역할 분류 체계                |
| `roleClassificationSeedData` | 역할과 카테고리의 계약        |
| `roleGroupSeedData`          | 역할 그룹 체계                |
| `roleAssociationSeedData`    | 역할과 그룹의 계약            |
| `subjectSeedData`            | 권한 subject 계약             |
| `actionSeedData`             | 권한 action 계약              |
| `abilitySeedData`            | 권한 규칙 계약                |
| `oidcClientSeedData`         | 인증 client 계약              |
| `spaceCategorySeedData`      | ROOT/BRANCH 공간 분류 계약    |
| `translationSeedData`        | 코드가 소유하는 공통 번역 key |

### Bootstrap Data

| 현재 이름 또는 로직                         | 이유                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `userSeedData`의 super admin                | 최초 운영 관리자 계정은 명시적으로 만드는 편이 안전 |
| `SYSTEM_SPACE_ID`와 system space 생성       | 최초 시스템 구조                                    |
| system tenant 생성                          | 최초 연결 관계                                      |
| system fitness center                      | 시스템 공간의 초기 시설                             |
| `ensureSystemBootstrap`의 system group 준비 | system space 내부 초기 구조                         |
| `classifyFitnessCenterSpacesAsBranch`       | bootstrap 공간의 후속 정리                          |
| `createHierarchicalTenants`                 | 최초 tenant 계층 연결                               |
| `securityPolicySeedData`                    | 운영자가 바꿀 수 있는 create-only 기본값            |
| `templateSeedData`                          | 운영자가 바꿀 수 있는 기본 템플릿                   |

### Demo/Test Data

| 현재 이름 또는 로직                       | 이유                         |
| ----------------------------------------- | ---------------------------- |
| `createRegularUsersAndFitnessCenters`     | 일반 사용자와 시설 샘플      |
| `timelineSeedData`                        | 샘플 timeline                |
| `exerciseCatalogSeedData`                 | 샘플 task와 exercise 입력값  |
| `sessionTemplateSeedData`                 | 샘플 session 구성            |
| `sessionLoadProfileSeedData`              | 샘플 사용자 부하 정보        |
| `createTimelineSessionExerciseDomainData` | 샘플 일정 도메인 데이터      |
| `assetSeedData` 계열                      | 샘플 asset                   |
| `inquirySeedData` 계열                    | 샘플 inquiry                 |
| `inquiryTagMasterData`                    | 샘플 inquiry tag 보조 데이터 |

### 정리가 필요한 항목

| 이름                | 현재 상태                                                |
| ------------------- | -------------------------------------------------------- |
| `agreementSeedData` | 정의는 있으나 현재 `seed.ts` 실행 흐름에서 사용하지 않음 |

## 14. 환경별 실행 원칙

### 개인 개발 환경

빠른 반복을 위해 reset과 bootstrap을 사용할 수 있습니다.

```bash
pnpm --filter=@cocrepo/prisma db:reset
pnpm --filter=@cocrepo/prisma db:bootstrap
```

reset은 DB 데이터를 지우므로 공유 DB나 운영 DB에 사용하면 안 됩니다.

### 공유 개발 환경

- 다른 개발자의 데이터가 있으므로 함부로 reset하지 않습니다.
- schema migration과 reference-data migration을 사용합니다.
- bootstrap이 필요하면 영향 범위를 확인하고 명시적으로 실행합니다.

### 스테이징

- 운영과 같은 `schema -> reference data -> app` 순서를 검증합니다.
- 자동 실행 기본값은 `db:data:migrate:stg`입니다.
- bootstrap은 필요한 사람이 명시적으로 실행합니다.
- demo data가 필요한지 환경 목적에 맞게 결정합니다.

### 운영

허용:

```bash
pnpm --filter=@cocrepo/prisma db:migrate:deploy:prod
pnpm --filter=@cocrepo/prisma db:data:migrate:prod
```

자동 실행 금지:

- 전체 seed
- bootstrap
- demo/test data
- DB reset
- 기록 없는 임의의 `db push`

## 15. 현재 명령 모음

```bash
# dev bootstrap
pnpm --filter=@cocrepo/prisma db:seed
pnpm --filter=@cocrepo/prisma db:bootstrap

# stg bootstrap: 자동이 아니라 명시 실행
pnpm --filter=@cocrepo/prisma db:bootstrap:stg

# reference-data migration
pnpm --filter=@cocrepo/prisma db:data:migrate
pnpm --filter=@cocrepo/prisma db:data:migrate:stg
pnpm --filter=@cocrepo/prisma db:data:migrate:prod
```

`db:seed`는 현재 dev bootstrap의 별칭입니다.

환경 명령을 실행하기 전에 연결 대상 DB가 정말 의도한 dev, stg, prod인지 확인합니다.

## 16. 현재 배포 연결 방식

현재는 `prj-devops`의 API Helm chart에 ArgoCD `PreSync` Job을 붙여 DB 변경을 앱 배포보다 먼저 실행합니다.

```text
OpenBao Secret Sync
        |
        v
API chart sync
        |
        v
PreSync migration Job
  1. prisma migrate deploy
  2. db:data:migrate
        |
        v
API rollout
```

핵심은 앱 컨테이너가 켜진 뒤 migration을 실행하는 것이 아닙니다. 앱 배포 전에 별도 Job이 DB 준비를 끝냅니다.

장점:

- 현재 앱 이미지를 재사용할 수 있습니다.
- `schema -> reference data -> app` 순서를 강제할 수 있습니다.
- Prisma migration과 `ReferenceDataMigrationHistory` 덕분에 중복 실행에 비교적 안전합니다.

한계:

- 같은 DB를 쓰는 여러 API chart가 동시에 sync되면 migration Job도 여러 개 뜰 수 있습니다.
- 현재 방식은 각 migration을 재실행 가능하게 만들어 이 상황을 버팁니다.
- 장기적으로는 공유 DB용 `db-migrator` chart 또는 application 하나로 분리하는 방법을 검토할 수 있습니다.

## 17. 새 데이터가 들어왔을 때 따라 할 순서

### 1단계: 이름보다 책임을 먼저 봅니다

변수 이름에 `SeedData`가 붙었다고 모두 bootstrap은 아닙니다. 실제로 누가 값을 소유하고 언제 반영해야 하는지를 봅니다.

### 2단계: 네 질문으로 분류합니다

- 코드 계약인가?
- 운영자가 수정할 수 있는가?
- 처음 한 번만 필요한가?
- 예시나 테스트용인가?

### 3단계: 알맞은 폴더에 정의합니다

- Reference: `src/reference-data/definitions/**`
- Bootstrap: `src/bootstrap/data/**`
- Demo/Test: `src/demo-data/**`

### 4단계: 알맞은 실행 경로에 연결합니다

- Reference: migration index와 sync
- Bootstrap: bootstrap orchestration
- Demo/Test: demo orchestration

### 5단계: 테스트합니다

최소한 아래를 확인합니다.

- 빈 DB에서 필요한 row가 만들어지는가
- 기존 DB에서 필요한 row가 갱신되는가
- 명령을 두 번 실행해도 중복되거나 망가지지 않는가
- 운영 경로에 demo data가 들어가지 않는가
- migration history가 예상대로 기록되는가

### 6단계: 배포 순서를 기록합니다

schema 변경이 있는지, data migration이 있는지, 앱이 새 데이터를 언제부터 사용하는지를 PR이나 작업 문서에 적습니다.

## 18. 자주 하는 실수

### 모든 미리 넣는 데이터를 `seed.ts`에 추가함

먼저 Reference, Bootstrap, Demo/Test로 분류합니다.

### 운영에서 전체 seed를 다시 실행함

이번에 바뀐 Reference Data migration만 실행합니다. 운영 기존 데이터 backfill은 별도 계획을 사용합니다.

### 표시 이름을 식별자로 사용함

이름은 바뀔 수 있습니다. 안정적인 immutable key를 사용합니다.

### Reference Data를 create-only로 만듦

기존 운영 DB의 row는 갱신되지 않습니다. update 경로도 함께 확인합니다.

### 이미 실행된 migration을 수정함

새 ID의 migration을 추가합니다.

### 자동 sync에서 row를 바로 삭제함

참조 관계와 앱 사용 여부를 확인한 별도 명시 migration으로 처리합니다.

### Demo Data가 없으면 앱이 실행되지 않음

분류가 잘못됐을 가능성이 큽니다. 필수 데이터라면 Reference 또는 Bootstrap인지 다시 판단합니다.

## 19. 작업 완료 체크리스트

### 공통

- [ ] Reference, Bootstrap, Demo/Test 중 하나로 분류했다.
- [ ] 그 분류를 한 문장으로 설명할 수 있다.
- [ ] 정의 파일과 실행 로직을 알맞은 경로에 뒀다.
- [ ] dev, stg, prod 중 어디에서 실행할지 정했다.
- [ ] 같은 명령을 다시 실행했을 때의 결과를 확인했다.

### Reference Data

- [ ] Git의 정의가 정답이다.
- [ ] 안정적인 immutable key가 있다.
- [ ] create와 update가 모두 동작한다.
- [ ] 기존 migration을 고치지 않고 새 migration을 추가했다.
- [ ] migration index에 등록했다.
- [ ] 실제 row와 migration history를 확인했다.
- [ ] 자동 삭제를 넣지 않았다.

### Bootstrap Data

- [ ] 처음 환경 생성에 필요한 값이다.
- [ ] 운영자가 이후 수정할 수 있는지 확인했다.
- [ ] 운영 자동 배포에서 실행되지 않는다.
- [ ] 기존 운영 row update가 필요하다면 다른 전략을 선택했다.

### Demo/Test Data

- [ ] 실제 운영 의미가 없는 샘플이다.
- [ ] 운영 자동 배포 경로에 포함되지 않는다.
- [ ] 실제 데이터로 오해하기 어려운 값이다.

## 20. 어려운 말 빠르게 찾기

| 말                | 쉬운 뜻                                         |
| ----------------- | ----------------------------------------------- |
| seed              | DB에 미리 넣는 데이터                           |
| reference data    | Git의 코드가 정답인 운영 기준 데이터            |
| `REFERENCE` type  | model이 해석·분류용 공통 기준임을 나타내는 타입 |
| bootstrap data    | 환경을 처음 만들 때 넣는 기본 데이터            |
| demo/test data    | 개발과 테스트용 가짜 데이터                     |
| source of truth   | 무엇이 최종 정답인지 정한 단일 기준             |
| immutable key     | 운영 중 바꾸지 않는 식별자                      |
| migration         | 이전 상태를 다음 상태로 바꾸는 번호가 붙은 작업 |
| migration history | 어떤 변경을 이미 실행했는지 남긴 기록           |
| idempotent        | 같은 작업을 다시 실행해도 결과가 망가지지 않음  |
| sync              | 코드 정의와 실제 DB 값을 맞춤                   |
| orchestration     | 여러 데이터 작업을 정해진 순서로 실행하는 흐름  |
| PreSync Job       | 앱 배포 전에 먼저 실행되는 배포 작업            |
| backfill          | 기존 row의 새 빈칸을 채우는 작업                |

## 21. 현재 기본 결정 사항

- 운영 자동 반영 범위: Reference Data만
- 운영 반영 방법: 버전이 있는 data migration
- Reference Data의 정답: Git 저장소의 코드
- 자동 삭제: 기본 금지
- Bootstrap: 수동 또는 명시 실행
- Demo/Test Data: 운영 금지
- 운영 순서: schema migration → reference-data migration → app rollout

## 22. 남아 있는 정리 과제

1. `agreementSeedData`처럼 사용하지 않는 seed 정의를 정리합니다.
2. Bootstrap 값이 운영 계약으로 굳으면 Reference Data 승격 기준을 적용합니다.
3. 공유 DB migration을 앱별 PreSync Job으로 계속 실행할지, 단일 `db-migrator`로 분리할지 결정합니다.
