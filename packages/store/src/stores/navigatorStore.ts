import { RouteStore } from "./routeStore";
import { type RootStore } from "./Store";

export class NavigatorStore {
	readonly rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	getRouteByFullPath(
		fullPath: string,
		routes: RouteStore[],
	): RouteStore | undefined {
		for (const route of routes) {
			if (route.fullPath === fullPath) {
				return route;
			}

			if (route.children) {
				const childResult = this.getRouteByFullPath(fullPath, route.children);
				if (childResult) {
					return childResult;
				}
			}
		}

		return undefined;
	}
}
