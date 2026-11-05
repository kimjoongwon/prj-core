import type { StepData } from "./types";

export const designStep: StepData = {
  id: "design",
  title: "디자인·기획 도구",
  description:
    "디자인을 어떻게 만들고 보여줄지 선택해주세요. Figma 시안을 넘겨주고 기다리는 방식이 아니라, Storybook으로 동작하는 실제 컴포넌트를 직접 확인하는 방식을 권합니다.",
  options: [
    {
      id: "storybook",
      name: "Storybook 활용",
      vendor: "Storybook JS",
      tagline: "동작하는 실제 컴포넌트로 디자인 확인",
      pros: [
        "시안이 아닌 실제 화면을 브라우저에서 바로 확인 — 시안-구현 갭 없음",
        "컴포넌트 단위 문서화 — 디자인 변경이 즉시 반영·공유",
        "진행 과정을 URL로 투명하게 공개",
        "완성된 컴포넌트 라이브러리가 자산으로 축적 — 유지보수·확장 빠름",
      ],
      cons: ["초기에 컴포넌트 구조를 잡는 시간 소요"],
      costRange: "무료",
      bestFor: "진행 투명성 + 장기 자산화",
      monthlyCost: 0,
      isRecommended: true,
    },
    {
      id: "figma",
      name: "Figma 시안 우선",
      vendor: "Figma",
      tagline: "시안 중심 — 실제 화면은 개발 완료 후 확인",
      warning:
        "선택 시 시안 제작과 시안-구현 정합 관리가 이중으로 늘어나 일정과 비용이 커집니다. Figma 구독료도 별도입니다.",
      pros: [
        "업계 표준 도구 — 누구나 익숙하게 접근",
        "프로토타입으로 화면 흐름을 먼저 검증",
      ],
      cons: [
        "시안과 실제 구현 사이 갭 — 고객이 실제 결과를 늦게 확인",
        "컴포넌트 문서가 없음 — 인수인계 후 수정이 외주 종속적",
      ],
      costRange: "무료 플랜 제한적 · Professional 월 $15~/인",
      bestFor: "소규모 + 빠른 착수",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "확인 방식", values: { storybook: "브라우저에서 실제 컴포넌트", figma: "시안 (프로토타입)" } },
    { label: "시안-구현 갭", values: { storybook: "없음 — 실제 결과를 계속 봄", figma: "발생 — 구현 완료 후 확인" } },
    { label: "변경 반영", values: { storybook: "즉시 — 컴포넌트 수정과 동시에 공유", figma: "시안 재작업 후 전달" } },
    { label: "컴포넌트 문서", values: { storybook: "자동 문서화 — 자산으로 축적", figma: "없음" } },
    { label: "인수인계 후", values: { storybook: "문서·구조가 남아 직접 수정 가능", figma: "외주 종속 가능성" } },
    { label: "추가 비용", values: { storybook: "없음 (무료)", figma: "시안 이중 작업 + Figma 구독료" } },
  ],
  recommendations: [
    { scenario: "진행 과정을 투명하게 보고 싶다", pick: "storybook", reason: "실제 컴포넌트를 언제든 브라우저로 확인" },
    { scenario: "인수인계 후 직접 수정하고 싶다", pick: "storybook", reason: "컴포넌트 문서와 구조가 그대로 남는다" },
    { scenario: "시안 승인 절차가 필요한 관공서·대기업", pick: "figma", reason: "시안 문서 기반 승인 흐름에 적합" },
  ],
};
