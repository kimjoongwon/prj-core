# DerivativeKind Enum 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: enum
> 위치: packages/common-enum/src/derivative-kind.enum.ts

## 역할

Derivative(파생 리소스)의 종류를 정의합니다. 원본 에셋에서 생성된 변환 파일의 용도를 구분합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| THUMBNAIL | Thumbnail | "썸네일" | 작은 크기 미리보기 이미지 (예: 100x100) |
| PREVIEW | Preview | "프리뷰" | 중간 크기 미리보기 (예: 800x600) |
| TRANSCODE | Transcode | "트랜스코딩" | 비디오 포맷/해상도 변환본 |
| TEXT | Text | "텍스트" | 문서에서 추출된 텍스트 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class DerivativeKind extends BaseEnum {
  static readonly THUMBNAIL = new DerivativeKind("Thumbnail", "썸네일");
  static readonly PREVIEW = new DerivativeKind("Preview", "프리뷰");
  static readonly TRANSCODE = new DerivativeKind("Transcode", "트랜스코딩");
  static readonly TEXT = new DerivativeKind("Text", "텍스트");

  private static readonly _values = [
    DerivativeKind.THUMBNAIL,
    DerivativeKind.PREVIEW,
    DerivativeKind.TRANSCODE,
    DerivativeKind.TEXT,
  ] as const;

  static values(): DerivativeKind[] {
    return [...DerivativeKind._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum DerivativeKind {
  THUMBNAIL
  PREVIEW
  TRANSCODE
  TEXT
}
```

## 매핑 규칙

| Prisma 값 | TypeScript Code | 변환 방식 |
|-----------|-----------------|----------|
| `THUMBNAIL` | `DerivativeKind.THUMBNAIL` | 직접 매핑 |
| `PREVIEW` | `DerivativeKind.PREVIEW` | 직접 매핑 |
| `TRANSCODE` | `DerivativeKind.TRANSCODE` | 직접 매핑 |
| `TEXT` | `DerivativeKind.TEXT` | 직접 매핑 |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Derivative | Derivative.kind | 파생 리소스 종류 |
| Processor | 변환 서비스 | 생성할 파생 리소스 종류 결정 |
| Asset | 목록/상세 | 적절한 파생 리소스 선택 |

## AssetKind별 지원 DerivativeKind

| AssetKind | 지원 DerivativeKind |
|-----------|---------------------|
| IMAGE | THUMBNAIL, PREVIEW |
| VIDEO | THUMBNAIL, PREVIEW, TRANSCODE |
| DOCUMENT | THUMBNAIL, TEXT |

## 구현 체크리스트

- [ ] `derivative-kind.enum.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가 (`DerivativeKind`)
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/derivative.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | L7 Entity 기획자 |
| 2026-02-22 | BaseEnum 패턴으로 수정 | orch-requirement |
| 2026-02-22 | 단수형 네이밍으로 수정 | orch-requirement |
