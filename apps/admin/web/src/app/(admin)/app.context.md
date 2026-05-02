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
- **인증**: JWT + X-Space-ID 헤더 기반 Multi-Tenancy
- **브랜드**: "플레이트" (AppLogo)

## L1: 사용자 (Actor)

| ID | Actor | 역할 | 설명 |
|----|-------|------|------|
| ACT-001 | 플랫폼 관리자 | FULL_ACCESS | 전체 시스템 접근 권한. System Space에서 모든 Space의 데이터를 조회/관리 |
| ACT-002 | Space 관리자 | MANAGE | 특정 Space 내의 리소스를 관리. 회원, 예약, 콘텐츠, 알림 등 운영 업무 담당 |
| ACT-003 | 조회자 | VIEW | 특정 Space 내의 리소스를 조회만 가능. 수정/삭제 권한 없음 |
| ACT-004 | 상담원 | AGENT | 특정 Space 내에서 문의 접수, 처리, 응답 담당. 문의 관련 리소스만 관리 |

## L2: 사용자 목표 (Goal)

| ID | Actor | 목표 | 우선순위 |
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

## 도메인 목록

| 도메인 | 경로 | 설명 | 구현 상태 |
|--------|------|------|-----------|
| 대시보드 | `/dashboard` | 주요 지표 대시보드 | 폴더 존재 |
| 시설 (Spaces) | `/spaces` | 시설(Ground) CRUD 관리. Space를 구체화하는 물리적 시설 (이름, 주소, 사업자번호 등) | 기획 중 |
| 회원 (Users) | `/users` | 회원 CRUD 관리 | 목록 구현 완료, 상세/등록/수정 TODO |
| 이메일 인증 | `/email-verifications` | 회원가입 전 이메일 인증 요청 목록 조회와 재발송 관리. User 생성 전 데이터이므로 FULL_ACCESS 전역 scope로 운영 | 구현 중 |
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

## Ground 도메인 맥락

Ground는 Space를 구체화하는 물리적 시설입니다. Space 자체는 추상 컨테이너(id만 존재)이고, Ground가 실제 비즈니스 의미(이름, 주소, 사업자번호 등)를 부여합니다.

```
Space (추상) ◄─── Ground (구체화: name, address, phone, email, businessNo)
  │
  ├─── Timeline (학기/시즌)
  ├─── Routine (커리큘럼)
  └─── Task/Exercise (운동)
```

- Ground와 Space는 1:1 관계입니다
- Ground 등록 시 새 Space가 자동으로 함께 생성됩니다 (서버에서 처리)
- FULL_ACCESS 역할만 시설 등록/수정이 가능합니다 (플랫폼 관리자 전용)
- `businessNo`(사업자등록번호)는 유니크하며 한 번 등록 후 변경 불가합니다

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
│   ├── AppLogo ("플레이트", LayoutGrid 아이콘)
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
2. X-Space-ID 헤더로 현재 Space 지정 (필수)
3. Space 미선택 시 `/select-space`로 리다이렉트 (useSpaceGuard)
4. PersistStore에 선택된 Space ID/이름 저장
5. 로그아웃 시 PersistStore 초기화 후 `/admin/auth/login`으로 이동

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 이메일 인증 관리 도메인과 FULL_ACCESS 전역 scope 목표를 추가 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | Timeline/Session 도메인 추가, GOAL-009/010 추가 | req-context-planner |
| 2026-02-19 | Exercise 도메인 추가 (GOAL-011), 도메인 목록에 운동 종목 항목 추가 | req-context-planner |
| 2026-02-19 | Ground 도메인 추가 (GOAL-012, 도메인 목록, Ground 맥락 섹션) | req-context-planner |
| 2026-02-19 | Program 도메인 추가 (GOAL-013), 도메인 목록에 세션/프로그램 항목 추가, Program 맥락 섹션 추가 | orch-requirement |
| 2026-02-20 | 삭제된 self-service 페이지(`/my-sessions`, `/my-account/change-password`) 관련 항목 정리 | OpenCode |
| 2026-02-22 | 에셋 도메인 초안 추가 (GOAL-014, 도메인 목록 항목 추가) | orch-requirement |
| 2026-02-22 | 도메인 명칭 오기 정정: GOAL-014 및 도메인 목록을 Asset(`/assets`) 기준으로 수정 | OpenCode |
| 2026-02-22 | Asset 도메인 전체 기획: GOAL-015/016/017 추가, Asset 도메인 맥락 섹션 추가, 폴더/앨범 도메인 항목 추가 | orch-requirement |
| 2026-02-25 | Inquiry 도메인 추가 (GOAL-018~023, ACT-004 상담원 역할, Inquiry 도메인 맥락 섹션) | orch-requirement |
| 2026-02-26 | AI Form Template 도메인 추가 (GOAL-024, AI Form Template 도메인 맥락 섹션) | orch-requirement |
| 2026-02-28 | AI Form Template 페이지 기반 기획 제거, Create/Update 상단 AiForm Feature 기준으로 정리 | Codex |
