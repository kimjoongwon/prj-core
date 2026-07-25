# Prisma 스키마 변경 안내서: 처음 보는 사람용

이 문서는 DB에 필드나 모델을 추가할 때 **무엇을, 어떤 순서로 바꿔야 하는지** 설명합니다.

아래 한 줄만 먼저 기억하면 됩니다.

> DB 모양을 먼저 안전하게 바꾸고, 기존 데이터를 채운 다음, 마지막에 앱이 새 모양을 사용하게 합니다.

파일 배치 규칙은
[schema-file-conventions.md](./schema-file-conventions.md)를 봅니다.

초기 데이터와 운영 기준 데이터의 차이는
[seed-data-governance.md](./seed-data-governance.md)를 봅니다.

## 1. 이 문서는 언제 보나요?

다음 작업을 할 때 봅니다.

- 기존 모델에 필드를 추가하거나 삭제할 때
- 새 모델이나 enum을 추가할 때
- 필드 타입이나 필수 여부를 바꿀 때
- 기존 DB row에 새 값을 채워야 할 때
- Role, Action, OIDC Client 같은 운영 기준 데이터를 바꿀 때
- bootstrap 데이터에 새 필드가 생겼을 때
- 운영 배포 순서를 정할 때

## 2. 어려운 말부터 쉽게 정리하기

| 말               | 쉬운 뜻                                             |
| ---------------- | --------------------------------------------------- |
| schema           | DB 표와 열의 설계도                                 |
| schema migration | DB 설계도를 이전 모양에서 새 모양으로 바꾸는 기록   |
| data migration   | 이미 저장된 데이터 값을 새 규칙에 맞게 바꾸는 기록  |
| backfill         | 새로 생긴 빈 칸을 기존 데이터에도 채우는 작업       |
| nullable         | 값이 없어도 되는 상태. Prisma에서는 보통 `?`로 표시 |
| required         | 반드시 값이 있어야 하는 상태                        |
| default          | 값을 안 줬을 때 DB가 대신 넣는 기본값               |
| rollout          | 새 앱 버전을 서버에 배포하는 과정                   |
| idempotent       | 같은 작업을 다시 실행해도 결과가 망가지지 않는 성질 |
| immutable key    | 운영 중 바꾸지 않는 안정적인 식별자                 |

## 3. 가장 중요한 배포 순서

안전한 기본 순서는 아래입니다.

```text
1. DB schema 변경
2. 필요한 기준 데이터 또는 기존 데이터 채우기
3. 새 앱 버전 배포
4. 충분히 확인한 뒤 더 강한 제약 적용
```

왜 앱을 마지막에 배포할까요?

새 앱이 `lastSeenAt`이라는 필드를 읽는데 DB에 그 열이 아직 없다면 앱은 바로 실패할 수 있습니다. DB가 새 앱과 예전 앱을 모두 받아 줄 수 있는 모양이 된 뒤 앱을 배포해야 합니다.

## 4. 변경 전에 먼저 데이터 종류를 고릅니다

필드 하나를 추가하더라도 데이터 종류에 따라 바꿔야 할 파일과 배포 방법이 달라집니다.

여기서 말하는 **Reference Data**는 특정 row를 Git의 코드가 소유하고 운영 DB에 동기화하는 정책입니다. Prisma model 분류와는 별도 판단이며, 두 기준의 자세한 차이는 [seed-data-governance.md](./seed-data-governance.md)를 봅니다.

### 종류 A: 일반 운영 데이터

사람이나 서비스가 평소에 만들고 수정하는 업무 데이터입니다.

예:

- `User`
- `Inquiry`
- `Asset`

주로 바꾸는 곳:

```text
packages/be-prisma/schema/*.prisma
packages/be-prisma/migrations/**
```

### 종류 B: Reference Data

DB에 저장되지만 Git의 코드가 정답이어야 하는 운영 기준 데이터입니다.

예:

- `Role`
- `Action`
- `Subject`
- `Ability`
- 코드가 소유하는 `Translation`
- `OidcClient`

이 데이터는 운영자가 마음대로 바꾸면 코드의 기대와 달라질 수 있습니다. 따라서 schema만 바꾸는 것으로 끝나지 않고, 기존 운영 row도 코드 정의와 맞춰야 합니다.

주로 바꾸는 곳:

```text
packages/be-prisma/schema/*.prisma
packages/be-prisma/migrations/**
packages/be-prisma/src/reference-data/definitions/**
packages/be-prisma/src/reference-data/sync-reference-data.ts
packages/be-prisma/src/reference-data/migrations/**
```

### 종류 C: Bootstrap 또는 Demo Data

환경을 처음 만들 때 넣는 기본 데이터나 개발용 예시 데이터입니다.

예:

- 기본 관리자 계정
- 시스템 공간의 초기 연결
- 기본 보안 정책
- 기본 템플릿
- 개발용 샘플 문의와 샘플 asset

주로 바꾸는 곳:

```text
packages/be-prisma/src/bootstrap/data/**
packages/be-prisma/src/bootstrap/**
packages/be-prisma/src/demo-data/**
packages/be-prisma/seed.ts
```

### 10초 판별법

아래 질문을 순서대로 봅니다.

1. 사용자가 평소 만들고 수정하는 데이터인가?
   - 예: 일반 운영 데이터
2. 모든 운영 환경에서 코드와 같은 key·값을 유지해야 하는가?
   - 예: Reference Data
3. 처음 환경을 만들 때만 필요한가?
   - 예: Bootstrap Data
4. 화면 확인이나 테스트용 가짜 데이터인가?
   - 예: Demo/Test Data

## 5. 현재 저장소의 실제 실행 구조

현재 `packages/be-prisma`에는 아래 경로가 함께 존재합니다.

```text
schema/*.prisma                        Prisma schema 원본
migrations/**                          schema migration SQL
src/reference-data/definitions/**      운영 기준 데이터 정의
src/reference-data/migrations/**       버전이 있는 기준 데이터 변경 기록
src/reference-data/sync-reference-data.ts
                                       기준 데이터를 실제 DB와 맞추는 로직
src/bootstrap/data/**                  처음 넣는 기본값
src/demo-data/**                       개발·스테이징 샘플 데이터
src/bootstrap/**                       bootstrap 실행 흐름
data-migrate.ts                        기준 데이터 migration 실행 입구
seed.ts                                bootstrap 실행 입구
```

중요한 사실:

- `seed.ts`는 얇은 시작 파일이고 실제 bootstrap 로직은 `src/bootstrap/**`에 있습니다.
- 기준 데이터 정의는 `src/reference-data/definitions/**`에 있습니다.
- 운영에서 자동으로 기존 값을 맞추는 경로는 reference data에만 있습니다.
- 실제 작업 판단은 미래의 목표 구조가 아니라 현재 실행 경로를 기준으로 합니다.

현재 `db:data:migrate`가 대표적으로 맞추는 항목:

- `Role`
- `RoleCategory`, `RoleClassification`, `RoleGroup`, `RoleAssociation`
- `Subject`
- `Action`
- `Ability`, `Grant`
- 코드 소유 `Translation`
- `OidcClient`
- system space의 일부 taxonomy

현재 자동 반영 대상으로 보지 않는 항목:

- `SecurityPolicy`
- `Template`
- 일반 업무 row

## 6. 새 모델과 enum을 추가하는 순서

### 새 모델

예를 들어 `NotificationRule`을 추가한다면 아래 순서를 따릅니다.

1. 같은 model이나 같은 책임이 이미 없는지 검색합니다.
2. `UpperCamelCase` model 이름을 정합니다.
3. 이름을 기계식 kebab-case로 바꿔 파일 경로를 계산합니다.
4. `schema/notification-rule.prisma`에 model 하나만 선언합니다.
5. [schema-metadata-guide.md](./schema-metadata-guide.md)의 모델 메타데이터 계약을 적용합니다.
6. Aggregate Root 여부는 같은 가이드의 판단 기준을 따릅니다.
7. relation, key, index와 unique constraint를 검토합니다.
8. 구조와 Prisma 문법을 검사합니다.
9. DB 구조가 달라지면 migration을 만들고 SQL을 검토합니다.
10. Prisma Client를 다시 생성하고 consumer를 확인합니다.

파일 이름 계산식과 다섯 데이터 타입의 판단 기준은 각각
[schema-file-conventions.md](./schema-file-conventions.md)와
[schema-metadata-guide.md](./schema-metadata-guide.md)를 따릅니다.

model 파일은 모두 `schema/` 바로 아래에 있으며, 한 파일에 두 번째 model이나 enum을 함께 넣지 않습니다.

### 새 enum

1. 같은 enum이 이미 없는지 검색합니다.
2. 실제 model 필드에서 바로 사용하는 enum인지 확인합니다.
3. `schema/_enums.prisma`에서 enum 이름의 오름차순 위치에 추가합니다.
4. 값과 `@map`이 DB mapping 계약에 맞는지 확인합니다.
5. `///` 문서 주석이 DMMF 문서 계약에 맞는지 확인합니다.
6. `schema:check`와 `prisma validate`를 실행합니다.
7. DB enum이 달라지면 migration SQL과 기존 row 영향을 검토합니다.

enum에는 model 설계 메타데이터를 두지 않고, enum별 파일이나 하위 폴더를 만들지 않습니다.

## 7. 모든 변경에서 공통으로 하는 준비

### 1단계: 바꿀 모델 파일을 찾습니다

```bash
rg "model User" packages/be-prisma/schema
```

### 2단계: 데이터를 분류합니다

일반 운영 데이터, Reference Data, Bootstrap/Demo 중 하나를 고릅니다.

### 3단계: 기존 row가 있다고 가정합니다

새 DB만 생각하면 위험합니다. 운영 DB에는 이미 데이터가 들어 있다는 전제로 아래 질문을 합니다.

- 새 필드가 비어 있어도 앱이 동작하는가?
- 기존 row에 어떤 값을 채울 것인가?
- 값을 한 번에 채우면 DB lock이 길어지지 않는가?
- 이전 앱과 새 앱이 잠시 같이 실행되어도 괜찮은가?

### 4단계: 관련 consumer를 찾습니다

consumer는 그 모델이나 필드를 읽고 쓰는 코드입니다.

```bash
rg "lastSeenAt|User" apps packages
```

### 5단계: 작은 단계로 나눕니다

위험한 변경을 한 번에 끝내려고 하지 않습니다.

예를 들어 필수 필드는 보통 아래처럼 나눕니다.

```text
1차: nullable 필드 추가
2차: 앱이 새 필드도 쓰도록 배포
3차: 기존 row backfill
4차: 모든 값이 채워졌는지 확인
5차: required 제약 적용
```

## 8. 시나리오 A: 일반 운영 모델에 필드 추가

예제로 `User.lastSeenAt`을 추가해 보겠습니다.

### 1단계: 첫 변경은 호환 가능하게 만듭니다

처음부터 아래처럼 필수 필드를 넣으면 기존 User row 때문에 migration이 실패할 수 있습니다.

위험한 시작:

```prisma
lastSeenAt DateTime
```

안전한 시작:

```prisma
lastSeenAt DateTime?
```

또는 모든 기존 row에 같은 기본값을 줘도 업무적으로 맞다면 default를 사용할 수 있습니다.

```prisma
isActive Boolean @default(false)
```

default가 업무적으로 거짓말이 되는 값이라면 사용하지 않습니다. 예를 들어 “마지막 로그인 시각”을 현재 시각으로 채우면 실제로 로그인하지 않은 사용자까지 로그인한 것처럼 보일 수 있습니다.

### 2단계: Prisma schema를 수정합니다

model 이름에서 계산된 `schema/<kebab-case>.prisma` 파일에 필드를 추가합니다.

### 3단계: 구조와 문법을 검사합니다

```bash
pnpm --filter=@cocrepo/prisma schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```

### 4단계: Prisma Client를 다시 만듭니다

```bash
pnpm --filter=@cocrepo/prisma generate
```

### 5단계: 개발용 migration을 만듭니다

```bash
pnpm --filter=@cocrepo/prisma db:migrate
```

생성된 `packages/be-prisma/migrations/**/migration.sql`을 반드시 직접 읽습니다.

확인할 내용:

- `DROP TABLE`이나 `DROP COLUMN`이 예상치 않게 들어갔는가
- `NOT NULL` 때문에 기존 row가 실패하는가
- 큰 테이블 전체를 오래 잠글 가능성이 있는가
- default가 큰 테이블을 불필요하게 다시 쓰게 만드는가
- index나 unique 제약이 기존 중복 데이터 때문에 실패하는가

### 6단계: 앱을 null-safe하게 바꿉니다

필드가 nullable이면 앱도 값이 없는 경우를 처리해야 합니다.

```ts
const lastSeenLabel = user.lastSeenAt
  ? formatDate(user.lastSeenAt)
  : "로그인 기록 없음";
```

`user.lastSeenAt!`처럼 값이 있다고 억지로 가정하지 않습니다.

### 7단계: 기존 데이터가 있는 상태로 확인합니다

빈 DB에서 migration이 성공한 것만으로는 부족합니다. 가능하면 운영과 비슷한 기존 row가 있는 로컬 또는 스테이징 DB에서 확인합니다.

### 8단계: 운영에 순서대로 반영합니다

```text
1. db:migrate:deploy:prod
2. 필요하면 backfill
3. 새 앱 rollout
4. 충분히 확인
5. 필요하면 후속 migration으로 required 제약 적용
```

운영 schema migration 명령:

```bash
pnpm --filter=@cocrepo/prisma db:migrate:deploy:prod
```

## 9. 시나리오 B: Reference Data 모델에 필드 추가

예제로 `OidcClient`에 새 필드를 추가한다고 가정합니다.

Reference Data는 schema만 바꾸면 끝나지 않습니다. 이미 운영 DB에 존재하는 `OidcClient` row도 코드 정의와 같은 값으로 맞춰야 하기 때문입니다.

### 바꿔야 할 가능성이 높은 곳

```text
schema/oidc-client.prisma
migrations/**
src/reference-data/definitions/**
src/reference-data/sync-reference-data.ts
src/reference-data/migrations/**
```

필드를 읽는 bootstrap 또는 runtime 코드가 있다면 그 consumer도 바꿉니다.

### 단계별 절차

1. Prisma 모델에 필드를 추가합니다.
2. `schema:check`와 `prisma validate`를 실행합니다.
3. `generate`를 실행합니다.
4. schema migration을 생성하고 SQL을 검토합니다.
5. `src/reference-data/definitions/**`의 코드 정의에 새 값을 추가합니다.
6. `sync-reference-data.ts`의 `create`와 `update` 양쪽에 필드를 반영합니다.
7. 기존 migration 파일은 수정하지 않습니다.
8. `src/reference-data/migrations/`에 새 migration 파일을 만듭니다.
9. `src/reference-data/migrations/index.ts`에 새 migration을 등록합니다.
10. 관련 테스트를 작성하거나 갱신합니다.
11. 운영에서 schema migration을 먼저 실행합니다.
12. 그다음 reference-data migration을 실행합니다.
13. 실제 row와 migration history를 확인합니다.
14. 마지막에 앱을 배포합니다.

### 왜 `create`와 `update`를 둘 다 바꾸나요?

- 새 환경에는 row가 없으므로 `create`가 필요합니다.
- 기존 운영 환경에는 row가 이미 있으므로 `update`가 필요합니다.

한쪽만 바꾸면 새 환경과 기존 환경의 결과가 달라질 수 있습니다.

### 왜 예전 migration 파일을 고치면 안 되나요?

예전 migration은 이미 어떤 DB에서 실행됐을 수 있습니다. 파일 내용만 바꾸어도 그 DB에서는 다시 실행되지 않습니다.

따라서 모든 새 변경은 새 ID를 가진 migration 파일로 추가합니다.

운영 실행 순서:

```bash
pnpm --filter=@cocrepo/prisma db:migrate:deploy:prod
pnpm --filter=@cocrepo/prisma db:data:migrate:prod
```

확인할 것:

- 대상 row에 새 값이 실제로 들어갔는가
- `reference_data_migration_history`에 새 migration ID가 기록됐는가
- 명령을 다시 실행해도 데이터가 중복되거나 망가지지 않는가

## 10. 시나리오 C: Bootstrap 데이터에 필드 추가

Bootstrap Data는 환경을 처음 만들 때 넣는 기본값입니다.

### 개인 개발 환경 초기

개발 초기에는 아래 흐름으로 빠르게 반복할 수 있습니다.

```text
bootstrap 코드 수정
-> DB reset
-> db:bootstrap
-> 결과 확인
```

관련 경로:

```text
src/bootstrap/**
src/bootstrap/data/**
src/demo-data/**
seed.ts
```

### 공유 개발·스테이징 환경

여러 사람이 쓰는 DB에서는 reset과 bootstrap 재실행이 점점 위험해집니다.

아래 중 하나라도 해당하면 bootstrap만 고쳐서 끝내지 않습니다.

- 기존 row에도 새 값을 넣어야 한다.
- `없으면 create`가 아니라 기존 값의 update도 필요하다.
- 앱이 특정 key나 row의 존재를 계속 전제로 한다.
- 운영 배포 이력과 재실행 안전성이 필요하다.

그때는 다음 중 하나를 선택합니다.

1. 운영 코드 계약이라면 Reference Data로 승격
2. 단순한 값이면 schema migration SQL로 backfill
3. 계산이 복잡하면 별도 배치 작업이나 명시 실행 스크립트로 backfill

### 운영 환경

운영의 기존 row를 고치기 위해 `seed.ts`나 전체 bootstrap을 다시 실행하지 않습니다.

현재 `SecurityPolicy`와 `Template`은 bootstrap/default 경로로 봅니다. 이 데이터가 운영 기존 row의 자동 보정을 요구하게 되면 Reference Data 승격 또는 별도 backfill 전략을 선택해야 합니다.

## 11. Backfill은 어떻게 결정하나요?

다음 네 질문을 봅니다.

1. 컬럼만 추가하면 되는가?
2. 기존 row의 빈칸도 채워야 하는가?
3. 모든 row에 같은 단순 값을 넣어도 되는가?
4. 다른 컬럼이나 외부 정보를 보고 계산해야 하는가?

### 경우 1: 단순 기본값

예:

```prisma
isArchived Boolean @default(false)
```

모든 기존 row가 `false`여도 업무적으로 맞는다면 schema migration에서 함께 처리할 수 있습니다.

### 경우 2: 코드 소유 기준 데이터

예:

- `OidcClient`
- 코드 소유 `Translation`

reference-data sync와 새 data migration으로 값을 맞춥니다.

### 경우 3: 일반 업무 데이터이며 계산이 복잡함

예: 다른 활동 기록을 보고 `User.lastSeenAt`을 계산해야 함

아래 3단계가 기본입니다.

```text
1. nullable 컬럼 추가
2. 배치 또는 SQL로 조금씩 backfill
3. 모든 row를 확인한 뒤 required 제약 적용
```

큰 테이블은 한 번에 모두 갱신하지 않고 배치 크기, 실행 시간, lock 영향을 검토합니다.

## 12. 필드를 삭제하거나 이름을 바꿀 때

삭제와 이름 변경은 추가보다 위험합니다. 예전 앱이 아직 그 필드를 사용할 수 있기 때문입니다.

### 안전한 삭제 순서

```text
1. 앱이 기존 필드를 더 이상 쓰지 않도록 변경
2. 배포 후 실제 사용이 없는지 확인
3. 후속 schema migration에서 필드 삭제
```

### 안전한 이름 변경 순서

운영 상황에 따라 바로 rename하지 않고 새 필드를 추가해 옮기는 방법을 사용합니다.

```text
1. 새 이름의 nullable 필드 추가
2. 앱이 옛 필드와 새 필드를 함께 처리
3. 기존 값을 새 필드로 backfill
4. 앱이 새 필드만 사용하도록 변경
5. 확인 후 옛 필드 삭제
```

실제 전략은 테이블 크기, 무중단 요구사항, Prisma가 만든 SQL을 보고 결정합니다.

## 13. 환경별 허용 범위

| 환경       | 가능한 작업                          | 주의할 작업                           |
| ---------- | ------------------------------------ | ------------------------------------- |
| 개인 dev   | reset, bootstrap 반복 가능           | 실제 운영 데이터라고 가정하지 않기    |
| shared dev | migration과 data migration 사용 권장 | 다른 개발자 데이터 삭제 금지          |
| stg        | 운영 순서와 비슷하게 검증            | 자동 bootstrap 재실행 주의            |
| prod       | versioned migration만 사용           | reset, 전체 seed, 임의 `db push` 금지 |

운영에서 `db:push`로 schema를 직접 맞추지 않습니다. 기록이 남는 migration을 사용합니다.

## 14. 자주 하는 실수

### required 필드를 바로 추가함

기존 row가 값을 갖고 있지 않아 migration이 실패할 수 있습니다. nullable 추가와 backfill을 먼저 검토합니다.

### 생성된 SQL을 읽지 않음

Prisma가 예상보다 큰 삭제나 재생성을 만들 수 있습니다. `migration.sql`을 반드시 확인합니다.

### Reference Data인데 schema만 수정함

기존 운영 row는 자동으로 새 값을 얻지 못합니다. 정의, sync, 새 data migration까지 확인합니다.

### `sync-reference-data.ts`에서 create만 수정함

기존 환경은 update 경로를 타므로 값이 반영되지 않습니다. create와 update를 함께 봅니다.

### 이미 실행된 data migration 파일을 수정함

실행 이력이 있는 DB에는 수정 내용이 다시 적용되지 않습니다. 새 migration을 추가합니다.

### 운영 값을 고치려고 `seed.ts`를 재실행함

bootstrap과 demo 데이터까지 다시 들어갈 수 있습니다. Reference Data migration 또는 별도 backfill을 사용합니다.

### 앱을 DB보다 먼저 배포함

새 앱이 아직 없는 필드나 테이블을 읽으며 실패할 수 있습니다.

### nullable 필드를 앱에서 무조건 있다고 가정함

backfill이 끝나기 전까지 값은 없을 수 있습니다. 앱은 이 상태를 처리해야 합니다.

## 15. 변경 종류별 빠른 체크리스트

### 일반 필드

- [ ] 기존 row가 있는 상태를 고려했다.
- [ ] nullable 또는 안전한 default로 시작할지 검토했다.
- [ ] schema와 관련 앱 코드를 수정했다.
- [ ] `schema:check`, `prisma validate`, `generate`를 실행했다.
- [ ] migration SQL을 직접 읽었다.
- [ ] 앱이 null을 안전하게 처리한다.
- [ ] 필요하면 backfill 계획이 있다.
- [ ] DB를 앱보다 먼저 배포한다.
- [ ] required 제약은 마지막 단계로 미뤘다.

### Reference Data 필드

- [ ] 일반 schema 변경 절차를 모두 수행했다.
- [ ] `definitions/**`에 새 값을 넣었다.
- [ ] sync의 create와 update를 모두 수정했다.
- [ ] 예전 data migration을 고치지 않고 새 migration을 추가했다.
- [ ] migrations index에 등록했다.
- [ ] `db:migrate:deploy` 다음 `db:data:migrate` 순서를 지킨다.
- [ ] 실제 row와 migration history를 확인한다.
- [ ] 다시 실행해도 안전하다.

### Bootstrap 또는 Demo 필드

- [ ] bootstrap과 demo 중 어느 쪽인지 구분했다.
- [ ] 개인 dev에서만 reset을 사용한다.
- [ ] 운영 기존 row의 update가 필요한지 확인했다.
- [ ] 필요하면 Reference Data 승격 또는 별도 backfill을 선택했다.
- [ ] 운영에서 전체 seed나 bootstrap을 자동 재실행하지 않는다.

## 16. 검증 명령 모음

```bash
# schema 파일 구조 검사
pnpm --filter=@cocrepo/prisma schema:check

# Prisma 문법과 relation 검사
pnpm --filter=@cocrepo/prisma exec prisma validate

# Prisma Client 생성
pnpm --filter=@cocrepo/prisma generate

# 개발 DB용 schema migration 생성·적용
pnpm --filter=@cocrepo/prisma db:migrate

# 운영 DB에 이미 만든 schema migration 적용
pnpm --filter=@cocrepo/prisma db:migrate:deploy:prod

# 운영 DB에 reference-data migration 적용
pnpm --filter=@cocrepo/prisma db:data:migrate:prod
```

환경 명령을 실행하기 전에는 연결 대상이 정말 dev, stg, prod 중 어디인지 반드시 확인합니다.
