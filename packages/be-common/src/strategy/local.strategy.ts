import { AuthFacade } from "@cocrepo/facade";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authFacade: AuthFacade) {
		super({
			usernameField: "email",
		});
	}

	async validate(username: string, password: string) {
		return this.authFacade.validateUser(username, password);
	}
}
