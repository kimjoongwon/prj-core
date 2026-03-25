const LOGIN_PATH = "/__storybook_auth/login";
const LOGOUT_PATH = "/__storybook_auth/logout";
const SESSION_PATH = "/__storybook_auth/session";
const LOGIN_ALIAS_PATHS = new Set(["/admin/auth/login", "/auth/login"]);
const JSON_GATE_PATHS = new Set(["/index.json", "/stories.json", "/project.json"]);
const STATIC_FILE_PATTERN =
	/\.(?:avif|bmp|css|gif|ico|jpeg|jpg|js|map|mjs|png|svg|txt|webp|woff2?)$/i;

function createProxyTarget(target) {
	return {
		target,
		changeOrigin: true,
		secure: false,
	};
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function buildRequestUrl(request) {
	const host = request.headers.host || "localhost:6006";
	return new URL(request.url || "/", `http://${host}`);
}

function normalizeReturnTo(rawValue, requestUrl) {
	try {
		const candidate = new URL(rawValue || "/", requestUrl);
		if (candidate.origin !== requestUrl.origin) {
			return new URL("/", requestUrl).toString();
		}
		return candidate.toString();
	} catch {
		return new URL("/", requestUrl).toString();
	}
}

function getLoginPath(requestUrl, returnTo = requestUrl.toString()) {
	const loginUrl = new URL(LOGIN_PATH, requestUrl.origin);
	loginUrl.searchParams.set("returnTo", normalizeReturnTo(returnTo, requestUrl));
	return `${loginUrl.pathname}${loginUrl.search}`;
}

function buildIdpLoginUrl(requestUrl, returnTo) {
	const loginUrl = new URL("/api/v1/auth/login", requestUrl.origin);
	loginUrl.searchParams.set("clientId", "storybook");
	loginUrl.searchParams.set("returnTo", normalizeReturnTo(returnTo, requestUrl));
	return loginUrl.toString();
}

function getAliasReturnTo(request, requestUrl) {
	const explicitReturnTo = requestUrl.searchParams.get("returnTo");
	if (explicitReturnTo) {
		return normalizeReturnTo(explicitReturnTo, requestUrl);
	}

	const referer = request.headers.referer;
	if (!referer) {
		return new URL("/", requestUrl).toString();
	}

	try {
		const refererUrl = new URL(referer);
		if (refererUrl.origin === requestUrl.origin) {
			return refererUrl.toString();
		}
	} catch {
		// ignore malformed referer
	}

	return new URL("/", requestUrl).toString();
}

function shouldSkipGate(pathname) {
	if (
		pathname.startsWith("/api/") ||
		pathname.startsWith("/__vite") ||
		pathname.startsWith("/@vite") ||
		pathname.startsWith("/@id/") ||
		pathname.startsWith("/node_modules/") ||
		pathname.startsWith("/virtual:")
	) {
		return true;
	}

	if (
		pathname === LOGIN_PATH ||
		pathname === LOGOUT_PATH ||
		pathname === SESSION_PATH ||
		LOGIN_ALIAS_PATHS.has(pathname)
	) {
		return true;
	}

	if (STATIC_FILE_PATTERN.test(pathname)) {
		return true;
	}

	return false;
}

function shouldProtectRequest(request, requestUrl) {
	if (!request.method || !["GET", "HEAD"].includes(request.method.toUpperCase())) {
		return false;
	}

	if (LOGIN_ALIAS_PATHS.has(requestUrl.pathname)) {
		return true;
	}

	if (shouldSkipGate(requestUrl.pathname)) {
		return false;
	}

	if (JSON_GATE_PATHS.has(requestUrl.pathname)) {
		return true;
	}

	if (requestUrl.pathname === "/" || requestUrl.pathname === "/index.html") {
		return true;
	}

	if (requestUrl.pathname === "/iframe.html") {
		return true;
	}

	const acceptHeader = request.headers.accept || "";
	return acceptHeader.includes("text/html");
}

async function verifySession(request, authConfig) {
	try {
		const response = await fetch(`${authConfig.idpApiTarget}/api/v1/auth/verify-token`, {
			method: "GET",
			headers: {
				accept: "application/json",
				cookie: request.headers.cookie || "",
			},
			redirect: "manual",
		});

		const body = await response.json().catch(() => null);
		const data = body?.data ?? null;
		const authenticated = response.ok && Boolean(data?.valid);

		return {
			authenticated,
			status: response.status,
			data,
			message:
				body?.message ||
				(authenticated ? "authenticated" : "Storybook auth session not found."),
		};
	} catch (error) {
		return {
			authenticated: false,
			status: 503,
			data: null,
			message:
				error instanceof Error
					? error.message
					: "Failed to reach the local IDP API.",
		};
	}
}

function sendJson(response, statusCode, body) {
	response.statusCode = statusCode;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(JSON.stringify(body));
}

function redirect(response, location) {
	response.statusCode = 302;
	response.setHeader("Location", location);
	response.end();
}

function renderShellHtml({
	title,
	heading,
	description,
	ctaLabel,
	ctaHref,
	secondaryHref,
	secondaryLabel,
	extraScript,
	statusMessage,
}) {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0e1116;
        --panel: rgba(20, 25, 37, 0.92);
        --border: rgba(151, 163, 189, 0.18);
        --text: #f4f7ff;
        --muted: #97a3bd;
        --accent: #f2b236;
        --danger: #f97066;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top right, rgba(242, 178, 54, 0.22), transparent 38%),
          radial-gradient(circle at bottom left, rgba(73, 121, 255, 0.18), transparent 44%),
          linear-gradient(180deg, #0a0d12 0%, var(--bg) 100%);
        color: var(--text);
        font-family: "Space Grotesk", "Pretendard", sans-serif;
        padding: 24px;
      }

      .shell {
        width: min(560px, 100%);
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--panel);
        backdrop-filter: blur(18px);
        box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
        padding: 32px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(242, 178, 54, 0.22);
        background: rgba(242, 178, 54, 0.08);
        color: var(--accent);
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 18px 0 12px;
        font-size: clamp(28px, 6vw, 40px);
        line-height: 1.05;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-size: 15px;
      }

      .status {
        margin-top: 18px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(249, 112, 102, 0.24);
        background: rgba(249, 112, 102, 0.08);
        color: #ffd6d2;
        font-size: 13px;
      }

      .actions {
        margin-top: 28px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .button {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 14px;
        border: 1px solid transparent;
        text-decoration: none;
        font-weight: 600;
        transition:
          transform 140ms ease,
          border-color 140ms ease,
          background-color 140ms ease;
      }

      .button:hover {
        transform: translateY(-1px);
      }

      .button-primary {
        background: var(--accent);
        color: #0f1217;
      }

      .button-secondary {
        border-color: var(--border);
        color: var(--text);
      }

      .meta {
        margin-top: 18px;
        font-size: 12px;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="eyebrow">plate storybook</div>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      ${
				statusMessage
					? `<div class="status">${escapeHtml(statusMessage)}</div>`
					: ""
			}
      <div class="actions">
        <a class="button button-primary" href="${escapeHtml(ctaHref)}">${escapeHtml(ctaLabel)}</a>
        ${
					secondaryHref && secondaryLabel
						? `<a class="button button-secondary" href="${escapeHtml(secondaryHref)}">${escapeHtml(secondaryLabel)}</a>`
						: ""
				}
      </div>
      <div class="meta">Local dev only. Static Storybook builds and Chromatic stay unauthenticated.</div>
    </main>
    ${extraScript ? `<script>${extraScript}</script>` : ""}
  </body>
</html>`;
}

function renderLoginShell(requestUrl, returnTo, session) {
	const loginApiUrl = buildIdpLoginUrl(requestUrl, returnTo);
	const sessionUrl = `${SESSION_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
	const loginUrl = `${LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
	const script = `
      (() => {
        const sessionUrl = ${JSON.stringify(sessionUrl)};
        const returnTo = ${JSON.stringify(returnTo)};
        const loginUrl = ${JSON.stringify(loginUrl)};

        const redirectToReturnTo = () => {
          window.location.replace(returnTo);
        };

        fetch(sessionUrl, {
          credentials: "include",
          cache: "no-store",
        })
          .then(async (response) => {
            const payload = await response.json().catch(() => null);
            if (response.ok && payload?.authenticated) {
              redirectToReturnTo();
              return;
            }

            if (payload?.status && payload.status >= 500) {
              const statusNode = document.querySelector("[data-status]");
              if (statusNode) {
                statusNode.textContent = payload.message || "Local IDP API is unavailable.";
              }
            }
          })
          .catch(() => {
            const statusNode = document.querySelector("[data-status]");
            if (statusNode) {
              statusNode.textContent = "Local IDP API is unavailable.";
            }
          });

        window.addEventListener("pageshow", () => {
          if (window.location.pathname === "/admin/auth/login" || window.location.pathname === "/auth/login") {
            window.location.replace(loginUrl);
          }
        });
      })();
    `;

	return renderShellHtml({
		title: "PLATE Storybook Login",
		heading: "Sign in to unlock Storybook",
		description:
			"Local Storybook uses the existing IDP cookie session. Continue through the login flow, then you will return to the exact story URL.",
		ctaLabel: "Continue with IDP",
		ctaHref: loginApiUrl,
		secondaryHref: "/",
		secondaryLabel: "Back to root",
		extraScript: script,
		statusMessage:
			session.status >= 500
				? `Auth check failed: ${session.message}`
				: "Checking your local session...",
	}).replace('<div class="status">', '<div class="status" data-status>');
}

function renderLogoutShell(returnTo) {
	const loginUrl = `${LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
	const script = `
      (() => {
        const nextUrl = ${JSON.stringify(loginUrl)};
        const clearClientState = () => {
          try {
            const storageKeys = [
              "storybook-admin-persist",
              "storybook-idp-persist",
              "admin-persist",
              "idp-persist"
            ];
            for (const key of storageKeys) {
              window.localStorage.removeItem(key);
            }
            window.sessionStorage.clear();
          } catch {
            // ignore storage cleanup failures
          }
        };

        fetch("/api/v1/auth/logout", {
          method: "POST",
          credentials: "include"
        })
          .catch(() => undefined)
          .finally(() => {
            clearClientState();
            window.location.replace(nextUrl);
          });
      })();
    `;

	return renderShellHtml({
		title: "PLATE Storybook Logout",
		heading: "Signing out of Storybook",
		description:
			"The local Storybook shell clears persisted runtime state, revokes the current cookie session, and returns to the login shell.",
		ctaLabel: "Working...",
		ctaHref: loginUrl,
		extraScript: script,
	});
}

export function createStorybookProxyConfig(authConfig) {
	return {
		"/api/v1/auth": createProxyTarget(authConfig.idpApiTarget),
		"/api/v1/idp": createProxyTarget(authConfig.idpApiTarget),
		"/api/v1/oidc-clients": createProxyTarget(authConfig.idpApiTarget),
		"/api/v1/oidc-sessions": createProxyTarget(authConfig.idpApiTarget),
		"/api/interaction": createProxyTarget(authConfig.idpApiTarget),
		"/api/forgot-password": createProxyTarget(authConfig.idpApiTarget),
		"/api/password-policy": createProxyTarget(authConfig.idpApiTarget),
		"/api/reset-password": createProxyTarget(authConfig.idpApiTarget),
		"^/api/v1/(?!auth|idp|oidc-clients|oidc-sessions).*":
			createProxyTarget(authConfig.coreApiTarget),
	};
}

export function createStorybookAuthPlugin(authConfig) {
	return {
		name: "plate-storybook-auth-shell",
		apply: "serve",
		configureServer(server) {
			const middleware = async (request, response, next) => {
				const requestUrl = buildRequestUrl(request);
				const { pathname } = requestUrl;

				if (pathname === SESSION_PATH) {
					if (!authConfig.requireAuth) {
						sendJson(response, 404, {
							authenticated: false,
							status: 404,
							data: null,
							message: "Storybook auth is disabled.",
						});
						return;
					}

					const session = await verifySession(request, authConfig);
					sendJson(response, session.authenticated ? 200 : session.status, session);
					return;
				}

				if (LOGIN_ALIAS_PATHS.has(pathname)) {
					const returnTo = getAliasReturnTo(request, requestUrl);
					const session = await verifySession(request, authConfig);
					response.statusCode = 200;
					response.setHeader("Content-Type", "text/html; charset=utf-8");
					response.end(renderLoginShell(requestUrl, returnTo, session));
					return;
				}

				if (pathname === LOGIN_PATH) {
					const returnTo = normalizeReturnTo(
						requestUrl.searchParams.get("returnTo") || "/",
						requestUrl,
					);
					const session = await verifySession(request, authConfig);
					if (session.authenticated) {
						redirect(response, returnTo);
						return;
					}

					response.statusCode = 200;
					response.setHeader("Content-Type", "text/html; charset=utf-8");
					response.end(renderLoginShell(requestUrl, returnTo, session));
					return;
				}

				if (pathname === LOGOUT_PATH) {
					const returnTo = normalizeReturnTo(
						requestUrl.searchParams.get("returnTo") || "/",
						requestUrl,
					);
					response.statusCode = 200;
					response.setHeader("Content-Type", "text/html; charset=utf-8");
					response.end(renderLogoutShell(returnTo));
					return;
				}

				if (!authConfig.requireAuth) {
					next();
					return;
				}

				if (!shouldProtectRequest(request, requestUrl)) {
					next();
					return;
				}

				const session = await verifySession(request, authConfig);
				if (session.authenticated) {
					next();
					return;
				}

				if (JSON_GATE_PATHS.has(pathname)) {
					sendJson(response, 401, session);
					return;
				}

				redirect(response, getLoginPath(requestUrl));
			};

			return () => {
				server.middlewares.use(middleware);

				const latestLayer = server.middlewares.stack.pop();
				if (latestLayer) {
					server.middlewares.stack.unshift(latestLayer);
				}
			};
		},
	};
}
