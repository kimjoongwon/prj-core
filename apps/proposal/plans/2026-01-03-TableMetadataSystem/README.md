# MetaDataGrid 시스템 기획서

**작성일:** 2026-01-03
**플랫폼:** Admin Web (Desktop + Tablet + Mobile)
**버전:** 2.0

---

## 개요

테이블 화면을 **메타데이터 기반 선언적 시스템**으로 구성합니다.
메타데이터만 제공하면 테이블 전체가 자동으로 구성됩니다.

### 핵심 원칙

```
메타데이터 = columns + data + leftInputs + rightInputs
     ↓
MetaDataGrid 컴포넌트 (기존 DataGrid, Pagination 활용)
     ↓
완성된 테이블 UI (URL querystring 자동 연동)
```

- **선언적 구성**: 메타데이터로 테이블 정의
- **nuqs 연동**: 페이지네이션, 필터가 URL querystring과 자동 동기화
- **기존 컴포넌트 재사용**: DataGrid, Pagination, Table 활용
- **Admin 접두어 없음**: 범용 컴포넌트로 설계

---

## 기획 문서 목차

| 파일 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 개요 및 기존 컴포넌트 분석 |
| [02-metadata-interface.md](./02-metadata-interface.md) | 메타데이터 인터페이스 정의 |
| [03-nuqs-integration.md](./03-nuqs-integration.md) | nuqs 기반 URL Querystring 연동 |
| [04-scenarios.md](./04-scenarios.md) | 사용 예시 및 시나리오 |
| [05-components.md](./05-components.md) | 컴포넌트 구조 및 구현 |
| [06-layout.md](./06-layout.md) | 레이아웃 구조 (Desktop/Mobile) |
| [07-checklist.md](./07-checklist.md) | 구현 체크리스트 및 참고 자료 |

---

## 기존 컴포넌트 활용

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| **DataGrid** | `components/ui/data-display/DataGrid` | TanStack Table 래퍼 |
| **Table** | `components/ui/data-display/Table` | 기본 테이블 |
| **Pagination** | `components/inputs/Pagination` | nuqs 기반 페이지네이션 |

---

## 진행 상황

- [x] 타입 정의 완료 (2026-01-30)
- [x] 컴포넌트 구현 (2026-01-30)
- [x] 입력 컴포넌트 (nuqs 연동) (2026-01-30)
- [x] 훅 구현 (2026-01-30)
- [x] 기존 컴포넌트 연동 (2026-01-30)
- [x] TablePage → MetaDataGrid 리네이밍 (2026-01-30)
- [ ] CASL 권한 연동

**상세 진행 상황:** [PROGRESS.md](./PROGRESS.md)

---

## 참고 자료

- [nuqs](https://nuqs.47ng.com/) - URL querystring 상태 관리
- [TanStack Table](https://tanstack.com/table/v8)
- 기존 컴포넌트: `components/ui/data-display/DataGrid`
- 기존 컴포넌트: `components/inputs/Pagination`
- 컬럼 가시성: `2025-12-30-CASL-Permission-System.md` (12장)
