export interface IntroductionPoint {
  id: string;
  title: string;
  detail: string;
}

export const founderIntroduction = {
  headline: "개발하는 대표가 직접 작업합니다",
  description: "거짓 없이 작업합니다 — 과장된 견적 없이, 결과로 보여드립니다.",
  points: [
    {
      id: "direct-development",
      title: "대표가 직접 개발합니다",
      detail: "설계·개발·운영 전부 대표 본인이 합니다. 중간에서 전달이 왜곡되는 단계가 없습니다.",
    },
    {
      id: "low-price-reality",
      title: "저단가로 달려드는 업체의 조건",
      detail:
        "대표가 직접 개발하지 못하는 업체라면, 지금 제시하는 단가는 절대 소화하지 못합니다. 계약 후 추가 견적과 품질 문제로 고객에게 되돌아옵니다.",
    },
    {
      id: "ai-native-handover",
      title: "AI-native 환경을 구축해 인계",
      detail: "코드만 넘기고 끝나지 않습니다. AI가 실제로 작동하는 개발 환경을 구축해서 그대로 넘깁니다.",
    },
    {
      id: "self-service-maintenance",
      title: "간단한 기능은 직접 수정 가능",
      detail:
        "가이드와 구조를 함께 드립니다. 인계 후 간단한 기능 추가·수정은 대표님이 스스로 하실 수 있습니다.",
    },
  ],
  closingStatement:
    "구조가 없으면 아무리 AI가 있어도 늘 외주회사에 묶일 수밖에 없습니다. 그래서 구조까지 함께 넘깁니다.",
};
