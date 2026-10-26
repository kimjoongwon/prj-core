# Prisma 스키마 파일 규칙: 처음 보는 사람용

이 문서는 `packages/be-prisma/schema` 안의 `.prisma` 파일을 **어디에 두고, 어떻게 나누는지** 설명합니다.

아래 한 줄만 먼저 기억하면 됩니다.

> 하위 폴더 없이 모델 하나를 파일 하나에 두고, 모델 이름으로 파일 이름을 계산합니다.

모델 위에 쓰는 주석의 자세한 뜻은
[schema-metadata-guide.md](./schema-metadata-guide.md)를 봅니다.

DB 컬럼을 실제로 추가하거나 바꾸는 순서는
[schema-change-playbook.md](./schema-change-playbook.md)를 봅니다.

## 1. Prisma 스키마가 무엇인가요?

Prisma 스키마는 데이터베이스의 설계도입니다.

```prisma
model User {
  userId String @unique @default(ulid()) @map("user_id") @db.Char(26)
  id     BigInt @id @default(autoincrement())
  email  String @unique
}
```

쉽게 비유하면 다음과 같습니다.

- `model`은 표 하나의 설계도입니다.
- 필드는 표의 열입니다.
- DB의 실제 row는 표에 적힌 한 줄의 데이터입니다.
- `.prisma` 파일은 설계도 한 장입니다.

이 저장소에서는 설계도 한 장에 모델 하나만 적습니다. 업무 분류는 폴더가 아니라 모델의 `@data-type`으로 기록합니다. 따라서 모델의 업무 의미가 다시 분류되어도 파일 경로는 바뀌지 않습니다.

## 2. 전체 구조

모든 `.prisma` 파일은 `schema/` 바로 아래에 있습니다. `schema/` 아래에는 하위 디렉터리를 만들지 않습니다.

```text
packages/be-prisma/schema/
├── _base.prisma
├── _enums.prisma
├── ability.prisma
├── ai-agent-log.prisma
├── oidc-client.prisma
├── user.prisma
└── ...                     # 나머지 모델도 같은 규칙으로 계산
```

현재 구조의 계약은 다음과 같습니다.

- 모델 파일 64개
- 예약 파일 2개: `_base.prisma`, `_enums.prisma`
- 전체 `.prisma` 파일 66개
- 모델 64개와 enum 32개

전체 모델 이름을 문서에 복사해 두지 않습니다. 실제 `schema/*.prisma` 선언이 단일 기준입니다.

## 3. 모델 파일 규칙

예약 파일이 아닌 `.prisma` 파일은 아래 조건을 모두 지킵니다.

1. `schema/` 바로 아래에 있습니다.
2. `model`을 정확히 하나 선언합니다.
3. `enum`, `generator`, `datasource`를 선언하지 않습니다.
4. 파일 이름은 model 이름에서 기계적으로 계산합니다.
5. [schema-metadata-guide.md](./schema-metadata-guide.md)의 모델 메타데이터 계약을 지킵니다.

모든 model의 식별자 계약은 같습니다.

- `id`: 내부 PK/FK join용 숫자, `BigInt @id @default(autoincrement())`
- 공개 ULID: 파일명의 kebab-case를 lowerCamelCase로 바꾼 뒤 `Id`를 붙인 필드, `String @unique @default(ulid()) @map("<snake>_id") @db.Char(26)`
- relation scalar: `<relation>Id` 이름과 `BigInt`, `@map("<relation>_id")`, `references: [id]` 사용
- API와 URL에는 내부 PK인 `id`를 노출하지 않고 공개 ULID 필드를 사용

메타데이터 종류와 형식, 의미와 판단 기준은 이 문서에서 다시 정의하지 않습니다.

## 4. 파일 이름은 어떻게 계산하나요?

model 이름은 `UpperCamelCase`로 작성합니다. 파일 이름은 다음 변환을 한 뒤 `.prisma`를 붙입니다.

```ts
name
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
  .toLowerCase();
```

예:

| model 이름        | 계산된 파일 이름          |
| ----------------- | -------------------------- |
| `User`            | `user.prisma`              |
| `OidcClient`      | `oidc-client.prisma`       |
| `AIAgentLog`      | `ai-agent-log.prisma`      |
| `S3Asset`         | `s3-asset.prisma`           |
| `SafeTransaction` | `safe-transaction.prisma`  |

사람이 별도의 경로 표에서 파일 이름을 고르지 않습니다. 변환 함수가 유일한 경로 규칙입니다.

계산된 이름이 다른 모델과 충돌하면 `schema:check`가 실패합니다. macOS처럼 대소문자를 구분하지 않는 파일 시스템도 고려하여 대소문자만 다른 이름 역시 충돌로 봅니다.

## 5. 예약 파일 규칙

### `_base.prisma`

`_base.prisma`는 Prisma가 전체 스키마를 읽을 때 필요한 공통 설정만 소유합니다.

- `generator`와 `datasource`만 선언합니다.
- `model`과 `enum`을 선언하지 않습니다.
- model 설계 메타데이터를 두지 않습니다.
- 현재 generator output과 datasource 설정은 스키마 구조 정리만을 이유로 바꾸지 않습니다.

### `_enums.prisma`

`_enums.prisma`는 모든 Prisma enum을 한곳에서 소유합니다.

- `enum`만 선언합니다.
- `model`, `generator`, `datasource`를 선언하지 않습니다.
- enum에는 model 설계 메타데이터를 두지 않습니다.
- enum 선언은 enum 이름의 오름차순으로 정렬합니다.
- enum 이름, 값과 `@map`은 DB mapping 계약이므로 임의로 바꾸지 않습니다.
- `///` 문서 주석은 DMMF 문서 계약이므로 임의로 바꾸지 않습니다.
- 어느 모델에서도 사용하지 않는 enum을 미리 추가하지 않습니다.

예:

```prisma
enum ActivityType {
  ARTICLE
  VIDEO
}

enum LanguageCode {
  EN
  KO
}
```

enum을 사용하는 model이 달라져도 enum 파일 경로는 `_enums.prisma`로 고정됩니다.

## 6. 왜 하위 폴더를 사용하지 않나요?

도메인 폴더를 사용하면 새 모델마다 “어느 폴더가 맞는가?”를 먼저 판단해야 합니다. 여러 업무 영역에서 함께 쓰는 모델은 한 폴더만 고르기 어렵고, 업무 분류가 바뀌면 파일 이동도 필요합니다.

단일 폴더 구조에서는 경로가 모델 이름만으로 정해집니다.

```text
모델 이름 -> kebab-case 변환 -> schema/<이름>.prisma
```

업무 의미는 `@data-type`이 소유합니다.

```text
업무 의미 -> MASTER | REFERENCE | CONFIGURATION | TRANSACTION | EVENT
```

경로 계산과 업무 판단을 분리하면 사람은 의미만 판단하고, 위치는 도구가 검사할 수 있습니다.

## 7. 새 모델을 추가하는 순서

예를 들어 `NotificationRule` 모델을 추가한다고 가정합니다.

### 1단계: 같은 선언이 없는지 찾습니다

```bash
rg "model NotificationRule\\b" packages/be-prisma/schema
```

같은 model을 다른 파일에 다시 선언하지 않습니다.

### 2단계: 파일 이름을 계산합니다

```text
NotificationRule -> notification-rule.prisma
```

만들 위치는 `packages/be-prisma/schema/notification-rule.prisma`입니다. 하위 폴더를 만들지 않습니다.

### 3단계: 모델 하나만 선언합니다

```prisma
// @data-type: CONFIGURATION
// @description: 알림 전달 조건과 채널 선택 규칙을 관리
/// @displayName 알림 규칙
model NotificationRule {
  notificationRuleId String @unique @default(ulid()) @map("notification_rule_id") @db.Char(26)
  id                 BigInt @id @default(autoincrement())
}
```

같은 업무 흐름에서 쓰더라도 두 번째 model이 필요하면 두 번째 파일을 만듭니다.

### 4단계: 데이터 타입을 판단합니다

다섯 타입 중 하나를 고릅니다. 분류가 어렵다면 경로를 바꾸지 말고 승인된 spec이나 도메인 owner에게 의미를 확인합니다.

### 5단계: 자동 검사를 실행합니다

```bash
pnpm --filter=@cocrepo/prisma run schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```

## 8. 새 enum을 추가하는 순서

1. 같은 enum 선언이 없는지 검색합니다.
2. 실제 model 필드에서 바로 사용할 enum인지 확인합니다.
3. `_enums.prisma`에서 이름 오름차순 위치에 선언합니다.
4. enum 이름, 값과 DB mapping을 검토합니다.
5. `schema:check`와 `prisma validate`를 실행합니다.

enum마다 별도 파일이나 하위 폴더를 만들지 않습니다.

## 9. `schema:check`가 검사하는 것

자동 검사는 사람이 실수하기 쉬운 구조를 확인합니다.

- `schema/` 아래에 하위 디렉터리가 없는가
- `_base.prisma`와 `_enums.prisma`가 정확한 책임만 가지는가
- 일반 파일마다 model이 정확히 하나 있는가
- model 파일에 enum이나 공통 설정이 섞이지 않았는가
- model 이름과 kebab-case 파일 이름이 일치하는가
- 모델 이름과 계산된 경로가 대소문자 기준으로도 충돌하지 않는가
- model과 enum 선언이 중복되지 않는가
- `_enums.prisma`의 enum이 이름순이며 실제로 사용되는가
- 모든 model이 메타데이터 가이드의 현재 자동 검사 계약을 지키는가

성공하면 전체 파일·모델·enum 수와 타입별 모델 수를 출력합니다.

자동 검사는 업무 의미까지 결정하지 못합니다. 메타데이터의 의미 판단은
[schema-metadata-guide.md](./schema-metadata-guide.md)를 따르고, relation과 제약 조건이 의도한 DB 구조를 표현하는지는 사람이 확인합니다.

## 10. 허용하지 않는 구조

다음 구조는 만들지 않습니다.

- `schema/<하위-폴더>/<파일>.prisma` 같은 중첩 경로
- 모델 여러 개가 함께 있는 파일
- enum이 섞인 모델 파일
- `_enums.prisma` 밖의 enum 선언
- 별도 수동 모델 경로 목록
- 계약을 확장하지 않은 top-level `view` 또는 composite `type` 선언

새로운 top-level 선언 종류가 필요하면 임의 파일에 넣지 않고, 예약 파일과 파일명 계산 규칙을 먼저 문서와 검증기에 추가합니다.

메타데이터 종류와 형식은 [schema-metadata-guide.md](./schema-metadata-guide.md)의 현재 계약을 따르며 이 문서에서 별도 목록을 관리하지 않습니다.

## 11. 자주 하는 실수

### 모델 파일을 새 하위 폴더에 둠

모델 이름으로 루트 파일 이름을 계산합니다. 업무 분류는 폴더가 아니라 `@data-type`에 적습니다.

### 관련 모델을 같은 파일에 넣음

relation으로 가까운 모델이어도 파일은 각각 하나씩 사용합니다.

### enum을 사용하는 모델 옆에 선언함

enum은 여러 모델이 공유할 수 있습니다. `_enums.prisma`에 이름순으로 둡니다.

### 메타데이터 판단 기준을 이 문서에서 새로 만듦

메타데이터의 형식과 판단 기준은 [schema-metadata-guide.md](./schema-metadata-guide.md)만 따릅니다.

### 문서에 전체 모델 목록을 복사함

모델 목록의 단일 기준은 실제 `.prisma` 파일입니다. 문서나 검증 코드에 전체 목록을 복제하면 나중에 서로 달라질 수 있습니다.

## 12. 작업 완료 체크리스트

- [ ] `schema/` 아래에 새 하위 폴더를 만들지 않았다.
- [ ] 모델 이름에서 파일 이름을 계산했다.
- [ ] 파일에 model이 정확히 하나 있다.
- [ ] enum은 `_enums.prisma`에 이름순으로 추가했다.
- [ ] 모델이 메타데이터 가이드의 현재 계약을 지킨다.
- [ ] `schema:check`가 성공했다.
- [ ] `prisma validate`가 성공했다.

## 13. 어려운 말 빠르게 찾기

| 말             | 쉬운 뜻                                                |
| -------------- | ------------------------------------------------------ |
| schema         | 데이터베이스 설계도                                    |
| model          | 데이터가 들어가는 표의 설계                            |
| field          | 표의 열                                                |
| enum           | 미리 정해 둔 선택지 목록                               |
| relation       | 모델과 모델의 연결                                     |
| kebab-case     | 단어 사이를 `-`로 잇는 소문자 이름                    |
| data type      | 메타데이터 가이드에서 정의하는 model 분류             |
| aggregate root | 메타데이터 가이드에서 정의하는 일관성 경계 진입점      |
| invariant      | 데이터가 바뀌어도 반드시 지켜야 하는 업무 규칙         |
