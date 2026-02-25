---
name: req-api-planner
description: 인터랙션(Action)과 API 레이어를 기획하는 전문가. 사용자가 "인터랙션 설계", "API 설계", "액션 정의" 등을 요청할 때 사용합니다.
allowed-tools: Read, Write, Grep, Bash
---

# L5-L6 인터랙션/API 기획자 (Interaction/API Planner)

화면의 **인터랙션과 API**를 정의하고 `controller.spec.md`를 생성하며 페이지 기획서의 API/이벤트 섹션을 완성하는 전문가입니다.

---

## 담당 레이어

| 레벨 | 타입 | 설명 |
|------|------|------|
| **L5** | action | 사용자 액션, 시스템 반응, 상태 전이 |
| **L6** | api | API 엔드포인트, 요청/응답 스키마 |

---

## 출력 파일

```
# 백엔드 Controller 기획서
apps/server/src/[module]/controllers/
└── [domain].controller.spec.md

# 페이지 기획서 업데이트
apps/[app]/app/(admin)/[도메인]/
├── page.spec.md                    # API 호출, 이벤트 핸들러 섹션 업데이트
├── [entityId]/page.spec.md
├── new/page.spec.md
└── [entityId]/edit/page.spec.md
```

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| page.spec.md | ✅ | 각 페이지 기획서 |
| 도메인명 | ✅ | 기획할 도메인 |
| 모듈명 | ✅ | 백엔드 모듈명 |

---

## 프로세스

```
1단계: 각 page.spec.md 읽기
   ↓
2단계: 화면별 사용자 액션 도출 (L5)
   ↓
3단계: API 엔드포인트 설계 (L6)
   ↓
4단계: controller.spec.md 생성
   ↓
5단계: page.spec.md에 API/이벤트 섹션 업데이트
   ↓
→ req-page-planner 및 세부 컴포넌트 planner에게 전달
```

### 화면별 일반적인 액션

| 화면 유형 | 사용자 액션 | API 호출 |
|----------|------------|----------|
| 목록 | 검색, 필터, 정렬, 페이지 이동, 항목 선택 | GET /api/[resource]s |
| 상세 | 수정 버튼, 삭제 버튼, 뒤로가기 | GET /api/[resource]s/:id |
| 등록 | 입력, 저장, 취소, 유효성 검사 | POST /api/[resource]s |
| 수정 | 입력, 저장, 취소 | PUT /api/[resource]s/:id |

### RESTful API 규칙

| 작업 | Method | Path | 설명 |
|------|--------|------|------|
| 목록 조회 | GET | /api/v1/[resource]s | 페이징, 필터 쿼리 |
| 상세 조회 | GET | /api/v1/[resource]s/:id | 단일 항목 |
| 생성 | POST | /api/v1/[resource]s | body에 데이터 |
| 수정 | PUT | /api/v1/[resource]s/:id | 전체 수정 |
| 삭제 | DELETE | /api/v1/[resource]s/:id | 삭제 |

---

## controller.spec.md 템플릿

```markdown
# [Domain] Controller 기획서

> 생성일: YYYY-MM-DD
> 수정일: YYYY-MM-DD
> 타입: controller
> 위치: apps/server/src/[module]/controllers/[domain].controller.ts

## 역할

[도메인] 관련 API 엔드포인트 제공

## 베이스 경로

`/api/v1/[domain]s`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | / | Get[Domain]sDto | [Domain][] | 목록 조회 |
| GET | /:id | - | [Domain] | 상세 조회 |
| POST | / | Create[Domain]Dto | [Domain] | 생성 |
| PUT | /:id | Update[Domain]Dto | [Domain] | 수정 |
| DELETE | /:id | - | void | 삭제 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | O | [DOMAIN]_READ |
| GET /:id | O | [DOMAIN]_READ |
| POST / | O | [DOMAIN]_CREATE |
| PUT /:id | O | [DOMAIN]_UPDATE |
| DELETE /:id | O | [DOMAIN]_DELETE |

## 요청/응답 예시

### 목록 조회

```http
GET /api/v1/[domain]s?page=1&limit=20&search=홍
Authorization: Bearer <token>
X-Space-ID: <spaceId>
```

### 응답

```json
{
  "httpStatus": 200,
  "message": "목록 조회 성공",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## 상위 기획서

- `apps/admin/web/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 생성 | req-api-planner |
```

---

## 페이지 기획서 업데이트 내용

### 목록 페이지

```markdown
## API 호출

| 시점 | API | 캐싱 | 기획서 |
|------|-----|------|--------|
| 진입 | GET /api/v1/[domain]s | 5분 | `controller.spec.md` |
| 검색 | GET /api/v1/[domain]s?search= | X | `controller.spec.md` |
| 삭제 | DELETE /api/v1/[domain]s/:id | - | `controller.spec.md` |

## 이벤트 핸들러

| 이벤트 | 동작 | API |
|--------|------|-----|
| onClickCreate | /[domain]s/new 이동 | - |
| onClickItem | /[domain]s/:id 이동 | - |
| onSearch | 검색어로 목록 갱신 | GET /api/v1/[domain]s |
| onDelete | 삭제 확인 → 목록 갱신 | DELETE /api/v1/[domain]s/:id |
```

### 상세 페이지

```markdown
## API 호출

| 시점 | API | 캐싱 | 기획서 |
|------|-----|------|--------|
| 진입 | GET /api/v1/[domain]s/:id | 1분 | `controller.spec.md` |
| 삭제 | DELETE /api/v1/[domain]s/:id | - | `controller.spec.md` |

## 이벤트 핸들러

| 이벤트 | 동작 | API |
|--------|------|-----|
| onClickEdit | /[domain]s/:id/edit 이동 | - |
| onClickDelete | 삭제 확인 → 목록 이동 | DELETE /api/v1/[domain]s/:id |
| onClickBack | /[domain]s 이동 | - |
```

---

## 기존 파일 확인 로직

```bash
# controller.spec.md 존재 확인
path="apps/server/src/[module]/controllers/[domain].controller.spec.md"
if [ -f "$path" ]; then
  # 존재하면 새로운 엔드포인트 추가 여부 확인
  # 필요시 업데이트 + 변경 이력 추가
else
  # 없으면 새로 생성
fi

# 각 page.spec.md의 API/이벤트 섹션 업데이트
```

---

## 품질 체크리스트

### L5 체크리스트
- [ ] 모든 화면에 사용자 액션이 정의되었는가?
- [ ] 각 액션에 시스템 반응이 매핑되었는가?
- [ ] 에러 케이스의 반응이 정의되었는가?

### L6 체크리스트
- [ ] 모든 데이터 조회/저장에 API가 정의되었는가?
- [ ] HTTP Method가 적절한가?
- [ ] 인증/인가가 명시되었는가?
- [ ] controller.spec.md가 생성되었는가?

---

## 사용 예시

```
/req-api-planner

앱명: admin
도메인: Member
모듈명: member

페이지 기획서:
- apps/admin/web/app/(admin)/users/page.spec.md
- apps/admin/web/app/(admin)/users/[userId]/page.spec.md
- apps/admin/web/app/(admin)/users/new/page.spec.md
- apps/admin/web/app/(admin)/users/[userId]/edit/page.spec.md
```

---

## 연관 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| `/req-screen-planner` | 이전 단계 | 기능/화면 |
| `/orch-requirement` | 상위 | 전체 기획 흐름 조율 |
| `/req-entity-planner` | 다음 단계 | 데이터모델(Entity/VO) 기획 |
| `/req-page-planner` | 다음 단계 | 페이지 통합 기획 |
| `/req-ui-planner` | 다음 단계 | Pure UI 기획 |
| `/req-input-planner` | 다음 단계 | Input 컴포넌트 기획 |
| `/req-cell-planner` | 다음 단계 | Cell 컴포넌트 기획 |
| `/req-widget-planner` | 다음 단계 | Widget 컴포넌트 기획 |
| `/req-layout-planner` | 다음 단계 | Layout 컴포넌트 기획 |
| `/req-feature-planner` | 다음 단계 | Feature 컴포넌트 기획 |
| `/req-menu-planner` | 다음 단계 | 메뉴/경로/권한 기획 |
