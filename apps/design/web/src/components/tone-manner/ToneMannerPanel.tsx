"use client";

import { Button, Typography, useDesignSystemTheme } from "@cocrepo/ui";
import { RotateCcw } from "lucide-react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	buildToneMannerCssText,
	convertRadiusPixelsToRemToken,
	convertRemTokenToRadiusPixels,
	findToneMannerPreset,
	isValidToneMannerHexColor,
	toneMannerColorTokenDefinitions,
	toneMannerPresets,
	toneMannerShapeTokenDefinition,
	type ToneMannerColorTokenKey,
	type ToneMannerMode,
	type ToneMannerTokenKey,
	type ToneMannerTokenValues,
} from "@/data/tone-manners";

const toneMannerModeLabels: Record<ToneMannerMode, string> = {
	light: "라이트",
	dark: "다크",
};

export function createToneMannerPanelState() {
	const state = {
		presetId: toneMannerPresets[0].id,
		lightValues: {} as ToneMannerTokenValues,
		darkValues: {} as ToneMannerTokenValues,
		isCssCopied: false,

		applyPreset(presetId: string) {
			const preset = findToneMannerPreset(presetId);
			if (!preset) {
				return;
			}
			state.presetId = preset.id;
			state.lightValues = { ...preset.light };
			state.darkValues = { ...preset.dark };
		},
		setColorTokenValue(
			mode: ToneMannerMode,
			tokenKey: ToneMannerColorTokenKey,
			value: string,
		) {
			const modeValues = state.getModeValues(mode);
			const trimmedValue = value.trim();
			if (trimmedValue === "") {
				delete modeValues[tokenKey];
				return;
			}
			modeValues[tokenKey] = trimmedValue;
		},
		setRadiusPixels(mode: ToneMannerMode, pixels: number) {
			state.getModeValues(mode).radius = convertRadiusPixelsToRemToken(pixels);
		},
		resetTokenValue(mode: ToneMannerMode, tokenKey: ToneMannerTokenKey) {
			delete state.getModeValues(mode)[tokenKey];
		},
		resetAllTokens() {
			state.presetId = toneMannerPresets[0].id;
			state.lightValues = {};
			state.darkValues = {};
		},
		markCssCopied() {
			state.isCssCopied = true;
			setTimeout(() => {
				runInAction(() => {
					state.isCssCopied = false;
				});
			}, 1600);
		},

		getModeValues(mode: ToneMannerMode): ToneMannerTokenValues {
			return mode === "light" ? state.lightValues : state.darkValues;
		},
		get cssText(): string {
			return buildToneMannerCssText({
				light: state.lightValues,
				dark: state.darkValues,
			});
		},
		get hasAnyOverride(): boolean {
			return (
				Object.keys(state.lightValues).length > 0 ||
				Object.keys(state.darkValues).length > 0
			);
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "ToneMannerPanelState" },
	);
}

export type ToneMannerPanelState = ReturnType<typeof createToneMannerPanelState>;

export const ToneMannerPanel = observer(function ToneMannerPanel() {
	const toneMannerState = useLocalObservable(createToneMannerPanelState);
	const { resolvedTheme, setTheme } = useDesignSystemTheme();
	const activeMode: ToneMannerMode = resolvedTheme === "dark" ? "dark" : "light";
	const activeValues =
		activeMode === "light"
			? toneMannerState.lightValues
			: toneMannerState.darkValues;
	const cssText = toneMannerState.cssText;
	const activeRadiusPixels = convertRemTokenToRadiusPixels(activeValues.radius);
	const activePreset = findToneMannerPreset(toneMannerState.presetId);

	const copyCssTextToClipboard = async () => {
		if (!cssText) {
			return;
		}
		try {
			await navigator.clipboard.writeText(cssText);
			toneMannerState.markCssCopied();
		} catch {
			// 클립보드 권한이 없으면 복사 없이 스니펫 확인만 유지합니다.
		}
	};

	return (
		<div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-4 text-surface-foreground">
			{cssText ? (
				// 오버라이드를 :root/.dark 스코프에 주입해 파생 토큰(-hover 등
				// color-mix)까지 HeroUI 공식과 함께 재계산되게 합니다.
				<style
					href="tone-manner-token-overrides"
					precedence="design-tokens"
				>{cssText}</style>
			) : null}

			<div>
				<Typography.Heading level={3} weight="semibold">
					톤앤매너 토큰
				</Typography.Heading>
				<Typography.Paragraph color="muted" size="sm" className="mt-1">
					토큰을 바꾸면 이 페이지 전체에 즉시 반영됩니다.
				</Typography.Paragraph>
			</div>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-xs font-semibold text-muted">
					라이브 토큰 미리보기
				</legend>
				<div className="grid grid-cols-4 gap-1.5">
					{toneMannerColorTokenDefinitions.map((tokenDefinition) => (
						<div key={tokenDefinition.key} className="flex flex-col gap-1">
							<span
								className="h-8 w-full rounded-md border border-border"
								style={{
									backgroundColor: `var(${tokenDefinition.cssVariable})`,
								}}
							/>
							<span className="text-center text-[10px] text-muted">
								{tokenDefinition.label}
							</span>
						</div>
					))}
				</div>
				<div className="flex items-center gap-2 pt-1">
					<span
						className="size-8 border border-border bg-accent"
						style={{ borderRadius: "var(--radius)" }}
					/>
					<span
						className="size-8 border border-border bg-surface"
						style={{ borderRadius: "var(--field-radius)" }}
					/>
					<span className="text-[10px] text-muted">
						반경(--radius) · 필드(--field-radius)
					</span>
				</div>
			</fieldset>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-xs font-semibold text-muted">프리셋</legend>
				<div className="flex flex-wrap gap-1.5">
					{toneMannerPresets.map((preset) => (
						<Button
							key={preset.id}
							size="sm"
							variant={
								toneMannerState.presetId === preset.id ? "primary" : "outline"
							}
							aria-pressed={toneMannerState.presetId === preset.id}
							onPress={() => toneMannerState.applyPreset(preset.id)}
						>
							{preset.label}
						</Button>
					))}
				</div>
				<Typography.Paragraph color="muted" size="sm">
					{activePreset?.description}
				</Typography.Paragraph>
			</fieldset>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-xs font-semibold text-muted">모드</legend>
				<div className="grid grid-cols-2 gap-1.5">
					{(Object.keys(toneMannerModeLabels) as ToneMannerMode[]).map(
						(mode) => (
							<Button
								key={mode}
								size="sm"
								variant={activeMode === mode ? "primary" : "outline"}
								aria-pressed={activeMode === mode}
								onPress={() => setTheme(mode)}
							>
								{toneMannerModeLabels[mode]}
							</Button>
						),
					)}
				</div>
				<Typography.Paragraph color="muted" size="sm">
					지금 보고 있는 {toneMannerModeLabels[activeMode]} 모드의 토큰을
					편집합니다.
				</Typography.Paragraph>
			</fieldset>

			<fieldset className="flex flex-col gap-2.5">
				<legend className="text-xs font-semibold text-muted">색상 토큰</legend>
				{toneMannerColorTokenDefinitions.map((tokenDefinition) => {
					const tokenValue = activeValues[tokenDefinition.key];
					const isUsableColorValue = tokenValue
						? isValidToneMannerHexColor(tokenValue)
						: false;
					return (
						<div
							key={tokenDefinition.key}
							className="flex items-center gap-2.5"
							title={tokenDefinition.description}
						>
							<input
								type="color"
								aria-label={`${tokenDefinition.label} 색상 선택`}
								value={
									isUsableColorValue ? tokenValue : tokenDefinition.fallbackColor
								}
								onChange={(event) =>
									toneMannerState.setColorTokenValue(
										activeMode,
										tokenDefinition.key,
										event.target.value,
									)
								}
								className="size-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
							/>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium">{tokenDefinition.label}</p>
								<p className="font-mono text-[10px] text-muted">
									{tokenDefinition.cssVariable}
								</p>
							</div>
							<input
								type="text"
								value={tokenValue ?? ""}
								placeholder={tokenDefinition.fallbackColor}
								spellCheck={false}
								onChange={(event) =>
									toneMannerState.setColorTokenValue(
										activeMode,
										tokenDefinition.key,
										event.target.value,
									)
								}
								className="w-[5.5rem] shrink-0 rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent"
							/>
							<Button
								size="sm"
								variant="ghost"
								isIconOnly
								aria-label={`${tokenDefinition.label} 기본값으로 되돌리기`}
								isDisabled={!tokenValue}
								onPress={() =>
									toneMannerState.resetTokenValue(
										activeMode,
										tokenDefinition.key,
									)
								}
							>
								<RotateCcw className="size-3.5" aria-hidden />
							</Button>
						</div>
					);
				})}
			</fieldset>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-xs font-semibold text-muted">모양 토큰</legend>
				<div className="flex items-center gap-2.5">
					<input
						type="range"
						min="0"
						max="24"
						step="1"
						value={activeRadiusPixels}
						aria-label={`${toneMannerShapeTokenDefinition.label} 픽셀 값`}
						onChange={(event) =>
							toneMannerState.setRadiusPixels(
								activeMode,
								Number(event.target.value),
							)
						}
						className="min-w-0 flex-1 accent-(--accent)"
					/>
					<span className="w-[6.5rem] shrink-0 text-right font-mono text-xs">
						{activeRadiusPixels}px · 필드{" "}
						{Math.round(activeRadiusPixels * 1.5)}px
					</span>
				</div>
				<Typography.Paragraph color="muted" size="sm">
					{toneMannerShapeTokenDefinition.description}
				</Typography.Paragraph>
			</fieldset>

			<fieldset className="flex flex-col gap-2">
				<legend className="text-xs font-semibold text-muted">
					내보내기 CSS
				</legend>
				<div className="flex justify-end gap-1.5">
					<Button
						size="sm"
						variant="ghost"
						isDisabled={!toneMannerState.hasAnyOverride}
						onPress={() => toneMannerState.resetAllTokens()}
					>
						초기화
					</Button>
					<Button
						size="sm"
						variant="outline"
						isDisabled={!cssText}
						onPress={() => void copyCssTextToClipboard()}
					>
						{toneMannerState.isCssCopied ? "복사됨" : "복사"}
					</Button>
				</div>
				<pre className="max-h-52 overflow-auto rounded-lg bg-default p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap">
					{cssText ||
						"/* 오버라이드한 토큰이 없습니다. 프리셋을 선택하거나 값을 조정하세요. */"}
				</pre>
				<Typography.Paragraph color="muted" size="sm">
					이 블록을 앱의 globals.css에 붙여넣으면 같은 톤앤매너가 적용됩니다.
				</Typography.Paragraph>
			</fieldset>
		</div>
	);
});
