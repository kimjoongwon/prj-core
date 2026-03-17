# Prisma Schema Change Playbook

`packages/be-prisma` 기준으로 스키마 변경, 필드 추가, data migration, backfill을 어떻게 나눠 처리할지 정리한 문서입니다.

함께 읽을 문서:

- [schema-file-conventions.md](./schema-file-conventions.md)
- [seed-data-governance.md](./seed-data-governance.md)

## 1. 현재 실제 구조

이 문서는 `seed-data-governance.md`의 목표 구조를 그대로 설명하는 문서가 아닙니다.
현재 저장소에 실제로 구현된 구조를 기준으로 설명합니다.

현재 `packages/be-prisma`는 아래가 공존하는 하이브리드 상태입니다.

- `schema/**`: Prisma schema source of truth
- `migrations/**`: schema migration SQL
- `src/reference-data/**`: 운영 기준 데이터용 migration runner / sync 로직
- `seed.ts`, `seed-data.ts`: dev/stg bootstrap 및 일부 초기 데이터 경로

중요한 점:

- 문서상 목표 구조처럼 `reference-data/`, `bootstrap/`, `demo-data/`, `data-migrations/`가 완전히 루트로 분리된 상태는 아닙니다.
- 현재는 `seed.ts`에도 일부 reference 성격 로직이 남아 있습니다.
- 따라서 실무 판단은 "목표 구조"보다 "현재 실제 실행 경로"를 기준으로 해야 합니다.

### 현재 `db:data:migrate`가 자동 반영하는 범위

현재 코드상 `db:data:migrate`는 `src/reference-data/sync-reference-data.ts`에 포함된 항목만 자동 반영합니다.

대표 항목:

- `Role`
- `RoleCategory` / `RoleClassification` / `RoleGroup` / `RoleAssociation`
- `Subject`
- `Action`
- `Ability` / `Grant`
- 코드 소유 `Translation`
- `OidcClient`
- system space 기준 taxonomy 일부

반대로 아래는 현재 `db:data:migrate` 자동 반영 대상이 아닙니다.

- `SecurityPolicy`
- `Template`
- 일반 업무 row

## 2. 먼저 분류

필드 추가 요청이 오면 먼저 아래 셋 중 어디인지 분류합니다.

### 1) 일반 운영 데이터 필드

실제 운영 row에 붙는 컬럼입니다.

예:

- `User`
- `Inquiry`
- `Asset`

중심 파일:

- `packages/be-prisma/schema/**`
- `packages/be-prisma/migrations/**`

### 2) Reference Data 필드

DB에 저장되지만, 운영에서도 코드가 기준이어야 하는 기준값/카탈로그/설정 row입니다.

예:

- `Role`
- `Action`
- 코드 소유 `Translation`
- `OidcClient`

판단 기준:

- immutable key를 기준으로 맞춘다
- prod에서도 코드 기준으로 create/update가 필요하다
- schema migration만으로는 기존 row 값 반영이 끝나지 않는다

중심 파일:

- `packages/be-prisma/schema/**`
- `packages/be-prisma/src/reference-data/**`
- `packages/be-prisma/docs/seed-data-governance.md`

### 3) Bootstrap 전용 데이터 필드

처음 환경을 세울 때 넣는 초기 구조/초기값입니다.

예:

- 기본 관리자 계정
- 일부 system 초기 연결값
- `SecurityPolicy`
- `Template`
- `seed.ts`에서만 다루는 1회성 초기 데이터

중심 파일:

- `packages/be-prisma/seed-data.ts`
- `packages/be-prisma/seed.ts`

## 3. 개발 초기에는 Bootstrap이 자주 바뀔 수 있음

개발 초기에는 bootstrap 데이터가 자주 변하는 게 정상입니다.

핵심은 환경 단계입니다.

- `dev 초기`: `seed.ts`를 자주 바꾸고 `db reset -> bootstrap`을 반복해도 됨
- `shared dev / stg`: bootstrap 재실행이 점점 위험해지므로 기준 데이터와 초기화 데이터를 분리해야 함
- `prod`: bootstrap 자동 재실행 금지, reference data만 자동 반영

즉, 어떤 데이터는 처음엔 bootstrap처럼 시작했다가 운영 계약이 굳으면 reference data로 승격될 수 있습니다.

승격 신호:

1. 기존 row를 코드 기준으로 다시 맞춰야 한다
2. `없으면 create`만으로 부족하고 `update`도 필요하다
3. 앱이 특정 key나 row 존재를 전제로 동작한다
4. 운영 배포 이력과 idempotent 재실행이 필요하다

## 4. 시나리오 1: 일반 운영 테이블에 필드 추가

예: `User.lastSeenAt`

### 절차

1. 모델 파일을 찾습니다.
2. 첫 배포는 호환 가능하게 설계합니다.
3. Prisma schema를 수정합니다.
4. Prisma client를 재생성합니다.
5. migration을 생성합니다.
6. 생성된 SQL을 직접 읽습니다.
7. 앱 코드를 null-safe하게 수정합니다.
8. 기존 데이터가 있는 상태를 가정해 로컬/스테이징에서 확인합니다.
9. prod는 `schema -> 필요 시 data -> app rollout` 순서로 반영합니다.

### 권장 패턴

처음부터 `required + no default`로 넣지 않습니다.

보통 아래 중 하나로 시작합니다.

- `DateTime?` 같이 nullable
- `Boolean @default(false)` 같이 default 포함

### 검토 포인트

- `ALTER TABLE ... ADD COLUMN ...`이 안전한가
- `NOT NULL`이면 기존 row가 깨지지 않는가
- default가 큰 테이블에 과도한 rewrite/lock을 일으키지 않는가
- 앱이 새 필드를 바로 필수값처럼 가정하지 않는가

### 배포 기본 순서

1. `pnpm --filter=@cocrepo/prisma generate`
2. `pnpm --filter=@cocrepo/prisma db:migrate`
3. 앱 코드 수정
4. prod/stg에서는 `db:migrate:deploy`
5. 필요 시 별도 backfill
6. 마지막에 제약 강화

## 5. 시나리오 2: Reference Data 모델에 필드 추가

예: `OidcClient`에 새 필드 추가

이 경우는 schema migration만으로 끝나지 않습니다.

### 왜 더 많나

Reference Data는 기존 운영 row도 코드 기준으로 맞춰야 하기 때문입니다.

`OidcClient`의 경우 현재 구조상 다음이 모두 맞아야 합니다.

- Prisma schema
- seed source
- bootstrap 경로
- reference-data sync 경로
- reference-data migration 이력

### 절차

1. 모델 파일을 수정합니다.
2. `generate`와 `db:migrate`를 수행합니다.
3. seed source 데이터 정의에 새 필드를 추가합니다.
4. `seed.ts`의 bootstrap create 경로를 반영합니다.
5. `src/reference-data/sync-reference-data.ts`의 `create`와 `update` 둘 다 반영합니다.
6. 기존 reference-data migration 파일은 수정하지 않습니다.
7. 새 migration 파일을 `src/reference-data/migrations/`에 추가합니다.
8. `src/reference-data/migrations/index.ts`에 등록합니다.
9. 배포 시 `db:migrate:deploy` 다음 `db:data:migrate`를 실행합니다.
10. row 값과 migration history를 함께 검증합니다.

### 중요한 규칙

- 이미 적용된 reference-data migration 파일은 수정하지 않습니다.
- 새 변경은 새 migration 파일로 추가합니다.
- prod 값 반영은 `db:data:migrate`가 담당합니다.

### 확인 포인트

- 대상 테이블 row에 새 필드 값이 실제로 들어갔는가
- `reference_data_migration_history`에 새 migration id가 기록되었는가

## 6. 시나리오 3: Bootstrap 전용 데이터 필드 추가

처음 세팅용 데이터인데 개발 초기에 자주 변할 수 있습니다.

### dev 초기

- `seed.ts` 중심으로 빠르게 반복 가능
- `db reset -> bootstrap` 방식 허용
- 아직 운영 배포 경로를 강제할 필요는 없음

### shared env 이후

다음 중 하나라도 필요하면 bootstrap만으로 처리하지 않습니다.

- prod 기존 row에도 값 반영 필요
- 기존 row update 필요
- 코드 계약으로 계속 유지해야 함

이 경우 둘 중 하나를 선택합니다.

1. reference data로 승격
2. migration SQL / 배치 job / 명시 실행 스크립트로 backfill

### 주의

운영 backfill을 `seed.ts` 재실행으로 해결하지 않습니다.

현재 구조에서 특히 아래는 bootstrap/default 경로로 보는 편이 맞습니다.

- `SecurityPolicy`
- `Template`

특히 `seed.ts`에만 있는 데이터가 prod 기존 row 보정을 필요로 하면:

- 단순값이면 migration SQL
- 복잡한 계산이면 배치성 backfill
- 운영 기준 데이터가 됐다면 reference-data 경로로 승격

## 7. 운영 배포 순서

현재 스크립트 기준 운영 반영 순서는 아래처럼 봅니다.

### 일반 운영 데이터

1. `db:migrate:deploy:prod`
2. app rollout

### Reference Data

1. `db:migrate:deploy:prod`
2. `db:data:migrate:prod`
3. app rollout

### Bootstrap/default 데이터

1. `db:migrate:deploy:prod`
2. 필요 시 migration SQL 또는 별도 backfill
3. app rollout

핵심은:

- schema는 항상 migration으로 먼저 반영
- reference data만 `db:data:migrate`로 자동 보정
- bootstrap/default는 현재 구조상 prod 자동 보정 대상으로 가정하지 않음

## 8. Backfill 판단 기준

질문을 분리해서 봅니다.

1. 컬럼만 추가하면 되는가
2. 기존 row에 값도 채워야 하는가
3. 그 값이 단순 default인가
4. 기존 다른 컬럼을 보고 계산해야 하는가

### 단순값

예: `BOOLEAN NOT NULL DEFAULT false`

- 가능하면 schema migration에서 같이 처리

### 코드 소유 기준 데이터

예: `OidcClient`, `Translation`

- reference-data sync / migration으로 보정

### 일반 업무 데이터 + 복잡 계산

권장 3단계:

1. nullable 컬럼 추가
2. 배치나 SQL로 backfill
3. 마지막에 제약 강화

## 9. 자주 하는 실수

- required 필드를 바로 추가하고 기존 row를 고려하지 않음
- migration SQL을 읽지 않고 그대로 merge함
- reference-data 모델인데 `sync-reference-data.ts`의 `update/create`를 빼먹음
- 이미 적용된 reference-data migration 파일을 수정함
- prod 값 보정을 `seed.ts` 재실행으로 해결하려고 함
- 앱이 새 필드를 null-safe하게 처리하지 않음
- 배포 순서를 `app rollout` 먼저로 가져감

## 10. 빠른 체크리스트

### 일반 필드 추가

1. schema 수정
2. `generate`
3. `db:migrate`
4. migration SQL 검토
5. 앱 null-safe 반영
6. 배포
7. 필요 시 backfill
8. 마지막에 제약 강화

### Reference Data 필드 추가

1. schema 수정
2. `generate`
3. `db:migrate`
4. seed source 반영
5. bootstrap 경로 반영
6. `sync-reference-data.ts` 반영
7. 새 reference-data migration 추가
8. `db:migrate:deploy`
9. `db:data:migrate`
10. row + history 검증

### Bootstrap 필드 추가

1. dev 초기인지, 운영 반영 대상인지 먼저 판단
2. dev 초기면 `seed.ts` 중심으로 빠르게 진행
3. 운영 row update가 필요해지는 순간 bootstrap만으로 해결하지 않음
4. 필요 시 reference data 승격 또는 별도 backfill 전략 선택
