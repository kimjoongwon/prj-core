# 템플릿 관리 시스템 (AdminTemplateManagement)

**작성일:** 2025-12-30
**수정일:** 2026-01-11
**플랫폼:** Admin Web

---

## 5단계 개발 플로우 현황

```
Stage 1: 데이터 설계     ⏳ 대기
Stage 2: 스키마 구현     ⏳ 대기
Stage 3: 백엔드 로직     ⏳ 대기
Stage 4: 컴포넌트 구현   ⏳ 대기
Stage 5: 페이지 통합     ⏳ 대기
```

**다음 단계:**
```bash
/orch-stage start stage=1 plan=2025-12-30-AdminTemplateManagement
```

---

## 문서 구조

```
2025-12-30-AdminTemplateManagement/
├── README.md                 ← 현재 문서 (개요 + 목차)
│
├── 01-overview.md            ← 화면 개요 및 구조
├── 02-data-interaction.md    ← 데이터 요구사항 및 인터랙션
├── 03-ui.md                  ← UI 상세 및 컴포넌트
├── 04-builder-guide.md       ← 페이지/백엔드 빌더 전달 내용
├── 05-technical.md           ← 템플릿 시스템 설계, 보안, 성능
│
└── design.md                 ← 기술 설계서 (Entity, API, DTO 등)
```

---

## 문서 목차

### 기획 문서 (이 폴더)

| 문서 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 화면 목적, 진입/이탈 조건, 레이아웃 구조 |
| [02-data-interaction.md](./02-data-interaction.md) | API, 상태, 타입 정의, 인터랙션 흐름 |
| [03-ui.md](./03-ui.md) | 템플릿 타입별 UI 상세, 변수 가이드, 모달 |
| [04-builder-guide.md](./04-builder-guide.md) | 페이지 빌더/백엔드 빌더 전달 내용 |
| [05-technical.md](./05-technical.md) | 템플릿 키 규칙, 렌더링 엔진, 보안, 성능 |

### 기술 설계서

| 섹션 | 내용 |
|------|------|
| 1. Entity 설계 | Template, TemplateHistory 모델 |
| 2. Repository 설계 | 메서드 명세 및 구현 예시 |
| 3. Service 설계 | 비즈니스 로직 메서드 |
| 4. Controller 설계 | 엔드포인트 상세 |
| 5. DTO 설계 | Request/Response DTO |
| 6. 기술 고려사항 | 보안, 성능, 에러 처리 |
| 7. 마이그레이션 계획 | 실행 순서 및 시드 데이터 |

**설계서 바로가기:** [design.md](./design.md)

---

## 화면 개요

### 목적
관리자가 시스템에서 사용하는 각종 템플릿(이메일, SMS, 푸시, HTML)을 관리하는 화면입니다. 이메일 인증, 회원 탈퇴, 비밀번호 재설정 등 다양한 상황에서 사용되는 템플릿을 생성, 수정, 미리보기, 테스트 발송할 수 있습니다.

### 진입 조건
- 관리자 로그인 완료
- `menu:templates` Subject 접근 권한 보유

### 핵심 기능
- 템플릿 타입별 탭 (EMAIL, SMS, PUSH, HTML)
- 템플릿 생성/수정/삭제
- Handlebars 기반 변수 치환
- 미리보기 및 테스트 발송

---

## 관련 문서

- [AdminLayoutAndMenuSystem](../2025-12-30-AdminLayoutAndMenuSystem.md) - 어드민 레이아웃 및 메뉴
- [SignupSystem](../2025-12-30-SignupSystem.md) - 회원가입 시스템 (이메일 인증 사용)
