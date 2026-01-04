import { Cookies } from "react-cookie";

export class CookieStore {
	private cookies: Cookies;

	constructor() {
		this.cookies = new Cookies();
	}

	set(name: string, value: unknown, options?: unknown): void {
		this.cookies.set(name, value, options);
	}

	get(name: string): unknown {
		return this.cookies.get(name);
	}

	remove(name: string, options?: unknown): void {
		this.cookies.remove(name, options);
	}

	getAll(): { [key: string]: unknown } {
		return this.cookies.getAll();
	}
}
