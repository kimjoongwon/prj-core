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
        "JS 생태계 활용 — npm 라이브러리 방대하고 성숙도 높음",
        "토스·인스타그램 등 대규모 서비스 검증",
        "마이크로 프론트엔드 아키텍처 가능 (토스 사례)",
      ],
      cons: [
        "네이티브 모듈 필요 시 Swift/Kotlin 지식 요구",
        "New Architecture 전환기 — 일부 라이브러리 호환성 확인 필요",
      ],
      costRange: "개발 비용 동일",
      bestFor: "빠른 MVP + 웹 동시 개발 + 장기 확장",
      monthlyCost: 0,
    },
    {
      id: "flutter",
      name: "Flutter",
      vendor: "Google",
      tagline: "Dart 언어로 자체 렌더링 엔진 기반 UI",
      pros: [
        "자체 엔진(Skia)으로 일관된 UI — 플랫폼별 렌더링 차이 없음",
        "성능 우수 — 게임·애니메이션에 강함",
        "디자인 자유도 높음 (Material/Cupertino 위젯 내장)",
        "Google 전략 투자 — 장기 지원 안정",
      ],
      cons: [
        "Dart 개발자 구하기 어려움",
        "Shorebird(OTA)는 초기 단계 — 규모 커지면 배포 속도 느림",
        "모놀리식 아키텍처 — 마이크로 프론트엔드 구성 어려움",
      ],
      costRange: "개발 비용 동일",
      bestFor: "디자인 일관성 + 고성능 + 중소 규모",
      monthlyCost: 0,
    },
  ],
  comparison: [
    { label: "언어", values: { "react-native": "JavaScript / TypeScript", flutter: "Dart" } },
    { label: "개발 속도", values: { "react-native": "빠름 (웹 개발 지식 + npm 생태계)", flutter: "빠름 (위젯 조립식)" } },
    { label: "인력 채용", values: { "react-native": "매우 쉬움 (JS 개발자 많음)", flutter: "어려움 (Dart 경험자 드묾)" } },
    { label: "웹과 코드 공유", values: { "react-native": "높음 (React와 로직·타입 공유)", flutter: "낮음 (별도 웹 필요)" } },
    { label: "긴급 수정 (OTA)", values: { "react-native": "Code Push — 검증된 솔루션", flutter: "Shorebird — 초기 단계" } },
    { label: "라이브러리 성숙도", values: { "react-native": "npm 생태계, 오래 검증됨", flutter: "pub.dev, 상대적으로 젊음" } },
    { label: "디자인 일관성", values: { "react-native": "디자인 라이브러리로 통일 가능", flutter: "자체 엔진으로 기본 일관됨" } },
    { label: "대규모 확장", values: { "react-native": "마이크로 프론트엔드 가능 (토스)", flutter: "모놀리식 — 팀 병렬 개발 어려움" } },
    { label: "성능", values: { "react-native": "일반 앱 충분 (New Architecture 개선 중)", flutter: "게임·3D 우위 (AOT 컴파일)" } },
    { label: "한국 환경", values: { "react-native": "카카오·PG 등 지원 성숙", flutter: "지원 수준 비슷해지는 중" } },
  ],
  recommendations: [
    { scenario: "웹사이트도 함께 만든다", pick: "react-native", reason: "같은 언어·생태계로 웹+앱 → 비용 절감" },
    { scenario: "빠른 출시로 시장 검증", pick: "react-native", reason: "웹 개발자 투입 + npm 라이브러리 성숙 + Code Push" },
    { scenario: "나중에 팀이 커진다 (5명+)", pick: "react-native", reason: "마이크로 프론트엔드로 병렬 개발 가능 (토스 사례)" },
    { scenario: "게임·3D·복잡한 애니메이션", pick: "flutter", reason: "자체 엔진으로 성능 확실한 우위" },
    { scenario: "디자인 시스템 직접 구축", pick: "flutter", reason: "Material/Cupertino 위젯으로 커스텀 UI 자유로움" },
  ],
};
