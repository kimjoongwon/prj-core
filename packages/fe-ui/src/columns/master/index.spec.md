# master/index 기획서

> 생성일: 2026-03-27
> 타입: index
> 위치: packages/fe-ui/src/columns/master/index.ts

## 역할

`columns/master` 하위 도메인별 컬럼 구현의 공용 배럴입니다.
호출부는 이 배럴을 통해 필요한 master 컬럼 builder만 가져옵니다.
공용 factory는 `columns/internal`로 이동해 이 배럴에서 숨깁니다.

## 공개 계약

| 항목             | 설명                       |
| ---------------- | -------------------------- |
| `./adminColumns` | 관리자 영역 master columns |
| `./idpColumns`   | IDP 영역 master columns    |

## 변경 이력

| 일자       | 내용                                                                                                         | 작성자 |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-03-27 | 공용 factory를 `columns/internal/masterFactory.tsx`로 이동하고 `master` 배럴은 도메인 컬럼만 공개하도록 정리 | codex  |
| 2026-03-27 | 상위 `masterTableColumns.tsx` 중간 배럴 제거 후 `columns/master`를 직접 진입점으로 사용하도록 정리           | codex  |
| 2026-03-27 | `master` 하위 도메인 파일을 묶는 배럴 추가                                                                   | codex  |
