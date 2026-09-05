# 에셋 상세 응답 연결

| 항목 | 계약 |
|------|------|
| Route | `apps/admin/web/src/app/(admin)/assets/[assetId]/page.tsx` |
| page 역할 / reusable 대상 | `detail` / `detail/view` |
| Screen | `packages/fe-ui/src/screen/AssetDetailScreen/AssetDetailScreen.tsx` |
| SSR/prefetch | 사용하지 않음 |

- 기존 `@cocrepo/api/assets` 수동 클라이언트의 식별자·ISO 문자열 계약을 유지한다.
- `mapAssetDetail`에서 생성일을 `Date`로 복원해 Screen의 날짜 셀에 전달한다.
- 폴더 이동·삭제와 관련 Query 무효화 동작을 유지한다.
- route owner는 앱 타입 검사와 lint로 수동 API → Screen 경계를 검증한다.
