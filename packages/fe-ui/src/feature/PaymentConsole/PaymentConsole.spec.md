# PaymentConsole feature 기획서

> 생성일: 2026-05-10
> 타입: feature
> 위치: packages/fe-ui/src/feature/PaymentConsole/PaymentConsole.tsx

## 역할

Payment admin page의 업무 조합 feature입니다. Page가 전달한 Payment row, summary, query state를 받아 scope rail, metric grid, table state, payment table widget을 조합합니다.

## 화면 러프

```text
PaymentConsole
├─ PaymentScopeRail
│  ├─ Space
│  ├─ Payment
│  ├─ Subject
│  └─ Reference
├─ PaymentMetricGrid
│  ├─ 결제 원장
│  ├─ 결제 완료액
│  ├─ 결제 대기
│  └─ 연결 서비스
├─ PaymentTableStatePanel (loading / refreshing / error / empty)
└─ PaymentTable (ready 상태)
```

## 공개 계약

| 항목                                     | 설명                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| PaymentConsoleProps.payments   | Payment table rows                                                                |
| PaymentConsoleProps.summary    | 결제 원장 metric 계산 결과                                                        |
| PaymentConsoleProps.queryState | Orval query 상태. `isLoading`, `isFetching`, `isError`를 표 영역 상태 UI로 렌더링 |

## 조합 계층

| 계층   | 컴포넌트               | 책임                                           |
| ------ | ---------------------- | ---------------------------------------------- |
| Widget | PaymentScopeRail       | 결제 도메인의 Space-scoped 공통 원장 구조 표시 |
| Widget | PaymentMetricGrid      | 결제 원장 요약 metric 표시                     |
| Widget | PaymentTableStatePanel | loading/refreshing/error/empty 상태 표시       |
| Widget | PaymentTable           | 결제 목록과 subject/reference 표시             |