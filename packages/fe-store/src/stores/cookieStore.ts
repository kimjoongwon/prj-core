import { Cookies } from "react-cookie";

type CookieValue = Parameters<Cookies["set"]>[1];
type CookieSetOptions = Parameters<Cookies["set"]>[2];
type CookieRemoveOptions = Parameters<Cookies["remove"]>[1];

export class CookieStore {
	private cookies: Cookies;

	constructor() {
		this.cookies = new Cookies();
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
