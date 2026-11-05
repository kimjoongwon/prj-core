export interface RecommendedStackItem {
  id: string;
  name: string;
  role: string;
  reason: string;
  /** 규모에 따라 단계적으로 확장되는 구성 — 카드에 단계 목록 표시 */
  stages?: string[];
  /** 선택 시 유의 사항 — 카드에 경고 문구 표시 */
  note?: string;
}

export const recommendedStack: RecommendedStackItem[] = [
  {
    id: "react-native",
    name: "React Native",
    role: "모바일 앱 (iOS·Android)",
    reason: "TypeScript 하나로 웹·앱 통합 개발 — 토스·인스타그램 검증",
  },
  {
    id: "nestjs",
    name: "NestJS",
    role: "백엔드 API",
    reason: "프론트와 같은 언어 — 1인 풀스택으로 빠른 출시",
  },
  {
    id: "turborepo",
    name: "Turborepo",
    role: "모노레포 빌드 관리",
    reason: "앱·웹·API를 하나의 저장소에서 — 증분 빌드·캐시 공유",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    role: "데이터베이스",
    reason: "ACID 준수·JSONB — 모든 프로젝트 표준",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    role: "DNS·CDN·파일 저장",
    reason: "CDN은 대역폭 무료·송신 과금 없는 Cloudflare로 결정 — CloudFront·S3는 전송량 과금이라 트래픽이 늘면 수십만원 차이. R2 파일 저장 10GB 무료 포함",
  },
  {
    id: "k8s-growth-path",
    name: "Kubernetes",
    role: "인프라·CI/CD",
    reason: "규모에 맞춰 단계적으로 확장 — DNS·CDN은 전 구간 Cloudflare",
    stages: [
      "개발·MVP — 개인 본체 서버 K8s (Jenkins·ArgoCD·Grafana 직접 운영)",
      "상용 — Vultr (월 $5~ 저비용 클라우드)",
      "이용자 증가 시 — AWS EKS (자동 확장)",
    ],
    note: "관측 스택(Grafana·Loki·Tempo 등)은 컴퓨팅 파워가 더 필요해 서버 PC의 요구 사양이 높아집니다 — 운영 비용 증가가 아닌 하드웨어 사양 문제입니다. 서버 본체 PC는 제공되지 않습니다 — 고객이 준비한 PC로 구축합니다.",
  },
  {
    id: "storybook",
    name: "Storybook",
    role: "디자인 확인·컴포넌트 문서",
    reason: "시안 대신 실제 컴포넌트를 브라우저에서 확인 — 진행 투명, 자산 축적",
  },
  {
    id: "github-projects",
    name: "GitHub Projects",
    role: "WBS 칸반 일정 관리",
    reason: "작업을 WBS로 분해해 칸반으로 공유 — 진행과 지연이 항상 보임",
  },
  {
    id: "openspec",
    name: "OpenSpec",
    role: "기능 명세·변경 관리",
    reason: "기능 명세와 변경 이력을 문서로 고정 — 무엇을 만들지 항상 합의된 상태",
  },
];
