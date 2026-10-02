"use client";

import type {
	PlanningAuthState,
	PlanningContext,
	PlanningSpaceOption,
} from "@cocrepo/type";
import { requireDecimalId } from "@cocrepo/type";
import { LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "../../../data-display/Chip/Chip";
import { Button } from "../../../input/Button/Button";
import { Select } from "../../../input/Select/Select";

export interface PlanningSessionBarProps {
	context: PlanningContext;
	onSpaceChange?: (space: PlanningSpaceOption) => void;
}

const spaceSelectClassNames = {
	trigger:
		"inline-flex h-11 w-40 shrink-0 flex-nowrap items-center justify-start gap-2 rounded-2xl border border-border bg-surface px-3 text-foreground shadow-sm hover:bg-surface-hover sm:w-52 lg:w-60",
	value: "min-w-0 flex-1 truncate text-left text-sm text-foreground",
	indicator: "h-4 w-4 shrink-0 text-muted",
	popover: "min-w-40 sm:min-w-52 lg:min-w-60",
	listbox: "min-w-40 sm:min-w-52 lg:min-w-60",
};

function getFallbackSpace(
	context: PlanningContext,
): PlanningSpaceOption | null {
	if (!context.tenantId && !context.spaceId && !context.fitnessCenterName) {
		return null;
	}

	return {
		tenantId: context.tenantId ?? requireDecimalId("1", "tenantId"),
		spaceId: context.spaceId ?? requireDecimalId("1", "spaceId"),
		fitnessCenterName:
			context.fitnessCenterName ??
			context.spaceId ??
			"Storybook Fitness Center",
		tenantName: context.tenantName,
	};
}

function getPlanningSpaces(context: PlanningContext): PlanningSpaceOption[] {
	if (context.spaces && context.spaces.length > 0) {
		return [...context.spaces];
	}

	const fallbackSpace = getFallbackSpace(context);
	return fallbackSpace ? [fallbackSpace] : [];
}

function getInitialTenantId(
	context: PlanningContext,
	spaces: readonly PlanningSpaceOption[],
): string | null {
	const selectedByTenant = spaces.find(
		(space) => space.tenantId === context.tenantId,
	);
	const selectedBySpace = spaces.find(
		(space) => space.spaceId === context.spaceId,
	);

	return (
		selectedByTenant?.tenantId ??
		selectedBySpace?.tenantId ??
		spaces[0]?.tenantId ??
		context.tenantId ??
		null
	);
}

function getInitialAuthState(context: PlanningContext): PlanningAuthState {
	return context.authState ?? "authenticated";
}

export function PlanningSessionBar({
	context,
	onSpaceChange,
}: PlanningSessionBarProps) {
	const spaces = useMemo(() => getPlanningSpaces(context), [context]);
	const spaceSignature = spaces
		.map(
			(space) =>
				`${space.tenantId}:${space.spaceId}:${space.fitnessCenterName}`,
		)
		.join("|");
	const [authState, setAuthState] = useState<PlanningAuthState>(() =>
		getInitialAuthState(context),
	);
	const [selectedTenantId, setSelectedTenantId] = useState<string | null>(() =>
		getInitialTenantId(context, spaces),
	);
	const selectedSpace =
		spaces.find((space) => space.tenantId === selectedTenantId) ??
		spaces.find((space) => space.spaceId === context.spaceId) ??
		spaces[0] ??
		null;
	const spaceSelectValue = spaces.some(
		(space) => space.tenantId === selectedTenantId,
	)
		? selectedTenantId
		: null;
	const spaceOptions = spaces.map((space) => ({
		value: space.tenantId,
		label: space.fitnessCenterName,
	}));
	const isAuthenticated = authState === "authenticated";
	const accountName = isAuthenticated
		? (context.account?.name ?? "Storybook 사용자")
		: "로그인 안 됨";
	const accountCaption = isAuthenticated
		? (context.account?.email ??
			context.account?.role ??
			context.role ??
			"Mock session")
		: "이 스토리는 로그아웃 상태를 검토합니다.";
	const roleLabel = context.account?.role ?? context.role ?? "-";

	useEffect(() => {
		setAuthState(getInitialAuthState(context));
	}, [context.authState]);

	useEffect(() => {
		setSelectedTenantId(getInitialTenantId(context, spaces));
	}, [context.tenantId, context.spaceId, spaces, spaceSignature]);

	const handleSpaceSelect = (space: PlanningSpaceOption) => {
		setSelectedTenantId(space.tenantId);
		onSpaceChange?.(space);
	};

	const handleToggleAuthState = () => {
		setAuthState((current) =>
			current === "authenticated" ? "anonymous" : "authenticated",
		);
	};

	return (
		<section
			aria-label="Storybook mock session"
			className="rounded-lg border border-border bg-surface p-4 xl:col-span-2"
		>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-background text-foreground">
						{isAuthenticated ? (
							<UserRound className="h-5 w-5" size={20} />
						) : (
							<LogOut className="h-5 w-5 text-muted" size={20} />
						)}
					</div>
					<div className="grid min-w-0 gap-1">
						<div className="flex flex-wrap items-center gap-2">
							<Chip
								color={isAuthenticated ? "success" : "warning"}
								size="sm"
								variant="soft"
							>
								{isAuthenticated ? "Mock 로그인" : "Mock 로그아웃"}
							</Chip>
							<Chip color="accent" size="sm" variant="tertiary">
								{context.realm}
							</Chip>
							<span className="text-xs font-medium text-muted">
								role {roleLabel}
							</span>
						</div>
						<p className="truncate text-sm font-semibold text-foreground">
							{accountName}
						</p>
						<p className="truncate text-xs text-muted">{accountCaption}</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2">
					<div className="min-w-0">
						<p className="mb-1 text-[11px] font-semibold uppercase text-muted">
							Tenant / Space
						</p>
						<Select
							aria-label="Space 선택"
							value={spaceSelectValue}
							placeholder={selectedSpace?.fitnessCenterName ?? "Space 확인 중"}
							options={spaceOptions}
							isDisabled={spaces.length === 0}
							classNames={spaceSelectClassNames}
							onChange={(tenantId) => {
								if (tenantId == null) {
									return;
								}

								const selectedSpace = spaces.find(
									(space) => space.tenantId === String(tenantId),
								);
								if (
									selectedSpace &&
									selectedSpace.tenantId !== selectedTenantId
								) {
									handleSpaceSelect(selectedSpace);
								}
							}}
						/>
					</div>
					<Button
						size="sm"
						variant="outline"
						startContent={
							isAuthenticated ? (
								<LogOut className="h-4 w-4" size={16} />
							) : (
								<LogIn className="h-4 w-4" size={16} />
							)
						}
						onPress={handleToggleAuthState}
					>
						{isAuthenticated ? "Mock 로그아웃" : "Mock 로그인"}
					</Button>
				</div>
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
				<ShieldCheck className="h-4 w-4 text-success" size={16} />
				<span>
					실제 인증, 라우터, API 호출 없이 Storybook 안에서만 컨텍스트를
					검토합니다.
				</span>
				{selectedSpace ? (
					<span className="break-words">
						선택: {selectedSpace.tenantName ?? selectedSpace.tenantId} /{" "}
						{selectedSpace.fitnessCenterName}
					</span>
				) : null}
			</div>
		</section>
	);
}
