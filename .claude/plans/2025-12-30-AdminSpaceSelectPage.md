# 📋 AdminSpaceSelectPage 화면 기획서

**플랫폼:** Admin Web

## 1. 화면 개요

### 목적
관리자가 접근 가능한 Ground 목록을 확인하고, 관리할 Ground를 선택하여 해당 Space 컨텍스트로 접속하기 위한 화면입니다. 멀티테넌트 구조에서 관리자가 어떤 Ground를 관리할지 결정하는 진입점 역할을 합니다. Space는 Ground의 개념적/기능적 컨텍스트로서 실제 데이터는 Ground에 존재합니다.

### 진입 조건
- 관리자 로그인 완료
- 관리자 권한 확인 완료
- 2개 이상의 Ground 접근 권한이 있는 경우 (1개만 있으면 자동 선택)

### 이탈 조건
- Ground 선택 완료 시 어드민 대시보드로 이동
- 로그아웃 시 로그인 화면으로 이동

---

## 2. 화면 구조

### 레이아웃 (Admin Web)

```
┌─────────────────────────────────────────────────────────┐
│                     [Logo]                              │
│                                                         │
│              관리할 Ground를 선택하세요                    │
│                                                         │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│    │   [Logo]     │  │   [Logo]     │  │   [Logo]     ││
│    │              │  │              │  │              ││
│    │  Ground A    │  │  Ground B    │  │  Ground C    ││
│    │  서울 강남점   │  │  서울 홍대점   │  │  부산 해운대점 ││
│    │              │  │              │  │              ││
│    └──────────────┘  └──────────────┘  └──────────────┘│
│                                                         │
│    ┌──────────────┐  ┌──────────────┐                  │
│    │   [Logo]     │  │   [Logo]     │                  │
│    │              │  │              │                  │
│    │  Ground D    │  │  Ground E    │                  │
│    │  인천 송도점   │  │  대구 동성로점 │                  │
│    │              │  │              │                  │
│    └──────────────┘  └──────────────┘                  │
│                                                         │
│                    [ 로그아웃 ]                          │
└─────────────────────────────────────────────────────────┘
```

### 컴포넌트 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| Header | Logo + Text | 로고 및 안내 문구 |
| Content | Ground Card Grid | 선택 가능한 Ground 카드 목록 (그리드 레이아웃) |
| Footer | Button | 로그아웃 버튼 |

---

## 3. 데이터 요구사항

### 필요한 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/v1/admin/grounds | 관리자가 접근 가능한 Ground 목록 조회 | Admin Token |

### API 응답 예시

```json
{
  "data": [
    {
      "id": "ground-uuid-1",
      "name": "서울 강남점",
      "spaceId": "space-uuid-1",
      "logoImageFileId": "file-uuid-1",
      "address": "서울시 강남구 테헤란로 123",
      "role": "ADMIN"
    },
    {
      "id": "ground-uuid-2",
      "name": "서울 홍대점",
      "spaceId": "space-uuid-2",
      "logoImageFileId": "file-uuid-2",
      "address": "서울시 마포구 홍익로 456",
      "role": "SUPER_ADMIN"
    }
  ]
}
```

### 필요한 상태

| 상태 | 타입 | 설명 | 초기값 |
|------|------|------|--------|
| grounds | AdminGround[] | Ground 목록 | [] |
| selectedGroundId | string \| null | 선택된 Ground ID | null |
| isLoading | boolean | 로딩 상태 | true |
| errorMessage | string | 에러 메시지 | "" |

### 타입 정의

```typescript
interface AdminGround {
  id: string;
  name: string;
  spaceId: string;
  logoImageFileId?: string;
  address?: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'MANAGER';
}
```

### 저장소 (Storage)

| 키 | 저장소 | 설명 |
|----|--------|------|
| currentSpaceId | localStorage | 현재 선택된 Space ID (개념적 컨텍스트 식별자) |
| currentGroundId | localStorage | 현재 선택된 Ground ID |
| adminRole | sessionStorage | 해당 Ground에서의 관리자 권한 |

---

## 4. 인터랙션 정의

### 사용자 액션

| 액션 | 트리거 | 결과 |
|------|--------|------|
| Ground 카드 클릭 | Ground 카드 클릭 | Ground 선택 및 해당 Space 컨텍스트 저장 후 대시보드 이동 |
| 로그아웃 클릭 | 로그아웃 버튼 클릭 | 로그인 화면으로 이동 |

### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onClickGroundCard | ground: AdminGround | localStorage/sessionStorage 저장 후 라우터 이동 |
| onClickLogout | - | 인증 토큰 제거 후 로그인 페이지 이동 |

### 상태 변화 흐름

```
페이지 진입
    ↓
isLoading = true
    ↓
API 호출 (GET /api/v1/admin/grounds)
    ↓
성공 → grounds = response.data, isLoading = false
       만약 grounds.length === 1이면 자동 선택 후 대시보드 이동
실패 → errorMessage = "...", isLoading = false
    ↓
사용자가 Ground 카드 클릭
    ↓
localStorage.setItem("currentSpaceId", ground.spaceId)
localStorage.setItem("currentGroundId", ground.id)
sessionStorage.setItem("adminRole", ground.role)
    ↓
router.push("/admin/dashboard")
```

---

## 5. UI 상세

### 로딩 상태
- 스켈레톤 카드 표시 (6개, 그리드 레이아웃)

### 빈 상태
- "접근 가능한 Ground가 없습니다" 메시지
- 로그아웃 버튼만 활성화

### 에러 상태
- 에러 메시지 표시
- 재시도 버튼 제공

### Ground 카드 디자인
- Ground 로고 (logoImageFileId로 이미지 표시, 없으면 기본 이미지)
- Ground 이름 (name) - 예: "서울 강남점"
- 주소 (address) - 선택적 표시
- 권한 배지 (role) - SUPER_ADMIN일 경우 "최고 관리자" 배지 표시
- Hover 시 카드 강조 효과
- 클릭 시 즉시 이동 (별도 확인 버튼 불필요)

---

## 6. 기존 컴포넌트 활용 제안

### 사용 가능한 기존 컴포넌트

| 컴포넌트 | 용도 | 경로 |
|----------|------|------|
| VStack | 수직 정렬 | components/ui/surfaces/VStack |
| HStack | 수평 정렬 | components/ui/surfaces/HStack |
| Text | 텍스트 표시 | components/ui/data-display/Text |
| Button | 버튼 | components/ui/inputs/Button |
| Card (HeroUI) | 카드 컴포넌트 | @heroui/react |
| Skeleton (HeroUI) | 스켈레톤 | @heroui/react |
| Badge (HeroUI) | 권한 배지 | @heroui/react |
| Image (HeroUI) | Ground 로고 | @heroui/react |

### 신규 컴포넌트 필요 여부
- [x] 필요함 → 아래 명세 참고

### 신규 컴포넌트 명세

---
**AdminGroundCard 컴포넌트를 만들어주세요.**

**Props:**
- ground: AdminGround (Ground 데이터)
- onPress?: (ground: AdminGround) => void (클릭 핸들러)

**표시 내용:**
- Ground 로고 이미지
- Ground 이름 (name) - 예: "서울 강남점"
- 주소 (address, 있을 경우)
- 권한 배지 (role이 SUPER_ADMIN일 경우)

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/AdminGroundCard/AdminGroundCard.tsx
---

---

## 7. 페이지 빌더 전달 내용

### 페이지-빌더에게 요청할 내용

---
**AdminSpaceSelectPage를 만들어주세요.**

**기능:**
- GET /api/v1/admin/grounds API로 접근 가능한 Ground 목록 조회
- Ground가 1개만 있으면 자동으로 선택 후 대시보드 이동
- Ground가 2개 이상이면 카드 형태로 목록 표시
- Ground 클릭 시 localStorage/sessionStorage에 저장 후 대시보드 이동
- 로그아웃 버튼 제공

**필요한 상태:**
- grounds: AdminGround[] (목록)
- isLoading: boolean (로딩)
- errorMessage: string (에러)

**필요한 핸들러:**
- onClickGroundCard(ground: AdminGround): Ground 선택 및 저장 후 이동
- onClickLogout(): 로그아웃 처리

**페이지 경로:** /admin/select-space

**레이아웃:** 독립적인 전체 화면 레이아웃 (AdminLayout 없이)
---

---

## 8. 백엔드 빌더 전달 내용

### 백엔드-빌더에게 요청할 내용

---
**GET /api/v1/admin/grounds API를 만들어주세요.**

**인증:** Admin JWT Token 필요

**응답 형식:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "spaceId": "string",
      "logoImageFileId": "string?",
      "address": "string?",
      "role": "ADMIN | SUPER_ADMIN | MANAGER"
    }
  ]
}
```

**비즈니스 로직:**
- JWT 토큰에서 관리자 ID 추출
- 해당 관리자가 접근 가능한 Ground 목록 조회
- Ground와 연결된 Space ID 포함 (Space는 개념적 컨텍스트로 name 등의 속성 없음)
- 각 Ground에서의 관리자 권한(role) 정보 포함

**에러 처리:**
- 401: 인증 토큰 없음 또는 유효하지 않음
- 403: 관리자 권한 없음
- 500: 서버 에러
---
