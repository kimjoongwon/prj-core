# AdminLayout & MenuSystem 화면 기획서

**플랫폼:** Admin Web (Desktop + Mobile)
**최종 수정일:** 2026-01-06
**버전:** 5.0

---

## 개정 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-12-30 | 초안 작성 |
| 2.0 | 2026-01-01 | 코드베이스 분석 후 전면 개정 |
| 3.0 | 2026-01-01 | 좌측 사이드바 + 2depth 트리 메뉴 구조로 변경 |
| 4.0 | 2026-01-03 | 모바일 반응형 레이아웃 추가 |
| 5.0 | 2026-01-06 | Prisma 스키마 기반 메뉴 트리 재설계 |

### 주요 변경 사항 (v5.0)

1. **메뉴 트리 재설계**: Prisma 스키마 엔티티 기반으로 메뉴 구조 전면 재설계
2. **개발 상세 내용 제거**: 순수 기획 문서로 정리

---

## 1. 화면 개요

### 목적

엔터프라이즈급 멀티테넌트 어드민 시스템의 전체 레이아웃과 메뉴 시스템을 제공합니다.

### 레이아웃 구조

**데스크톱 (768px 이상):**
- **Header**: 로고 + Space 셀렉터 + 유저 메뉴
- **Sidebar (좌측)**: 2depth 트리 메뉴
- **Main**: 페이지 콘텐츠 영역

**모바일 (768px 미만):**
- **Header**: 로고 + Space 셀렉터 + 유저 메뉴
- **Main**: 페이지 콘텐츠 영역
- **BottomTab**: 1depth 메뉴 (하단 탭)
- **SubMenuList**: 2depth 메뉴 (전체 화면 리스트)

### 진입 조건

- Space 선택 완료
- 관리자 인증 완료

### 이탈 조건

- 로그아웃
- Space 재선택

---

## 2. 화면 구조

### 데스크톱 레이아웃

```
+------------------+----------------------------------------------------------+
|      [Logo]      |                                   [Space▼] [Avatar▼]    |  <- Header
+------------------+----------------------------------------------------------+
|                  |                                                          |
|  📊 대시보드      |                                                          |
|                  |                                                          |
|  ▼ 👥 사용자      |                                                          |
|     사용자 목록   |                                                          |
|     등급 관리     |                    페이지 콘텐츠 영역                      |
|                  |                                                          |
|  ▶ 📅 일정        |                                                          |
|  ▶ 📁 파일        |                                                          |
|  ▶ 📝 콘텐츠      |                                                          |
|  ▶ 💰 지갑        |                                                          |
|  ▶ ⚙️ 설정        |                                                          |
|                  |                                                          |
+------------------+----------------------------------------------------------+
     Sidebar                                Main
```

### 모바일 레이아웃

```
+----------------------------------------------------------------+
|               [Logo]               [Space▼] [Avatar▼]         |  <- Header
+----------------------------------------------------------------+
|                                                                |
|                     페이지 콘텐츠 영역                           |
|                                                                |
+----------------------------------------------------------------+
| [대시보드] [사용자] [일정] [파일] [더보기]                        |  <- BottomTab
+----------------------------------------------------------------+
```

---

## 3. 메뉴 트리 (Prisma 스키마 기반)

### 1depth 메뉴

| ID | 라벨 | 아이콘 | Subject | 하위 메뉴 |
|----|------|--------|---------|-----------|
| dashboard | 대시보드 | LayoutDashboard | menu:dashboard | 없음 (바로 이동) |
| users | 사용자 | Users | menu:users | 있음 |
| schedules | 일정 | Calendar | menu:schedules | 있음 |
| files | 파일 | FolderOpen | menu:files | 있음 |
| contents | 콘텐츠 | FileText | menu:contents | 있음 |
| wallets | 지갑 | Wallet | menu:wallets | 있음 |
| settings | 설정 | Settings | menu:settings | 있음 |

### 2depth 메뉴 상세

#### 사용자 (users)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| users-list | 사용자 목록 | /users | menu:users:list | User |
| users-profiles | 프로필 관리 | /users/profiles | menu:users:profiles | Profile |
| users-categories | 분류 관리 | /users/categories | menu:users:categories | Category (type=User) |
| users-groups | 그룹 관리 | /users/groups | menu:users:groups | Group (type=User) |

#### 일정 (schedules)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| schedules-timelines | 타임라인 | /schedules/timelines | menu:schedules:timelines | Timeline |
| schedules-sessions | 세션 | /schedules/sessions | menu:schedules:sessions | Session |
| schedules-programs | 프로그램 | /schedules/programs | menu:schedules:programs | Program |
| schedules-routines | 루틴 | /schedules/routines | menu:schedules:routines | Routine |

#### 파일 (files)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| files-list | 파일 목록 | /files | menu:files:list | File |
| files-categories | 분류 관리 | /files/categories | menu:files:categories | Category (type=File) |

#### 콘텐츠 (contents)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| contents-posts | 게시물 | /contents/posts | menu:contents:posts | Post |
| contents-list | 콘텐츠 목록 | /contents | menu:contents:list | Content |

#### 지갑 (wallets)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| wallets-list | 지갑 목록 | /wallets | menu:wallets:list | SafeWallet |
| wallets-transactions | 트랜잭션 | /wallets/transactions | menu:wallets:transactions | SafeTransaction |

#### 설정 (settings)

| ID | 라벨 | 경로 | Subject | 관련 엔티티 |
|----|------|------|---------|-------------|
| settings-ground | Ground 정보 | /settings/ground | menu:settings:ground | Ground |
| settings-roles | 역할 관리 | /settings/roles | menu:settings:roles | Role |
| settings-abilities | 권한 관리 | /settings/abilities | menu:settings:abilities | Ability, Subject |
| settings-tenants | 테넌트 관리 | /settings/tenants | menu:settings:tenants | Tenant |
| settings-ui-configs | UI 설정 | /settings/ui-configs | menu:settings:ui-configs | UIConfig |

---

## 4. 인터랙션 정의

### Header

| 액션 | 결과 |
|------|------|
| 로고 클릭 | 대시보드로 이동 |
| Space 셀렉터 클릭 | Space 선택 페이지로 이동 |
| 아바타 클릭 | 로그아웃 메뉴 표시 |

### Sidebar (데스크톱)

| 액션 | 결과 |
|------|------|
| 대시보드 클릭 | 대시보드 페이지로 이동 |
| 1depth 메뉴 클릭 (하위 있음) | 해당 메뉴 펼침/접힘 토글 |
| 2depth 메뉴 클릭 | 해당 페이지로 이동 |

### BottomTab + SubMenuList (모바일)

| 액션 | 결과 |
|------|------|
| 1depth 탭 클릭 (하위 없음) | 해당 페이지로 이동 |
| 1depth 탭 클릭 (하위 있음) | SubMenuList 전체 화면 표시 |
| SubMenuList 항목 클릭 | 해당 페이지로 이동 + SubMenuList 닫힘 |
| 뒤로가기 버튼 클릭 | SubMenuList 닫힘 |

---

## 5. UI 상세

### Header

- 높이: 64px (데스크톱), 56px (모바일)
- 배경: 반투명 + 블러 효과
- 테두리: 하단 구분선

### Sidebar (데스크톱)

- 너비: 240px (고정)
- 배경: bg-content1
- 테두리: 우측 구분선

**1depth 메뉴 스타일:**
- 기본: 회색 텍스트
- 호버: 배경색 변경
- 활성: primary 색상 + bold

**2depth 메뉴 스타일:**
- 들여쓰기: 40px
- 기본: 연한 회색 텍스트
- 활성: primary 배경 + primary 텍스트

### BottomTab (모바일)

- 높이: 64px
- 배경: bg-content1
- 테두리: 상단 구분선
- 탭 구성: 아이콘 + 라벨 (세로 배치)
- 최대 5개 탭 (초과 시 "더보기" 처리)

### SubMenuList (모바일)

- 전체 화면 높이
- 배경: bg-background
- 항목 높이: 56px
- 구분선: 각 항목 하단
- 우측: 화살표 아이콘

---

## 6. 권한 체계

### Subject 네이밍 규칙

| 패턴 | 설명 | 예시 |
|------|------|------|
| `menu:{domain}` | 1depth 메뉴 접근 | menu:users |
| `menu:{domain}:{sub}` | 2depth 메뉴 접근 | menu:users:list |
| `entity:{Entity}` | 엔티티 CRUD | entity:User |
| `feature:{name}` | 특정 기능 | feature:export |

### 권한 액션

| 액션 | 설명 |
|------|------|
| ACCESS | 메뉴/기능 접근 |
| CREATE | 생성 |
| READ | 조회 |
| UPDATE | 수정 |
| DELETE | 삭제 |
| MANAGE | 전체 관리 |
| EXPORT | 내보내기 |
| IMPORT | 가져오기 |

---

## 7. 반응형 브레이크포인트

| 뷰포트 | 브레이크포인트 | 레이아웃 |
|--------|---------------|----------|
| 모바일 | < 768px | BottomTab + SubMenuList |
| 데스크톱 | >= 768px | 좌측 Sidebar |

---

## 8. 관련 문서

| 문서 | 설명 |
|------|------|
| [모바일 레이아웃 상세](./2025-12-30-AdminLayoutAndMenuSystem-Mobile.md) | 모바일 반응형 상세 기획 |

---

**문서 끝**
