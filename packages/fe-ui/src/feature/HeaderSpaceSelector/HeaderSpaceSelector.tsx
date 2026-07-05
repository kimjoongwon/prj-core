"use client";

import { Dropdown } from "@heroui/react";
import { Building2, Check, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import type { HeaderSpaceSelectorProps } from "./type";

/**
 * HeaderSpaceSelector - 헤더용 Space 선택 Feature 컴포넌트
 *
 * 헤더에서 Space를 선택할 수 있게 합니다. app 연결은 사용하는 앱에서 props로 주입합니다.
 *
 * @example
 * ```tsx
 * // 앱에서 app.space와 연결하여 사용
 * const app = useApp();
 * const space = app.space;
 *
 * const handleSpaceSelect = (space: SpaceInfo) => {
 *   space.setSpace(space.tenantId, space.groundName, undefined, space.spaceId);
 *   window.location.reload();
 * };
 *
 * <HeaderSpaceSelector
 *   spaces={space.spaces}
 *   currentTenantId={space.tenantId}
 *   currentSpaceName={space.groundName}
 *   onSpaceSelect={handleSpaceSelect}
 * />
 * ```
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector({
	spaces,
	currentTenantId,
	currentSpaceName,
	onSpaceSelect,
}: HeaderSpaceSelectorProps) {
	const buttonLabel = currentSpaceName ?? "Space 확인 중";
	const buttonClasses =
		"inline-flex h-11 w-40 shrink-0 flex-nowrap items-center justify-start gap-2 rounded-2xl border border-border bg-surface/80 px-3 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary sm:w-52 lg:w-60";

	if (spaces.length === 0) {
		return (
			<Button
				variant="light"
				isDisabled
				className={buttonClasses}
				startContent={
					<Building2 className="h-4 w-4 shrink-0 text-muted" size={16} />
				}
			>
				<span className="min-w-0 flex-1 truncate text-left text-sm text-muted">
					{buttonLabel}
				</span>
			</Button>
		);
	}

	return (
		<Dropdown>
			<Dropdown.Trigger className={buttonClasses}>
				<Building2 className="h-4 w-4 shrink-0 text-muted" size={16} />
				<span className="min-w-0 flex-1 truncate text-left text-sm text-foreground">
					{buttonLabel}
				</span>
				<ChevronDown className="h-4 w-4 shrink-0 text-muted" size={16} />
			</Dropdown.Trigger>
			<Dropdown.Popover placement="bottom end">
				<Dropdown.Menu
					aria-label="Space 선택"
					onAction={(key) => {
						const selectedSpace = spaces.find((space) => space.tenantId === key);
						if (selectedSpace && selectedSpace.tenantId !== currentTenantId) {
							onSpaceSelect(selectedSpace);
						}
					}}
				>
					{spaces.map((space) => (
						<Dropdown.Item
							id={space.tenantId}
							key={space.tenantId}
							className={
								space.tenantId === currentTenantId ? "text-accent" : undefined
							}
						>
							<span className="flex items-center gap-2">
								{space.tenantId === currentTenantId ? (
									<Check className="h-4 w-4 text-accent" size={16} />
								) : (
									<Building2 className="h-4 w-4 text-muted" size={16} />
								)}
								{space.groundName}
							</span>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
});

HeaderSpaceSelector.displayName = "HeaderSpaceSelector";
