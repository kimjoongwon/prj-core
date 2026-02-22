# AssetStatus Enum 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: enum
> 위치: packages/common-enum/src/asset-status.enum.ts

## 역할

Asset(에셋)의 업로드 상태를 정의합니다. 파일 처리 파이프라인에서 현재 단계를 추적하는 데 사용됩니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| UPLOADING | Uploading | "업로드 중" | 파일 업로드 진행 중 |
| READY | Ready | "준비됨" | 업로드 완료, 사용 가능 |
| FAILED | Failed | "실패" | 업로드 또는 처리 실패 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class AssetStatus extends BaseEnum {
  static readonly UPLOADING = new AssetStatus("Uploading", "업로드 중");
  static readonly READY = new AssetStatus("Ready", "준비됨");
  static readonly FAILED = new AssetStatus("Failed", "실패");

  private static readonly _values = [
    AssetStatus.UPLOADING,
    AssetStatus.READY,
    AssetStatus.FAILED,
  ] as const;

  static values(): AssetStatus[] {
    return [...AssetStatus._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum AssetStatus {
  UPLOADING
  READY
  FAILED
}
```

## 매핑 규칙

| Prisma 값 | TypeScript Code | 변환 방식 |
|-----------|-----------------|----------|
| `UPLOADING` | `AssetStatus.UPLOADING` | 직접 매핑 |
| `READY` | `AssetStatus.READY` | 직접 매핑 |
| `FAILED` | `AssetStatus.FAILED` | 직접 매핑 |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Asset | Asset.status | 업로드 상태 추적 |
| Uploader | 업로드 서비스 | 상태 전이 관리 |
| Processor | 변환 서비스 | 처리 가능 여부 확인 |

## 상태 전이 규칙

```
UPLOADING ──(성공)──> READY
    │
    └──(실패)──> FAILED
```

- UPLOADING → READY: 업로드 완료 시
- UPLOADING → FAILED: 업로드 실패 시
- READY → FAILED: 처리 실패 시 (선택적)
- FAILED → UPLOADING: 수동 재시도 시

## 구현 체크리스트

- [ ] `asset-status.enum.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가 (`AssetStatus`)
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | L7 Entity 기획자 |
| 2026-02-22 | BaseEnum 패턴으로 수정 | orch-requirement |
| 2026-02-22 | 단수형 네이밍으로 수정 | orch-requirement |
