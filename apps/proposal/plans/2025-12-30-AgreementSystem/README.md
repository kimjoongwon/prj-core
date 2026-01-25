# 약관 시스템 기획서

**작성일:** 2025-12-30
**플랫폼:** Web + Mobile + Admin

---

## 개요

운동 예약 플랫폼의 회원가입 및 약관 관리 시스템 기획서입니다.

**플랫폼:**
- **Web**: 웹 브라우저 환경 (React)
- **Mobile**: 모바일 앱 환경 (React Native)
- **Admin**: 관리자 웹 페이지 (Web only)

---

## 문서 구조

| 문서 | 설명 |
|------|------|
| [01-schema.md](./01-schema.md) | DB 스키마 설계 (Agreement, UserAgreementConsent) |
| [02-screens.md](./02-screens.md) | 화면 기획 (사용자/관리자 페이지) |
| [03-components.md](./03-components.md) | 신규 컴포넌트 명세 |
| [04-implementation.md](./04-implementation.md) | 권한, 라우팅, 체크리스트, 주의사항 |

---

## 핵심 기능

1. **사용자 약관 동의 페이지**: 회원가입 시 약관 동의 (Web + Mobile)
2. **관리자 약관 관리 페이지**: 약관 등록/수정/버전 관리 (Admin)
3. **법적 증빙**: 동의 시각, IP 주소 저장
4. **버전 관리**: 약관 수정 시 새 버전 생성

---

## 관련 문서

- [5단계 분할 개발 플로우](../../../docs/STAGE-DEVELOPMENT-FLOW.md)
