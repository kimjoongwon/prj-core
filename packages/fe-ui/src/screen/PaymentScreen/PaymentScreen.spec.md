# PaymentScreen page 기획서

> 생성일: 2026-05-10
> 타입: page
> 위치: packages/fe-ui/src/screen/PaymentScreen/PaymentScreen.tsx

## 역할

Payment admin route가 전달한 Space-scoped 결제 원장 데이터를 렌더링하는 pure screen 컴포넌트입니다. route는 Orval hook과 refetch 이벤트를 소유하고, 이 컴포넌트는 page title/action과 PaymentConsole feature 조합만 담당합니다.
route `page.tsx`는 이 screen을 `ScreenSurface`로 감싸고, screen은 `VStack` rhythm과 `SectionSurface` body를 소유합니다.

## 화면 러프

### Desktop

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 결제 관리                                                   [새로고침]       │
│ Space별 결제 원장을 Course와 Product까지 같은 구조로 추적합니다.             │
├────────────────────────────────────────────────────────────────────────────┤
│ [01 Space] [02 Payment] [03 Subject] [04 Reference]                         │
│ 권한 범위     공통 결제 원장  서비스 대상       역추적 참조                  │
├────────────────────────────────────────────────────────────────────────────┤
│ 결제 원장          결제 완료액          결제 대기          연결 서비스        │
│ 12건               ₩1,200,000           3건                2개               │
├────────────────────────────────────────────────────────────────────────────┤
│ Loading/Error/Empty/Refreshing State 또는 Payment Table                      │
│ 결제 / Space / 결제자 / 대상 / 참조 / 금액 / 상태 / 승인일                    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ 결제 관리       [새로고침]    │
├──────────────────────────────┤
│ [Space]                      │
│ [Payment]                    │
│ [Subject]                    │
│ [Reference]                  │
├──────────────────────────────┤
│ 결제 원장                    │
│ 결제 완료액                  │
│ 결제 대기                    │
│ 연결 서비스                  │
├──────────────────────────────┤
│ State panel / horizontal table│
└──────────────────────────────┘
```

## 공개 계약

| 항목                        | 설명                                   |
| --------------------------- | -------------------------------------- |
| PaymentRow    | Payment table row 표시 계약            |
| PaymentSummary    | Payment metric 계산 결과 계약          |
| PaymentQueryState | Orval loading/fetching/error 상태 계약 |
| PaymentScreenProps  | pure screen 입력 계약                    |
| PaymentScreen       | 결제 관리 admin pure screen              |

## 하위 조합

| 계층    | 컴포넌트                 | 책임                                            |
| ------- | ------------------------ | ----------------------------------------------- |
| Feature | PaymentConsole | Payment 업무 콘솔 조합                          |
| Widget  | PaymentScopeRail         | Space → Payment → Subject → Reference 구조 표시 |
| Widget  | PaymentMetricGrid        | 결제 건수, 완료액, 대기 건, 연결 서비스 요약    |
| Widget  | PaymentTableStatePanel   | loading/refreshing/error/empty 상태 표시        |
| Widget  | PaymentTable             | Payment 원장 row 표시                           |

## Surface / Rhythm Ownership

| 계층 | owner | 규칙 |
|------|-------|------|
| Route page | `apps/admin/web/src/app/(admin)/payments/page.tsx` | `ScreenSurface`를 명시하고 screen props를 조립 |
| Screen | `PaymentScreen` | `VStack` rhythm, title/action, `SectionSurface` body 소유 |
| Feature | `PaymentConsole` | surface 없이 결제 콘솔 흐름과 상태 분기 소유 |
| Widget | `PaymentScopeRail`, `PaymentMetricGrid`, `PaymentTableShell`, `PaymentTableStatePanel` | 독립 패널/table shell에는 local `Surface` 사용 |