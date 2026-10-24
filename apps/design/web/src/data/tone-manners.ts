/**
 * UI 키트 페이지의 톤앤매너 토큰 정의와 프리셋입니다.
 *
 * 토큰 이름과 역할은 @heroui/styles 기본 테마(variables.css)와 저장소 루트
 * DESIGN.md의 색상 역할 어휘를 따릅니다. 정의하지 않은 토큰은 HeroUI
 * 기본값을 그대로 사용하고, 오버라이드한 토큰만 :root/.dark 블록으로
 * 내보냅니다(admin-web globals.css의 --accent 오버라이드와 같은 계약).
 */

export type ToneMannerColorTokenKey =
	| "accent"
	| "accentForeground"
	| "background"
	| "surface"
	| "surfaceSecondary"
	| "muted"
	| "overlay"
	| "border"
	| "success"
	| "warning"
	| "danger";

export type ToneMannerShadowTokenKey =
	| "surfaceShadow"
	| "overlayShadow"
	| "fieldShadow";

export type ToneMannerShapeTokenKey = "radius" | "borderWidth" | "spacing";

export type ToneMannerTokenKey =
	| ToneMannerColorTokenKey
	| ToneMannerShadowTokenKey
	| ToneMannerShapeTokenKey;

export type ToneMannerMode = "light" | "dark";

/** 한 모드에서 오버라이드한 토큰 값입니다. 없는 키는 HeroUI 기본값을 따릅니다. */
export type ToneMannerTokenValues = Partial<Record<ToneMannerTokenKey, string>>;

export interface ToneMannerColorTokenDefinition {
	key: ToneMannerColorTokenKey;
	cssVariable: string;
	label: string;
	description: string;
	/** 오버라이드 전 색상 선택기에 표시할 HeroUI light 기본 근사값 */
	fallbackColor: string;
}

export interface ToneMannerShadowTokenDefinition {
	key: ToneMannerShadowTokenKey;
	cssVariable: string;
	label: string;
	description: string;
	/** 오버라이드 전 입력칸에 표시할 HeroUI light 기본값 */
	fallbackValue: string;
}

export interface ToneMannerShapeTokenDefinition {
	key: ToneMannerShapeTokenKey;
	cssVariable: string;
	label: string;
	description: string;
	/** HeroUI light 기본값을 픽셀로 환산한 값 */
	defaultPixels: number;
	/** 슬라이더 범위와 단계 */
	minPixels: number;
	maxPixels: number;
	stepPixels: number;
}

export const toneMannerColorTokenDefinitions: ToneMannerColorTokenDefinition[] =
	[
		{
			key: "accent",
			cssVariable: "--accent",
			label: "액센트",
			description: "주요 액션과 강조에 쓰이는 대표 색상",
			fallbackColor: "#3d7bfd",
		},
		{
			key: "accentForeground",
			cssVariable: "--accent-foreground",
			label: "액센트 글자색",
			description: "액센트 배경 위에 놓이는 텍스트 색상",
			fallbackColor: "#ffffff",
		},
		{
			key: "background",
			cssVariable: "--background",
			label: "배경",
			description: "화면 가장 뒤의 기본 배경",
			fallbackColor: "#f4f4f5",
		},
		{
			key: "surface",
			cssVariable: "--surface",
			label: "표면",
			description: "카드·패널 같은 콘텐츠 표면",
			fallbackColor: "#ffffff",
		},
		{
			key: "surfaceSecondary",
			cssVariable: "--surface-secondary",
			label: "중첩 표면",
			description: "표면 안에 중첩되는 두 번째 표면",
			fallbackColor: "#ededf0",
		},
		{
			key: "muted",
			cssVariable: "--muted",
			label: "보조 글자색",
			description: "설명문·플레이스홀더 같은 보조 텍스트 색상",
			fallbackColor: "#6b7280",
		},
		{
			key: "overlay",
			cssVariable: "--overlay",
			label: "플로팅 표면",
			description: "드롭다운·모달·툴팁 같은 떠 있는 층의 배경",
			fallbackColor: "#ffffff",
		},
		{
			key: "border",
			cssVariable: "--border",
			label: "테두리",
			description: "경계선과 구분선",
			fallbackColor: "#e4e4e7",
		},
		{
			key: "success",
			cssVariable: "--success",
			label: "성공",
			description: "성공 상태 색상",
			fallbackColor: "#4ade80",
		},
		{
			key: "warning",
			cssVariable: "--warning",
			label: "주의",
			description: "주의 상태 색상",
			fallbackColor: "#fbbf24",
		},
		{
			key: "danger",
			cssVariable: "--danger",
			label: "위험",
			description: "파괴적 동작과 오류 색상",
			fallbackColor: "#f87171",
		},
	];

const heroUiLightShadowDefaults = {
	surfaceShadow:
		"0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06)",
	overlayShadow:
		"0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 -6px 12px 0 rgba(0, 0, 0, 0.03), 0 14px 28px 0 rgba(0, 0, 0, 0.08)",
	fieldShadow:
		"0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06)",
};

export const toneMannerShadowTokenDefinitions: ToneMannerShadowTokenDefinition[] =
	[
		{
			key: "surfaceShadow",
			cssVariable: "--surface-shadow",
			label: "표면 그림자",
			description: "카드·패널 표면의 입체감",
			fallbackValue: heroUiLightShadowDefaults.surfaceShadow,
		},
		{
			key: "overlayShadow",
			cssVariable: "--overlay-shadow",
			label: "플로팅 그림자",
			description: "드롭다운·모달 같은 떠 있는 층의 입체감",
			fallbackValue: heroUiLightShadowDefaults.overlayShadow,
		},
		{
			key: "fieldShadow",
			cssVariable: "--field-shadow",
			label: "입력 필드 그림자",
			description: "입력 필드의 기본 입체감",
			fallbackValue: heroUiLightShadowDefaults.fieldShadow,
		},
	];

export const toneMannerRadiusTokenDefinition: ToneMannerShapeTokenDefinition = {
	key: "radius",
	cssVariable: "--radius",
	label: "모서리 반경",
	description:
		"버튼·칩의 기준 반경입니다. 입력 필드(--field-radius)는 이 값의 1.5배로 파생됩니다.",
	defaultPixels: 8,
	minPixels: 0,
	maxPixels: 24,
	stepPixels: 1,
};

export const toneMannerBorderWidthTokenDefinition: ToneMannerShapeTokenDefinition =
	{
		key: "borderWidth",
		cssVariable: "--border-width",
		label: "테두리 두께",
		description: "입력·선택 컨트롤의 기본 테두리 두께입니다.",
		defaultPixels: 1,
		minPixels: 0,
		maxPixels: 3,
		stepPixels: 1,
	};

export const toneMannerSpacingTokenDefinition: ToneMannerShapeTokenDefinition = {
	key: "spacing",
	cssVariable: "--spacing",
	label: "간격 밀도",
	description:
		"모든 간격·패딩의 기준 단위입니다. 값을 올리면 화면 전체가 여유롭게 늘어납니다.",
	defaultPixels: 4,
	minPixels: 3,
	maxPixels: 6,
	stepPixels: 0.5,
};

export const toneMannerShapeTokenDefinitions: ToneMannerShapeTokenDefinition[] =
	[
		toneMannerRadiusTokenDefinition,
		toneMannerBorderWidthTokenDefinition,
		toneMannerSpacingTokenDefinition,
	];

/** 그림자 3종을 한 번에 바꾸는 강도 프리셋입니다. "default"는 오버라이드를 해제합니다. */
export interface ToneMannerShadowStrength {
	id: "default" | "none" | "soft" | "strong";
	label: string;
	values: Partial<Record<ToneMannerShadowTokenKey, string>>;
}

export const toneMannerShadowStrengths: ToneMannerShadowStrength[] = [
	{ id: "default", label: "기본", values: {} },
	{
		id: "none",
		label: "없음(플랫)",
		values: {
			surfaceShadow: "0 0 0 0 transparent",
			overlayShadow: "0 0 0 0 transparent",
			fieldShadow: "0 0 0 0 transparent",
		},
	},
	{
		id: "soft",
		label: "부드럽게",
		values: {
			surfaceShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 4px 12px 0 rgba(0, 0, 0, 0.05)",
			overlayShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.08), 0 12px 32px 0 rgba(0, 0, 0, 0.1)",
			fieldShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
		},
	},
	{
		id: "strong",
		label: "진하게",
		values: {
			surfaceShadow:
				"0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 12px 24px 0 rgba(0, 0, 0, 0.1)",
			overlayShadow:
				"0 8px 24px 0 rgba(0, 0, 0, 0.16), 0 24px 48px 0 rgba(0, 0, 0, 0.18)",
			fieldShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.08), 0 0 1px 0 rgba(0, 0, 0, 0.1)",
		},
	},
];

export interface ToneMannerPreset {
	id: string;
	label: string;
	description: string;
	light: ToneMannerTokenValues;
	dark: ToneMannerTokenValues;
}

const softShadowValues = toneMannerShadowStrengths.find(
	(strength) => strength.id === "soft",
)?.values;
const flatShadowValues = toneMannerShadowStrengths.find(
	(strength) => strength.id === "none",
)?.values;

export const toneMannerPresets: ToneMannerPreset[] = [
	{
		id: "hero-default",
		label: "기본",
		description: "HeroUI 기본 토큰을 그대로 사용합니다.",
		light: {},
		dark: {},
	},
	{
		id: "brand-blue",
		label: "브랜드 블루",
		description: "admin-web이 쓰는 브랜드 액센트 조합입니다.",
		light: { accent: "#3182f6", accentForeground: "#ffffff" },
		dark: { accent: "#4593fc", accentForeground: "#ffffff" },
	},
	{
		id: "warm-sand",
		label: "웜 샌드",
		description: "따뜻한 배경과 주황 액센트입니다.",
		light: {
			accent: "#ea580c",
			accentForeground: "#ffffff",
			background: "#faf8f4",
			surface: "#fffdf9",
			surfaceSecondary: "#f5efe6",
			muted: "#8a7d6b",
			border: "#e9e0d3",
		},
		dark: {
			accent: "#fb923c",
			accentForeground: "#1c1208",
			background: "#17120d",
			surface: "#211a12",
			surfaceSecondary: "#2c2317",
			muted: "#a89a86",
			border: "#3c2f22",
		},
	},
	{
		id: "forest-calm",
		label: "포레스트",
		description: "차분한 녹색 액센트와 북톤 배경입니다.",
		light: {
			accent: "#15803d",
			accentForeground: "#ffffff",
			background: "#f5f8f5",
			surface: "#fbfdfb",
			surfaceSecondary: "#eaf1ec",
			muted: "#5f7264",
			border: "#dce8de",
		},
		dark: {
			accent: "#4ade80",
			accentForeground: "#0c1a10",
			background: "#0f1510",
			surface: "#151d16",
			surfaceSecondary: "#1c271d",
			muted: "#93a898",
			border: "#263428",
		},
	},
	{
		id: "violet-dusk",
		label: "바이올렛",
		description: "보라 액센트의 차가운 톤입니다.",
		light: {
			accent: "#7c3aed",
			accentForeground: "#ffffff",
			background: "#f8f7fc",
			surface: "#fdfcff",
			surfaceSecondary: "#f0ecf8",
			muted: "#6f6788",
			border: "#e6e2f0",
		},
		dark: {
			accent: "#a78bfa",
			accentForeground: "#170f2a",
			background: "#131118",
			surface: "#1a1622",
			surfaceSecondary: "#241f31",
			muted: "#9c93b8",
			border: "#2c2740",
		},
	},
	{
		id: "soft-round",
		label: "소프트 라운드",
		description: "인디고 액센트·넉넉한 반경·부드러운 그림자입니다.",
		light: {
			accent: "#6366f1",
			accentForeground: "#ffffff",
			radius: "1rem",
			...(softShadowValues ?? {}),
		},
		dark: {
			accent: "#818cf8",
			accentForeground: "#10102e",
			radius: "1rem",
			...(softShadowValues ?? {}),
		},
	},
	{
		id: "sharp-ink",
		label: "샤프 잉크",
		description: "잉크 블랙 액센트·각진 모서리·그림자 없는 플랫 톤입니다.",
		light: {
			accent: "#18181b",
			accentForeground: "#ffffff",
			border: "#d4d4d8",
			radius: "0.125rem",
			...(flatShadowValues ?? {}),
		},
		dark: {
			accent: "#fafafa",
			accentForeground: "#18181b",
			border: "#3f3f46",
			radius: "0.125rem",
			...(flatShadowValues ?? {}),
		},
	},
];

const toneMannerTokenCssVariables: Record<ToneMannerTokenKey, string> = {
	accent: "--accent",
	accentForeground: "--accent-foreground",
	background: "--background",
	surface: "--surface",
	surfaceSecondary: "--surface-secondary",
	muted: "--muted",
	overlay: "--overlay",
	border: "--border",
	success: "--success",
	warning: "--warning",
	danger: "--danger",
	surfaceShadow: "--surface-shadow",
	overlayShadow: "--overlay-shadow",
	fieldShadow: "--field-shadow",
	radius: "--radius",
	borderWidth: "--border-width",
	spacing: "--spacing",
};

const toneMannerColorTokenKeys: ToneMannerColorTokenKey[] =
	toneMannerColorTokenDefinitions.map((definition) => definition.key);

const toneMannerShadowTokenKeys: ToneMannerShadowTokenKey[] =
	toneMannerShadowTokenDefinitions.map((definition) => definition.key);

const toneMannerTokenOrder: ToneMannerTokenKey[] = [
	...toneMannerColorTokenKeys,
	...toneMannerShadowTokenKeys,
	...toneMannerShapeTokenDefinitions.map((definition) => definition.key),
];

export function isValidToneMannerHexColor(value: string): boolean {
	return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

export function convertPixelsToRemToken(pixels: number): string {
	return `${Number((pixels / 16).toFixed(4))}rem`;
}

export function convertRemTokenToPixels(
	remToken: string | undefined,
	fallbackPixels: number,
): number {
	if (!remToken) {
		return fallbackPixels;
	}
	const remValue = Number.parseFloat(remToken);
	if (!Number.isFinite(remValue)) {
		return fallbackPixels;
	}
	return Math.round(remValue * 16);
}

export function convertPixelTokenToPixels(
	pixelToken: string | undefined,
	fallbackPixels: number,
): number {
	if (!pixelToken) {
		return fallbackPixels;
	}
	const pixelValue = Number.parseFloat(pixelToken);
	if (!Number.isFinite(pixelValue)) {
		return fallbackPixels;
	}
	return Math.round(pixelValue);
}

export function findToneMannerPreset(
	presetId: string,
): ToneMannerPreset | undefined {
	return toneMannerPresets.find((preset) => preset.id === presetId);
}

/**
 * 오버라이드한 토큰만 :root/.dark 선언 블록으로 직렬화합니다.
 * 색상 토큰은 hex가 아니면 건너뛰고, 나머지 토큰은 비지 않은 값만 담습니다.
 */
export function buildToneMannerCssText(overridesByMode: {
	light: ToneMannerTokenValues;
	dark: ToneMannerTokenValues;
}): string {
	const cssBlocks = (["light", "dark"] as ToneMannerMode[])
		.map((mode) => {
			const selector = mode === "light" ? ":root" : ".dark";
			const declarations = toneMannerTokenOrder.flatMap((tokenKey) => {
				const tokenValue = overridesByMode[mode][tokenKey];
				if (!tokenValue) {
					return [];
				}
				const isColorToken = toneMannerColorTokenKeys.includes(
					tokenKey as ToneMannerColorTokenKey,
				);
				if (isColorToken && !isValidToneMannerHexColor(tokenValue)) {
					return [];
				}
				return [
					`\t${toneMannerTokenCssVariables[tokenKey]}: ${tokenValue.trim()};`,
				];
			});
			if (declarations.length === 0) {
				return null;
			}
			return `${selector} {\n${declarations.join("\n")}\n}`;
		})
		.filter((cssBlock): cssBlock is string => cssBlock !== null);
	return cssBlocks.join("\n\n");
}
