import { RouteDto } from "@cocrepo/api-client";
import { type PlateStore } from "./Store";

export class NavigatorStore {
	readonly plateStore: PlateStore;

	constructor(plateStore: PlateStore) {
		this.plateStore = plateStore;
	}

	getRouteByFullPath(
		fullPath: string,
		routes: RouteDto[],
	): RouteDto | undefined {
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
