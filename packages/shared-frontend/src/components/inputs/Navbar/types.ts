import { Route } from "@shared/types";

export interface NavbarProps {
	routes: Route[];
	direction?: "horizontal" | "vertical";
	onRouteClick?: (route: Route) => void;
}

export type Direction = "horizontal" | "vertical";