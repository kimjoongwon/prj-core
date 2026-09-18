# 기여 안내

## 개발 환경

- Node.js 22.18 이상과 `packageManager`에 지정된 pnpm을 사용합니다.
- 설치 후 README의 로컬 실행 절차를 따릅니다.
- 실제 `.env`, 인증서, 개인 키, 운영 URL이나 자격증명을 커밋하지 않습니다.
- TypeScript 증분 빌드 캐시인 `*.tsbuildinfo`는 생성 산출물이므로 커밋하지 않습니다.
- 공개 전 검사는 `pnpm public-release:check`로 수행하며, 실패 보고에 비밀값을 복사하지 않습니다.

## 변경 원칙

- 변경 범위를 작게 유지하고 관련 테스트를 함께 수정합니다.
- 공개 API 또는 패키지 계약을 변경하면 README와 export를 함께 갱신합니다.
- 커밋 메시지는 `<타입>: <제목>` 또는 `<타입>(<범위>): <제목>` 형식을 사용합니다.

## 검증과 Pull Request

Pull Request 전에 `pnpm type-check`, `pnpm lint`, `pnpm test`를 실행합니다. 외부 fork의 CI는 자격증명 없는 비특권 검증만 수행하며 이미지 push와 배포는 하지 않습니다. 배포 파이프라인은 보호 브랜치의 승인된 내부 job에서만 실행됩니다.
