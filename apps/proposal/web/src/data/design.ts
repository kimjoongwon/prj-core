import type { StepData } from "./types";

export const designStep: StepData = {
  id: "design",
  title: "디자인·기획 도구",
  description:
    "디자인 시안과 기획 문서를 어떻게 관리하고 개발에 연결할지 선택해주세요. 진행 과정은 모든 방식에서 투명하게 공유됩니다.",
  options: [
    {
      id: "figma-storybook",
      name: "Figma + Storybook",
      vendor: "Figma + Storybook JS",
      tagline: "디자인 시안 → 컴포넌트 문서 → 개발 until 원라인 파이프라인",
      pros: [
        "Figma로 디자인 시안 작성 → Storybook으로 실제 컴포넌트 문서화",
        "고객이 디자인 시안(Figma)과 실제 컴포넌트(Storybook)를 나란히 확인",
        "디자인 변경 시 Storybook에 즉시 반영 — 개발자·고객 동일한 화면 공유",
        "디자인 시스템 구축 → 재사용 가능한 컴포넌트 라이브러리로 자산화",
      ],
      cons: ["초기 디자인 시스템 구축에 시간 소요"],
      costRange: "Figma 무료(~3인) + Storybook 무료",
      bestFor: "디자인 일관성 + 고객 커뮤니케이션",
      monthlyCost: 0,
    },
    {
      id: "figma-only",
      name: "Figma만 사용",
      vendor: "Figma",
      tagline: "디자인 시안 중심 — 개발은 시안 보고 직접 구현",
      pros: ["업계 표준 도구 — 누구나 사용 가능", "프로토타입으로 화면 흐름 검증 가능"],
      cons: [
        "시안과 실제 구현 사이 갭 발생 — 고객이 실제 결과를 늦게 확인",
        "컴포넌트 문서 없음 — 개발자 간 이해 차이 가능",
      ],
      costRange: "Figma 무료(~3인)",
      bestFor: "소규모 + 빠른 진행",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "디자인 시안", values: { "figma-storybook": "Figma", "figma-only": "Figma" } },
    { label: "컴포넌트 문서", values: { "figma-storybook": "Storybook — 실제 코드 기반", "figma-only": "없음" } },
    { label: "고객 확인", values: { "figma-storybook": "시안 + 실제 컴포넌트 동시 확인", "figma-only": "시안만 확인 (구현은 개발 완료 후)" } },
    { label: "디자인→개발 갭", values: { "figma-storybook": "최소화 — Storybook이 실제 모습 보여줌", "figma-only": "발생 가능 — 구현 후 확인" } },
    { label: "디자인 시스템", values: { "figma-storybook": "구축 가능 → 재사용 자산화", "figma-only": "Figma 내에서만" } },
  ],
  recommendations: [
    { scenario: "고객에게 진행 과정 투명하게 공유", pick: "figma-storybook", reason: "Storybook URL로 실제 컴포넌트를 언제든 확인 가능" },
    { scenario: "장기 프로젝트·디자인 시스템 필요", pick: "figma-storybook", reason: "컴포넌트 라이브러리가 자산으로 축적" },
    { scenario: "소규모 MVP·빠른 진행", pick: "figma-only", reason: "간단하게 시작, 필요 시 Storybook 추가" },
  ],
};
