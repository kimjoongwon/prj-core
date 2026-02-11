---
name: route-design
description: 백엔드 엔티티 기반으로 프론트엔드 라우팅 경로를 설계합니다. 사용자가 "경로 설계", "라우팅 설계", "URL 구조" 등을 요청할 때 사용합니다.
allowed-tools: Bash, Read, Grep
---

# 라우팅 경로 설계 (route-design)

백엔드 엔티티 구조를 기반으로 프론트엔드 라우팅 경로를 설계합니다.
경로는 추상적 의미를 담아야 하며, UI 구현 방식에 종속되지 않아야 합니다.

---

## 중요 원칙

**절대 하지 말아야 할 것:**

- ❌ UI 구현 방식 단어 사용 (`list`, `table`, `grid`, `card`, `form`)
- ❌ 엔티티 이름과 다른 경로 사용 (User → `/members`)
- ❌ 단수형 사용 (`/user` → `/users`)

**반드시 해야 할 것:**

- ✅ 경로에 엔티티 이름의 복수형 사용 (`/users`, `/categories`)
- ✅ 경로는 "무엇이 있는 화면인가" 표현
- ✅ Prisma 스키마에서 정확한 엔티티 이름 확인
- ✅ API 경로와 프론트엔드 경로 일관성 유지

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 대상 Entity | ✅ | 경로 설계 대상 엔티티 |
| 기획서 | ⚪ | 참고할 기획 문서 |

---

## 실행 지침

### 1단계: 엔티티 파악

```bash
# Prisma 스키마에서 엔티티 목록 확인
ls packages/be-prisma/schema/*.prisma

# 특정 엔티티 스키마 확인
cat packages/be-prisma/schema/user.prisma
```

### 2단계: 엔티티-경로 매핑 규칙

| 엔티티 | 테이블명 | 경로 |
|--------|----------|------|
| User | users | /users |
| Category | categories | /categories |
| Group | groups | /groups |
| Role | roles | /roles |
| Ability | abilities | /abilities |
| Space | spaces | /spaces |
| Content | contents | /contents |

### 3단계: 하위 경로 패턴

```
/{entities}                 → 목록 화면
/{entities}/new             → 생성 화면
/{entities}/:id             → 상세 화면
/{entities}/:id/edit        → 수정 화면
/{entities}/{sub-resource}  → 하위 리소스 목록
```

### 4단계: 기존 경로 확인

```bash
# 메뉴 설정 파일 확인
cat packages/common-constant/src/routing/admin-menu.ts

# 기존 라우트 파일 구조 확인
ls apps/admin/app/
```

---

## 출력 형식

### 경로 설계서 템플릿

```markdown
# 경로 설계서

## 엔티티-경로 매핑

| 엔티티 | 현재 경로 | 변경 경로 | 변경 사유 |
|--------|-----------|-----------|-----------|
| User | /members | /users | 엔티티 이름 일치 |
| User | /members/list | /users | list 제거 |

## 경로 상수 (PATHS)

```typescript
export const PATHS = {
  USERS: "/users",
  USERS_GRADES: "/users/grades",
  USERS_WITHDRAWN: "/users/withdrawn",
};
```

## Subject 상수 (SUBJECTS)

```typescript
export const SUBJECTS = {
  MENU_USERS: "menu:users",
  MENU_USERS_GRADES: "menu:users:grades",
};
```

## 메뉴 구조

```typescript
export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "users",
    label: "사용자",
    subject: "menu:users",
    children: [
      { id: "users-main", label: "사용자 목록", path: "/users", subject: "menu:users:main" },
    ],
  },
];
```
```

---

## 올바른/잘못된 예시

### 올바른 예시

```
✅ 올바른 예시
/users          → User 엔티티의 복수형
/reservations   → Reservation 엔티티의 복수형
/contents       → Content 엔티티의 복수형
```

### 잘못된 예시

```
❌ 잘못된 예시
/members        → 엔티티가 User인데 members 사용
/member-list    → UI 구현 방식(list)이 경로에 포함됨
/user           → 단수형 사용
```

---

## 특수 케이스

### 설정 페이지

```
/settings/ground       → Ground 설정
/settings/permissions  → 권한(Ability) 설정
```

### 인증 페이지

```
/auth/login
/auth/register
/auth/forgot-password
```

### 기능적 의미 (허용)

```
✅ 허용
/reservations/calendar  → 캘린더는 "시간 기반 보기"라는 기능
/notifications/send     → 발송은 "발송 기능"

❌ 금지
/users/list            → list는 순수 UI 구현 방식
/users/table           → table은 순수 UI 구현 방식
```

---

## 체크리스트

- [ ] 모든 경로가 엔티티 이름(복수형)을 사용하는가?
- [ ] UI 구현 방식 단어(list, table, grid)가 없는가?
- [ ] 경로가 추상적 의미를 담고 있는가?
- [ ] 계층 구조가 논리적인가?
- [ ] Subject가 경로 구조와 일치하는가?
- [ ] 영어 복수형 규칙을 따르는가? (user → users, category → categories)

---

## 주의사항

- 이 Skill은 **설계 결과 리포트만** 출력합니다
- 실제 파일 생성/수정은 사용자가 별도로 진행해야 합니다
- 설계 결과를 바탕으로 `page-builder` 에이전트가 페이지를 생성합니다
