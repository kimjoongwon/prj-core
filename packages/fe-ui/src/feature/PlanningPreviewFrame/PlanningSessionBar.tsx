"use client";

import type {
	PlanningAuthState,
	PlanningContext,
	PlanningSpaceOption,
} from "@cocrepo/type";
import { LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Button } from "../../input/Button/Button";
import { HeaderSpaceSelector } from "../HeaderSpaceSelector";

export interface PlanningSessionBarProps {
	context: PlanningContext;
	onSpaceChange?: (space: PlanningSpaceOption) => void;
}

function getFallbackSpace(
	context: PlanningContext,
): PlanningSpaceOption | null {
	if (!context.tenantId && !context.spaceId && !context.groundName) {
		return null;
	}

	return {
		tenantId: context.tenantId ?? "storybook-tenant",
		spaceId: context.spaceId ?? "storybook-space",
		groundName: context.groundName ?? context.spaceId ?? "Storybook Space",
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
		.map((space) => `${space.tenantId}:${space.spaceId}:${space.groundName}`)
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
								variant="flat"
							>
								{isAuthenticated ? "Mock 로그인" : "Mock 로그아웃"}
							</Chip>
							<Chip color="primary" size="sm" variant="bordered">
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
						<HeaderSpaceSelector
							spaces={spaces}
							currentTenantId={selectedTenantId}
							currentSpaceName={selectedSpace?.groundName ?? null}
							onSpaceSelect={handleSpaceSelect}
						/>
					</div>
					<Button
						size="sm"
						variant="bordered"
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
						{selectedSpace.groundName}
					</span>
				) : null}
			</div>
		</section>
	);
}
