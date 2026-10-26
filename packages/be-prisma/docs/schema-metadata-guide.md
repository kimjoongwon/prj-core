# Prisma 모델 메타데이터 가이드

이 문서는 Prisma 모델 위에 적는 메타데이터의 뜻과 판단 기준을 설명합니다.

메타데이터의 종류, 형식, 의미와 Prisma 기본 속성의 구분은 이 문서가 단독으로 소유합니다. 다른 문서는 이 계약을 복제하지 않고 이 문서를 참조합니다.

핵심 원칙은 두 줄입니다.

> 모든 모델은 업무 데이터 성격을 `@data-type`으로 설명합니다.
>
> DDD의 Aggregate Root는 데이터 타입과 별개로 판단하고, 관계와 DB 구조는 Prisma schema 자체로 표현합니다.

파일을 어디에 두는지는
[schema-file-conventions.md](./schema-file-conventions.md)를 봅니다.

## 0. 1분 요약

먼저 세 단어만 쉽게 바꿔서 생각합니다.

- **model**: 같은 종류의 내용을 적는 장부입니다. `User`라면 사용자 장부입니다.
- **row**: 장부에 적은 한 줄입니다. 민지 사용자 한 명이 row 하나입니다.
- **`@data-type`**: “이 장부를 왜 보관하지?”라는 질문에 답하는 스티커입니다.

`@data-type`은 필드의 자료형을 말하지 않습니다. `String`, `Int`, `DateTime` 같은 Prisma 타입과도 관계없습니다.

| 타입            | 한눈에 보는 이름 | row 한 장이 뜻하는 것                                      | 실제 예시        |
| --------------- | --------------- | ----------------------------------------------------------- | ---------------- |
| `MASTER`        | 주인공 카드     | 계속 같은 사람·장소·물건으로 관리하는 대상의 현재 모습     | `User`           |
| `REFERENCE`     | 공용 이름표     | 여러 곳에서 같은 뜻으로 가져다 쓰는 이름·코드·분류 기준    | `Action`         |
| `CONFIGURATION` | 규칙판          | 앞으로 시스템이 어떻게 행동할지를 정하는 설정              | `SecurityPolicy` |
| `TRANSACTION`   | 진행표          | 신청부터 완료·취소까지 처리하는 업무 한 건                  | `Reservation`    |
| `EVENT`         | 일기 한 줄      | 특정 시각에 이미 일어난 사실 하나                           | `AuthAuditLog`   |

분류할 때는 row 한 장을 들고 다음처럼 묻습니다.

> 이 row는 **주인공**, **공용 기준**, **여러 번 적용할 규칙**, **진행 중인 일**, **이미 일어난 사실** 중 무엇인가?

나머지 절은 이 표를 실제 schema와 연결해서 자세히 설명합니다.

## 1. 기준 자료

이 저장소의 용어는 프로젝트에서 임의로 만들지 않고 아래 자료의 개념을 실무에 맞게 적용합니다.

### 데이터 종류

- Springer, [Master Data, Transaction Data, and Event Data 구분](https://link.springer.com/chapter/10.1007/978-3-319-16673-5_2)
- IBM, [Master data, reference data, transactional data 설명](https://www.ibm.com/think/topics/master-data-management)
- Martin Fowler, [Domain Event](https://martinfowler.com/eaaDev/DomainEvent.html)

Springer 자료는 master, transaction, event, configuration data를 구분하는 토대를 제공합니다. IBM 자료는 master와 reference data의 차이와 transactional data의 성격을 설명합니다. Fowler의 Domain Event는 “업무에서 일어난 일”을 명시적으로 기록하는 관점을 설명합니다.

이 자료의 표현을 그대로 DB 테이블 분류표로 복사하지는 않습니다. 이 저장소에서는 팀이 반복해서 같은 판단을 할 수 있도록 다섯 값으로 정리합니다.

### 이 분류는 Microsoft 표준인가요?

아닙니다. 특정 회사의 공식 표준을 그대로 가져온 분류가 아닙니다.

- `MASTER`, `TRANSACTION`, `EVENT`, `CONFIGURATION`은 Springer 전공서가 설명하는 기업 데이터 구분을 토대로 합니다.
- `REFERENCE`는 IBM이 설명하는 공통 코드·분류 데이터 개념을 보완해서 사용합니다.
- 최종 다섯 값과 각 모델의 판정은 이 저장소가 소유하는 설계 계약입니다.

Microsoft Dynamics 365도 비슷한 용어를 사용하지만
[master, configuration, transactional, inferred data](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/data-management-architecture)라는 다른 구분을 사용합니다. 따라서 이 저장소의 다섯 값을 “Microsoft 분류”라고 부르지 않습니다.

### Domain-Driven Design과 관계형 매핑

- Eric Evans, [_Domain-Driven Design: Tackling Complexity in the Heart of Software_](https://www.informit.com/store/domain-driven-design-tackling-complexity-in-the-heart-9780321125217)
- Martin Fowler, [DDD Aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html)
- Martin Fowler, [Evans Classification](https://martinfowler.com/bliki/EvansClassification.html)
- Martin Fowler, [Association Table Mapping](https://martinfowler.com/eaaCatalog/associationTableMapping.html)
- Prisma, [Many-to-many relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations)
- Prisma, [Table inheritance](https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance)

Evans의 Aggregate는 함께 일관성을 지켜야 하는 도메인 객체의 경계입니다. Aggregate Root는 그 경계 밖에서 접근하는 진입점입니다.

Entity, Value Object, Service 같은 DDD 분류는 테이블 모양만으로 결정할 수 없습니다. 관계 테이블과 상속 테이블도 도메인 객체 분류가 아니라 영속성 매핑 방법입니다. 따라서 이 저장소는 이 정보를 별도 설계 메타데이터로 복제하지 않습니다.

## 2. 현재 메타데이터 계약

모델 위에 적는 정보는 **설계 메타데이터**와 **Prisma 문서 주석**으로 나눕니다.

### 설계 메타데이터

설계 메타데이터는 아래 세 종류가 전부이며 슬래시 2개(`//`)로 작성합니다.

| 형식                       | 필수 여부          | 답하는 질문                                      |
| -------------------------- | ------------------ | ------------------------------------------------ |
| `// @data-type: <TYPE>`    | 모든 모델에 필수   | 이 모델은 어떤 성격의 업무 데이터를 저장하는가? |
| `// @description: <설명>`  | 모든 모델에 필수   | 이 모델이 담당하는 업무 책임은 무엇인가?         |
| `// @aggregate-root: true` | 필요한 모델만 선택 | 이 모델이 Aggregate의 일관성 경계 진입점인가?    |

설계 메타데이터는 model 선언 앞의 한 주석 블록에 모읍니다. 그 블록의 마지막 줄에는 model의 `/// @displayName`이 옵니다. 다른 이름을 추가하지 않으며 `schema:check`가 이름, 개수, 위치와 값 형식을 검사합니다.

### Prisma 문서 주석

```prisma
/// @displayName 사용자
```

`/// @displayName`은 설계 메타데이터가 아니라 Prisma가 DMMF에 보존하는 문서 주석입니다.

- 모든 model 선언 바로 위에 정확히 하나 둡니다.
- enum과 업무 필드에도 사람이 읽는 한글 이름이 필요할 때 사용합니다.
- 설명하는 model, enum 또는 field 선언의 바로 위에 둡니다.
- 슬래시 3개(`///`)와 `@displayName 이름` 형식을 사용합니다.

### Prisma 기본 속성

아래 문법은 Prisma가 DB 구조와 mapping을 표현하기 위해 제공하는 기본 속성입니다. 이 저장소의 설계 메타데이터 종류에 포함하지 않습니다.

| 적용 위치 | 현재 사용하는 Prisma 기본 속성                                           |
| --------- | ------------------------------------------------------------------------ |
| 필드      | `@id`, `@default`, `@map`, `@relation`, `@unique`, `@updatedAt`, `@db.*` |
| model     | `@@index`, `@@map`, `@@unique`                                            |
| enum      | `@@map`                                                                   |

`@data-type`과 `@aggregate-root`는 서로 독립적입니다.

- `@data-type`은 “어떤 종류의 업무 데이터를 저장하는가?”에 답합니다.
- `@aggregate-root`는 “어떤 모델을 통해 이 묶음의 불변식을 지키며 변경하는가?”에 답합니다.

예를 들어 `MASTER` 모델이 항상 Aggregate Root인 것도 아니고, `TRANSACTION` 모델만 Aggregate Root가 될 수 있는 것도 아닙니다.

## 3. 다섯 가지 `@data-type`

모든 모델은 다음 값 중 정확히 하나를 사용합니다.

```text
MASTER
REFERENCE
CONFIGURATION
TRANSACTION
EVENT
```

값은 대문자로 적습니다. 데이터 타입은 파일 경로에 영향을 주지 않습니다.

### 한 사람의 하루로 다섯 타입 보기

민지가 서비스에 로그인해서 수업을 예약한다고 가정합니다.

1. `User`에는 민지의 현재 이메일과 활성 상태가 있습니다.
   - 민지라는 같은 사용자를 계속 관리하므로 `MASTER`입니다.
2. 권한 검사에서 `Action(name="read")`를 공통으로 사용합니다.
   - 여러 권한이 “조회”라는 같은 뜻을 사용하게 하므로 `REFERENCE`입니다.
3. `SecurityPolicy.passwordMinLength=10`에 따라 비밀번호를 검사합니다.
   - 값을 12로 바꾸면 앞으로의 검사 방법이 달라지므로 `CONFIGURATION`입니다.
4. 민지가 수업 예약 버튼을 누르면 `Reservation` 한 건이 생깁니다.
   - 예약이 대기·확정·취소 상태를 거치므로 `TRANSACTION`입니다.
5. 로그인 결과는 `AuthAuditLog` 한 줄로 남습니다.
   - “언제 로그인에 성공하거나 실패했다”는 이미 일어난 사실이므로 `EVENT`입니다.

같은 사용자 행동에서도 다섯 타입이 함께 생길 수 있습니다. 따라서 API 하나, 화면 하나 또는 DB 작업 하나를 통째로 같은 타입이라고 판단하지 않습니다. **model마다 row의 역할을 따로 봅니다.**

### `MASTER`: 핵심 대상의 현재 모습

업무에서 계속 식별하고 관리하는 핵심 대상의 identity, 현재 상태와 생명주기를 나타냅니다.

쉬운 비유:

> 학교에서 학생 한 명의 학적부처럼, 시간이 지나도 “같은 대상”으로 계속 관리하는 기록입니다.

대표 예:

- 사용자 계정의 현재 상태
- 회사나 공간처럼 계속 식별하는 업무 대상
- 파일 자산처럼 생명주기를 관리하는 대상

#### 실제 예시 1: `User`는 사용자 한 명의 현재 카드

[실제 `User` schema 보기](../schema/user.prisma)

`User` row 하나를 쉬운 값으로 적으면 다음과 같습니다.

```text
id = 1
userId = "user-minji"
name = "민지"
email = "minji@example.com"
isActive = true
failedLoginAttempts = 0
lastLoginAt = "2026-07-25 10:00"
```

- 민지가 가입할 때 row가 한 번 생깁니다.
- 이메일을 바꾸면 같은 row의 `email`을 고칩니다.
- 로그인에 실패하면 같은 row의 `failedLoginAttempts`가 바뀝니다.
- 계정을 잠그거나 풀어도 여전히 같은 민지의 row입니다.

즉, `User`는 회원가입 요청 한 건이 아니라 **가입 뒤에도 계속 존재하는 사용자 자체**입니다.

`lastLoginAt`이라는 시각 필드가 있어도 `EVENT`가 아닙니다. 이 필드는 마지막 로그인 시각 하나만 보여 주는 현재 상태입니다. 로그인 시도 하나하나의 과거 기록은 `AuthAuditLog`가 담당합니다.

#### 실제 예시 2: `Asset`은 파일 하나의 현재 카드

[실제 `Asset` schema 보기](../schema/asset.prisma)

```text
id = 1
assetId = "asset-001"
originalName = "운동사진.jpg"
kind = IMAGE
status = UPLOADING
storageKey = "images/asset-001"
```

- 업로드를 시작하면 `UPLOADING`으로 생깁니다.
- 업로드가 끝나면 같은 row가 `READY`로 바뀝니다.
- 실패하면 `FAILED`, 삭제하면 `removedAt`이 바뀝니다.
- 업로드 작업이 끝난 뒤에도 사진 파일 자체는 계속 조회하고 관리합니다.

상태가 변한다고 무조건 `TRANSACTION`인 것은 아닙니다. 이 row의 주인공은 “업로드 신청서”가 아니라 **계속 보관할 파일 자산**이므로 `MASTER`입니다.

`MASTER`가 아닌 예:

- 사용자가 보낸 한 번의 요청: `TRANSACTION`
- 로그인에 성공했다는 시점 사실: `EVENT`
- 시스템 행동을 제어하는 보안 규칙: `CONFIGURATION`

### `REFERENCE`: 해석과 분류에 함께 쓰는 기준

여러 데이터가 같은 뜻으로 해석되도록 제공하는 비교적 안정적인 코드, 분류, 허용 목록이나 기준 항목입니다.

쉬운 비유:

> 여러 반에서 공통으로 사용하는 “학년 코드표”나 “과목 분류표”입니다.

대표 예:

- 권한 판정에서 공유하는 action 또는 subject 기준
- 여러 모델이 참조하는 역할이나 분류 항목
- 언어나 상태를 해석하는 공통 기준

#### 실제 예시 1: `Action`은 권한에서 함께 쓰는 행동 이름표

[실제 `Action` schema 보기](../schema/action.prisma)

현재 기준 데이터에는 다음과 같은 `Action` row가 있습니다.

```text
name = "read"
displayName = "조회"
group = "crud"
```

여러 권한 규칙이 각자 “보기”, “읽기”, “조회하기”처럼 다른 말을 만들지 않고 이 row를 참조합니다. 그러면 시스템 전체에서 `read`가 같은 뜻이 됩니다.

`Action`은 실제로 누가 무엇을 조회한 기록이 아닙니다. “조회”라는 행동을 같은 뜻으로 사용하게 해 주는 **공용 낱말 카드**입니다.

#### 실제 예시 2: `Role`은 여러 사용자가 함께 쓰는 역할 이름표

[실제 `Role` schema 보기](../schema/role.prisma)

```text
name = "MEMBER"
displayName = "회원"
```

- 사용자마다 `Role` row를 새로 만드는 것이 아닙니다.
- 여러 `Tenant`가 같은 “회원” 역할을 참조합니다.
- “회원”이라는 역할의 표시 이름이나 설명이 바뀌면 공용 역할 정의를 고칩니다.

민지가 어느 공간에서 현재 회원인지 나타내는 row는 `Tenant`입니다. `Role`은 여러 멤버십이 함께 가져다 쓰는 **역할 사전**이므로 `REFERENCE`입니다.

`REFERENCE`가 아닌 예:

- 운영자가 바꾸어 시스템 행동을 조정하는 정책: `CONFIGURATION`
- 특정 사용자의 현재 역할 수행 상태: 상황에 따라 `MASTER` 또는 `TRANSACTION`

중요: `@data-type: REFERENCE`와 seed 운영의 **Reference Data**는 같은 판정이 아닙니다.

- `@data-type: REFERENCE`는 model 전체의 업무 의미를 분류합니다.
- Reference Data는 특정 row의 정답을 Git 코드가 소유하고 운영 환경에 동기화할지를 결정합니다.

둘은 자주 함께 나타나지만 자동으로 묶이지 않습니다. 자세한 운영 기준은
[seed-data-governance.md](./seed-data-governance.md)를 봅니다.

### `CONFIGURATION`: 시스템 행동을 조정하는 규칙과 설정

운영자나 시스템이 정하고, 이후 처리 방식에 영향을 주는 정책, 설정, 템플릿 또는 실행 규칙입니다.

쉬운 비유:

> 학교의 시간표 운영 규칙이나 출입 정책처럼, 값을 바꾸면 앞으로의 행동이 달라지는 설정입니다.

대표 예:

- 보안 정책
- 외부 인증 client 설정
- 메시지 템플릿과 치환 변수
- 실행 계획이나 프로그램 구성

#### 실제 예시 1: `SecurityPolicy`는 로그인 보안 규칙판

[실제 `SecurityPolicy` schema 보기](../schema/security-policy.prisma)

```text
key = "default"
passwordMinLength = 10
temporaryLockThreshold = 5
temporaryLockDurationMin = 15
sessionTtlSec = 86400
```

이 row는 다음과 같이 시스템에 명령합니다.

- 비밀번호는 최소 10글자인지 검사한다.
- 로그인을 5번 틀리면 15분 동안 잠근다.
- 세션은 86,400초 동안 유지한다.

`passwordMinLength`를 10에서 12로 바꾸면 그다음 비밀번호 검사부터 결과가 달라집니다. 단순한 이름표가 아니라 **앞으로의 시스템 행동을 바꾸는 규칙**이므로 `CONFIGURATION`입니다.

#### 실제 예시 2: `Template`은 실제 메시지가 아니라 메시지 틀

[실제 `Template` schema 보기](../schema/template.prisma)

```text
code = "signup-welcome"
type = EMAIL
subject = "가입을 환영해요"
content = "안녕하세요 {{name}}님"
isActive = true
```

- 민지에게 이미 보낸 이메일 한 건이 아닙니다.
- 앞으로 여러 사용자에게 보낼 이메일을 만드는 틀입니다.
- 제목이나 본문을 바꾸면 이후에 만들어지는 메시지가 달라집니다.
- `isActive=false`로 바꾸면 앞으로 이 틀을 사용하지 않게 할 수 있습니다.

붕어빵 하나가 아니라 붕어빵을 찍어 내는 **틀**에 가깝기 때문에 `CONFIGURATION`입니다.

`CONFIGURATION`과 `REFERENCE`를 구분하는 질문:

> 이 값은 데이터를 같은 뜻으로 읽게 하는 기준인가, 아니면 시스템이 어떻게 행동할지를 조정하는가?

- 해석과 분류의 공통 기준이면 `REFERENCE`
- 처리 방식과 행동을 조정하면 `CONFIGURATION`

### `TRANSACTION`: 업무 요청·교환·처리 과정의 기록

업무가 진행되면서 생기는 요청, 신청, 대화, 예약, 교환 또는 처리 상태를 나타냅니다. 생성 뒤 상태가 바뀔 수도 있고, 완료되거나 취소될 수도 있습니다.

쉬운 비유:

> 학생이 상담을 신청하고 접수·처리·완료 상태를 거치는 한 건의 업무 기록입니다.

대표 예:

- 문의와 문의 메시지
- 예약 또는 접근 요청
- 외부 시스템과 진행 중인 교환 상태

#### 실제 예시 1: `Reservation`은 수업 예약 한 건의 진행표

[실제 `Reservation` schema 보기](../schema/reservation.prisma)

```text
userId = "user-minji"
programId = "swimming-class"
occurrenceStartAt = "2026-07-26 15:00"
status = WAITLISTED
waitlistPosition = 2
```

이 row는 다음처럼 진행될 수 있습니다.

```text
WAITLISTED -> CONFIRMED -> CANCELED
```

- 민지가 특정 날짜의 수업을 예약할 때 한 건이 생깁니다.
- 자리가 없으면 대기 순번을 가집니다.
- 자리가 생기면 확정되고 `confirmedAt`이 채워집니다.
- 취소하면 `canceledAt`과 `cancelReason`이 채워집니다.

민지라는 사람 자체나 수업 프로그램 자체가 아니라 **특정 수업 회차를 예약한 업무 한 건**이므로 `TRANSACTION`입니다.

#### 실제 예시 2: `TenantAccessRequest`는 공간 입장 신청서

[실제 `TenantAccessRequest` schema 보기](../schema/tenant-access-request.prisma)

```text
requesterId = "user-minji"
spaceId = "space-math"
requestedRoleId = "role-member"
reason = "수업에 참여하고 싶어요"
status = PENDING
```

- 신청할 때 `PENDING`으로 생깁니다.
- 관리자가 승인하면 `APPROVED`, 거절하면 `REJECTED`가 됩니다.
- 검토한 사람과 시각은 `reviewerId`, `reviewedAt`에 채워집니다.
- 승인 뒤 만들어진 실제 멤버십은 `Tenant`가 담당합니다.

`TenantAccessRequest`는 멤버십 자체가 아니라 멤버십을 만들어 달라는 **신청부터 처리 결과까지의 진행표**입니다.

여기서 `TRANSACTION`은 SQL의 `BEGIN`, `COMMIT`, `ROLLBACK`으로 묶는 **DB transaction**을 뜻하지 않습니다. 한 `TRANSACTION` 모델을 여러 DB transaction에 걸쳐 처리할 수 있고, 하나의 DB transaction에서 여러 데이터 타입을 함께 변경할 수도 있습니다.

### `EVENT`: 특정 시점에 일어난 사실의 기록

업무나 시스템에서 이미 일어난 일을 시점과 함께 남기는 감사, 이력, 로그 또는 발생 사실입니다.

쉬운 비유:

> “7월 25일 10시에 출입에 성공했다”처럼, 나중에 무슨 일이 있었는지 확인하는 기록입니다.

대표 예:

- 인증 감사 로그
- 비밀번호 변경 이력
- 자동화 agent가 수행한 행동 기록

#### 실제 예시 1: `AuthAuditLog`는 로그인 한 번의 기록

[실제 `AuthAuditLog` schema 보기](../schema/auth-audit-log.prisma)

```text
createdAt = "2026-07-25 10:00"
email = "minji@example.com"
result = FAILURE
failureReason = "비밀번호 불일치"
ipAddress = "192.0.2.10"
```

- 민지가 로그인할 때마다 새 row를 한 줄 추가합니다.
- 다음 로그인은 기존 row의 결과를 고치지 않고 새 row로 남깁니다.
- 성공, 실패, 계정 잠금 같은 당시 결과를 보존합니다.

이 row는 로그인 과정을 계속 처리하는 진행표가 아니라 **10시에 이미 일어난 로그인 시도 한 번**이므로 `EVENT`입니다.

현재 로그인 실패 횟수와 잠금 상태는 `User`가 보관합니다. `AuthAuditLog`는 과거의 개별 시도를 보관합니다.

#### 실제 예시 2: `PasswordHistory`는 예전 비밀번호의 발자국

[실제 `PasswordHistory` schema 보기](../schema/password-history.prisma)

```text
userId = "user-minji"
passwordHash = "안전하게 변환된 이전 비밀번호 값"
createdAt = "2026-07-20 09:00"
```

- 비밀번호를 바꿀 때 과거 비밀번호의 hash를 새 row로 추가합니다.
- 다음에 또 바꾸면 기존 row를 고치지 않고 기록을 하나 더 추가합니다.
- 새 비밀번호가 예전에 사용한 값인지 검사할 때 이 기록을 봅니다.

현재 비밀번호는 `User`에 있습니다. `PasswordHistory`는 **과거에 이 값을 사용했다는 사실**을 누적하므로 `EVENT`입니다.

`EVENT`와 `TRANSACTION`을 구분하는 질문:

> 지금 진행 중인 업무 건의 상태를 관리하는가, 아니면 이미 일어난 사실을 기록하는가?

- 요청부터 완료까지의 업무 건을 관리하면 `TRANSACTION`
- 특정 시점의 발생 사실을 기록하면 `EVENT`

`EVENT` 태그는 Event Sourcing을 사용한다는 뜻이 아닙니다. 모든 상태를 event 재생으로 복원해야 한다는 계약도 아니며, 메시지 브로커로 발행된다는 뜻도 아닙니다. 불변성, 보존 기간과 발행 방식은 별도 설계와 DB 제약으로 결정합니다.

## 4. 데이터 타입 판단 순서

### 먼저 model의 주된 책임을 한 문장으로 적습니다

필드 하나만 보고 고르면 거의 항상 헷갈립니다. 먼저 다음 문장을 완성합니다.

```text
이 model은 ____________________________하기 위해 존재한다.
```

예:

```text
User는 사용자 한 명의 현재 계정 상태를 관리하기 위해 존재한다.
Reservation은 특정 수업 회차의 예약 처리 상태를 관리하기 위해 존재한다.
AuthAuditLog는 로그인 한 번의 결과를 시각과 함께 남기기 위해 존재한다.
```

그다음 아래 질문을 위에서부터 읽습니다. **model의 주된 존재 이유**와 처음으로 맞는 답을 선택합니다.

1. row 하나가 특정 시각에 이미 일어난 사실 하나인가?
   - 예: 로그인 한 번의 결과인 `AuthAuditLog`
   - 맞으면 `EVENT`
2. row 하나가 접수되어 완료·취소될 때까지 처리하는 업무 한 건인가?
   - 예: `WAITLISTED → CONFIRMED → CANCELED`로 바뀌는 `Reservation`
   - 맞으면 `TRANSACTION`
3. 같은 규칙을 여러 사람·대상·처리에 앞으로 반복 적용하는가?
   - 예: 모든 로그인에 적용할 잠금 횟수를 가진 `SecurityPolicy`
   - 맞으면 `CONFIGURATION`
4. 여러 model이나 row가 같은 이름·코드·분류의 뜻을 공유하도록 참조하는가?
   - 예: 여러 권한이 참조하는 `Action(name="read")`
   - 맞으면 `REFERENCE`
5. 시간이 지나도 같은 사람·장소·물건으로 식별하며 현재 모습을 관리하는가?
   - 예: 이메일이나 활성 상태가 바뀌어도 같은 사용자인 `User`
   - 맞으면 `MASTER`

어느 질문에도 분명히 답할 수 없다면 이름이나 필드를 보고 억지로 고르지 않습니다. 승인된 spec과 도메인 owner에게 model의 존재 이유를 먼저 확인합니다.

### 자주 틀리는 판단

#### `createdAt`이 있으면 `EVENT`인가요?

아닙니다. 거의 모든 model에 생성 시각이 있을 수 있습니다.

- `User.createdAt`: 사용자가 언제 만들어졌는지 알려 주는 현재 카드의 정보
- `AuthAuditLog.createdAt`: 로그인 사건이 언제 일어났는지 알려 주는 사건의 핵심 정보

같은 필드가 있어도 model의 주된 책임이 다릅니다.

#### `status`가 바뀌면 `TRANSACTION`인가요?

아닙니다.

- `Asset.status`: 계속 관리할 파일 자산의 현재 상태이므로 `MASTER`
- `Reservation.status`: 예약 한 건이 처리되는 단계이므로 `TRANSACTION`

상태 필드의 존재가 아니라 **무엇의 상태인지**를 봅니다.

#### 값을 바꾸면 시스템 행동이 달라지니 모두 `CONFIGURATION`인가요?

아닙니다.

`User.isActive=false`로 바꾸면 로그인이 막힐 수 있지만 `User`의 주된 책임은 사용자 한 명의 현재 모습을 관리하는 것입니다. 반면 `SecurityPolicy.temporaryLockThreshold`는 여러 사용자의 로그인에 반복 적용할 규칙 자체이므로 `CONFIGURATION`입니다.

#### 운영자가 수정할 수 있으면 `CONFIGURATION`인가요?

아닙니다. 누가 수정하는지는 보조 정보일 뿐입니다.

- 운영자가 사용자 이름을 고쳐도 `User`는 `MASTER`
- 운영자가 공용 역할 이름을 고쳐도 `Role`은 `REFERENCE`
- 운영자가 비밀번호 최소 길이를 고치면 `SecurityPolicy`는 `CONFIGURATION`

### 헷갈리는 짝을 바로 비교하기

| 비교 대상                              | 왼쪽                                           | 오른쪽                                                     |
| -------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `User`와 `AuthAuditLog`                | 현재 사용자 카드인 `MASTER`                    | 로그인할 때마다 남는 과거 사실인 `EVENT`                   |
| `Role`과 `TenantAccessRequest`         | 모두가 쓰는 역할 정의인 `REFERENCE`            | 그 역할을 달라는 신청 한 건인 `TRANSACTION`                |
| `SecurityPolicy`와 `User`              | 여러 사용자에게 적용할 규칙인 `CONFIGURATION`  | 특정 사용자 한 명의 현재 상태인 `MASTER`                   |
| `Template`과 실제 메시지               | 앞으로 메시지를 만드는 틀인 `CONFIGURATION`    | 실제 발송 한 건은 별도 업무 기록 또는 발생 사실            |
| `Reservation`과 예약 취소 발생 기록    | 예약 전체 진행을 관리하는 `TRANSACTION`        | “10시에 취소했다”만 따로 남기면 `EVENT`                     |

### 1분 확인 문제

정답을 먼저 가리고 이유까지 말해 봅니다.

1. 민지의 현재 이름, 이메일, 활성 상태를 저장한다.
2. 여러 권한이 함께 쓰는 `조회` 행동 이름을 저장한다.
3. 비밀번호는 최소 10글자여야 한다는 규칙을 저장한다.
4. 수업 예약이 대기에서 확정되고 나중에 취소된다.
5. 7월 25일 10시에 로그인에 실패했다는 사실을 저장한다.
6. `User.lastLoginAt`과 로그인할 때마다 추가되는 `AuthAuditLog`는 같은 타입인가?

정답:

1. `MASTER`: 같은 사용자의 현재 모습을 계속 관리합니다.
2. `REFERENCE`: 여러 권한이 같은 행동 이름을 참조합니다.
3. `CONFIGURATION`: 앞으로 여러 비밀번호 검사에 반복 적용합니다.
4. `TRANSACTION`: 예약 한 건의 처리 상태가 진행됩니다.
5. `EVENT`: 특정 시각에 이미 일어난 사실입니다.
6. 다릅니다. `User`는 최신 상태를 가진 `MASTER`, `AuthAuditLog`는 시도마다 남는 `EVENT`입니다.

질문 하나만으로 불분명하면 다음을 함께 확인합니다.

- 모델이 왜 존재하는지 설명한 승인된 spec
- 누가 값을 만들고 바꾸는지
- 값이 현재 상태인지, 처리 중인 업무 건인지, 이미 일어난 사실인지
- 다른 모델이 이 값을 “대상”, “기준”, “설정”, “업무 건”, “발생 사실” 중 무엇으로 사용하는지

relation 개수, 파일 이름, API CRUD 유무만으로 타입을 결정하지 않습니다. 분류가 달라져도 flat schema 파일 경로는 바뀌지 않습니다.

## 5. 주석 형식

권장 순서는 아래와 같습니다.

```prisma
// @data-type: MASTER
// @aggregate-root: true
// @description: 사용자 계정의 현재 상태와 생명주기를 관리
/// @displayName 사용자
model User {
  userId String @unique @default(ulid()) @map("user_id") @db.Char(26)
  id     BigInt @id @default(autoincrement())
}
```

Aggregate Root가 아니라면 `@aggregate-root` 줄만 뺍니다.

### 설계 메타데이터

```prisma
// @data-type: CONFIGURATION
// @description: 인증 요청을 처리할 외부 client 설정을 관리
```

- 슬래시는 2개입니다.
- 태그 이름 뒤에 콜론(`:`)을 씁니다.
- `@data-type` 값은 다섯 허용값 중 하나를 대문자로 씁니다.
- `schema:check`가 이름, 개수, 위치와 값 형식을 검사합니다.

### Prisma DMMF 문서

```prisma
/// @displayName OIDC 클라이언트
```

- 슬래시는 3개입니다.
- `@displayName` 뒤에는 콜론을 쓰지 않습니다.
- `@DisplayName`, `@displayname`처럼 대소문자를 바꾸지 않습니다.

설계 메타데이터는 model 선언 앞의 주석 블록에 모으고 model용 Prisma 문서 주석을 그 블록의 마지막 줄에 둡니다. enum이나 field의 Prisma 문서 주석은 각각 설명하는 enum 또는 field 선언 바로 위에 둡니다. 주석과 설명 대상 사이를 빈 줄이나 다른 선언으로 분리하지 않습니다.

## 6. `@description`

모든 모델에 정확히 하나 있어야 합니다.

```prisma
// @description: 로그인 시도 결과를 보관하여 보안 사고 추적을 지원
```

다음 질문에 답하는 한 문장으로 작성합니다.

> 이 모델이 없으면 어떤 업무 책임을 수행할 수 없는가?

좋은 설명:

```prisma
// @description: Template에서 사용할 치환 변수의 이름과 기본값을 관리
```

피해야 할 설명:

```prisma
// @description: id, templateId, name 필드가 있는 모델
// @description: Template과 N:1 관계인 모델
// @description: 템플릿 관련 모델
```

필드 목록과 relation은 코드에 이미 있습니다. “관련 모델” 같은 표현은 책임을 설명하기에 너무 넓습니다.

## 7. `/// @displayName`

모든 모델에 정확히 하나 있어야 합니다.

```prisma
/// @displayName 로그인 감사 기록
```

사람이 모델 목록에서 바로 이해할 수 있는 짧은 한글 이름을 적습니다.

잘못된 형식:

```prisma
// @displayName: 사용자
/// @DisplayName 사용자
/// @displayname 사용자
```

## 8. `@aggregate-root: true`

Aggregate는 여러 도메인 객체를 하나의 일관성 단위로 다루는 DDD 패턴입니다. Aggregate Root는 외부에서 그 묶음을 변경할 때 사용하는 진입점입니다.

단순히 아래 조건에 해당한다는 이유로 붙이지 않습니다.

- 특정 데이터 타입이다.
- 독립 CRUD API가 있다.
- 중요한 모델처럼 보인다.
- relation이 많다.
- 다른 모델이 이 모델을 참조한다.

태그를 붙이기 전에 아래 질문에 답해야 합니다.

1. 외부 로직이 하위 모델을 Root 없이 직접 변경해도 되는가?
2. Root가 보호해야 하는 비즈니스 불변식은 무엇인가?
3. 한 명령에서 일관성을 보장할 범위는 어디까지인가?
4. 외부 Aggregate는 내부 객체가 아니라 Root의 identity를 참조하는가?

답이 분명하지 않다면 태그를 추가하지 않고 승인된 spec 또는 도메인 owner에게 확인합니다.

## 9. 관계 모델은 어떻게 표현하나요?

추가 속성이 있는 관계는 Prisma의 explicit relation model로 표현합니다. 별도 분류 태그를 붙이지 않습니다.

```prisma
// @data-type: CONFIGURATION
// @description: Policy와 Ability를 연결하여 정책의 권한 구성을 관리
/// @displayName 정책 권한
model PolicyEntry {
  policyEntryId String @unique @default(ulid()) @map("policy_entry_id") @db.Char(26)
  id            BigInt @id @default(autoincrement())
  policyId      BigInt @map("policy_id")
  abilityId     BigInt @map("ability_id")

  policy  Policy  @relation(fields: [policyId], references: [id])
  ability Ability @relation(fields: [abilityId], references: [id])

  @@unique([policyId, abilityId])
}
```

관계의 의미는 다음 코드 요소로 드러냅니다.

- 업무 용어를 사용한 model 이름
- 양쪽 FK와 relation
- 중복을 막는 `@@unique` 또는 `@@id`
- 순서, 상태, 역할처럼 관계 자체가 소유하는 필드
- 모델의 존재 이유를 설명하는 `@description`

## 10. 1:1 상세 모델은 어떻게 표현하나요?

1:1 관계라는 사실만으로 상속이나 다형성으로 분류하지 않습니다.

```prisma
// @data-type: TRANSACTION
// @description: Inquiry에 종속되어 감정 분석 결과를 보관
/// @displayName 감정 분석
model SentimentAnalysis {
  sentimentAnalysisId String  @unique @default(ulid()) @map("sentiment_analysis_id") @db.Char(26)
  id                  BigInt  @id @default(autoincrement())
  inquiryId           BigInt  @unique @map("inquiry_id")
  inquiry             Inquiry @relation(fields: [inquiryId], references: [id])
}
```

`@unique`와 `@relation`이 두 모델의 구조를 이미 표현합니다. 이 사실만으로 `SentimentAnalysis`가 `Inquiry`의 하위 타입이 되지는 않습니다.

## 11. 실제 다형성은 어떻게 표현하나요?

실제 다형성이 필요할 때만 `type` 또는 `kind` discriminator를 둡니다.

```prisma
// `_enums.prisma`
enum AssetKind {
  DOCUMENT
  IMAGE
  VIDEO
}
```

```prisma
// `asset.prisma`
// @data-type: MASTER
// @description: 보관되는 파일 자산의 공통 identity와 종류를 관리
/// @displayName 자산
model Asset {
  assetId String    @unique @default(ulid()) @map("asset_id") @db.Char(26)
  id      BigInt    @id @default(autoincrement())
  kind    AssetKind

  image    Image?
  video    Video?
  document Document?
}
```

타입별 `Image`, `Video`, `Document` 모델도 각각 계산된 별도 파일에 둡니다. 타입 정보의 단일 기준은 `Asset.kind`이며, 주석 태그로 같은 정보를 다시 쓰지 않습니다.

주의할 점:

- 모든 1:1 상세 모델에 discriminator를 추가하지 않습니다.
- 실제로 서로 배타적인 타입이며 치환 가능한 경우에만 상속 매핑을 사용합니다.
- DB에 새 discriminator를 추가하면 schema migration과 기존 row backfill이 필요합니다.

## 12. 메타데이터 밖에서 표현하는 정보

아래 정보는 설계 메타데이터를 늘리지 않고 Prisma 코드 자체나 owner 문서에 표현합니다.

- 파일 위치: model 이름에서 계산
- relation 종류: FK, `@relation`, `@unique`, `@@id`
- explicit join 의미: model 이름과 relation 필드
- 실제 다형성: discriminator와 relation
- 도메인 소유권: 승인된 spec과 도메인 코드

## 13. 자동 검사

```bash
pnpm --filter=@cocrepo/prisma run schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```

`schema:check`가 검사하는 항목:

- 모든 모델에 필수 설계 메타데이터인 `@data-type`, `@description`이 정확히 하나 있는가
- 모든 모델에 Prisma 문서 주석인 `/// @displayName`이 정확히 하나 있는가
- `@data-type`이 다섯 허용값 중 하나인가
- `@aggregate-root`가 중복되지 않았는가
- 설계 메타데이터가 현재 세 종류로만 구성되어 있는가
- model의 설계 메타데이터와 Prisma 문서 주석이 하나의 model 주석 블록에 있는가
- 파일 구조와 이름이 flat schema 계약을 지키는가

사람이 판단할 항목:

- 데이터 타입이 모델의 실제 업무 성격과 일치하는가
- 설명이 모델의 실제 책임을 말하는가
- Aggregate 경계가 비즈니스 불변식과 일치하는가
- 관계 model의 이름과 제약이 업무 의미를 충분히 표현하는가
- discriminator가 실제 다형성을 나타내는가

## 14. 작업 완료 체크리스트

- [ ] 모든 모델에 `@data-type`이 정확히 하나 있다.
- [ ] 다섯 데이터 타입의 판단 질문에 답할 수 있다.
- [ ] `TRANSACTION`을 DB transaction 의미로 사용하지 않았다.
- [ ] `EVENT`를 Event Sourcing 사용 표시로 해석하지 않았다.
- [ ] `REFERENCE` 모델 분류와 Reference Data row 운영 정책을 별도로 판단했다.
- [ ] 모든 모델에 `@description`과 `/// @displayName`이 정확히 하나 있다.
- [ ] Aggregate Root의 불변식과 경계를 설명할 수 있다.
- [ ] 관계는 model 이름, FK, relation과 unique constraint로 표현했다.
- [ ] 설계 메타데이터가 `@data-type`, `@description`, `@aggregate-root`로만 구성되어 있다.
- [ ] `schema:check`와 `prisma validate`가 성공했다.

## 15. 용어

| 용어                    | 뜻                                                         |
| ----------------------- | ---------------------------------------------------------- |
| Master Data             | 계속 식별하고 관리하는 핵심 업무 대상의 현재 정보          |
| Reference Data          | 데이터를 같은 의미로 해석하게 하는 공통 기준               |
| Configuration Data      | 시스템의 처리 방식과 행동을 조정하는 규칙과 설정            |
| Transaction Data        | 요청·교환·처리 과정에서 생기는 업무 건의 기록               |
| Event Data              | 특정 시점에 이미 일어난 사실의 기록                         |
| DB transaction          | 여러 DB 작업을 전부 성공시키거나 전부 취소하는 실행 단위     |
| Event Sourcing          | 상태를 event 기록의 재생으로 복원하는 아키텍처 패턴          |
| Aggregate               | 함께 일관성을 지켜야 하는 도메인 객체 묶음                  |
| Aggregate Root          | Aggregate 외부에서 접근하는 일관성 경계의 진입점             |
| explicit relation model | 관계 테이블을 Prisma model로 직접 선언한 구조               |
| discriminator           | row가 어느 타입인지 구분하는 `type` 또는 `kind` 필드        |
| invariant               | 데이터가 바뀌어도 반드시 지켜야 하는 비즈니스 규칙          |
| DMMF                    | Prisma가 schema를 읽어 만든 구조화된 model 정보             |
