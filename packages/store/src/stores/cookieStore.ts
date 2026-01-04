import { Cookies } from "react-cookie";

export class CookieStore {
	private cookies: Cookies;

	constructor() {
		this.cookies = new Cookies();
	}

	set(name: string, value: unknown, options?: any): void {
		this.cookies.set(name, value, options as any);
	}

	get(name: string): any {
		return this.cookies.get(name);
	}

	remove(name: string, options?: any): void {
		this.cookies.remove(name, options as any);
	}

	getAll(): { [key: string]: unknown } {
		return this.cookies.getAll();
	}
}
