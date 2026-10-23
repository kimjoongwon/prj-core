// 판매 강조 — 자사 AI 에셋 자동화 파이프라인 (아이콘·배너·스플래시 자동 생성)
// 실제 파이프라인: 스타일 분석 → LoRA 학습 → ComfyUI 배치 생성 → Android·iOS 규격 변형
export type AssetSellingPointIcon = "batch" | "styleLock" | "fastIteration" | "designerFocus";

export interface AssetSellingPoint {
	icon: AssetSellingPointIcon;
	name: string;
	detail: string;
}

export interface AssetPipelineStage {
	stepOrder: number;
	name: string;
	detail: string;
}

export const assetAutomationFramework = {
	badge: "자사 파이프라인 · 도구 선택과 무관하게 적용",
	title: "AI 에셋 자동화 프레임워크",
	headline:
		"아이콘·배너·스플래시처럼 같은 스타일로 여러 장 찍어내야 하는 반복 에셋을 AI 생성 파이프라인이 자동 생산합니다.",
	description:
		"브랜드 스타일을 학습시킨 ComfyUI 워크플로우로 서비스 아이콘 세트부터 앱 스플래시·배너까지 일괄 생성합니다. 아래 화면은 실제 운용 중인 생성 대기열로, 완성된 아이콘과 앱 이미지가 순서대로 쌓이는 모습입니다.",
	sellingPoints: [
		{
			icon: "batch",
			name: "수십 장 배치 생산",
			detail:
				"모티프와 색만 바꾸면 구도·질감이 유지된 시리즈가 한 번에 수십 장 생성됩니다. Android·iOS 전 해상도 변형도 자동입니다.",
		},
		{
			icon: "styleLock",
			name: "브랜드 스타일 고정",
			detail:
				"기존 브랜드·레퍼런스에서 색·형태·질감 규칙을 추출해 학습(LoRA)하므로 장 수가 늘어나도 톤이 흔들리지 않습니다.",
		},
		{
			icon: "fastIteration",
			name: "수정 요청에 당일 대응",
			detail:
				"'아이콘 하나만 더 추가해주세요' 같은 요청에 디자이너 일정과 무관하게 당일 후보를 뽑고, 같은 설정은 같은 결과로 재현됩니다.",
		},
		{
			icon: "designerFocus",
			name: "디자이너는 핵심에 집중",
			detail:
				"반복 에셋은 파이프라인이 맡고 디자이너는 시안·UX 같은 핵심 작업에 집중합니다. 전체 일정이 그만큼 짧아집니다.",
		},
	] satisfies AssetSellingPoint[],
	pipelineStages: [
		{
			stepOrder: 1,
			name: "스타일 분석",
			detail: "브랜드·레퍼런스에서 색·형태·질감 규칙 정의",
		},
		{
			stepOrder: 2,
			name: "스타일 학습",
			detail: "규칙을 모델에 학습(LoRA)해 스타일 고정",
		},
		{
			stepOrder: 3,
			name: "배치 생성",
			detail: "모티프·색 조합으로 후보 시리즈 대량 생성",
		},
		{
			stepOrder: 4,
			name: "규격 변형",
			detail: "Android·iOS 저장 규격으로 자동 내보내기",
		},
	] satisfies AssetPipelineStage[],
	deliverables: [
		"앱 아이콘",
		"서비스 아이콘 세트",
		"배너",
		"스플래시 화면",
		"앱스토어 스크린샷 이미지",
		"Android·iOS 전 규격",
	],
	screenshot: {
		src: "/asset-automation/comfyui-asset-workflow.png",
		width: 2782,
		height: 2000,
		alt: "ComfyUI 에셋 자동화 파이프라인 실행 화면 — 노드로 구성된 생성 워크플로우와, 완성된 서비스 아이콘·앱 스플래시 이미지가 쌓이는 생성 대기열",
		caption: "실제 운용 화면 — 대기열에 서비스 아이콘 6종과 앱 스플래시·메인 이미지가 자동 생성되는 중",
	},
} as const;
