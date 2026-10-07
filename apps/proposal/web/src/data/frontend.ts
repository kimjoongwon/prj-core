import type { StepData } from "./types";

export const frontendStep: StepData = {
  id: "frontend",
  title: "모바일 앱 프레임워크",
  description: "iOS와 Android 앱을 하나의 코드로 만드는 기술을 선택해주세요.",
  options: [
    {
      id: "react-native",
      name: "React Native",
      vendor: "Meta (Facebook)",
      tagline: "JavaScript/TypeScript로 네이티브 앱 개발",
      pros: [
        "웹(React)과 같은 언어 — 개발자 1명이 웹+앱 모두 가능",
        "Code Push로 심사 없이 긴급 수정 가능",
        "카카오 로그인·PG 등 한국 특화 SDK 지원 우수",
      ],
      cons: ["네이티브 모듈 필요 시 Swift/Kotlin 지식 요구", "iOS/Android 화면이 각각 다르게 보임"],
      costRange: "개발 비용 동일",
      bestFor: "빠른 MVP + 웹 동시 개발",
      monthlyCost: 0,
    },
    {
      id: "flutter",
      name: "Flutter",
      vendor: "Google",
      tagline: "Dart 언어로 픽셀 단위 디자인 제어",
      pros: [
        "iOS/Android 화면이 100% 동일",
        "성능 우수 — 게임·애니메이션에 강함",
        "디자인 자유도 최대 (커스텀 UI)",
      ],
      cons: ["Dart 개발자 구하기 어려움", "Code Push 미지원 (긴급 수정 시 심사 필요)"],
      costRange: "개발 비용 동일",
      bestFor: "디자인 일관성 + 고성능",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "언어", values: { "react-native": "JavaScript / TypeScript", flutter: "Dart" } },
    { label: "개발 속도", values: { "react-native": "빠름 (웹 개발 지식 재사용)", flutter: "빠름 (위젯 조립식)" } },
    { label: "인력 채용", values: { "react-native": "매우 쉬움 (JS 개발자 많음)", flutter: "어려움 (Dart 경험자 드묾)" } },
    { label: "웹과 코드 공유", values: { "react-native": "높음 (React와 로직·타입 공유)", flutter: "낮음 (별도 웹 필요)" } },
    { label: "긴급 수정", values: { "react-native": "심사 없이 즉시 배포 (Code Push)", flutter: "App Store 심사 필요 (1~3일)" } },
    { label: "한국 SDK", values: { "react-native": "카카오·PG 우선 지원", flutter: "지원하지만 일부 직접 구현" } },
    { label: "디자인 일관성", values: { "react-native": "각 OS 관례 따름", flutter: "두 OS 완전 동일" } },
    { label: "성능", values: { "react-native": "일반 앱 충분", flutter: "게임·3D 우위" } },
  ],
  recommendations: [
    { scenario: "웹사이트도 함께 만든다", pick: "react-native", reason: "같은 코드로 웹+앱 → 전체 비용 절감" },
    { scenario: "카카오 로그인 필수", pick: "react-native", reason: "한국 특화 SDK 지원 성숙" },
    { scenario: "iOS/Android 동일 디자인", pick: "flutter", reason: "픽셀 단위로 두 OS가 똑같이 보임" },
    { scenario: "게임·3D·복잡한 애니메이션", pick: "flutter", reason: "성능 확실한 우위" },
    { scenario: "빠른 출시로 시장 검증", pick: "react-native", reason: "웹 개발자 투입 + 긴급 수정 빠름" },
  ],
};
