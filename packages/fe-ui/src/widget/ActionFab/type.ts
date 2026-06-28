import type { FABAction } from "@cocrepo/type";

export interface ActionFabProps {
	isOpen: boolean;
	actions: FABAction[];
	onToggle: () => void;
	onActionClick: (actionId: string) => void;
}
