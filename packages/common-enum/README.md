# @cocrepo/enum

프론트엔드와 백엔드에서 공유하는 열거형(Enum) 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/enum
```

## 제공 열거형

### CategoryType

카테고리 타입을 정의합니다:

```typescript
import { CategoryType } from '@cocrepo/enum';

const category = CategoryType.SERVICE;
```

### CategoryName

카테고리 이름을 정의합니다:

```typescript
import { CategoryName } from '@cocrepo/enum';

const name = CategoryName.PILATES;
```

### GroupTypes

그룹 타입을 정의합니다:

```typescript
import { GroupTypes } from '@cocrepo/enum';

const groupType = GroupTypes.TEAM;
```

### GroupName

그룹 이름을 정의합니다:

```typescript
import { GroupName } from '@cocrepo/enum';

const groupName = GroupName.DEFAULT;
```

### SessionType

세션 타입을 정의합니다:

```typescript
import { SessionType } from '@cocrepo/enum';

const sessionType = SessionType.PRIVATE;
// SessionType.GROUP, SessionType.OPEN 등
```

### RecurringDayOfWeek

반복 일정의 요일을 정의합니다:

```typescript
import { RecurringDayOfWeek } from '@cocrepo/enum';

const days = [
  RecurringDayOfWeek.MONDAY,
  RecurringDayOfWeek.WEDNESDAY,
  RecurringDayOfWeek.FRIDAY,
];
```

### RepeatCycleType

반복 주기 타입을 정의합니다:

```typescript
import { RepeatCycleType } from '@cocrepo/enum';

const cycle = RepeatCycleType.WEEKLY;
// RepeatCycleType.DAILY, RepeatCycleType.MONTHLY 등
```

### RoleCategoryName

역할 카테고리 이름을 정의합니다:

```typescript
import { RoleCategoryName } from '@cocrepo/enum';

const roleCategory = RoleCategoryName.SYSTEM;
```

### RoleGroupName

역할 그룹 이름을 정의합니다:

```typescript
import { RoleGroupName } from '@cocrepo/enum';

const roleGroup = RoleGroupName.ADMIN;
```

---

## 파일 구조

```
src/
├── base-enum.ts                 # 공통 Enum 베이스
 ├── category-names.enum.ts       # 카테고리 이름
 ├── category-types.enum.ts       # 카테고리 타입
 ├── group-names.enum.ts          # 그룹 이름
 ├── group-types.enum.ts          # 그룹 타입
 ├── recurring-day-of-week.enum.ts # 반복 요일
 ├── repeat-cycle-types.enum.ts   # 반복 주기
 ├── role-category-names.enum.ts  # 역할 카테고리 이름
 ├── role-group-names.enum.ts     # 역할 그룹 이름
 ├── space-category-names.enum.ts # 공간 카테고리 이름
 ├── space-group-names.enum.ts    # 공간 그룹 이름
 ├── session-types.enum.ts        # 세션 타입
 └── index.ts                     # 통합 export
```

## Enum 구현 방식

이 패키지의 Enum은 공통 `BaseEnum`을 상속하는 순수 TypeScript class 방식으로 구현되어, 별도 외부 Enum 라이브러리 없이 사용합니다.

```typescript
export abstract class BaseEnum {
  constructor(
    protected readonly _code: string,
    protected readonly _name: string,
  ) {}

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  equals(code: string): boolean {
    return this.code === code;
  }
}
```

## 의존성

- 내부 BaseEnum 클래스 기반 구현 (`base-enum.ts`)
