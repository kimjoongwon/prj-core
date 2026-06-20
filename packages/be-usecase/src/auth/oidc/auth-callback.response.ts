import type { AuthRedirectResponse } from "./auth-redirect.response";
import type { AuthSendResponse } from "./auth-send.response";

export type AuthCallbackResponse = AuthRedirectResponse | AuthSendResponse;
