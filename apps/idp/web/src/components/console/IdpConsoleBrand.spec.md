# IdpConsoleBrand 기획서

> 생성일: 2026-03-23
> 수정일: 2026-03-23
> 타입: client component
> 위치: apps/idp/web/src/components/console/IdpConsoleBrand.tsx

## 역할

- IDP 콘솔 헤더와 사이드 패널에서 재사용하는 브랜드 링크입니다.
- 전용 SVG 브랜드 마크와 서비스명을 함께 렌더링합니다.
- 클릭 시 `/dashboard`로 이동합니다.

## 입력 계약

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `className` | `string` | `undefined` | 배치용 추가 클래스 |
| `compact` | `boolean` | `false` | `true`면 텍스트를 숨기고 심벌만 노출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | IDP 콘솔 전용 브랜드 링크 추가 | codex |
