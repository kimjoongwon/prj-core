"use client";

import { X, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { Button } from "../../design-system/primitives";
import type { ActionFabProps } from "../../display/layout/type";

export const ActionFab = observer(function ActionFab({
	isOpen,
	actions,
	onToggle,
	onActionClick,
}: ActionFabProps) {
	const handleToggle = () => {
		onToggle();
	};

	const handleActionClick = (actionId: string) => {
		onActionClick(actionId);
	};

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
						<span className="rounded-lg bg-content1 px-3 py-1.5 font-medium text-foreground text-sm shadow-md">
							{action.label}
						</span>

						<Button
							isIconOnly
							color="primary"
							variant="shadow"
							size="md"
							className="h-12 w-12 rounded-full"
							onPress={() => handleActionClick(action.id)}
							aria-label={action.label}
						>
							<AppIcon
								name={action.icon}
								className="text-primary-foreground"
								size={20}
							/>
						</Button>
					</div>
				))}
			</div>

			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 -z-10 cursor-default bg-transparent"
					onClick={handleToggle}
					onKeyDown={(e) => e.key === "Escape" && handleToggle()}
					aria-label="Close FAB menu"
				/>
			)}

			<Button
				isIconOnly
				color="primary"
				variant="shadow"
				size="lg"
				className="h-14 w-14 rounded-full shadow-lg"
				onPress={handleToggle}
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
			>
				{isOpen ? (
					<X
						className="text-primary-foreground transition-transform duration-200 rotate-90"
						size={24}
					/>
				) : (
					<Zap
						className="text-primary-foreground transition-transform duration-200 rotate-0"
						size={24}
					/>
				)}
			</Button>
		</div>
	);
});

ActionFab.displayName = "ActionFab";
