# Dockerfile.admin-web 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.admin-web

## 역할

> 2026-10-22 Dockerfile·호출 소스 대조. 이미지 빌드·실행을 새로 수행한 검증 기록은 아니다. 날짜가 붙은 변경 이력은 당시 기록으로 구분한다.

`admin-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune --scope=admin-web --docker`로 축소된 모노레포 트리를 기준으로 빌드하고,
Next.js standalone 런타임 이미지로 배포합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| 베이스 이미지 | Node `24.21.0-alpine3.24` multi-arch manifest를 tag와 digest로 고정하고 builder/runner에서 동일하게 사용 |
| 빌드 도구 | `pnpm 10.34.5`, `turbo 2.9.14` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=admin-web --docker` |
| builder 단계 | `out/json` 복사 → `pnpm install --frozen-lockfile --store-dir /cache/pnpm-store --prefer-offline` → `out/full` 복사 → `pnpm exec turbo build --concurrency=2 --cache-dir=/cache/turbo --filter=admin-web...` 수행 |
| 러너 단계 | `CMD ["node", "apps/admin/web/server.js"]` |
| 런타임 | `PORT=3000`, `HOSTNAME=0.0.0.0`, non-root(`nextjs`) 실행 |

## 구현 체크리스트

- [x] `admin-web` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 최신 `pnpm-lock.yaml` 기준으로 `pnpm install` 수행
- [x] prune 결과에 포함된 `turbo.json`을 그대로 사용해 별도 루트 설정 파일 복사를 제거
- [x] 빌드 캐시 경로는 `/cache/pnpm-store`, `/cache/turbo`. 명시적 cache mount는 없고 현재 Jenkins는 별도 PVC를 마운트하지 않음
- [x] 별도 `type-check:prod` stage 없이 `turbo build --filter=admin-web...` 수행
- [x] `next build` 실행 전 런타임 산출물을 위한 standalone 번들 사용
- [x] `nextjs` non-root 사용자로 실행 보안 유지
- [x] Node 베이스 이미지를 안전 버전과 검증된 multi-arch digest로 고정
- [x] Dependabot의 `/devops` Docker 감시가 `FROM` 리터럴을 인식할 수 있도록 유지
