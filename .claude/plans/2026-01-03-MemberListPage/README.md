# 회원목록 화면 기획서

**작성일:** 2026-01-03
**버전:** 1.0
**상태:** 초안

---

## 개요

엔터프라이즈급 회원 관리 시스템을 구축하여 대규모 사용자 데이터를 효율적으로 관리하고, 고급 필터링, 일괄 작업, 통계 분석 기능을 제공합니다.

### 대상 사용자
- **SUPER_ADMIN**: 전체 시스템 관리자 (모든 Space의 회원 관리)
- **ADMIN**: Space 관리자 (해당 Space의 회원 관리)

### 접근 경로
```
/admin/members
/admin/members/:id (회원 상세)
```

---

## 문서 구조

| 문서 | 설명 |
|------|------|
| [01-layout.md](./01-layout.md) | 화면 구성 및 레이아웃 |
| [02-features.md](./02-features.md) | 상세 기능 명세 |
| [03-api.md](./03-api.md) | API 명세 |
| [04-components.md](./04-components.md) | 컴포넌트 구조 및 Store |
| [05-guidelines.md](./05-guidelines.md) | 권한, UI/UX, 테스트, 마일스톤 |

---

## 핵심 기능

1. **대시보드 통계**: 전체/활성/비활성/신규가입 회원 통계
2. **고급 필터링**: 역할, 상태, 가입일, 분류, 그룹별 필터
3. **일괄 작업**: 역할 변경, 분류 지정, 그룹 추가, 활성화/비활성화
4. **내보내기**: Excel, CSV, PDF 형식 지원
5. **회원 상세**: 기본 정보, 역할/권한, 분류/그룹, 활동 이력

---

## 관련 스키마

- `packages/prisma/schema/user.prisma`
- `packages/prisma/schema/role.prisma`
- `packages/prisma/schema/space.prisma`
- `packages/prisma/schema/core.prisma`

## 관련 기획서

- [AdminAuthenticationSystem](../2026-01-01-AdminAuthenticationSystem/)
- [AdminLayoutAndMenuSystem](../2025-12-30-AdminLayoutAndMenuSystem.md)
