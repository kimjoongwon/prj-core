import { RouteDto } from "@cocrepo/api-client";
import { makeAutoObservable } from "mobx";

export class RouteStore {
  name: string;
  fullPath: string;
  relativePath: string;
  active: boolean;
  icon: string | null;
  children: RouteStore[] = [];

  constructor(routeDto: RouteDto) {
    makeAutoObservable(this);
    this.name = routeDto.name;
    this.fullPath = routeDto.fullPath;
    this.relativePath = routeDto.relativePath;
    this.active = false;
    this.icon = routeDto.icon;
    if (routeDto.children) {
      this.children = routeDto.children.map((child) => new RouteStore(child));
    }
  }
}
