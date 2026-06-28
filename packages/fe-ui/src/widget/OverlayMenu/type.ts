import type { NavItem } from "@cocrepo/store";

export interface OverlayMenuProps {
	title: string;
	items: NavItem[];
	selectedItemId: string | null;
	onItemClick: (itemId: string) => void;
	onClose: () => void;
}
