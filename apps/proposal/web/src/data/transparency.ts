// 고객 이탈 방지 — 진행 과정 투명화 방안
export const transparencyFeatures = {
  title: "진행 과정 투명화",
  description: "고객이 프로젝트 진행 상황을 언제든 확인할 수 있는 채널을 제공합니다.",
  channels: [
    {
      icon: "git",
      name: "GitHub 저장소 공유",
      detail:
        "모든 코드 변경이 GitHub에 기록됩니다. 고객에게 Read 권한을 드려서 어떤 파일이 언제 바뀌었는지 실시간 확인 가능합니다.",
    },
    {
      icon: "pr",
      name: "Pull Request 리뷰",
      detail:
        "기능 추가·수정 시 PR을 생성하고 고객에게 알림을 보냅니다. 변경 내용을 코드 diff로 확인하고 승인하실 수 있습니다.",
    },
    {
      icon: "storybook",
      name: "Storybook 실시간 확인",
      detail:
        "개발 중인 컴포넌트를 Storybook에서 실시간으로 확인하실 수 있습니다. 디자인 시안과 실제 구현이 일치하는지 즉시 비교 가능합니다.",
    },
    {
      icon: "deploy",
      name: "Staging 환경 상시 접근",
      detail:
        "개발이 완료된 기능은 staging 환경에 즉시 배포됩니다. 고객이 브라우저에서 직접 사용해보고 피드백을 주실 수 있습니다.",
    },
    {
      icon: "figma",
      name: "Figma 디자인 링크 공유",
      detail:
        "디자인 작업 진행 상황을 Figma에서 실시간으로 확인하실 수 있습니다. 코멘트로 피드백을 남기시면 바로 반영됩니다.",
    },
    {
      icon: "report",
      name: "주간 진행 보고",
      detail:
        "매주 진행 사항, 완료된 기능, 다음 주 계획을 정리해서 공유합니다. 이슈나 지연이 있다면 즉시 알립니다.",
    },
    {
      icon: "ci",
      name: "CI/CD 배포 알림",
      detail:
        "빌드·배포가 자동으로 진행될 때마다 알림을 드립니다. 어떤 기능이 언제 배포됐는지 실시간으로 확인 가능합니다.",
    },
    {
      icon: "ai",
      name: "AI 코드 리뷰 결과 공유",
      detail:
        "AI가 코드 품질을 자동 검수한 결과를 PR에 게시합니다. 보안 이슈, 성능 문제, 버그를 개발 단계에서 조기에 발견·수정합니다.",
    },
  ],
};
