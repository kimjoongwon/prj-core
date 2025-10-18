import { makeAutoObservable } from "mobx";

export class RouteStore {
	name: string;
	fullPath: string;
	relativePath: string;
	active: boolean;
	icon: string | null;
	children: RouteStore[] = [];

	constructor(route: RouteStore) {
		makeAutoObservable(this);
		this.name = route.name;
		this.fullPath = route.fullPath;
		this.relativePath = route.relativePath;
		this.active = false;
		this.icon = route.icon;
		if (route.children) {
			this.children = route.children.map((child) => new RouteStore(child));
		}
	}
}
