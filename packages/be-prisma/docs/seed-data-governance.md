# Seed Data Governance

## 목적

`packages/be-prisma`의 seed 데이터를 운영 가능한 기준으로 다시 정의합니다.
핵심은 "개발 편의용 초기 데이터"와 "운영에서 계속 맞춰야 하는 기준 데이터"를 분리하는 것입니다.

이 문서는 아래를 정리합니다.

- 현재 `seed.ts` 구조가 어떻게 동작하는지
- 왜 현재 방식이 운영 반영 전략으로는 부족한지
- 어떤 데이터를 `reference`, `bootstrap`, `demo/test`로 나눠야 하는지
- schema 변경 시 운영 반영을 어떤 순서와 원칙으로 가져가야 하는지
- 앞으로의 파일 구조와 배포 흐름을 어떻게 잡아야 하는지

함께 읽을 문서:

- [schema-file-conventions.md](./schema-file-conventions.md)
- [schema-change-playbook.md](./schema-change-playbook.md)

## 한 줄 요약

현재 방식은 seed 정의와 bootstrap 실행이 같은 패키지 안에 묶여 있어 개발/스테이징 초기화에는 편하지만,
운영(prod)에서는 "이번 변경만 안전하게 반영"하는 전략이 아니라 "기본 세트를 다시 넣는" 구조에 가깝습니다.

운영은 `전체 seed 재실행`이 아니라 `versioned reference-data migration`으로 다뤄야 합니다.

현재 코드에는 아래가 이미 구현되어 있습니다.

- `data-migrate.ts`
- `src/reference-data/**`
- `schema/platform/reference-data-migration.prisma`
- `db:data:migrate[:env]` 스크립트

## 현재 구조

### 용어 정리

- `reference-data`: 운영에서도 코드가 기준이어야 하는 카탈로그/계약 데이터
- `bootstrap default`: 초기 환경에 넣는 기본값. 보통 create-only
- `demo/test data`: dev/stg 샘플 데이터
- `bootstrap runtime`: `src/bootstrap/**`가 수행하는 초기 적재 로직
- `reference-data migration`: `data-migrate.ts`가 실행하는 versioned data migration

### 현재 실행 흐름

```text
reference-data path
  src/reference-data/definitions/*
           +
  src/reference-data/migrations/*
           |
           v
     data-migrate.ts
           |
           v
  pnpm db:data:migrate[:env]
           |
           v
reference_data_migration_history

bootstrap path
  src/bootstrap/data/*
  src/demo-data/*
           |
           v
     src/bootstrap/*
           |
           v
         seed.ts
           |
   +------------+-------------+
   |                          |
   v                          v
pnpm db:bootstrap       pnpm db:bootstrap:stg
   (= db:seed)
```

### 현재 구조의 특징

- 데이터 정의는 `src/reference-data/definitions/**`,
  `src/bootstrap/data/**`, `src/demo-data/**`에,
  실행 로직은 `src/bootstrap/**`에 나뉘어 있습니다.
- 역할, 권한, OIDC client 같은 기준 데이터와
  샘플 유저, 샘플 ground, timeline, inquiry, asset 같은 데이터가 여전히 같은 패키지 안에 공존합니다.
- 스키마가 바뀌면 사람 손으로 seed 정의와 실행 로직을 같이 맞춰야 합니다.
- reference-data는 `reference_data_migration_history`로 이력이 남지만,
  bootstrap/demo는 언제 어떤 값이 다시 적재됐는지 별도 이력이 없습니다.
- prod에 "자동으로, 안전하게, 이번 변경만" 반영하는 경로는 reference-data에 한해 존재합니다.

## 왜 운영에서는 위험한가

운영은 이미 사람이 쓰고 있는 데이터베이스입니다.
여기에 개발 초기화용 seed를 그대로 재사용하면 아래 문제가 생깁니다.

1. 운영 기준 데이터와 샘플 데이터가 섞여 있습니다.
2. 어떤 데이터가 코드 소유인지, 운영자 소유인지 경계가 모호합니다.
3. bootstrap/demo는 실행 이력이 없어 "언제 무엇이 반영됐는지" 추적하기 어렵습니다.
4. schema migration과 data 반영이 분리되어 있지 않아 변경 누락이 생기기 쉽습니다.
5. 특정 앱 배포에 묶어 처리하면 공유 Prisma schema를 쓰는 다른 앱과 타이밍이 어긋날 수 있습니다.

쉽게 비유하면:

- schema = 건물 설계도
- reference data = 건물 운영 규칙
- bootstrap data = 입주할 때 넣는 기본 가구
- demo/test data = 모델하우스 전시품

지금 `seed.ts`는 운영 규칙, 기본 가구, 전시품을 한 트럭에 실어 한 번에 넣는 구조입니다.
개발 환경에서는 편하지만 운영에서는 사고가 나기 쉽습니다.

## 데이터 분류 원칙

### 1. Reference Data

운영에서도 코드가 기준이어야 하는 데이터입니다.
앱이 정상 동작하려면 환경마다 같은 식별자와 계약을 유지해야 합니다.

판단 기준:

- immutable business key가 있다
- 운영자가 임의로 바꾸면 코드 계약과 충돌한다
- schema 변경 시 운영 DB도 같이 맞춰야 한다
- create/update 대상이지, 사람 손으로 관리하는 업무 데이터가 아니다

예:

- Role
- Action
- Subject
- Ability / Grant 규칙
- OIDC Client
- SpaceCategory
- 코드 소유 Translation

### 2. Bootstrap Data

시스템을 처음 세울 때 넣는 초기 구조입니다.
운영에서 계속 자동 반영하는 대상은 아니고, 보통 1회성 또는 명시 실행 대상입니다.

판단 기준:

- 시스템은 시작할 때 필요하지만, 이후 운영 상태에 따라 달라질 수 있다
- 운영자가 수정하거나 별도 절차로 생성할 수 있다
- 자동 재실행 시 운영 데이터와 충돌하거나 과도한 덮어쓰기가 생길 수 있다

예:

- 기본 관리자 계정
- system space
- 최초 tenant 연결
- system ground
- default security policy
- default message template

### 3. Demo/Test Data

개발, E2E, 데모, 샘플 화면을 위한 데이터입니다.
운영에서는 자동 반영 대상이 아닙니다.

판단 기준:

- 샘플 시설명, 샘플 유저, 샘플 문의처럼 예시 데이터다
- 화면 확인이나 테스트 편의를 위한 값이다
- 운영에서 의미가 없거나 오히려 혼란을 준다

예:

- 일반 유저/ground 샘플
- timeline / session / exercise 샘플
- asset 샘플
- inquiry 샘플
- storybook / e2e 전용 데이터

## 현재 코드 기준 권장 분류

### Reference Data로 보는 항목

| 현재 이름 | 권장 분류 | 이유 |
|-----------|-----------|------|
| `roleSeedData` | reference | 시스템 역할 계약 |
| `roleCategorySeedData` | reference | 역할 분류 체계 |
| `roleClassificationSeedData` | reference | 역할-카테고리 계약 |
| `roleGroupSeedData` | reference | 역할 그룹 체계 |
| `roleAssociationSeedData` | reference | 역할-그룹 계약 |
| `subjectSeedData` | reference | 권한 subject 계약 |
| `actionSeedData` | reference | 권한 action 계약 |
| `abilitySeedData` | reference | 권한 규칙 계약 |
| `oidcClientSeedData` | reference | 인증 클라이언트 계약 |
| `spaceCategorySeedData` | reference | ROOT/BRANCH 공간 분류 계약 |
| `translationSeedData` | reference | 코드 소유 공통 번역 키 |

### Bootstrap Data로 보는 항목

| 현재 이름/로직 | 권장 분류 | 이유 |
|----------------|-----------|------|
| `userSeedData`의 super admin | bootstrap | 운영 기본 관리자 계정은 자동 반영보다 명시 생성이 안전 |
| `SYSTEM_SPACE_ID` + system space 생성 | bootstrap | 최초 시스템 구조 초기화 |
| system tenant 생성 | bootstrap | 최초 연결 관계 초기화 |
| `groundSeedData` 중 system ground | bootstrap | 시스템 공간 기본 시설 |
| `ensureSystemBootstrap` 내부 system group 준비 | bootstrap | 실제 system space 내부 구조 초기화 |
| `classifyGroundSpacesAsBranch` | bootstrap | 생성된 bootstrap 공간의 후속 정리 |
| `createHierarchicalTenants` | bootstrap | 초기 tenant 계층 연결 |
| `securityPolicySeedData` | bootstrap default | 운영자가 바꿀 가능성이 높고 현재도 create-only |
| `templateSeedData` | bootstrap default | 기본 템플릿은 필요하지만 운영 수정 가능성이 큼 |

### Demo/Test Data로 보는 항목

| 현재 이름/로직 | 권장 분류 | 이유 |
|----------------|-----------|------|
| `createRegularUsersAndGrounds` | demo/test | 일반 유저와 시설 샘플 생성 |
| `timelineSeedData` | demo/test | 실제 예시 이름의 샘플 타임라인 |
| `exerciseCatalogSeedData` | demo/test | 현재는 샘플 task/exercise 생성 입력값으로 사용 |
| `sessionTemplateSeedData` | demo/test | 샘플 세션 구성 |
| `sessionLoadProfileSeedData` | demo/test | 샘플 사용자 부하 프로필 |
| `createTimelineSessionExerciseDomainData` | demo/test | 샘플 도메인 데이터 생성 |
| `assetSeedData` 계열 | demo/test | 샘플 asset 데이터 |
| `inquirySeedData` 계열 | demo/test | 샘플 문의 데이터 |
| `inquiryTagMasterData` | demo/test helper | 샘플 inquiry tag 색상 보조 데이터 |

### 정리 대상

| 현재 이름 | 상태 | 설명 |
|-----------|------|------|
| `agreementSeedData` | unused | 정의는 있으나 현재 `seed.ts`에서 실제 사용하지 않음 |

## 추천 운영 원칙

### 원칙 1. 운영 자동 반영 대상은 Reference Data만 허용

prod에서 자동으로 돌아가는 것은 `reference data`만 허용합니다.
`bootstrap`과 `demo/test`는 자동 배포 파이프라인에서 제외합니다.

### 원칙 2. 운영 반영은 Seed가 아니라 Data Migration으로 관리

운영은 "전체 seed 재실행"이 아니라 "이번 변경만 반영"해야 합니다.

그래서 reference data는 아래처럼 다룹니다.

- 변경 단위를 migration 파일 하나로 쪼갭니다.
- 각 migration은 순서와 id를 가집니다.
- DB에는 적용 이력을 저장합니다.
- 같은 migration을 다시 실행해도 안전해야 합니다.

### 원칙 3. Schema Migration과 Data Migration은 순서를 고정

운영 반영 순서는 항상 아래 순서로 고정합니다.

```text
1. prisma migrate deploy
2. reference-data migration apply
3. app rollout
```

이 순서를 깨면 schema는 바뀌었는데 필요한 기준 데이터가 없는 상태가 생길 수 있습니다.

실제 필드 추가 / backfill / reference-data 변경 절차는
[schema-change-playbook.md](./schema-change-playbook.md)를 따릅니다.

### 원칙 4. 식별자는 Immutable Key를 사용

reference data는 아래 같은 변경 가능한 표시명이 아니라
운영에서도 안정적인 key를 기준으로 맞춰야 합니다.

- `role.name`
- `action.name`
- `subject.name`
- `oidcClient.clientId`
- `translation.languageCode + key`

### 원칙 5. 기본 동작은 Insert/Update Only

운영 데이터 삭제는 위험하므로 기본 동작은 create/update로 제한합니다.
삭제가 정말 필요하면 별도 명시 migration으로만 처리합니다.

## 권장 구조(현재 구현 기준)

### 파일 구조

```text
packages/be-prisma/
├── schema/                         # Prisma schema source
├── migrations/                     # Prisma schema migration SQL
├── seed.ts                         # dev/stg bootstrap 엔트리
├── data-migrate.ts                 # reference-data migration 엔트리
├── src/
│   ├── reference-data/
│   │   ├── definitions/
│   │   └── migrations/
│   ├── bootstrap/
│   │   ├── data/
│   │   └── *.ts
│   └── demo-data/
└── schema/platform/reference-data-migration.prisma
```

### 실행 구조

```text
data-migrate.ts
  -> src/reference-data/migrations/*
  -> src/reference-data/sync-reference-data.ts
  -> reference_data_migration_history

seed.ts
  -> src/bootstrap/run-bootstrap.ts
  -> reference/system bootstrap + bootstrap default + demo data
  -> dev / stg 전용
```

## 현재 배포 연결 방식 (v1)

현재는 `prj-devops`에서 별도 전용 migrator 앱을 만들지 않고,
각 API Helm chart에 ArgoCD `PreSync` Job을 붙였습니다.

중요한 점은 "앱 컨테이너가 켜지면서 migration을 하는 것"이 아니라,
"앱 배포 전에 Job이 먼저 migration을 끝내는 것"입니다.

```text
OpenBao Secret Sync
        |
        v
core-api chart sync
  -> PreSync migration Job
     - prisma migrate deploy
     - db:data:migrate
  -> core-api rollout

idp-api chart sync
  -> PreSync migration Job
     - prisma migrate deploy
     - db:data:migrate
  -> idp-api rollout
```

즉, DB 반영 책임은 앱 `Deployment` 본체가 아니라
배포 직전에 실행되는 `PreSync Job`이 가집니다.

이 방식의 장점:

- 지금 있는 앱 이미지를 그대로 재사용할 수 있습니다.
- `schema -> reference data -> app rollout` 순서를 바로 강제할 수 있습니다.
- `ReferenceDataMigrationHistory`와 Prisma migration 자체의 idempotency 덕분에
  중복 실행에도 비교적 안전합니다.

이 방식의 한계:

- `core-api`, `idp-api`가 같은 DB를 쓰므로 두 앱이 동시에 sync되면
  migration Job도 각각 뜰 수 있습니다.
- v1에서는 이를 "중복 실행 가능하지만 안전하게 설계"하는 쪽으로 처리합니다.
- 장기적으로는 별도 `db-migrator` chart/application으로 분리하는 것이 더 깔끔할 수 있습니다.

## 명령 체계 권장안

```bash
pnpm db:seed              # dev bootstrap alias
pnpm db:bootstrap         # dev bootstrap 명시 이름
pnpm db:bootstrap:stg     # stg bootstrap 명시 실행

pnpm db:data:migrate      # dev reference-data migration
pnpm db:data:migrate:stg  # stg reference-data migration
pnpm db:data:migrate:prod # prod reference-data migration
```

규칙:

- prod에는 `db:seed:prod`를 만들지 않습니다.
- prod 자동 배포는 `db:data:migrate:prod`만 허용합니다.
- stg도 기본은 `db:data:migrate:stg`만 자동 실행합니다.
- bootstrap은 사람이 명시적으로 돌릴 때만 실행합니다.

## 실무 판단 기준

어떤 데이터가 들어왔을 때 아래 질문으로 분류합니다.

1. 이 값이 운영 코드 계약인가?
2. 운영자가 수정할 수 있는 업무 데이터인가?
3. 샘플/데모/테스트 목적이 있는가?
4. key가 안정적인가?
5. 자동 반영 시 덮어쓰기 위험이 있는가?

필드 추가나 스키마 변경이 실제로 들어오면
[schema-change-playbook.md](./schema-change-playbook.md)의 시나리오별 절차로 바로 연결합니다.

판정 규칙:

- "코드 계약이다" -> reference
- "초기 기본값이다" -> bootstrap
- "예시/화면/테스트용이다" -> demo/test

## 남아 있는 액션

1. `agreementSeedData`처럼 미사용 seed를 정리합니다.
2. bootstrap default 중 운영 계약으로 굳는 항목이 생기면 reference-data 승격 기준을 적용합니다.
3. GitOps 배포에서 shared DB용 단일 migrator를 둘지, 앱별 PreSync Job 중복 실행을 유지할지 결정합니다.

## 기본 결정 사항

- 운영 자동 반영 범위: reference data only
- 운영 반영 방식: versioned data migration
- 소스 오브 트루스: Git 저장소 코드
- 삭제 정책: 기본은 자동 삭제 금지
- bootstrap 기본 정책: 수동 또는 명시 실행
- demo/test 데이터: prod 금지

## 비고

현재 seed 정의 구조의 역할과 일부 계약은 `seed-data.ts`와 관련 구현 코드에서 관리합니다.
이 문서는 그보다 상위 개념인 "운영 관점의 seed governance"를 정의합니다.
