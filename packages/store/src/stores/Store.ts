import { makeAutoObservable } from "mobx";
import { AbilityStore } from "./abilityStore";
import { AuthStore } from "./authStore";
import { CookieStore } from "./cookieStore";
import { NavigationStore } from "./navigationStore";
import { TokenStore } from "./tokenStore";

export class Store {
	name: string = "PROTOTYPE";
	navigation: NavigationStore | undefined;
	tokenStore: TokenStore | undefined;
	authStore: AuthStore | undefined;
	cookieStore: CookieStore | undefined;
	abilityStore: AbilityStore;

	constructor() {
		// const navigator = new NavigatorStore(this);
		// this.navigation = new NavigationStore(this, navigator, []);
		this.tokenStore = new TokenStore(this);
		this.cookieStore = new CookieStore();
		this.authStore = new AuthStore(this);
		this.abilityStore = new AbilityStore(this);

		makeAutoObservable(this);
	}
}
