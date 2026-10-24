"use client";

import { Button, Typography, useDesignSystemTheme } from "@cocrepo/ui";
import { RotateCcw } from "lucide-react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import {
	buildToneMannerCssText,
	convertPixelTokenToPixels,
	convertPixelsToRemToken,
	convertRemTokenToPixels,
	findToneMannerPreset,
	isValidToneMannerHexColor,
	toneMannerColorTokenDefinitions,
	toneMannerPresets,
	toneMannerShadowStrengths,
	toneMannerShadowTokenDefinitions,
	toneMannerShapeTokenDefinitions,
	type ToneMannerColorTokenKey,
	type ToneMannerMode,
	type ToneMannerShadowTokenKey,
	type ToneMannerTokenKey,
	type ToneMannerTokenValues,
} from "@/data/tone-manners";

const toneMannerModeLabels: Record<ToneMannerMode, string> = {
	light: "라이트",
	dark: "다크",
};

const toneMannerShadowTokenKeys = toneMannerShadowTokenDefinitions.map(
	(definition) => definition.key,
);

const toneMannerShadowPreviewClasses: Record<
	ToneMannerShadowTokenKey,
	string
> = {
	surfaceShadow: "shadow-surface",
	overlayShadow: "shadow-overlay",
	fieldShadow: "shadow-field",
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
		setTokenValue(
			mode: ToneMannerMode,
			tokenKey: ToneMannerColorTokenKey | ToneMannerShadowTokenKey,
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
		applyShadowStrength(mode: ToneMannerMode, strengthId: string) {
			const strength = toneMannerShadowStrengths.find(
				(candidate) => candidate.id === strengthId,
			);
			if (!strength) {
				return;
			}
			const modeValues = state.getModeValues(mode);
			for (const shadowTokenKey of toneMannerShadowTokenKeys) {
				const strengthValue = strength.values[shadowTokenKey];
				if (strengthValue === undefined) {
					delete modeValues[shadowTokenKey];
				} else {
					modeValues[shadowTokenKey] = strengthValue;
				}
			}
		},
		setShapeTokenPixels(
			mode: ToneMannerMode,
			tokenKey: "radius" | "borderWidth" | "spacing",
			pixels: number,
		) {
			const modeValues = state.getModeValues(mode);
			// --border-width는 픽셀 리터럴, 나머지는 rem으로 저장합니다.
			modeValues[tokenKey] =
				tokenKey === "borderWidth"
					? `${pixels}px`
					: convertPixelsToRemToken(pixels);
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
		/** 현재 그림자 3종 값과 일치하는 강도 프리셋 id. 커스텀 값이면 "custom"입니다. */
		getActiveShadowStrengthId(mode: ToneMannerMode): string {
			const modeValues = state.getModeValues(mode);
			for (const strength of toneMannerShadowStrengths) {
				const isMatch = toneMannerShadowTokenKeys.every((shadowTokenKey) => {
					const currentValue = modeValues[shadowTokenKey];
					const strengthValue = strength.values[shadowTokenKey];
					return (currentValue ?? undefined) === strengthValue;
				});
				if (isMatch) {
					return strength.id;
				}
			}
			return "custom";
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

export interface ToneMannerPanelProps {
	toneMannerState: ToneMannerPanelState;
}

export const ToneMannerPanel = observer(function ToneMannerPanel({
	toneMannerState,
}: ToneMannerPanelProps) {
	const { resolvedTheme, setTheme } = useDesignSystemTheme();
	const activeMode: ToneMannerMode = resolvedTheme === "dark" ? "dark" : "light";
	const activeValues =
		activeMode === "light"
			? toneMannerState.lightValues
			: toneMannerState.darkValues;
	const cssText = toneMannerState.cssText;
	const activeShadowStrengthId = toneMannerState.getActiveShadowStrengthId(
		activeMode,
	);
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
		<div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 text-surface-foreground shadow-surface">
			<div>
				<Typography.Heading level={3} weight="semibold">
					톤앤매너 토큰
				</Typography.Heading>
				<Typography.Paragraph color="muted" size="sm" className="mt-1">
					색상·그림자·모양 토큰을 바꾸면 이 페이지 전체에 즉시 반영됩니다.
				</Typography.Paragraph>
			</div>

			<fieldset className="flex flex-col gap-2.5">
				<legend className="text-sm font-semibold text-muted">
					라이브 토큰 미리보기
				</legend>
				<div className="grid grid-cols-4 gap-2">
					{toneMannerColorTokenDefinitions.map((tokenDefinition) => (
						<div key={tokenDefinition.key} className="flex flex-col gap-1.5">
							<span
								className="h-10 w-full rounded-lg border border-border"
								style={{
									backgroundColor: `var(${tokenDefinition.cssVariable})`,
								}}
							/>
							<span className="text-center text-[11px] text-muted">
								{tokenDefinition.label}
							</span>
						</div>
					))}
				</div>
				<div className="grid grid-cols-3 gap-2">
					{toneMannerShadowTokenDefinitions.map((tokenDefinition) => (
						<div key={tokenDefinition.key} className="flex flex-col gap-1.5">
							<span
								className={`h-10 w-full rounded-lg border border-border bg-surface ${toneMannerShadowPreviewClasses[tokenDefinition.key]}`}
								title={tokenDefinition.label}
							/>
							<span className="text-center text-[11px] text-muted">
								{tokenDefinition.label}
							</span>
						</div>
					))}
				</div>
				<div className="flex items-center gap-3 pt-1">
					<span
						className="size-10 border-(--border) bg-accent"
						style={{
							borderWidth: "var(--border-width)",
							borderStyle: "solid",
							borderRadius: "var(--radius)",
						}}
					/>
					<span
						className="size-10 border-(--border) bg-surface"
						style={{ borderRadius: "var(--field-radius)" }}
					/>
					<span className="flex flex-col gap-1">
						<span className="h-2 w-10 rounded-full bg-accent" />
						<span className="h-2 w-10 rounded-full bg-default" />
					</span>
					<span className="text-[11px] leading-4 text-muted">
						반경 · 필드 반경 · 테두리 두께 · 간격 밀도
					</span>
				</div>
			</fieldset>

			<fieldset className="flex flex-col gap-2.5">
				<legend className="text-sm font-semibold text-muted">프리셋</legend>
				<div className="flex flex-wrap gap-2">
					{toneMannerPresets.map((preset) => (
						<Button
							key={preset.id}
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

			<fieldset className="flex flex-col gap-2.5">
				<legend className="text-sm font-semibold text-muted">모드</legend>
				<div className="grid grid-cols-2 gap-2">
					{(Object.keys(toneMannerModeLabels) as ToneMannerMode[]).map(
						(mode) => (
							<Button
								key={mode}
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

			<fieldset className="flex flex-col gap-3">
				<legend className="text-sm font-semibold text-muted">색상 토큰</legend>
				{toneMannerColorTokenDefinitions.map((tokenDefinition) => {
					const tokenValue = activeValues[tokenDefinition.key];
					const isUsableColorValue = tokenValue
						? isValidToneMannerHexColor(tokenValue)
						: false;
					return (
						<div
							key={tokenDefinition.key}
							className="flex items-center gap-3"
							title={tokenDefinition.description}
						>
							<input
								type="color"
								aria-label={`${tokenDefinition.label} 색상 선택`}
								value={
									isUsableColorValue ? tokenValue : tokenDefinition.fallbackColor
								}
								onChange={(event) =>
									toneMannerState.setTokenValue(
										activeMode,
										tokenDefinition.key,
										event.target.value,
									)
								}
								className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-1"
							/>
							<div className="min-w-0 flex-1">
								<p className="text-sm font-medium">{tokenDefinition.label}</p>
								<p className="font-mono text-[11px] text-muted">
									{tokenDefinition.cssVariable}
								</p>
							</div>
							<input
								type="text"
								value={tokenValue ?? ""}
								placeholder={tokenDefinition.fallbackColor}
								spellCheck={false}
								onChange={(event) =>
									toneMannerState.setTokenValue(
										activeMode,
										tokenDefinition.key,
										event.target.value,
									)
								}
								className="w-24 shrink-0 rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
							/>
							<Button
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
								<RotateCcw className="size-4" aria-hidden />
							</Button>
						</div>
					);
				})}
			</fieldset>

			<fieldset className="flex flex-col gap-3">
				<legend className="text-sm font-semibold text-muted">그림자 토큰</legend>
				<div className="flex flex-wrap gap-2">
					{toneMannerShadowStrengths.map((strength) => (
						<Button
							key={strength.id}
							variant={
								activeShadowStrengthId === strength.id
									? "primary"
									: "outline"
							}
							aria-pressed={activeShadowStrengthId === strength.id}
							onPress={() =>
								toneMannerState.applyShadowStrength(activeMode, strength.id)
							}
						>
							{strength.label}
						</Button>
					))}
					{activeShadowStrengthId === "custom" ? (
						<span className="self-center text-xs text-muted">커스텀</span>
					) : null}
				</div>
				{toneMannerShadowTokenDefinitions.map((tokenDefinition) => {
					const tokenValue = activeValues[tokenDefinition.key];
					return (
						<div
							key={tokenDefinition.key}
							className="flex flex-col gap-1"
							title={tokenDefinition.description}
						>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									{tokenDefinition.label}
								</span>
								<Button
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
									<RotateCcw className="size-4" aria-hidden />
								</Button>
							</div>
							<span className="font-mono text-[11px] text-muted">
								{tokenDefinition.cssVariable}
							</span>
							<input
								type="text"
								value={tokenValue ?? ""}
								placeholder={tokenDefinition.fallbackValue}
								spellCheck={false}
								onChange={(event) =>
									toneMannerState.setTokenValue(
										activeMode,
										tokenDefinition.key,
										event.target.value,
									)
								}
								className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent"
							/>
						</div>
					);
				})}
			</fieldset>

			<fieldset className="flex flex-col gap-4">
				<legend className="text-sm font-semibold text-muted">모양 토큰</legend>
				{toneMannerShapeTokenDefinitions.map((tokenDefinition) => {
					const activePixels =
						tokenDefinition.key === "borderWidth"
							? convertPixelTokenToPixels(
									activeValues.borderWidth,
									tokenDefinition.defaultPixels,
								)
							: convertRemTokenToPixels(
									activeValues[tokenDefinition.key],
									tokenDefinition.defaultPixels,
								);
					const tokenValue = activeValues[tokenDefinition.key];
					return (
						<div key={tokenDefinition.key} className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									{tokenDefinition.label}
								</span>
								<span className="flex items-center gap-2">
									<span className="font-mono text-xs text-muted">
										{activePixels}px
										{tokenDefinition.key === "radius"
											? ` · 필드 ${Math.round(activePixels * 1.5)}px`
											: ""}
									</span>
									<Button
										variant="ghost"
										isIconOnly
										size="sm"
										aria-label={`${tokenDefinition.label} 기본값으로 되돌리기`}
										isDisabled={!tokenValue}
										onPress={() =>
											toneMannerState.resetTokenValue(
												activeMode,
												tokenDefinition.key,
											)
										}
									>
										<RotateCcw className="size-4" aria-hidden />
									</Button>
								</span>
							</div>
							<input
								type="range"
								min={tokenDefinition.minPixels}
								max={tokenDefinition.maxPixels}
								step={tokenDefinition.stepPixels}
								value={activePixels}
								aria-label={`${tokenDefinition.label} 픽셀 값`}
								onChange={(event) =>
									toneMannerState.setShapeTokenPixels(
										activeMode,
										tokenDefinition.key,
										Number(event.target.value),
									)
								}
								className="h-5 min-w-0 flex-1 accent-(--accent)"
							/>
							<Typography.Paragraph color="muted" size="sm">
								{tokenDefinition.description}
							</Typography.Paragraph>
						</div>
					);
				})}
			</fieldset>

			<fieldset className="flex flex-col gap-2.5">
				<legend className="text-sm font-semibold text-muted">
					내보내기 CSS
				</legend>
				<div className="flex justify-end gap-2">
					<Button
						variant="ghost"
						isDisabled={!toneMannerState.hasAnyOverride}
						onPress={() => toneMannerState.resetAllTokens()}
					>
						초기화
					</Button>
					<Button
						variant="outline"
						isDisabled={!cssText}
						onPress={() => void copyCssTextToClipboard()}
					>
						{toneMannerState.isCssCopied ? "복사됨" : "복사"}
					</Button>
				</div>
				<pre className="max-h-60 overflow-auto rounded-lg bg-default p-3 font-mono text-xs leading-5 whitespace-pre-wrap">
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
