export interface RecommendedStackItem {
  id: string;
  name: string;
  role: string;
  reason: string;
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
];
