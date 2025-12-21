# @cocrepo/enums

프론트엔드와 백엔드에서 공유하는 열거형(Enum) 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/enums
```

## 제공 열거형

### CategoryTypes

카테고리 타입을 정의합니다:

```typescript
import { CategoryTypes } from '@cocrepo/enums';

const category = CategoryTypes.SERVICE;
```

### CategoryNames

카테고리 이름을 정의합니다:

```typescript
import { CategoryNames } from '@cocrepo/enums';

const name = CategoryNames.PILATES;
```

### GroupTypes

그룹 타입을 정의합니다:

```typescript
import { GroupTypes } from '@cocrepo/enums';

const groupType = GroupTypes.TEAM;
```

### GroupNames

그룹 이름을 정의합니다:

```typescript
import { GroupNames } from '@cocrepo/enums';

const groupName = GroupNames.DEFAULT;
```

### SessionTypes

세션 타입을 정의합니다:

```typescript
import { SessionTypes } from '@cocrepo/enums';

const sessionType = SessionTypes.PRIVATE;
// SessionTypes.GROUP, SessionTypes.OPEN 등
```

### RecurringDayOfWeek

반복 일정의 요일을 정의합니다:

```typescript
import { RecurringDayOfWeek } from '@cocrepo/enums';

const days = [
  RecurringDayOfWeek.MONDAY,
  RecurringDayOfWeek.WEDNESDAY,
  RecurringDayOfWeek.FRIDAY,
];
```

### RepeatCycleTypes

반복 주기 타입을 정의합니다:

```typescript
import { RepeatCycleTypes } from '@cocrepo/enums';

const cycle = RepeatCycleTypes.WEEKLY;
// RepeatCycleTypes.DAILY, RepeatCycleTypes.MONTHLY 등
```

### RoleCategoryNames

역할 카테고리 이름을 정의합니다:

```typescript
import { RoleCategoryNames } from '@cocrepo/enums';

const roleCategory = RoleCategoryNames.SYSTEM;
```

### RoleGroupNames

역할 그룹 이름을 정의합니다:

```typescript
import { RoleGroupNames } from '@cocrepo/enums';

const roleGroup = RoleGroupNames.ADMIN;
```

---

## 파일 구조

```
src/
├── category-names.enum.ts       # 카테고리 이름
├── category-types.enum.ts       # 카테고리 타입
├── group-names.enum.ts          # 그룹 이름
├── group-types.enum.ts          # 그룹 타입
├── recurring-day-of-week.enum.ts # 반복 요일
├── repeat-cycle-types.enum.ts   # 반복 주기
├── role-category-names.enum.ts  # 역할 카테고리
├── role-group-names.enum.ts     # 역할 그룹
├── session-types.enum.ts        # 세션 타입
└── index.ts                     # 통합 export
```

## ts-jenum

이 패키지는 `ts-jenum` 라이브러리를 사용하여 Java 스타일의 강력한 Enum을 제공합니다:

```typescript
import { Enum, EnumType } from 'ts-jenum';

@Enum('value')
export class SessionTypes extends EnumType<SessionTypes>() {
  static readonly PRIVATE = new SessionTypes('PRIVATE', '1:1 개인 수업');
  static readonly GROUP = new SessionTypes('GROUP', '그룹 수업');
  static readonly OPEN = new SessionTypes('OPEN', '오픈 수업');

  private constructor(
    readonly value: string,
    readonly description: string,
  ) {
    super();
  }
}
```

### ts-jenum 장점

- 타입 안정성
- 추가 속성 지원 (description 등)
- 메서드 추가 가능
- 직렬화/역직렬화 지원

## 의존성

- `ts-jenum` - Java 스타일 Enum 라이브러리
