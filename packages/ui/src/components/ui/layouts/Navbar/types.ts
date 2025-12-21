export interface Route {
	name: string;
	fullPath: string;
	relativePath: string;
	active?: boolean;
	params?: any;
	icon?: string;
	visible?: boolean;
	onClick?: () => void;
	children?: Route[];
}

export interface NavbarProps {
	routes: Route[];
	direction?: "horizontal" | "vertical";
	onRouteClick?: (route: Route) => void;
}

export type Direction = "horizontal" | "vertical";
