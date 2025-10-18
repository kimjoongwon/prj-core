import { RouteStore } from "./routeStore";
import { type Store } from "./Store";

export class NavigatorStore {
	readonly plateStore: Store;

	constructor(plateStore: Store) {
		this.plateStore = plateStore;
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
