import { Cookies } from "react-cookie";

export class CookieStore {
	private cookies: Cookies;

	constructor() {
		this.cookies = new Cookies();
	}

	set(name: string, value: any, options?: any): void {
		this.cookies.set(name, value, options);
	}

	get(name: string): any {
		return this.cookies.get(name);
	}

	remove(name: string, options?: any): void {
		this.cookies.remove(name, options);
	}

	getAll(): { [key: string]: any } {
		return this.cookies.getAll();
	}
}
