# prj-core/admin-web

> 📦 프로젝트: prj-core (자체 서비스)
> 📱 앱: admin-web (관리자 웹)

---

## 사용하는 공통 시스템

| 공통 시스템 | 위치 | 커스터마이징 |
|------------|------|-------------|
| CASL 권한 | [`/_core/infrastructure/2026-01-31-CASL/`](../../_core/infrastructure/2026-01-31-CASL/) | 기본 사용 |
| 메뉴 시스템 | [`/_core/navigation/2026-01-31-MenuSystem/`](../../_core/navigation/2026-01-31-MenuSystem/) | 메뉴 상수만 변경 |

---

## 프로젝트별 확장

### CASL Subject 확장

프로젝트에서 추가로 사용하는 Subject:

| Subject | Action | 설명 |
|---------|--------|------|
| `dashboard` | `read` | 대시보드 조회 |
| `user` | `read`, `create`, `update`, `delete` | 사용자 관리 |
| `admin` | `read`, `create`, `update`, `delete` | 관리자 관리 |

### 메뉴 상수 위치

- `packages/constant/src/routing/admin-menu.ts`

---

## 기능 목록

| 기능 | 폴더 | 상태 | 설명 |
|------|------|------|------|
| (예정) | | | |

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-31 | _app.md 초기 생성 |
