# API 명세

> 상위 문서: [README.md](./README.md)

---

## 1. 회원 목록 조회

```
GET /api/v1/users

Query Parameters:
- page: number (기본값: 1)
- limit: number (기본값: 20, 최대: 100)
- search: string (통합 검색어)
- roles: string[] (역할 필터)
- status: 'active' | 'inactive' | 'removed' (상태 필터)
- categoryId: string (분류 필터)
- groupIds: string[] (그룹 필터)
- createdFrom: ISO8601 (가입일 시작)
- createdTo: ISO8601 (가입일 종료)
- sortBy: string (정렬 필드)
- sortOrder: 'asc' | 'desc'

Response:
{
  data: User[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  },
  stats: {
    total: number,
    active: number,
    inactive: number,
    newThisMonth: number
  }
}
```

---

## 2. 회원 상세 조회

```
GET /api/v1/users/:id

Response:
{
  data: {
    ...User,
    profiles: Profile[],
    tenants: Tenant[] (with Role, Space),
    classification: UserClassification (with Category),
    associations: UserAssociation[] (with Group)
  }
}
```

---

## 3. 회원 등록

```
POST /api/v1/users

Body:
{
  name: string,
  email: string,
  phone: string,
  password: string,
  roleId: string,
  categoryId?: string,
  groupIds?: string[]
}
```

---

## 4. 회원 수정

```
PATCH /api/v1/users/:id

Body:
{
  name?: string,
  email?: string,
  phone?: string,
  categoryId?: string,
  groupIds?: string[]
}
```

---

## 5. 회원 삭제

```
DELETE /api/v1/users/:id

(Soft Delete: removedAt 설정)
```

---

## 6. 일괄 작업

```
POST /api/v1/users/bulk

Body:
{
  action: 'changeRole' | 'assignCategory' | 'addGroup' | 'deactivate' | 'activate' | 'delete',
  userIds: string[],
  payload: {
    roleId?: string,
    categoryId?: string,
    groupId?: string
  }
}
```

---

## 7. 내보내기

```
GET /api/v1/users/export

Query Parameters:
- format: 'xlsx' | 'csv' | 'pdf'
- (동일한 필터 파라미터)

Response: File download
```
