import { Cookies as ReactCookies } from "react-cookie";

type CookieValue = Parameters<ReactCookies["set"]>[1];
type CookieSetOptions = Parameters<ReactCookies["set"]>[2];
type CookieRemoveOptions = Parameters<ReactCookies["remove"]>[1];

export class Cookies {
	private cookies: ReactCookies;

	constructor() {
		this.cookies = new ReactCookies();
	}

	set(name: string, value: CookieValue, options?: CookieSetOptions): void {
		this.cookies.set(name, value, options);
	}

	get(name: string): unknown {
		return this.cookies.get(name);
	}

	remove(name: string, options?: CookieRemoveOptions): void {
		this.cookies.remove(name, options);
	}

	getAll(): { [key: string]: unknown } {
		return this.cookies.getAll();
	}
}
