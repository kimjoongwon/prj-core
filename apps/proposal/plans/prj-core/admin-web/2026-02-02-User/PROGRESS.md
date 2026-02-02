# User 기획 진행 상황

## 기본 정보

- **프로젝트**: prj-core
- **앱**: admin-web
- **기능**: User (이용자 목록 조회)
- **시작일**: 2026-02-02

---

## Stage 1: 기획

### L0-L2: 컨텍스트/사용자/목표
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `01-overview.md`

### L3-L4: 기능/화면
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `02-structure.md`

### L5-L6: 인터랙션/API
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `03-interactions.md`

### L7-L8: 엔티티/컴포넌트
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `04-ui-details.md`

### L9-L10: 로직/테스트
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `05-technical-design.md`

### 통합 파일
- [x] `requirement-graph.json` 생성 완료
- [x] Proposal 앱 동기화 완료
  - 생성: `data/requirements/prj-core__admin-web__user.json`

---

## Stage 2: 스키마

- [x] 기존 User 스키마 존재 (`packages/prisma/schema/user.prisma`)
- [x] 기존 DTO 존재 (`packages/dto/src/user.dto.ts`, `packages/dto/src/users/`)

---

## Stage 3: 백엔드

- [x] 기존 UsersController 존재 (`apps/server/src/module/users/`)
- [x] API 구현 완료: GET /api/users, GET /api/users/:id

---

## Stage 4: 컴포넌트

신규 컴포넌트 (기획 완료, 개발 대기):
- [ ] UserRoleCell - 역할 뱃지 Cell
- [ ] UserStatusCell - 상태 뱃지 Cell
- [ ] SearchFilterBar - 검색+필터 Widget
- [ ] FilterPanel - 접이식 필터 패널 Widget

기존 컴포넌트 (확인 필요):
- [ ] DateTimeCell - 날짜 포맷팅 Cell 존재 여부 확인
- [ ] StatsCard - 통계 카드 Widget 존재 여부 확인

---

## Stage 5: 페이지

- [ ] UserList 페이지 (`/users`) 대기 중

개발 명령어:
```bash
# Stage 4: 컴포넌트 개발
/orch-stage run stage=4 plan=prj-core/admin-web/2026-02-02-User page=UserList

# Stage 5: 페이지 개발
/orch-stage run stage=5 plan=prj-core/admin-web/2026-02-02-User page=UserList
```

---

## 비고

- 조회 전용 기능으로 CUD 관련 기획 제외
- 기존 백엔드 API 활용
- 상세 페이지는 현재 기획 범위에 포함하지 않음 (필요 시 별도 기획)
