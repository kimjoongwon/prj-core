# @cocrepo/enum

프론트엔드와 백엔드가 함께 사용하는 enum 값과 표시 정보를 제공합니다.

## 원천과 의존성

DB enum의 단일 원천은 `@cocrepo/prisma`의 Prisma schema입니다. 이 패키지는 브라우저 안전한 `@cocrepo/prisma/enums`에서 생성 enum을 그대로 재export합니다. enum 값과 타입을 직접 복제하지 않습니다. 이 경로는 Prisma Client를 불러오지 않습니다.

```ts
import { AssetKind, AssetKindLabel, InquiryStatus } from "@cocrepo/enum";

const kind: AssetKind = AssetKind.IMAGE; // "IMAGE"
const label = AssetKindLabel[kind]; // "이미지"
const status: InquiryStatus = InquiryStatus.NEW;
```

표시 정보는 `Record<Enum, string>`으로 선언하여 Prisma enum 변경 시 누락된 라벨을 타입 검사에서 발견합니다. 문의 도메인의 `*Options`, `InquiryStatusTransitions`, `getAllowedStatusOptions`는 기존 공개 계약을 유지합니다.

## 클래스 API 전환

Prisma 대응 enum은 클래스 인스턴스가 아닌 생성된 문자열 상수를 제공합니다. `AssetKind`, `AssetStatus`, `GroupTypes`, `RecurringDayOfWeek`의 `.code`, `.name`, `.values()` 대신 생성 상수, `*Label`, `Object.values()`를 사용합니다. `SessionType`, `RepeatCycleType`은 Prisma 이름인 `SessionTypes`, `RepeatCycleTypes` 및 각 `*Label`로 대체합니다.

이전 독립 선언의 `Image/Video/Document`, `Uploading/Ready/Failed`, `SUN/MON/...` 코드는 Prisma 값인 `IMAGE/VIDEO/DOCUMENT`, `UPLOADING/READY/FAILED`, `SUNDAY/MONDAY/...`로 통일합니다. Prisma에 없는 `RepeatCycleType.DAILY`, `YEARLY`는 제거합니다. 저장 데이터와 Prisma schema는 변경하지 않습니다.

## 앱 전용 값

`CategoryName`, `GroupName`, `DeleteFilter`, `GranteeType`, `SortOrder`는 Prisma schema enum이 아닌 앱 계약으로 유지합니다. reference-data 분류 값인 `RoleCategoryName`, `RoleGroupName`, `SpaceCategoryName`, `SpaceGroupName`은 `@cocrepo/constant`에서 소유하며 이 패키지가 재export합니다. 이는 Prisma reference-data가 enum 패키지를 역참조하는 의존성 순환을 방지합니다.

## 검증

`pnpm --filter @cocrepo/enum type-check`, `pnpm --filter @cocrepo/enum lint`, `pnpm --filter @cocrepo/enum test`로 생성 enum 재export 동일성, 라벨의 완전성, 문의 상태 전이 계약을 검증합니다.
