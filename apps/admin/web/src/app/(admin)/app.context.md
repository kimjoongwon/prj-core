# Admin 앱 기획서

> 생성일: 2026-02-18
> 타입: app
> 앱: admin

## L0: 시스템 컨텍스트

Admin 앱은 플랫폼의 관리자 콘솔입니다. 회원, 예약, 알림, 콘텐츠, 권한 등 플랫폼 전반의 리소스를 관리하기 위한 웹 애플리케이션입니다.

- **프레임워크**: Next.js (App Router)
- **UI**: HeroUI + Tailwind CSS (다크 모드 기본)
- **상태 관리**: MobX
- **API**: Orval 자동 생성 React Query 훅
- **레이아웃**: AdminLayout (데스크톱: Header + Sidebar, 모바일: Header + BottomTab + FAB)
- **인증**: JWT + X-Tenant-ID 헤더 기반 Multi-Tenancy (`Tenant.spaceId` 파생 scope)
- **브랜드**: "오노라(Onora)" (AppLogo)

## L1: 사용자 (행위자)

| ID | 행위자 | 역할 | 설명 |
|----|-------|------|------|
| ACT-001 | 플랫폼 관리자 | PLATFORM_ADMIN | 전체 시스템 접근 권한. System Space에서 모든 Space의 데이터를 조회/관리 |
| ACT-002 | Company 관리자 | COMPANY_MANAGER | 특정 Company의 지점, 회원, 예약, 콘텐츠, 알림 등 운영 업무 담당 |
| ACT-003 | 회원 | MEMBER | 자신의 정보와 예약을 관리하고 시설/콘텐츠를 조회 |
| ACT-004 | 상담원 | AGENT | 특정 Space 내에서 문의 접수, 처리, 응답 담당. 문의 관련 리소스만 관리 |

## L2: 사용자 목표 (Goal)

| ID | 행위자 | 목표 | 우선순위 |
|----|-------|------|----------|
| GOAL-001 | ACT-001, ACT-002 | 회원을 목록 조회/검색/등록/수정/삭제하여 관리한다 | 높음 |
| GOAL-002 | ACT-001, ACT-002 | 역할(Role), 권한(Ability), 액션(Action), 대상(Subject)을 정의하여 접근 제어를 관리한다 | 높음 |
| GOAL-004 | ACT-001, ACT-002 | 메시지 템플릿(SMS, 이메일, 푸시, HTML)을 생성/관리한다 | 중간 |
| GOAL-005 | ACT-001, ACT-002 | 대시보드에서 주요 지표를 한눈에 확인한다 | 높음 |
| GOAL-006 | ACT-001 | IDP(Identity Provider) 관리 콘솔에 접근하여 인증 설정을 관리한다 | 낮음 |
| GOAL-008 | ACT-001, ACT-002 | Space를 전환하여 다른 Space의 데이터를 관리한다 | 높음 |
| GOAL-009 | ACT-001, ACT-002 | 타임라인(Timeline)을 생성/수정/삭제하여 학기나 시즌을 구조화한다 | 높음 |
| GOAL-010 | ACT-001, ACT-002 | 타임라인 내 세션(Session)을 등록/수정/삭제하여 수업 일정을 관리한다 | 높음 |
| GOAL-011 | ACT-001, ACT-002 | 운동 종목(Exercise)을 등록/목록 조회/상세 확인/수정/삭제하여 루틴 구성의 기반 콘텐츠를 관리한다 | 높음 |
| GOAL-012 | ACT-001 | 시설(Ground)을 등록/목록 조회/상세 조회/수정하여 Space와 연결되는 물리적 시설을 관리한다 | 높음 |
| GOAL-013 | ACT-001, ACT-002 | 세션 내 프로그램(Program)을 등록/수정/삭제하여 강사·루틴·정원을 포함한 실제 수업 클래스를 관리한다 | 높음 |
| GOAL-014 | ACT-001, ACT-002, ACT-003 | 에셋을 목록 조회/검색/필터링하고 권한에 따라 미리보기·다운로드·삭제를 수행하여 운영 리소스를 관리한다 | 높음 |
| GOAL-015 | ACT-001, ACT-002 | 폴더를 생성/수정/삭제하여 계층적 에셋 저장 구조를 관리한다 | 높음 |
| GOAL-016 | ACT-001, ACT-002 | 앨범을 생성/수정/삭제하여 에셋을 사용자 정의 컬렉션으로 분류한다 | 중간 |
| GOAL-017 | ACT-001, ACT-002, ACT-003 | 에셋 선택기(Picker)를 통해 다른 리소스(프로필 이미지, 콘텐츠 이미지 등)에 에셋을 연결한다 | 높음 |
| GOAL-018 | ACT-001, ACT-002, ACT-004 | 문의를 목록 조회/검색/필터링하고 고객 문의를 접수/처리/해결한다 | 높음 |
| GOAL-019 | ACT-001, ACT-002, ACT-004 | 문의 스레드를 통해 고객과 실시간/비동기 대화를 나눈다 | 높음 |
| GOAL-020 | ACT-001, ACT-002 | 지식베이스 문서를 생성/관리하여 자주 묻는 질문에 대한 답변을 체계화한다 | 중간 |
| GOAL-021 | ACT-001, ACT-002 | SLA 정책을 설정하여 응답/해결 시간을 추적하고 위반 시 알림을 받는다 | 높음 |
| GOAL-022 | ACT-001, ACT-002 | 문의 채널(웹, 이메일, 채팅, SMS)을 설정하여 옴니채널 지원을 관리한다 | 중간 |
| GOAL-023 | ACT-001, ACT-002 | AI 기능(LLM 자동 해결, 응답 초안, 감정 분석)을 활용하여 상담 효율을 높인다 | 높음 |
| GOAL-024 | ACT-001 | 회원가입 전 이메일 인증 요청과 발송 상태를 조회하고 필요한 경우 인증 메일을 재발송한다 | 높음 |
| GOAL-025 | ACT-001 | 모바일과 web 서비스에 노출할 약관/동의 문서를 버전별로 등록, 게시, 보관한다 | 높음 |
| GOAL-026 | ACT-001, ACT-002 | Course를 정의하여 무엇을 배우는지와 기본 수강 상품 정책을 관리한다 | 높음 |
| GOAL-027 | ACT-001, ACT-002 | CourseOffering을 통해 실제 개설된 반/기수와 Timeline 연결을 관리한다 | 높음 |
| GOAL-028 | ACT-001, ACT-002 | Enrollment와 CoursePass로 결제 후 생기는 수강 권리와 유효기간을 관리한다 | 높음 |
| GOAL-029 | ACT-001, ACT-002 | Payment 공통 원장에서 Course와 Product 등 여러 서비스의 결제 기록을 Space별로 조회한다 | 높음 |

## 도메인 목록

| 도메인 | 경로 | 설명 | 구현 상태 |
|--------|------|------|-----------|
| 대시보드 | `/dashboard` | 주요 지표 대시보드 | 폴더 존재 |
| 시설 (Spaces) | `/spaces` | 시설(Ground) CRUD 관리. Space를 구체화하는 물리적 시설 (이름, 주소, 사업자번호 등) | 기획 중 |
| 회원 (Users) | `/users` | 회원 CRUD 관리 | 목록 구현 완료, 상세/등록/수정 TODO |
| 이메일 인증 | `/email-verifications` | 회원가입 전 이메일 인증 요청 목록 조회와 재발송 관리. User 생성 전 데이터이므로 PLATFORM_ADMIN 전역 scope로 운영 | 구현 중 |
| 역할 (Roles) | `/roles` | 역할 정의 및 관리 | 구현 중 |
| 권한 정의 (Abilities) | `/abilities` | 권한(Ability) CRUD 관리 | 구현 중 |
| 액션 (Actions) | `/actions` | 액션 CRUD 관리 | 구현 중 |
| 대상 (Subjects) | `/subjects` | 대상 조회 관리 | 구현 중 |
| 템플릿 (Templates) | `/templates` | 메시지 템플릿 관리 | 구현 완료 |
| 약관 관리 | `/terms` | 서비스 이용약관, 개인정보처리방침, 마케팅/위치/제3자 제공 동의 문서를 버전별로 관리 | 구현 중 |
| 루틴 (Routines) | `/routines` | 운동 루틴(커리큘럼) CRUD 관리 | 기획 완료, 구현 TODO |
| 운동 종목 (Tasks) | `/tasks` | 운동 종목 CRUD 관리. Task와 1:1 연결 | 기획 완료, 구현 TODO |
| 에셋 (Assets) | `/assets` | 업로드된 에셋(Image/Video/Document) 목록 조회/검색/필터링, 미리보기/다운로드, 삭제 및 일괄 삭제 관리 | 기획 완료, 구현 TODO |
| 폴더 (Folders) | `/assets` (에셋 목록 내) | 계층적 폴더 구조 관리 (에셋 목록 페이지 내에서 트리 탐색) | 기획 완료, 구현 TODO |
| 앨범 (Albums) | `/albums` | 앨범 CRUD 관리. 사용자 정의 에셋 컬렉션 | 기획 완료, 구현 TODO |
| 타임라인 (Timelines) | `/timelines` | 학기/시즌 타임라인 관리 | 기획 중 |
| 세션 (Sessions) | `/timelines/[timelineId]/sessions` | 세션 일정 관리 (타임라인 하위) | 기획 중 |
| 프로그램 (Programs) | `/timelines/[timelineId]/sessions/[sessionId]/programs` | 수업 프로그램 관리 (세션 하위) - 강사·루틴·정원 연결 | 기획 중 |
| Course | `/courses` | 무엇을 배우는지와 기본 수강 상품 정책 관리 | backend/API/Orval/admin route 구현 완료 |
| CourseOffering | `/course-offerings` | 실제 개설된 과정/반/기수와 Timeline 연결 관리 | nested Course API + admin route 구현 완료 |
| Enrollment | `/enrollments` | 결제 후 활성화되는 수강 신청 상태 관리 | nested Course API + admin route 구현 완료 |
| CoursePass | `/course-passes` | 수강권의 유효기간과 잔여 예약 권리 관리 | nested Course API + admin route 구현 완료 |
| Payment | `/payments` | Course와 Product 등 여러 서비스 결제를 공통 원장으로 조회하고 subject/reference를 추적 | backend/API/Orval/admin route 구현 완료 |
| 문의 (Inquiries) | `/inquiries` | 옴니채널 고객 문의 관리 (웹, 이메일, 채팅, SMS). AI 기반 자동 해결/응답 초안/감정 분석 지원 | 기획 완료 |
| 문의 상세 | `/inquiries/[inquiryId]` | 문의 스레드 뷰, 메시지 작성, AI 응답 초안, 지식베이스 연동 | 기획 완료 |
| 문의 등록 | `/inquiries/new` | 새 문의 수동 접수 (전화/현장 문의 등) | 기획 완료 |
| 지식베이스 | `/knowledge-base` | FAQ, 가이드 문서 관리. AI 자동 해결 시 참조 | 기획 완료 |
| SLA 설정 | `/inquiries/sla` | SLA 정책 관리 (응답/해결 시간, 우선순위별 정책) | 기획 완료 |
| 채널 설정 | `/inquiries/channels` | 문의 채널 설정 (웹 폼, 이메일, 채팅 위젯, SMS) | 기획 완료 |

## Asset 도메인 맥락

Asset은 미디어 리소스(이미지, 비디오, 문서)를 관리하는 도메인입니다. CTI(Class Table Inheritance) 패턴을 사용하여 공통 필드는 Asset, 타입별 필드는 Image/Video/Document로 분리합니다.

```
Space
  │
  ├─── Folder (계층적 폴더 구조, 자기 참조 트리)
  │     └─── Asset (공통 메타데이터)
  │           ├─── Image (CTI: width, height, exif)
  │           ├─── Video (CTI: duration, codec, bitRate)
  │           └─── Document (CTI: pageCount, extractedText)
  │                 └─── Derivative (썸네일, 프리뷰, 트랜스코딩)
  │
  └─── Album (폴더와 분리된 독립 컬렉션)
        └─── AlbumEntry (Album N:M Asset, 순서/캡션 포함)
```

### 핵심 원칙

1. **Folder와 Album 분리**: `type=FOLDER|ALBUM` 통합 모델 대신 별도 모델 사용
2. **CTI 패턴**: Asset은 공통 필드만, 타입별 상세 정보는 Image/Video/Document로 분리
3. **AlbumEntry 조인 모델**: 앨범-에셋 N:M 관계를 DDD 용어로 명명
4. **간결한 네이밍**: 모델명은 간결하게, DB 테이블명(`@@map`)에서만 도메인 명확화

### 에셋 선택기(Picker) 재사용

에셋 선택기는 다른 도메인에서 에셋을 선택할 때 재사용 가능한 컴포넌트입니다.

**사용 시나리오:**
- 콘텐츠 작성 시 이미지 선택
- 사용자 프로필 이미지 선택
- 프로그램 썸네일 이미지 선택
- 이메일 템플릿 첨부 파일 선택

**지원 모드:**
- 단일 선택 / 다중 선택
- 타입별 필터링 (IMAGE, VIDEO, DOCUMENT)
- 폴더별 필터링
- 검색

## Company/Ground 도메인 맥락

Company는 Space를 구체화하는 사업자/운영사 상세입니다. Space 자체는 접근 제어와 테넌트 소속의 기준이고, Company가 사업자번호 같은 회사 정체성을 부여합니다. Ground는 Company 아래의 서비스 시설이며 시설명, 현장 연락처, 이미지처럼 서비스 운영에 가까운 의미를 가집니다. 하나의 Company는 여러 Ground를 보유할 수 있습니다.

```
Space (접근/테넌트 기준) ◄─── Company (사업자: businessNo, contact)
                           └─── Ground[] (서비스 시설: name, address, image)
  │
  ├─── Timeline (학기/시즌)
  ├─── Routine (커리큘럼)
  └─── Task/Exercise (운동)
```

- Company와 Space는 1:1 관계이고, Company와 Ground는 1:N 관계입니다
- 현재 Admin의 `/spaces/[spaceId]/ground` 단수 화면은 Company의 대표 Ground를 조회/수정합니다
- Company/Ground 등록 시 새 Space와 첫 Ground가 자동으로 함께 생성됩니다 (서버에서 처리)
- PLATFORM_ADMIN 역할만 시설 등록/수정이 가능합니다 (플랫폼 관리자 전용)
- `businessNo`(회사 사업자등록번호)는 Company의 유니크 식별자이며 한 번 등록 후 변경 불가합니다

## Program 도메인 맥락

Program은 Session에 배치되는 실제 수업 클래스입니다. 강사(instructorId), 루틴(routineId), 세션(sessionId)을 연결합니다.

```
Timeline (학기/시즌)
  │
  └─── Session (수업 일정)
         │
         └─── Program (실제 클래스: 강사 + 루틴 + 정원)
                │
                ├─── Routine (커리큘럼)
                └─── instructorId (강사 User)
```

- Session을 만들어도 Program을 배치해야 실제 수업이 됩니다
- 한 세션에 같은 루틴을 중복 배치할 수 없습니다 (`@@unique([sessionId, routineId])`)
- Program은 독립 메뉴 없이 세션 상세 페이지 내에서 관리됩니다

## Course 도메인 맥락

Course 계열은 결제 후 생기는 수강 권리를 만들고, Timeline 계열은 그 권리를 실제 운영 일정과 회차 예약으로 실행합니다.

```
Course
  └─── CourseOffering
          ├─── Timeline
          │       └─── Session
          │               └─── Program
          └─── Enrollment / CoursePass
                  ├─── Payment linkage
                  └─── Reservation
```

- Course는 "무엇을 배우는가"를 정의합니다.
- CourseOffering은 특정 Space/기간에 실제 개설된 과정, 반, 기수입니다.
- Enrollment 또는 CoursePass는 결제 성공 후 활성화되는 수강 권리입니다.
- Timeline은 먼저 개설된 운영 시간표이며, 사용자는 수강 권리 안에서 Timeline의 회차를 예약합니다.
- 1:1 코칭처럼 개인 맞춤 운영이 필요한 경우에만 결제 후 개인 전용 Timeline을 생성할 수 있습니다.

### 책임 경계

| 대상 | 책임 | 소유/연결 |
|------|------|----------|
| Course | 무엇을 배우는지, 기본 수강 기간/가격/정책을 정의 | Tenant-owned root |
| CourseOffering | 개설된 반/기수/코호트, 모집 기간, 정원, Timeline 연결을 관리 | Course + Tenant + Timeline |
| Enrollment | 회원이 CourseOffering에 결제/등록된 상태와 유효기간을 관리 | User + CourseOffering + Payment linkage |
| CoursePass | 결제 성공 후 발급되는 6개월 기본 수강 권리와 잔여 예약 권리를 관리 | Enrollment 1:1 기본, Reservation이 소비 |
| Timeline/Session/Program | 수강 권리가 실제 실행되는 일정/회차/프로그램 | CourseOffering 또는 Enrollment에 연결 |
| Reservation | CoursePass가 허용하는 범위 안에서 특정 Program occurrence 좌석을 점유 | CoursePass + Timeline + Session + Program |

### Backend/API Contract

Course 계열 Prisma/DTO/Entity/Repository/Service/UseCase/Controller/Module과 Orval 산출물은 구현되어 있습니다. Backend API는 Course aggregate root 아래에서 CourseOffering, Enrollment, CoursePass collection을 함께 노출하고, admin route는 `packages/fe-hook/src/useCourseData.ts`에서 Orval hook 결과를 pure screen 입력 계약으로 변환합니다.

#### Entity / Enum

| 타입 | 필수 필드/규칙 |
|------|---------------|
| Course | `id`, `tenantId`, `name`, `description`, `durationMonths` 기본 6, `basePriceAmount`, `currency`, `status`, `activeOfferingCount`, `activeEnrollmentCount`, soft delete |
| CourseOffering | `id`, `courseId`, `tenantId`, `timelineId` 또는 `timelineProvisioningMode`, `name`, `startsAt`, `endsAt`, `enrollmentStartsAt`, `enrollmentEndsAt`, `capacity`, `enrolledCount`, `status`; Course/Tenant/Timeline의 `Tenant.spaceId` 파생 scope 검증 |
| Enrollment | `id`, `userId`, `courseId`, `courseOfferingId`, `coursePassId`, `assignedTimelineId`, `paymentStatus`, `paymentProvider`, `paymentExternalId`, `paidAt`, `validFrom`, `validUntil`, `status`; 결제 성공 시 CoursePass 발급 |
| CoursePass | `id`, `enrollmentId`, `userId`, `courseId`, `courseOfferingId`, `timelineId`, `kind`, `issuedAt`, `validFrom`, `expiresAt`, `reservationLimit`, `reservationUsedCount`, `reservationRemainingCount`, `status` |
| Reservation linkage | 기존 Reservation에 `coursePassId`를 추가해 좌석 점유가 어떤 수강 권리를 소비했는지 추적; 예약 생성 시 pass 유효기간, Timeline 범위, 잔여 예약권을 검증 |
| Payment linkage | 독립 Payment root가 결제 원장을 소유하고 Enrollment는 `paymentId`로 연결합니다. 기존 최소 결제 참조(`paymentProvider`, `paymentExternalId`, `paymentStatus`, `paidAt`, `paidAmount`, `currency`)는 Course 화면 요약/마이그레이션 보조 필드로만 유지합니다. |

필수 enum: `CourseStatus`, `CourseOfferingStatus`, `EnrollmentStatus`, `CoursePassStatus`, `CoursePassKind`, `PaymentStatus`, `TimelineProvisioningMode`.

#### API Surface

| Resource | Endpoint | OperationId | 용도 |
|----------|----------|-------------|------|
| Course | `GET /api/v1/courses` | `getCourses` | `/courses` 목록, 검색, 상태 필터, summary count |
| Course | `GET /api/v1/courses/:courseId` | `getCourseById` | 상세/수정 진입용 |
| Course | `POST /api/v1/courses` | `createCourse` | Course 등록 |
| Course | `PATCH /api/v1/courses/:courseId` | `updateCourse` | Course 수정 |
| Course | `DELETE /api/v1/courses/:courseId` | `deleteCourse` | soft delete, active offering 있으면 차단 |
| CourseOffering | `GET /api/v1/courses/offerings` | `getCourseOfferings` | `/course-offerings` 목록, Course/Timeline/모집 상태 필터 |
| CourseOffering | `GET /api/v1/courses/offerings/:courseOfferingId` | `getCourseOfferingById` | 개설 반 상세와 Timeline 연결 확인 |
| CourseOffering | `POST /api/v1/courses/offerings` | `createCourseOffering` | Course + Timeline 연결로 개설 반 생성 |
| CourseOffering | `PATCH /api/v1/courses/offerings/:courseOfferingId` | `updateCourseOffering` | 정원/모집 기간/상태 수정 |
| CourseOffering | `DELETE /api/v1/courses/offerings/:courseOfferingId` | `deleteCourseOffering` | active enrollment 있으면 차단 |
| Enrollment | `GET /api/v1/courses/enrollments` | `getEnrollments` | `/enrollments` 목록, 결제/수강 상태 필터 |
| Enrollment | `GET /api/v1/courses/enrollments/:enrollmentId` | `getEnrollmentById` | Enrollment와 CoursePass/Payment link 상세 |
| Enrollment | `POST /api/v1/courses/enrollments` | `createEnrollment` | 결제 성공 또는 관리자 수동 등록으로 Enrollment 생성 |
| Enrollment | `PATCH /api/v1/courses/enrollments/:enrollmentId` | `updateEnrollment` | 상태/결제 참조/유효기간 보정 |
| Enrollment | `DELETE /api/v1/courses/enrollments/:enrollmentId` | `deleteEnrollment` | active CoursePass 사용권이 있으면 차단 |
| CoursePass | `GET /api/v1/courses/passes` | `getCoursePasses` | `/course-passes` 목록, 만료/잔여 예약권 필터 |
| CoursePass | `GET /api/v1/courses/passes/:coursePassId` | `getCoursePassById` | 수강권 상세와 Reservation 소비 내역 확인 |
| CoursePass | `PATCH /api/v1/courses/passes/:coursePassId` | `updateCoursePass` | 만료/정지/잔여권 보정 |

#### Service / Repository / Controller Rules

- CourseOffering 생성/수정은 `courseId`, `tenantId`, `timelineId`의 scope 일치를 검증하되, 실제 Space 범위는 `tenantId -> Tenant.spaceId`로 파생합니다.
- Enrollment 활성화는 `paymentStatus=PAID` 또는 관리자 수동 grant 사유가 있을 때만 CoursePass를 발급합니다.
- CoursePass 기본 유효기간은 결제/발급 기준 6개월이며 Course별 정책으로 override 가능합니다.
- Reservation 생성은 `coursePassId`를 필수 입력으로 받고, 해당 pass가 같은 사용자, 같은 `Tenant.spaceId` 파생 범위, 연결된 Timeline/Session/Program 범위에 속하며 잔여 예약권이 있을 때만 성공합니다.
- 목록 API는 `ApiResponseEntity(..., { isArray: true })` 형태와 Orval 생성 React Query hook을 유지하기 위해 기존 Timeline/Reservation controller 패턴을 따릅니다.

### Orval / Frontend Handoff

`pnpm --filter=@cocrepo/api codegen:server`로 Course API hook이 `packages/fe-api/src/core/courses`에 생성되어 있습니다.

| Admin route | API endpoint | Orval hook |
|-------------|--------------|------------|
| `/courses` | `GET /api/v1/courses` | `useGetCourses` |
| `/course-offerings` | `GET /api/v1/courses/offerings` | `useGetCourseOfferings` |
| `/enrollments` | `GET /api/v1/courses/enrollments` | `useGetEnrollments` |
| `/course-passes` | `GET /api/v1/courses/passes` | `useGetCoursePasses` |

Admin route는 `_course-data.ts` mock을 사용하지 않습니다. `useCourseData`가 Orval 응답과 `isLoading`/`isFetching`/`isError` 상태를 `CourseScreen`의 row/query state 계약으로 변환하고, `CourseConsole`이 loading/refreshing/error/empty 상태를 렌더링합니다.

## Payment 도메인 맥락

Payment는 특정 서비스에 종속되지 않는 tenant-owned 결제 원장입니다. Course 결제는 `serviceCode=course`와 `subjectType=COURSE_OFFERING|ENROLLMENT|COURSE_PASS`로 기록하고, 앞으로 Product나 Subscription이 추가되어도 같은 Payment root에 `PaymentSubject`를 추가해 확장합니다.

```
Tenant
  ├─── Space (scope는 Tenant.spaceId에서 파생)
  └─── Payment
          ├─── PaymentSubject
          │       ├─── serviceCode (course, product, subscription ...)
          │       ├─── subjectType
          │       └─── subjectId / subjectLabel
          └─── PaymentReference
                  ├─── Enrollment / CoursePass
                  ├─── Order / Invoice
                  └─── External Payment ID
```

### 핵심 원칙

1. **공통 원장**: Payment는 Course, Product, Subscription 같은 여러 서비스가 공유합니다.
2. **Tenant-derived scope**: 요청은 `x-tenant-id`로 받고, 목록과 상세 조회는 `Tenant.spaceId`에서 파생한 `SpaceContext.spaceIds` 기준으로 제한합니다. PLATFORM_ADMIN이 아닌 관리자는 다른 Space 결제를 볼 수 없습니다.
3. **대상/참조 분리**: `PaymentSubject`는 무엇을 결제했는지, `PaymentReference`는 어떤 운영 리소스나 외부 ID와 연결되는지 추적합니다.
4. **Course 연결**: Enrollment는 `paymentId`로 Payment를 참조하고, Payment reference는 Enrollment/CoursePass 역추적을 보조합니다.

### API Surface

| Resource | Endpoint | OperationId | 용도 |
|----------|----------|-------------|------|
| Payment | `GET /api/v1/payments` | `getPayments` | `/payments` 목록, Tenant/상태/수단/대상/참조 필터 |
| Payment | `GET /api/v1/payments/:paymentId` | `getPaymentById` | Payment 상세와 subject/reference 확인 |
| Payment | `POST /api/v1/payments` | `createPayment` | 서비스별 결제 성공/수동 기록 생성 |
| Payment | `PATCH /api/v1/payments/:paymentId` | `updatePayment` | 결제 상태/제공자/영수증/메모 보정 |
| Payment | `DELETE /api/v1/payments/:paymentId` | `deletePayment` | soft delete |

### Orval / Frontend Handoff

`pnpm --filter=@cocrepo/api codegen:server`로 Payment API hook이 `packages/fe-api/src/core/payments`에 생성되어 있습니다.

| Admin route | API endpoint | Orval hook |
|-------------|--------------|------------|
| `/payments` | `GET /api/v1/payments` | `useGetPayments` |

## 구현 대상

| Stage | Item ID | Owner role | 정확한 대상 |
|-------|---------|------------|-------------|
| 2 | COURSE-S2-BE-001 | `be-prisma-builder` | `packages/be-prisma/schema/scheduling/course.prisma`, `packages/be-prisma/schema/identity/space.prisma`, `packages/be-prisma/schema/identity/user.prisma`, `packages/be-prisma/schema/scheduling/timeline.prisma`, `packages/be-prisma/schema/scheduling/reservation.prisma`, `packages/be-prisma/scripts/validate-schema-conventions.ts` |
| 2 | COURSE-S2-BE-002 | `be-entity-builder`, `be-dto-builder`, `be-query-dto-builder` | Course/CourseOffering/Enrollment/CoursePass entity, DTO, create/update/query DTO, package exports |
| 2 | COURSE-S2-BE-003 | `be-repository-builder`, `be-service-builder`, `be-usecase-builder` | `CoursesRepository`, `CourseService`, Course usecase handlers, enrollment activation/CoursePass issuance use case |
| 2 | COURSE-S2-BE-004 | `be-controller-builder`, `be-module-builder`, `be-bootstrap-integrator` | `/api/v1/courses`, `/api/v1/courses/offerings`, `/api/v1/courses/enrollments`, `/api/v1/courses/passes` controller/module and `apps/core/api/src/module/app.module.ts` wiring |
| 2 | COURSE-S2-BE-005 | `be-service-builder`, `be-repository-builder`, `be-dto-builder` | Reservation create/list contract update for `coursePassId` and CoursePass entitlement validation |
| 3 | COURSE-S3-API-001 | `fe-api-integrator` | `pnpm --filter=@cocrepo/api codegen:server`, generated `packages/fe-api/src/core/courses` and model exports |
| 3 | COURSE-S3-FE-001 | `fe-api-integrator`, `fe-route-agent` | `apps/admin/web/src/app/(admin)/{courses,course-offerings,enrollments,course-passes}/page.tsx`, `useCourseData`, query state rendering |
| 3 | COURSE-S3-QA-001 | `qa-fe-e2e-testing` | Course route sidecar E2E assertions for API-backed data and empty states |
| 2 | PAYMENT-S2-BE-001 | `be-prisma-builder`, `be-entity-builder`, `be-dto-builder`, `be-repository-builder`, `be-service-builder`, `be-usecase-builder`, `be-controller-builder` | `packages/be-prisma/schema/billing/payment.prisma`, `packages/be-service/src/payment/payment.service.ts`, `apps/core/api/src/module/payments` |
| 3 | PAYMENT-S3-API-001 | `fe-api-integrator` | `pnpm --filter=@cocrepo/api codegen:server`, generated `packages/fe-api/src/core/payments` |
| 3 | PAYMENT-S3-FE-001 | `fe-api-integrator`, `fe-route-agent`, `fe-feature-agent`, `fe-widget-agent` | `apps/admin/web/src/app/(admin)/payments/page.tsx`, `usePaymentData`, `packages/fe-ui/src/screen/PaymentScreen`, `packages/fe-ui/src/feature/PaymentConsole`, `packages/fe-ui/src/widget` |

## Inquiry 도메인 맥락

Inquiry는 옴니채널 고객 문의를 관리하는 도메인입니다. AI 기능을 활용하여 상담 효율을 높이고 SLA를 추적합니다.

```
Space
  │
  ├─── ChannelConfig (채널 설정: WEB, EMAIL, CHAT, SMS)
  │
  ├─── Inquiry (문의 티켓)
  │     ├─── InquiryThread (스레드: 문의-응답 흐름)
  │     │     └─── InquiryMessage (개별 메시지)
  │     │           └─── InquiryAttachment (첨부 파일)
  │     │
  │     ├─── InquiryTag (태그: 분류용)
  │     └─── SentimentAnalysis (감정 분석 결과)
  │
  ├─── KnowledgeBaseArticle (지식베이스 문서)
  │
  ├─── SLATemplate (SLA 정책 템플릿)
  │
  └─── AIAgentLog (AI 에이전트 활동 로그)
```

### 핵심 원칙

1. **옴니채널**: 웹 폼, 이메일, 채팅, SMS 등 다양한 채널에서 문의 접수
2. **스레드 기반**: 문의는 스레드로 구조화되며, 각 스레드는 여러 메시지를 포함
3. **AI 통합**: LLM 기반 자동 해결, 응답 초안 생성, 감정 분석 지원
4. **SLA 추적**: 응답/해결 시간을 추적하고 위반 시 알림
5. **지식베이스 연동**: AI 자동 해결 시 지식베이스 문서를 참조

### AI 기능

| 기능 | 설명 |
|------|------|
| 자동 해결 | LLM이 지식베이스를 참조하여 자동으로 답변 생성 |
| 응답 초안 | 상담원을 위한 응답 초안 생성 |
| 감정 분석 | 고객 메시지의 감정(긍정/부정/중립) 분석 |
| 분류 추천 | 문의 내용 기반 카테고리/우선순위 추천 |

### SLA 추적

| 메트릭 | 설명 |
|--------|------|
| 첫 응답 시간 | 문의 접수 후 첫 상담원 응답까지의 시간 |
| 해결 시간 | 문의 접수부터 해결까지의 총 시간 |
| 위반 알림 | SLA 임계치 초과 시 관리자/상담원 알림 |

### 문의 상태 흐름

```
NEW → OPEN → IN_PROGRESS → WAITING_CUSTOMER → RESOLVED → CLOSED
         ↓
      ESCALATED
```

| 상태 | 설명 |
|------|------|
| NEW | 새 문의, 아직 상담원 미배정 |
| OPEN | 상담원 배정 완료, 응답 대기 |
| IN_PROGRESS | 상담원이 처리 중 |
| WAITING_CUSTOMER | 고객 응답 대기 |
| RESOLVED | 문의 해결 완료 |
| CLOSED | 문의 종료 (재오픈 불가) |
| ESCALATED | 상위 레벨로 에스컬레이션 |

## 레이아웃 구조

```
AdminLayout
├── Header
│   ├── AppLogo ("오노라", LayoutGrid 아이콘)
│   ├── IDP 관리 버튼 (KeyRound 아이콘, 새 탭으로 IDP Client 열기)
│   └── HeaderSpaceSelector (Space 전환)
├── Sidebar (데스크톱) / BottomTab (모바일)
│   └── ADMIN_NAV_ITEMS 기반 메뉴 트리
├── Main Content
│   └── {children} (각 페이지)
└── FAB (모바일, 빠른 액션)
```

## 인증/인가 흐름

1. JWT 토큰으로 인증 (Authorization 헤더)
2. X-Tenant-ID 헤더로 현재 Tenant 지정 (필수)
3. Tenant 미선택 시 `/select-space`로 리다이렉트 (useSpaceGuard)
4. PersistStore에 선택된 Tenant ID와 파생 Space ID/이름 저장
5. 로그아웃 시 PersistStore 초기화 후 `/admin/auth/login`으로 이동
