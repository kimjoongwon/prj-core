import type { StepData } from "./types";

export const infrastructureStep: StepData = {
  id: "infrastructure",
  title: "인프라 (호스팅)",
  description:
    "서버를 어디에 둘지 선택해주세요. K8s 기반 선택 시 실제 구축 경험이 있는 풀 스택을 제안합니다.",
  options: [
    {
      id: "vercel",
      name: "Vercel",
      vendor: "Vercel Inc.",
      tagline: "프론트엔드 특화 — 설정 없이 배포",
      pros: [
        "Git push만 하면 자동 배포 (CI/CD 불필요)",
        "CDN 전 세계 자동 적용",
        "HTTPS·도메인 자동 설정",
      ],
      cons: [
        "백엔드 커스텀 제약 (WebSocket·장기 프로세스)",
        "트래픽 많아지면 비용 증가",
        "preview/production 2단계만 — stg 환경 별도 구성 불가",
      ],
      costRange: "월 0원 (Hobby) ~ $20 (Pro)",
      bestFor: "프론트엔드 위주 + 빠른 시작",
      monthlyCost: 0,
    },
    {
      id: "eks",
      name: "AWS EKS",
      vendor: "Amazon",
      tagline: "관리형 Kubernetes — 엔터프라이즈급 CI/CD",
      pros: [
        "Jenkins + ArgoCD + Grafana로 완전 자동화 CI/CD 구축 가능",
        "local → stg → prod 3단계 환경 분리 운영",
        "무한 확장성 (오토스케일링, 노드 풀 관리)",
        "AWS 생태계 통합 (S3, RDS, CloudFront, CloudWatch)",
        "GitOps 배포 — 코드 리뷰 후 머지만 하면 자동 배포",
      ],
      cons: [
        "초기 설정 복잡 (VPC, 노드 그룹, IAM)",
        "월 최소 ~15만원 (클러스터 + 노드 비용)",
        "Kubernetes 운영 경험 있는 인력 필요",
      ],
      costRange: "월 15만원 ~ (클러스터 + 워커 노드)",
      bestFor: "대규모 + CI/CD 자동화 + 환경 분리",
      monthlyCost: 150000,
    },
    {
      id: "vultr",
      name: "Vultr",
      vendor: "Vultr Holdings",
      tagline: "저렴한 클라우드 VPS — 수동 관리",
      pros: [
        "월 $5~ 시작 (가성비)",
        "심플한 UI — 관리 부담 적음",
        "한국 리전(도쿄) 사용 가능",
      ],
      cons: [
        "확장성 제한 (수동)",
        "관리 도구 부족 — 모니터링·로깅 직접 구축",
        "장애 시 대응 자체 해결",
        "K8s 구축은 가능하나 관리 부담 큼",
      ],
      costRange: "월 $5~ (~7천원)",
      bestFor: "소규모 + 비용 최소화",
      monthlyCost: 7000,
    },
    {
      id: "home-server",
      name: "집 컴퓨터 (K8s)",
      vendor: "자체 관리",
      tagline: "자체 Kubernetes 클러스터 — 풀 스택 CI/CD 실운영",
      pros: [
        "실제 구축·운영 중인 풀 스택: Jenkins·ArgoCD·Grafana·Harbor·OpenBao·Loki·Tempo",
        "local → stg → prod 3단계 환경 분리 운영 경험 보유",
        "GitOps 배포 — PR 머지 → 자동 빌드·배포·알림까지 무인",
        "하드웨어 비용 1회 — 장기 최저 TCO",
        "K8s 운영 노하우 축적 — 이후 클라우드(EKS) 이전 쉬움",
      ],
      cons: [
        "전기비 + 인터넷 회선 비용",
        "인터넷 회선 속도·안정성 의존",
        "장애 시 직접 대응 (하드웨어 교체 포함)",
        "초기 셋업에 시간 소요",
      ],
      costRange: "전기료+회선 월 ~3만원 + 초기 하드웨어",
      bestFor: "풀 스택 CI/CD + K8s 경험 + 비용 최적화",
      monthlyCost: 30000,
    },
  ],
  comparison: [
    { label: "월 비용", values: { vercel: "0원~ (트래픽 따라)", eks: "15만원~", vultr: "7천원~", "home-server": "전기료+회선 ~3만원" } },
    { label: "CI/CD 도구", values: { vercel: "Vercel 자체 (Git push)", eks: "Jenkins + ArgoCD (GitOps)", vultr: "직접 구축 필요", "home-server": "Jenkins + ArgoCD 자체 구축" } },
    { label: "모니터링", values: { vercel: "Vercel Analytics", eks: "Grafana + Prometheus + CloudWatch", vultr: "직접 구축", "home-server": "Grafana + Loki + Tempo + Alloy" } },
    { label: "환경 분리", values: { vercel: "preview / production (2단계)", eks: "local / stg / prod (3단계)", vultr: "수동 디렉터리 분리", "home-server": "local / stg / prod (3단계)" } },
    { label: "설정 난이도", values: { vercel: "매우 쉬움", eks: "어려움 (AWS 콘솔)", vultr: "보통", "home-server": "어려움 (OS부터)" } },
    { label: "확장성", values: { vercel: "자동 (Vercel 관리)", eks: "자동 (Kubernetes HPA)", vultr: "수동", "home-server": "하드웨어 교체 필요" } },
    { label: "백엔드 지원", values: { vercel: "제약 (Serverless)", eks: "완전 자유", vultr: "자유 (VPS)", "home-server": "완전 자유" } },
    { label: "장애 대응", values: { vercel: "Vercel가 처리", eks: "AWS + 자체", vultr: "자체", "home-server": "100% 자체" } },
    { label: "적합 규모", values: { vercel: "소~중 (프론트)", eks: "중~대 (풀스택)", vultr: "소", "home-server": "소~중 (풀스택)" } },
  ],
  recommendations: [
    { scenario: "프론트엔드 위주, 빠른 시작", pick: "vercel", reason: "설정 없이 배포, 무료 시작" },
    { scenario: "대규모 + CI/CD 자동화", pick: "eks", reason: "Jenkins+ArgoCD+Grafana 풀 스택, 3단계 환경" },
    { scenario: "저예산, 간단한 서비스", pick: "vultr", reason: "월 7천원으로 시작" },
    { scenario: "풀 스택 CI/CD 실운영", pick: "home-server", reason: "Jenkins·ArgoCD·Grafana·Harbor·OpenBao·관측 스택 실제 구축 경험" },
    { scenario: "나중에 클라우드 이전 예정", pick: "home-server", reason: "K8s 경험 축적 후 EKS로 스무스 이전" },
  ],
};

// 집 컴퓨터(K8s) 선택 시 표시되는 상세 구성 요약
export const homeServerStack = {
  title: "집 컴퓨터 K8s — 실제 구축·운영 중인 스택",
  categories: [
    {
      name: "CI/CD",
      tools: [
        { name: "Jenkins", role: "빌드·이미지 push·GitOps 범프 트리거" },
        { name: "ArgoCD", role: "GitOps 배포 (Git push → 자동 배포)" },
        { name: "BuildKit", role: "컨테이너 이미지 빌드 (원격 빌더)" },
        { name: "Harbor", role: "프라이빗 레지스트리 (이미지 저장)" },
      ],
    },
    {
      name: "관측 (Observability)",
      tools: [
        { name: "Grafana", role: "대시보드·시각화" },
        { name: "Loki", role: "로그 수집·검색" },
        { name: "Tempo", role: "분산 트레이싱" },
        { name: "Prometheus", role: "메트릭 수집·알림" },
        { name: "OTel Collector", role: "텔레메트리 파이프라인" },
        { name: "Alloy", role: "에이전트 (메트릭/로그/트레이스)" },
      ],
    },
    {
      name: "보안·시크릿",
      tools: [
        { name: "OpenBao", role: "시크릿 관리 (Vault fork) + ESO 동기화" },
        { name: "cert-manager", role: "TLS 인증서 자동 발급·갱신" },
      ],
    },
    {
      name: "네트워크",
      tools: [
        { name: "Cloudflare Tunnel", role: "외부 노출 (도메인·HTTPS)" },
        { name: "MetalLB", role: "LoadBalancer (내부 서비스 노출)" },
        { name: "Ingress (nginx)", role: "경로 기반 라우팅" },
      ],
    },
    {
      name: "스토리지",
      tools: [{ name: "OpenEBS", role: "영구 볼륨 (hostpath PV)" }],
    },
    {
      name: "AI 도구",
      tools: [
        { name: "PR-Agent", role: "AI 코드 리뷰 (PR 웹훅 → 자동 리뷰)" },
        { name: "buzz-gateway", role: "CI/CD 알림 (Nostr 메신저 연동)" },
      ],
    },
  ],
};
