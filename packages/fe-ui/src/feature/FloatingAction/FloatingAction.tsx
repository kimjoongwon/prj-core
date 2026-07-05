"use client";

import { useLayout } from "@cocrepo/hook";
import type { FABAction } from "@cocrepo/type";
import { X, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { Button } from "../../input/Button/Button";

interface FloatingActionButtonProps {
	isOpen: boolean;
	actions: FABAction[];
	onToggle: () => void;
	onActionClick: (actionId: string) => void;
}

const FloatingActionButton = observer(function FloatingActionButton({
	isOpen,
	actions,
	onToggle,
	onActionClick,
}: FloatingActionButtonProps) {
	return (
		<div className="fixed right-4 bottom-20 z-50 md:hidden">
			<div
				className={`absolute right-0 bottom-16 flex flex-col items-end gap-3 transition-all duration-300 ${
					isOpen
						? "pointer-events-auto translate-y-0 opacity-100"
						: "pointer-events-none translate-y-4 opacity-0"
				}`}
			>
				{actions.map((action, index) => (
					<div
						key={action.id}
						className="flex items-center gap-2"
						style={{
							transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
						}}
					>
						<span className="rounded-lg bg-surface px-3 py-1.5 font-medium text-foreground text-sm shadow-md">
							{action.label}
						</span>
						<Button
							isIconOnly
							color="primary"
							variant="shadow"
							size="md"
							className="h-12 w-12 rounded-full"
							onPress={() => onActionClick(action.id)}
							aria-label={action.label}
						>
							<AppIcon
								name={action.icon}
								className="text-accent-foreground"
								size={20}
							/>
						</Button>
					</div>
				))}
			</div>

			{isOpen ? (
				<button
					type="button"
					className="fixed inset-0 -z-10 cursor-default bg-transparent"
					onClick={onToggle}
					onKeyDown={(event) => {
						if (event.key === "Escape") {
							onToggle();
						}
					}}
					aria-label="Close FAB menu"
				/>
			) : null}

			<Button
				isIconOnly
				color="primary"
				variant="shadow"
				size="lg"
				className="h-14 w-14 rounded-full shadow-lg"
				onPress={onToggle}
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
			>
				{isOpen ? (
					<X
						className="rotate-90 text-accent-foreground transition-transform duration-200"
						size={24}
					/>
				) : (
					<Zap
						className="rotate-0 text-accent-foreground transition-transform duration-200"
						size={24}
					/>
				)}
			</Button>
		</div>
	);
});

/**
 * mobile floating action button을 store 상태에 연결해 렌더링합니다.
 */
export const FloatingAction = observer(function FloatingAction() {
	const layoutProps = useLayout();

	if (layoutProps.fabActions.length === 0) {
		return null;
	}

	return (
		<FloatingActionButton
			isOpen={layoutProps.isFABOpen}
			actions={layoutProps.fabActions}
			onToggle={layoutProps.onFABToggle}
			onActionClick={layoutProps.onFABActionClick}
		/>
	);
});
