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
	| "border"
	| "success"
	| "warning"
	| "danger";

export type ToneMannerShapeTokenKey = "radius";

export type ToneMannerTokenKey =
	| ToneMannerColorTokenKey
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

export interface ToneMannerShapeTokenDefinition {
	key: ToneMannerShapeTokenKey;
	cssVariable: string;
	label: string;
	description: string;
	/** HeroUI 기본 --radius(0.5rem)를 픽셀로 환산한 값 */
	defaultPixels: number;
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

export const toneMannerShapeTokenDefinition: ToneMannerShapeTokenDefinition = {
	key: "radius",
	cssVariable: "--radius",
	label: "모서리 반경",
	description:
		"버튼·칩의 기준 반경입니다. 입력 필드(--field-radius)는 이 값의 1.5배로 파생됩니다.",
	defaultPixels: 8,
};

export interface ToneMannerPreset {
	id: string;
	label: string;
	description: string;
	light: ToneMannerTokenValues;
	dark: ToneMannerTokenValues;
}

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
			border: "#e9e0d3",
		},
		dark: {
			accent: "#fb923c",
			accentForeground: "#1c1208",
			background: "#17120d",
			surface: "#211a12",
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
			border: "#dce8de",
		},
		dark: {
			accent: "#4ade80",
			accentForeground: "#0c1a10",
			background: "#0f1510",
			surface: "#151d16",
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
			border: "#e6e2f0",
		},
		dark: {
			accent: "#a78bfa",
			accentForeground: "#170f2a",
			background: "#131118",
			surface: "#1a1622",
			border: "#2c2740",
		},
	},
	{
		id: "soft-round",
		label: "소프트 라운드",
		description: "인디고 액센트와 넉넉한 모서리 반경입니다.",
		light: { accent: "#6366f1", accentForeground: "#ffffff", radius: "1rem" },
		dark: { accent: "#818cf8", accentForeground: "#10102e", radius: "1rem" },
	},
	{
		id: "sharp-ink",
		label: "샤프 잉크",
		description: "잉크 블랙 액센트와 각진 모서리입니다.",
		light: {
			accent: "#18181b",
			accentForeground: "#ffffff",
			border: "#d4d4d8",
			radius: "0.125rem",
		},
		dark: {
			accent: "#fafafa",
			accentForeground: "#18181b",
			border: "#3f3f46",
			radius: "0.125rem",
		},
	},
];

const toneMannerTokenCssVariables: Record<ToneMannerTokenKey, string> = {
	accent: "--accent",
	accentForeground: "--accent-foreground",
	background: "--background",
	surface: "--surface",
	border: "--border",
	success: "--success",
	warning: "--warning",
	danger: "--danger",
	radius: "--radius",
};

const toneMannerColorTokenKeys: ToneMannerColorTokenKey[] =
	toneMannerColorTokenDefinitions.map((definition) => definition.key);

const toneMannerTokenOrder: ToneMannerTokenKey[] = [
	...toneMannerColorTokenKeys,
	toneMannerShapeTokenDefinition.key,
];

export function isValidToneMannerHexColor(value: string): boolean {
	return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

export function convertRadiusPixelsToRemToken(pixels: number): string {
	return `${Number((pixels / 16).toFixed(4))}rem`;
}

export function convertRemTokenToRadiusPixels(
	remToken: string | undefined,
): number {
	if (!remToken) {
		return toneMannerShapeTokenDefinition.defaultPixels;
	}
	const remValue = Number.parseFloat(remToken);
	if (!Number.isFinite(remValue)) {
		return toneMannerShapeTokenDefinition.defaultPixels;
	}
	return Math.round(remValue * 16);
}

export function findToneMannerPreset(
	presetId: string,
): ToneMannerPreset | undefined {
	return toneMannerPresets.find((preset) => preset.id === presetId);
}

/**
 * 오버라이드한 토큰만 :root/.dark 선언 블록으로 직렬화합니다.
 * 유효하지 않은 색상 값은 건너뛰고, 오버라이드가 없으면 빈 문자열을 반환합니다.
 */
export function buildToneMannerCssText(overridesByMode: {
	light: ToneMannerTokenValues;
	dark: ToneMannerTokenValues;
}): string {
	const cssBlocks = (["light", "dark"] as ToneMannerMode[])
		.map((mode) => {
			const selector = mode === "light" ? ":root" : ".dark";
			const declarations = toneMannerTokenOrder
				.flatMap((tokenKey) => {
					const tokenValue = overridesByMode[mode][tokenKey];
					if (!tokenValue) {
						return [];
					}
					const isColorToken =
						toneMannerColorTokenKeys.includes(
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
