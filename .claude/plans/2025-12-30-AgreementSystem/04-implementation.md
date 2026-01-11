# 구현 가이드

> 상위 문서: [README.md](./README.md)

---

## 1. 권한

### AgreementConsentPage
- Public (회원가입 플로우)

### AgreementManagementPage
- ADMIN 또는 SUPER_ADMIN 권한 필요
- 권한 없으면 403 또는 로그인 페이지로 리다이렉트

---

## 2. 라우팅

### 사용자용 (Web)
- `/signup/agreements` - 약관 동의 페이지
- 성공 시: `/signup/complete` 또는 다음 단계

### 사용자용 (Mobile)
- `SignupAgreementScreen` - 약관 동의 화면
- 성공 시: `SignupCompleteScreen` 또는 다음 화면

### 어드민용 (Web)
- `/admin/agreements` - 약관 관리 페이지

---

## 3. 체크리스트

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

## 4. 다음 단계

### 백엔드 개발

**백엔드 빌더에게 전달:**
- `packages/prisma/schema/agreement.prisma` 파일 생성
- Agreement, UserAgreementConsent 모델 추가
- User 모델에 relation 추가
- Migration 실행

**API 개발자에게 전달:**
- 약관 CRUD API 구현 (NestJS)
- 사용자 동의 API 구현
- 관리자 권한 검증 미들웨어 적용

### Web 개발

**컴포넌트 빌더에게 전달:**
- AgreementFormModal 컴포넌트 구현 (Admin용)
- AgreementHistoryModal 컴포넌트 구현 (Admin용)
- AgreementDetailModal 컴포넌트 구현 (사용자용)
- AgreementConsentItem 컴포넌트 구현 (variant='web')
- Storybook 작성

**페이지 빌더에게 전달:**
- AgreementConsentPage 구현 (Web, 회원가입용)
- AgreementManagementPage 구현 (Web, Admin용)

### Mobile 개발

**컴포넌트 빌더에게 전달:**
- AgreementDetailBottomSheet 컴포넌트 구현 (React Native)
- AgreementConsentItem 컴포넌트 구현 (variant='mobile')

**화면 빌더에게 전달:**
- SignupAgreementScreen 구현 (React Native)

---

## 5. 주의사항

### 법적 요구사항
- 약관 동의 시각, IP 주소 반드시 저장
- 약관 버전 관리 필수 (삭제 금지, 이력 보존)
- 필수/선택 약관 명확히 구분

### 버전 관리
- 약관 수정 시 새 버전 생성 (기존 버전 유지)
- 한 번에 하나의 버전만 활성화 (isActive=true)
- 버전 형식: Semantic Versioning (1.0.0)

### 사용자 경험
- 약관 내용은 모달/하단 시트로 제공 (접근성 고려)
- 필수 약관 미동의 시 명확한 안내
- 전체 동의 기능으로 편의성 제공

### 보안
- 관리자 페이지는 ADMIN 권한 필수
- IP 주소 저장 시 개인정보 보호 고려
- SQL Injection, XSS 방어

### 플랫폼별 고려사항

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

### 공통 로직 공유

- API 호출 로직은 Web/Mobile 공통으로 사용 (공통 SDK 또는 Hook)
- 약관 동의 상태 관리 로직 공유 (zustand, redux 등)
- 유효성 검증 로직 공유
