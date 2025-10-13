import { getAppBuilder } from "@cocrepo/api-client";
import { makeAutoObservable } from "mobx";
import { AuthStore } from "./authStore";
import { CookieStore } from "./cookieStore";
import { NavigationStore } from "./navigationStore";
import { NavigatorStore } from "./navigatorStore";
import { TokenStore } from "./tokenStore";

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
