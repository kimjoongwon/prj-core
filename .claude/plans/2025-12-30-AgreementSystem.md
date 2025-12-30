# 📋 약관 시스템 기획서

## 개요

운동 예약 플랫폼의 회원가입 및 약관 관리 시스템 기획서입니다.

**작성일:** 2025-12-30

**플랫폼:**
- **Web**: 웹 브라우저 환경 (React)
- **Mobile**: 모바일 앱 환경 (React Native)
- **Admin**: 관리자 웹 페이지 (Web only)

---

## 📊 Agreement 스키마 설계

### 1. Agreement (약관)

```prisma
model Agreement {
  id          String              @id @default(uuid())
  seq         Int                 @unique @default(autoincrement())
  createdAt   DateTime            @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?           @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?           @map("removed_at") @db.Timestamptz(6)

  // 약관 정보
  title       String              // 약관 제목 (예: "서비스 이용약관")
  type        AgreementType       // 약관 종류
  version     String              // 버전 (예: "1.0.0")
  content     String              @db.Text // 약관 내용 (HTML 형식)
  isRequired  Boolean             @default(true) // 필수 여부
  isActive    Boolean             @default(true) // 활성화 여부 (최신 버전만 true)
  effectiveAt DateTime            @map("effective_at") @db.Timestamptz(6) // 시행일

  // Relations
  consents    UserAgreementConsent[]

  @@map("agreements")
}
```

### 2. UserAgreementConsent (사용자 약관 동의)

```prisma
model UserAgreementConsent {
  id          String     @id @default(uuid())
  seq         Int        @unique @default(autoincrement())
  createdAt   DateTime   @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?  @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?  @map("removed_at") @db.Timestamptz(6)

  userId      String     @map("user_id")
  agreementId String     @map("agreement_id")
  agreed      Boolean    @default(false) // 동의 여부
  agreedAt    DateTime?  @map("agreed_at") @db.Timestamptz(6) // 동의 시각
  ipAddress   String?    @map("ip_address") // 동의 시 IP (법적 증빙)

  user        User       @relation(fields: [userId], references: [id])
  agreement   Agreement  @relation(fields: [agreementId], references: [id])

  @@unique([userId, agreementId])
  @@map("user_agreement_consents")
}
```

### 3. AgreementType Enum

```prisma
enum AgreementType {
  TERMS_OF_SERVICE      // 서비스 이용약관
  PRIVACY_POLICY        // 개인정보 처리방침
  MARKETING_CONSENT     // 마케팅 정보 수신 동의
  LOCATION_CONSENT      // 위치 기반 서비스 이용약관
  THIRD_PARTY_SHARING   // 제3자 정보 제공 동의
}
```

### 4. User 모델 업데이트 필요

```prisma
model User {
  // ... 기존 필드
  agreementConsents UserAgreementConsent[]  // 추가
}
```

---

## 📱 화면 기획

### 1. AgreementConsentPage (약관 동의 페이지)

**플랫폼:** Web + Mobile

사용자가 회원가입 시 약관에 동의하는 페이지

#### 화면 구조

**Web:**
```
┌─────────────────────────────────────┐
│         약관 동의                    │
├─────────────────────────────────────┤
│                                     │
│  [ ✓ ] 전체 동의                    │
│  ─────────────────────────────────  │
│                                     │
│  [ ✓ ] 서비스 이용약관 (필수)  [보기]│
│  [ ✓ ] 개인정보 처리방침 (필수) [보기]│
│  [   ] 마케팅 정보 수신 동의    [보기]│
│  [   ] 위치 기반 서비스 이용약관 [보기]│
│                                     │
├─────────────────────────────────────┤
│  [  취소  ]          [  다음  ]      │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│    약관 동의        │
├─────────────────────┤
│                     │
│ [ ✓ ] 전체 동의     │
│ ─────────────────── │
│                     │
│ [ ✓ ] 서비스 이용   │
│       약관 (필수) ˅ │
│                     │
│ [ ✓ ] 개인정보      │
│       처리방침(필수)˅│
│                     │
│ [   ] 마케팅 수신   │
│       동의 (선택) ˅ │
│                     │
│ [   ] 위치 기반     │
│       서비스 (선택)˅│
│                     │
├─────────────────────┤
│    [   다음   ]     │
└─────────────────────┘
```

#### API 요구사항

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/v1/agreements | 활성화된 약관 목록 조회 |
| POST | /api/v1/users/{userId}/agreement-consents | 사용자 약관 동의 저장 |

#### 주요 기능

1. **전체 동의**: 모든 약관 일괄 선택/해제
2. **개별 동의**: 각 약관별 체크박스
3. **약관 상세보기**:
   - **Web**: 모달로 약관 전문 표시
   - **Mobile**: 하단 시트(Bottom Sheet) 또는 전체 화면 모달로 표시
4. **필수 약관 검증**: 필수 약관 미동의 시 다음 버튼 비활성화
5. **법적 증빙**: 동의 시각, IP 주소 저장

#### 플랫폼별 차이점

| 항목 | Web | Mobile |
|------|-----|--------|
| 레이아웃 | 중앙 정렬, 고정 너비 | 전체 화면, 스크롤 |
| 약관 상세보기 | 모달 (80% 화면) | 하단 시트 또는 전체 화면 |
| 버튼 위치 | 하단 좌우 배치 | 하단 전체 너비 버튼 |
| 체크박스 크기 | 중간 (24px) | 큼 (32px, 터치 친화적) |
| 약관 접기/펼치기 | 없음 (항상 표시) | Accordion으로 간략히 표시 후 펼치기 |

#### 상태 관리

```typescript
{
  agreements: Agreement[]
  consentStates: Map<string, boolean>
  allAgreed: boolean
  isLoading: boolean
  errorMessage: string
  selectedAgreement: Agreement | null
  isModalOpen: boolean
}
```

---

### 2. AgreementManagementPage (어드민 약관 관리 페이지)

**플랫폼:** Web only

관리자가 약관을 등록/수정/관리하는 페이지

#### 화면 구조

```
┌─────────────────────────────────────────────────────┐
│  약관 관리                     [ + 새 약관 등록 ]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 검색: [___________]  [🔍]  필터: [전체▾]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 약관 목록 테이블                             │   │
│  ├──────┬───────────┬─────┬─────┬─────┬──────┤   │
│  │ 상태 │ 제목      │ 종류│버전 │시행일│ 작업 │   │
│  ├──────┼───────────┼─────┼─────┼─────┼──────┤   │
│  │ ●활성│서비스이용약관│약관│1.2.0│25.01│[수정]│   │
│  │      │           │     │     │ .01 │[이력]│   │
│  └──────┴───────────┴─────┴─────┴─────┴──────┘   │
│                                                     │
│  [ 1 ] [ 2 ] [ 3 ] ... [ 10 ]                      │
└─────────────────────────────────────────────────────┘
```

#### API 요구사항

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/v1/admin/agreements | 약관 목록 조회 |
| GET | /api/v1/admin/agreements/{id} | 약관 상세 조회 |
| GET | /api/v1/admin/agreements/{id}/history | 약관 버전 이력 조회 |
| POST | /api/v1/admin/agreements | 새 약관 생성 |
| PUT | /api/v1/admin/agreements/{id} | 약관 수정 (새 버전 생성) |
| PATCH | /api/v1/admin/agreements/{id}/activate | 약관 활성화 |
| PATCH | /api/v1/admin/agreements/{id}/deactivate | 약관 비활성화 |
| DELETE | /api/v1/admin/agreements/{id} | 약관 삭제 (soft delete) |

#### 주요 기능

1. **약관 목록**: 페이지네이션, 검색, 필터링
2. **약관 등록**: 모달 폼으로 신규 약관 등록
3. **약관 수정**: 기존 약관 수정 시 새 버전 자동 생성
4. **버전 관리**: 각 약관의 버전 이력 조회
5. **활성화 관리**: 약관 활성화/비활성화 토글
6. **상태 표시**: Badge로 활성/비활성 시각적 표시

#### 상태 관리

```typescript
{
  agreements: Agreement[]
  isLoading: boolean
  errorMessage: string
  searchQuery: string
  filterType: AgreementType | "ALL"
  currentPage: number
  totalPages: number
  selectedAgreement: Agreement | null
  isFormModalOpen: boolean
  isHistoryModalOpen: boolean
  agreementHistory: Agreement[]
}
```

---

## 🧩 신규 컴포넌트

### 1. AgreementFormModal

**플랫폼:** Web (Admin only)

**경로:** `packages/ui/src/components/ui/AgreementFormModal/`

**Props:**
```typescript
{
  isOpen: boolean
  agreement?: Agreement
  onClose: () => void
  onSave: (data: AgreementFormData) => Promise<void>
}
```

**기능:**
- 약관 제목, 종류, 버전, 필수 여부, 시행일, 내용 입력
- Rich Text Editor 또는 Textarea
- 수정 시 버전 자동 증가 제안
- 유효성 검증

### 2. AgreementHistoryModal

**플랫폼:** Web (Admin only)

**경로:** `packages/ui/src/components/ui/AgreementHistoryModal/`

**Props:**
```typescript
{
  isOpen: boolean
  agreementTitle: string
  history: Agreement[]
  onClose: () => void
}
```

**기능:**
- 타임라인 형태로 버전 이력 표시
- 각 버전 클릭 시 내용 미리보기

### 3. AgreementDetailModal / AgreementDetailBottomSheet

**플랫폼:** Web + Mobile

**Web 경로:** `packages/ui/src/components/ui/AgreementDetailModal/`
**Mobile 경로:** `packages/mobile-ui/src/components/AgreementDetailBottomSheet/`

**Props:**
```typescript
{
  isOpen: boolean
  agreement: Agreement | null
  onClose: () => void
}
```

**기능:**
- 약관 전문 표시
- 스크롤 가능
- **Web**: 모달 형태 (80% 화면)
- **Mobile**: 하단 시트 또는 전체 화면 모달

### 4. AgreementConsentItem

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/AgreementConsentItem/`

**Props:**
```typescript
{
  agreement: Agreement
  isChecked: boolean
  onCheck: (agreementId: string) => void
  onViewDetail: (agreementId: string) => void
  variant?: 'web' | 'mobile'  // 플랫폼별 스타일 조정
}
```

**기능:**
- 약관 제목, 필수/선택 표시
- 체크박스
- 상세보기 버튼/아이콘
- 플랫폼별 크기 및 스타일 조정

---

## 🔐 권한

### AgreementConsentPage
- Public (회원가입 플로우)

### AgreementManagementPage
- ADMIN 또는 SUPER_ADMIN 권한 필요
- 권한 없으면 403 또는 로그인 페이지로 리다이렉트

---

## 🛣️ 라우팅

### 사용자용 (Web)
- `/signup/agreements` - 약관 동의 페이지
- 성공 시: `/signup/complete` 또는 다음 단계

### 사용자용 (Mobile)
- `SignupAgreementScreen` - 약관 동의 화면
- 성공 시: `SignupCompleteScreen` 또는 다음 화면

### 어드민용 (Web)
- `/admin/agreements` - 약관 관리 페이지

---

## ✅ 체크리스트

- [x] 스키마 설계 완료
- [x] 사용자 약관 동의 페이지 기획 완료 (Web + Mobile)
- [x] 어드민 약관 관리 페이지 기획 완료 (Web)
- [x] API 엔드포인트 정의 완료
- [x] 컴포넌트 명세 완료 (플랫폼별 구분)
- [x] 플랫폼별 차이점 정의 완료
- [ ] Prisma 스키마 파일 생성 필요
- [ ] API 구현 필요
- [ ] Web 페이지 구현 필요
- [ ] Mobile 화면 구현 필요
- [ ] 공통 컴포넌트 구현 필요
- [ ] 플랫폼별 컴포넌트 구현 필요

---

## 📝 다음 단계

### 1. 백엔드 개발

**백엔드 빌더에게 전달:**
- `packages/prisma/schema/agreement.prisma` 파일 생성
- Agreement, UserAgreementConsent 모델 추가
- User 모델에 relation 추가
- Migration 실행

**API 개발자에게 전달:**
- 약관 CRUD API 구현 (NestJS)
- 사용자 동의 API 구현
- 관리자 권한 검증 미들웨어 적용

### 2. Web 개발

**컴포넌트 빌더에게 전달:**
- AgreementFormModal 컴포넌트 구현 (Admin용)
- AgreementHistoryModal 컴포넌트 구현 (Admin용)
- AgreementDetailModal 컴포넌트 구현 (사용자용)
- AgreementConsentItem 컴포넌트 구현 (variant='web')
- Storybook 작성

**페이지 빌더에게 전달:**
- AgreementConsentPage 구현 (Web, 회원가입용)
- AgreementManagementPage 구현 (Web, Admin용)

### 3. Mobile 개발

**컴포넌트 빌더에게 전달:**
- AgreementDetailBottomSheet 컴포넌트 구현 (React Native)
- AgreementConsentItem 컴포넌트 구현 (variant='mobile')

**화면 빌더에게 전달:**
- SignupAgreementScreen 구현 (React Native)

---

## 🚨 주의사항

### 1. 법적 요구사항
- 약관 동의 시각, IP 주소 반드시 저장
- 약관 버전 관리 필수 (삭제 금지, 이력 보존)
- 필수/선택 약관 명확히 구분

### 2. 버전 관리
- 약관 수정 시 새 버전 생성 (기존 버전 유지)
- 한 번에 하나의 버전만 활성화 (isActive=true)
- 버전 형식: Semantic Versioning (1.0.0)

### 3. 사용자 경험
- 약관 내용은 모달/하단 시트로 제공 (접근성 고려)
- 필수 약관 미동의 시 명확한 안내
- 전체 동의 기능으로 편의성 제공

### 4. 보안
- 관리자 페이지는 ADMIN 권한 필수
- IP 주소 저장 시 개인정보 보호 고려
- SQL Injection, XSS 방어

### 5. 플랫폼별 고려사항

**Web:**
- 반응형 디자인 (모바일 웹 대응)
- 키보드 네비게이션 지원
- 브라우저 호환성 (최신 2개 버전)

**Mobile:**
- 터치 영역 최소 44x44pt (Apple HIG 기준)
- 하단 시트 Swipe로 닫기 지원
- 네이티브 체크박스 스타일 사용
- 오프라인 상태 처리 (동의 데이터 임시 저장 후 재전송)
- Safe Area 대응 (iPhone 노치, Android 상태바)

### 6. 공통 로직 공유

- API 호출 로직은 Web/Mobile 공통으로 사용 (공통 SDK 또는 Hook)
- 약관 동의 상태 관리 로직 공유 (zustand, redux 등)
- 유효성 검증 로직 공유
