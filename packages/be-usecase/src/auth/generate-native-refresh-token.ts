import { NativeRefreshToken } from "@cocrepo/vo";

export function generateNativeRefreshToken(): string {
	return NativeRefreshToken.generate().value;
}
