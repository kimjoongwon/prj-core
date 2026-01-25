# [PageName] 개발 진행 상황

> 이 파일은 에이전트 실행 시 자동으로 업데이트됩니다.

**시작일:** YYYY-MM-DD
**현재 단계:** Stage X

---

## Stage 1: 데이터 설계

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| planner | ⬜ | - | 기획서 폴더 |

**산출물:**
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/README.md`
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/01-overview.md`
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/02-structure.md`
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/03-interactions.md`
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/04-ui-details.md`
- [ ] `apps/proposal/plans/YYYY-MM-DD-[PageName]/05-technical-design.md`

---

## Stage 2: 스키마 구현

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| schema-builder | ⬜ | - | Prisma 스키마 |
| entity-builder | ⬜ | - | Entity 클래스 |
| dto-builder | ⬜ | - | DTO 클래스 |
| seed-maker | ⬜ | - | 시드 데이터 |

**산출물:**
- [ ] `packages/prisma/schema/*.prisma`
- [ ] `packages/entity/src/*.ts`
- [ ] `packages/dto/src/*.ts`
- [ ] `packages/prisma/seed-data.ts`

---

## Stage 3: 백엔드 로직

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| repository-builder | ⬜ | - | Repository |
| service-builder | ⬜ | - | Service |
| facade-builder | ⬜ | - | Facade (필요시) |
| controller-builder | ⬜ | - | Controller |

**산출물:**
- [ ] `packages/repository/src/*.ts`
- [ ] `packages/service/src/*.ts`
- [ ] `packages/facade/src/*.ts`
- [ ] `apps/server/src/module/**/*.controller.ts`

---

## Stage 4: 컴포넌트 구현

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| ui-component-builder | ⬜ | - | Pure UI |
| input-component-builder | ⬜ | - | Input |
| widget-builder | ⬜ | - | Widget |
| feature-builder | ⬜ | - | Feature |
| store-builder | ⬜ | - | Store (필요시) |

**산출물:**
- [ ] `packages/ui/src/components/ui/*.tsx`
- [ ] `packages/ui/src/components/inputs/*.tsx`
- [ ] `packages/ui/src/components/widgets/**/*.tsx`
- [ ] `packages/ui/src/components/features/**/*.tsx`

---

## Stage 5: 페이지 통합

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| page-builder | ⬜ | - | Page |
| page-reviewer | ⬜ | - | 검증 완료 |

**산출물:**
- [ ] `apps/admin/app/(admin)/[route]/*.tsx`

---

## 실행 로그

```
[YYYY-MM-DD HH:MM] 🚀 planner 에이전트 시작
[YYYY-MM-DD HH:MM] ✅ planner 에이전트 완료
```

---

## 상태 표시

| 아이콘 | 의미 |
|:------:|------|
| ⬜ | 대기 중 |
| 🔄 | 진행 중 |
| ✅ | 완료 |
| ❌ | 실패 |
| ⏭️ | 건너뜀 |
