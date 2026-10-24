import { GalleryExample, GallerySection } from "../GallerySection";

const semanticShadowExamples = [
	{
		utilityClassName: "shadow-surface",
		tokenVariable: "--surface-shadow",
		label: "표면(surface)",
		description: "카드·패널의 기본 입체감",
	},
	{
		utilityClassName: "shadow-overlay",
		tokenVariable: "--overlay-shadow",
		label: "플로팅(overlay)",
		description: "드롭다운·모달·툴팁의 입체감",
	},
	{
		utilityClassName: "shadow-field",
		tokenVariable: "--field-shadow",
		label: "입력 필드(field)",
		description: "입력 컨트롤의 기본 입체감",
	},
] as const;

const shadowScaleUtilities = [
	"shadow-sm",
	"shadow-md",
	"shadow-lg",
	"shadow-xl",
] as const;

export default function ShadowSection() {
	return (
		<GallerySection
			id="shadows"
			title="입체·그림자"
			description="시맨틱 그림자 토큰과 Tailwind 그림자 스케일입니다. 패널의 그림자 토큰(강도 프리셋·개별 값)을 바꾸면 시맨틱 그림자가 실시간으로 변합니다."
		>
			<GalleryExample
				label="시맨틱 그림자 토큰"
				className="grid gap-4 sm:grid-cols-3"
			>
				{semanticShadowExamples.map((example) => (
					<div
						key={example.utilityClassName}
						className={`rounded-xl border border-border bg-surface p-5 ${example.utilityClassName}`}
					>
						<p className="text-sm font-medium">{example.label}</p>
						<p className="mt-1 text-xs text-muted">{example.description}</p>
						<p className="mt-3 font-mono text-[11px] text-muted">
							{example.tokenVariable}
						</p>
					</div>
				))}
			</GalleryExample>
			<GalleryExample
				label="Tailwind 그림자 스케일"
				className="grid grid-cols-2 gap-4 sm:grid-cols-4"
			>
				{shadowScaleUtilities.map((utilityClassName) => (
					<div
						key={utilityClassName}
						className={`flex h-20 items-center justify-center rounded-xl border border-border bg-surface ${utilityClassName}`}
					>
						<span className="font-mono text-xs text-muted">
							{utilityClassName}
						</span>
					</div>
				))}
			</GalleryExample>
		</GallerySection>
	);
}
