# Pagination Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/Pagination/

## 역할

MobX state와 연동하는 페이지네이션 컴포넌트. 페이지 번호를 state에 저장하고, URL 쿼리 파라미터도 자동으로 동기화한다. `"use client"` 필수 (Next.js router/searchParams 사용).

## Props

```typescript
interface PaginationProps<T> extends MobxProps<T>,
  Omit<BasePaginationProps, "page" | "onChange"> {
  /** URL 쿼리 파라미터 이름 @default "page" */
  queryParam?: string;
  /** URL 쿼리 업데이트 비활성화 @default false */
  disableUrlSync?: boolean;
}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `total`: 총 페이지 수 (BasePaginationProps)

## 동작 흐름

1. 페이지 번호 클릭
2. `runInAction`으로 MobX state 업데이트
3. `disableUrlSync`가 false이면 URL 쿼리 파라미터도 업데이트 (`router.replace`)

## MobX 연동

- `observer`로 래핑
- `runInAction`으로 직접 state 설정 (`tools.set`)
- URL 동기화: `useRouter` + `useSearchParams`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
