# AssetKind Enum 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: enum
> 위치: packages/common-enum/src/asset-kind.enum.ts

## 역할

Asset(에셋)의 파일 종류를 정의합니다. 파일 처리 및 변환 로직을 구분하는 데 사용됩니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| IMAGE | Image | "이미지" | 이미지 파일 (jpg, png, gif, webp 등) |
| VIDEO | Video | "비디오" | 비디오 파일 (mp4, mov, avi, webm 등) |
| DOCUMENT | Document | "문서" | 문서 파일 (pdf, doc, docx, txt 등) |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class AssetKind extends BaseEnum {
  static readonly IMAGE = new AssetKind("Image", "이미지");
  static readonly VIDEO = new AssetKind("Video", "비디오");
  static readonly DOCUMENT = new AssetKind("Document", "문서");

  private static readonly _values = [
    AssetKind.IMAGE,
    AssetKind.VIDEO,
    AssetKind.DOCUMENT,
  ] as const;

  static values(): AssetKind[] {
    return [...AssetKind._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum AssetKind {
  IMAGE
  VIDEO
  DOCUMENT
}
```

## 매핑 규칙

| Prisma 값 | TypeScript Code | 변환 방식 |
|-----------|-----------------|----------|
| `IMAGE` | `AssetKind.IMAGE` | Prisma 값 → uppercase → 매핑 |
| `VIDEO` | `AssetKind.VIDEO` | 동일 |
| `DOCUMENT` | `AssetKind.DOCUMENT` | 동일 |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Asset | Asset.kind | 파일 종류 저장 |
| Derivative | Derivative 생성 | 원본 에셋 종류 기반 변환 규칙 결정 |
| Processor | 파일 처리 서비스 | 특정 파일 종류별 처리 로직 적용 |

## 비즈니스 규칙

- 파일 확장자에 따라 자동으로 AssetKind가 결정됨
- 각 AssetKind별로 지원하는 변환(Derivative) 종류가 다름
  - IMAGE: THUMBNAIL, PREVIEW 지원
  - VIDEO: THUMBNAIL, PREVIEW, TRANSCODE 지원
  - DOCUMENT: THUMBNAIL, TEXT 지원

## 구현 체크리스트

- [ ] `asset-kind.enum.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가 (`AssetKind`)
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | L7 Entity 기획자 |
| 2026-02-22 | BaseEnum 패턴으로 수정 | orch-requirement |
| 2026-02-22 | 단수형 네이밍으로 수정 | orch-requirement |
