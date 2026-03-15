# assets 목록 E2E 기획서

> 생성일: 2026-03-15
> 타입: e2e
> 위치: apps/admin/web/src/app/(admin)/assets/page.e2e.ts

## 역할

에셋 목록 및 상세 진입 흐름에서 브라우저 런타임 에러 없이 기본 UI가 렌더링되는지 검증합니다.

## 시나리오

| ID | 설명 |
|----|------|
| E2E-001 | 목록 진입 시 제목/설명/검색 필드가 노출되고 pageerror가 없어야 함 |
| E2E-002 | 목록에서 에셋 링크 클릭 시 상세 경로로 이동할 수 있고 pageerror가 없어야 함 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | SSR/client rendering 오류 재발 방지를 위한 assets E2E sidecar 신규 추가 | codex |
