import { makeAutoObservable } from "mobx";
import { NavigationStore } from "./navigationStore";
import { getAppBuilder } from "@shared/api-client";
import { NavigatorStore } from "./navigatorStore";
import { TokenStore } from "./tokenStore";
import { AuthStore } from "./authStore";
import { CookieStore } from "./cookieStore";

export class PlateStore {
  name: string = "PROTOTYPE";
  navigation: NavigationStore | undefined;
  tokenStore: TokenStore | undefined;
  authStore: AuthStore | undefined;
  cookieStore: CookieStore | undefined;

  constructor() {
    getAppBuilder().then((res) => {
      const routeDtos = res.data?.routes;
      const navigator = new NavigatorStore(this);
      this.navigation = new NavigationStore(this, navigator, routeDtos || []);
      this.tokenStore = new TokenStore(this);
      this.cookieStore = new CookieStore();
      this.authStore = new AuthStore(this);
    });

    makeAutoObservable(this);
  }
}
