import type { StepData } from "./types";

export const storageStep: StepData = {
  id: "storage",
  title: "저장소 & CDN",
  description: "파일 저장과 캐시는 검증된 조합으로 자동 구성됩니다.",
  options: [
    {
      id: "cloudflare-r2",
      name: "Cloudflare R2",
      vendor: "Cloudflare",
      tagline: "S3 호환 — 송신 트래픽 무료",
      pros: [
        "월 10GB 무료",
        "송신(egress) 트래픽 비용 0원 — S3 대비 월 수십만원 절감",
        "S3 호환 API — 나중에 AWS로 쉽게 이전 가능",
      ],
      cons: ["S3보다 리전 적음 (한국 리전 없음)"],
      costRange: "월 0원 (10GB까지)",
      bestFor: "모든 프로젝트 기본값",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "저장 용량", values: { "cloudflare-r2": "10GB 무료, 이후 $0.015/GB" } },
    { label: "송신 트래픽", values: { "cloudflare-r2": "무료 (S3는 트래픽당 과금)" } },
    { label: "S3 호환", values: { "cloudflare-r2": "완전 호환 — endpoint만 변경" } },
    { label: "CDN", values: { "cloudflare-r2": "Cloudflare CDN 자동 적용" } },
  ],
  recommendations: [],
};

export const cdnStep: StepData = {
  id: "cdn",
  title: "CloudFront 캐시 설정",
  description: "정적 파일(이미지·CSS·JS)을 전 세계 캐시로 빠르게 제공합니다.",
  options: [
    {
      id: "cloudfront",
      name: "CloudFront (선택적)",
      vendor: "AWS",
      tagline: "AWS 사용 시 자동 구성",
      pros: [
        "AWS EKS 선택 시 기본 구성",
        "정적 파일 응답 속도 급감 (글로벌 엣지)",
        "Cloudflare와 별도 불필요 (둘 중 하나)",
      ],
      cons: ["Vercel 선택 시 불필요 (자체 CDN 있음)"],
      costRange: "월 0원 (1TB까지)",
      bestFor: "AWS 인프라 사용 시",
      monthlyCost: 0,
    },
  ],
  comparison: [],
  recommendations: [],
};

export const databaseStep: StepData = {
  id: "database",
  title: "데이터베이스",
  description: "검증된 오픈소스 관계형 DB로 자동 구성됩니다.",
  options: [
    {
      id: "postgresql",
      name: "PostgreSQL",
      vendor: "PostgreSQL Global Development Group",
      tagline: "가장 진보된 오픈소스 RDBMS",
      pros: [
        "ACID 준수 — 거래·데이터 무결성 보장",
        "JSONB로 유연한 스키마 대응",
        "무료 — 라이선스 비용 0원",
        "관리형 서비스 풍부 (RDS, Supabase, Neon)",
      ],
      cons: ["읽기 전용 복제 설정 필요 시 공부 필요"],
      costRange: "월 0원 (자체) ~ $15 (관리형)",
      bestFor: "모든 프로젝트 표준",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "라이선스", values: { postgresql: "PostgreSQL License (무료)" } },
    { label: "JSON 지원", values: { postgresql: "JSONB — 인덱스 가능" } },
    { label: "확장성", values: { postgresql: "읽기 복제, 파티셔닝" } },
    { label: "관리형 옵션", values: { postgresql: "AWS RDS, Supabase, Neon 등" } },
  ],
  recommendations: [],
};
