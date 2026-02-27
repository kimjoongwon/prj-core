# Spec Checklist

## page.spec.md
- [x] Spec exists
- [x] Code paired
- [ ] Verified
- Code: `page.tsx`, `_client.tsx`, `_prefetch.ts`
- Verification: `pnpm --filter=admin-web type-check` PASS, `pnpm --filter=admin-web lint` PASS, `pnpm --filter=test-e2e exec playwright test inquiries --project=admin-chromium` FAIL (`admin-setup` login timeout)
- Last Update: 2026-02-27

## new/page.spec.md
- [x] Spec exists
- [x] Code paired
- [ ] Verified
- Code: `new/page.tsx`, `new/_client.tsx`
- Verification: `pnpm --filter=admin-web type-check` PASS, `pnpm --filter=admin-web lint` PASS, `pnpm --filter=test-e2e exec playwright test inquiries --project=admin-chromium` FAIL (`admin-setup` login timeout)
- Last Update: 2026-02-27

## [inquiryId]/page.spec.md
- [x] Spec exists
- [x] Code paired
- [ ] Verified
- Code: `[inquiryId]/page.tsx`, `[inquiryId]/_client.tsx`, `[inquiryId]/_prefetch.ts`
- Verification: `pnpm --filter=admin-web type-check` PASS, `pnpm --filter=admin-web lint` PASS, `pnpm --filter=test-e2e exec playwright test inquiries --project=admin-chromium` FAIL (`admin-setup` login timeout)
- Last Update: 2026-02-27
