import { Route } from "./types";

export const isRouteClickable = (route: Route): boolean => {
	return Boolean(route.fullPath);
};

export const getRouteDisplayText = (route: Route): string => {
	return route.name || route.fullPath || "";
};

export const getRouteKey = (route: Route, index: number): string => {
	return route.name || `route-${index}`;
};
