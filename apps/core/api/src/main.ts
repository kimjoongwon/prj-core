import { Token } from "@cocrepo/constant";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { AbilitiesModule } from "./module/abilities";
import { ActionsModule } from "./module/actions";
import { AppModule } from "./module/app.module";
import { AssetsModule } from "./module/assets";
import { AuthModule } from "./module/auth";
import { CommunityModule } from "./module/community";
import { EmailVerificationsModule } from "./module/email-verification";
import { FoldersModule } from "./module/folders";
import { I18nCatalogModule } from "./module/i18n";
import { IdpAccountsModule } from "./module/idp-accounts";
import { IdpDashboardModule } from "./module/idp-dashboard";
import { InquiriesModule } from "./module/inquiries";
import { InteractionModule } from "./module/interaction";
import { OidcModule } from "./module/oidc";
import { OidcClientsModule } from "./module/oidc-client";
import { OidcSessionsModule } from "./module/oidc-session";
import { PasswordResetModule } from "./module/password-reset";
import { PoliciesModule } from "./module/policies";
import { PolicyAssignmentsModule } from "./module/policy-assignments";
import { ReservationsModule } from "./module/reservations";
import { RolesModule } from "./module/roles";
import { RoutinesModule } from "./module/routines";
import { SecurityPolicyModule } from "./module/security-policy";
import { ServiceDocumentsModule } from "./module/service-documents";
import { SpacesModule } from "./module/spaces";
import { SubjectsModule } from "./module/subjects";
import { TasksModule } from "./module/tasks";
import { TemplatesModule } from "./module/templates";
import { TenantAccessRequestsModule } from "./module/tenant-access-requests";
import { TimelinesModule } from "./module/timelines";
import { TranslationsModule } from "./module/translations";
import { UsersModule } from "./module/users";
import { setNestApp } from "./setNestApp";

/**
 * Swagger UI Tenant/Space 선택 플러그인
 * - topbar에 Tenant/Space 드롭다운 추가
 * - 인증 후 Load 버튼으로 접근 가능한 Space 목록 로드
 * - 선택된 tenantId를 localStorage에 저장하고 x-tenant-id header로 주입
 */
const SWAGGER_TENANT_SELECTOR_JS = `
(function() {
  'use strict';
  var TENANT_ID_STORAGE_KEY = 'swagger:x-tenant-id';
  var origFetch = window.fetch;
  var isReauthorizing = false;

  function readTenantId() {
    try {
      return window.localStorage.getItem(TENANT_ID_STORAGE_KEY) || '';
    } catch (e) { /* ignore */ }
    return '';
  }

  function writeTenantId(tenantId) {
    try {
      if (tenantId) {
        window.localStorage.setItem(TENANT_ID_STORAGE_KEY, tenantId);
      } else {
        window.localStorage.removeItem(TENANT_ID_STORAGE_KEY);
      }
    } catch (e) { /* ignore */ }
  }

  function buildAuthHeaders(token, includeTenant) {
    var headers = { 'Authorization': 'Bearer ' + token };
    var tenantId = includeTenant ? readTenantId() : '';
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }
    return headers;
  }

  function spaceLabel(space) {
    var groundName = space && space.ground && space.ground.name;
    var companyName = space && space.company && space.company.name;
    var fallback = space && space.id ? space.id : 'Unknown Space';
    return groundName || companyName || fallback;
  }

  window.fetch = function(url, init) {
    var nextInit = init;
    var isApiRequest = typeof url === 'string' && url.indexOf('/api/v1/') !== -1;
    var tenantId = readTenantId();

    if (tenantId && isApiRequest) {
      nextInit = Object.assign({}, init || {});
      var headers = new Headers(nextInit.headers || {});
      if (!headers.has('x-tenant-id')) {
        headers.set('x-tenant-id', tenantId);
      }
      nextInit.headers = headers;
    }

    return origFetch.call(this, url, nextInit).then(function(response) {
      if (response.status === 401 && !isReauthorizing && isApiRequest) {
        isReauthorizing = true;
        try {
          if (window.ui) {
            window.ui.authActions.logout(['oauth2']);
          }
        } catch (e) { /* ignore */ }
        alert('인증이 만료되었습니다. Authorize 버튼을 클릭하여 다시 로그인해주세요.');
        var authBtn = document.querySelector('.btn.authorize');
        if (authBtn) authBtn.click();
        isReauthorizing = false;
      }
      return response;
    });
  };

  function getAuthToken() {
    try {
      var auth = window.ui && window.ui.getState().toJS().auth.authorized;
      if (auth && auth.oauth2 && auth.oauth2.token) {
        return auth.oauth2.token.access_token;
      }
      if (auth && auth.accessToken && auth.accessToken.value) {
        return auth.accessToken.value;
      }
    } catch (e) { /* ignore */ }
    return '';
  }

  function createTenantSelector() {
    var topbar = document.querySelector('.topbar-wrapper');
    if (!topbar || document.getElementById('tenant-space-selector')) return;

    var container = document.createElement('div');
    container.id = 'tenant-space-selector';
    container.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;padding-right:12px;';

    var label = document.createElement('span');
    label.textContent = 'Tenant/Space:';
    label.style.cssText = 'color:#fff;font-size:13px;font-weight:600;white-space:nowrap;';

    var select = document.createElement('select');
    select.id = 'tenant-space-select';
    select.style.cssText = 'padding:5px 10px;border-radius:4px;background:#2b3137;color:#fff;border:1px solid #555;font-size:13px;min-width:220px;cursor:pointer;';
    select.innerHTML = '<option value="">-- Authorize 후 Load 클릭 --</option>';

    var loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.style.cssText = 'padding:5px 14px;border-radius:4px;background:#4990e2;color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;';
    loadBtn.title = 'Authorize 인증 후 클릭하면 접근 가능한 Tenant/Space 목록을 불러옵니다';

    loadBtn.addEventListener('click', function() {
      var token = getAuthToken();
      if (!token) {
        alert('먼저 Authorize 버튼으로 인증해주세요.');
        return;
      }
      loadBtn.textContent = '...';
      loadBtn.disabled = true;

      Promise.all([
        origFetch((window.__IDP_SERVER_URL || 'http://localhost:3000') + '/api/v1/auth/my-spaces', {
          credentials: 'include',
          headers: buildAuthHeaders(token, false)
        }).then(function(r) { return r.json(); }),
        origFetch((window.__IDP_SERVER_URL || 'http://localhost:3000') + '/api/v1/auth/current-space', {
          credentials: 'include',
          headers: buildAuthHeaders(token, true)
        }).then(function(r) { return r.json(); })
      ])
      .then(function(results) {
        var spacesResponse = results[0];
        var currentSpaceResponse = results[1];
        var raw = spacesResponse && spacesResponse.data;
        var currentSpace = currentSpaceResponse && currentSpaceResponse.data;
        var spaces = Array.isArray(raw) ? raw : [];
        var selectedTenantId = (currentSpace && currentSpace.tenantId) || readTenantId();

        if (selectedTenantId) {
          writeTenantId(selectedTenantId);
        }

        select.innerHTML = '<option value="">-- Tenant/Space 선택 --</option>';
        spaces.forEach(function(s) {
          if (!s || !s.tenantId) {
            return;
          }

          var opt = document.createElement('option');
          opt.value = s.tenantId;
          opt.textContent = spaceLabel(s);
          opt.title = 'tenantId: ' + s.tenantId;
          if (selectedTenantId && s.tenantId === selectedTenantId) opt.selected = true;
          select.appendChild(opt);
        });
        if (spaces.length === 0) {
          select.innerHTML = '<option value="">접근 가능한 Tenant/Space가 없습니다</option>';
        }
      })
      .catch(function(err) {
        alert('Tenant/Space 로드 실패: ' + err.message);
      })
      .finally(function() {
        loadBtn.textContent = 'Load';
        loadBtn.disabled = false;
      });
    });

    select.addEventListener('change', function() {
      var value = select.value;
      var token = getAuthToken();
      if (!value || !token) {
        writeTenantId('');
        return;
      }

      select.disabled = true;
      origFetch((window.__IDP_SERVER_URL || 'http://localhost:3000') + '/api/v1/auth/current-space', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenantId: value })
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Tenant/Space 선택 변경에 실패했습니다.');
        }
        return response.json();
      })
      .then(function(response) {
        var currentSpace = response && response.data;
        if (!currentSpace) {
          return;
        }
        writeTenantId(currentSpace.tenantId || value);
        for (var i = 0; i < select.options.length; i += 1) {
          select.options[i].selected = select.options[i].value === (currentSpace.tenantId || value);
        }
      })
      .catch(function(err) {
        alert('Tenant/Space 변경 실패: ' + err.message);
      })
      .finally(function() {
        select.disabled = false;
      });
    });

    container.appendChild(label);
    container.appendChild(select);
    container.appendChild(loadBtn);
    topbar.appendChild(container);
  }

  function waitForSwagger() {
    if (document.querySelector('.topbar-wrapper')) {
      createTenantSelector();
    } else {
      setTimeout(waitForSwagger, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(waitForSwagger, 300); });
  } else {
    setTimeout(waitForSwagger, 300);
  }
})();
`;

const SWAGGER_MODULES = [
	SpacesModule,
	UsersModule,
	ActionsModule,
	AssetsModule,
	SubjectsModule,
	AbilitiesModule,
	RolesModule,
	I18nCatalogModule,
	CommunityModule,
	PoliciesModule,
	PolicyAssignmentsModule,
	FoldersModule,
	TemplatesModule,
	ServiceDocumentsModule,
	TranslationsModule,
	TimelinesModule,
	TasksModule,
	RoutinesModule,
	InquiriesModule,
	TenantAccessRequestsModule,
	ReservationsModule,
	AuthModule,
	OidcModule,
	InteractionModule,
	PasswordResetModule,
	OidcClientsModule,
	OidcSessionsModule,
	SecurityPolicyModule,
	IdpAccountsModule,
	IdpDashboardModule,
	EmailVerificationsModule,
];

interface HotModule {
	hot?: {
		accept(): void;
		dispose(callback: () => void | Promise<void>): void;
	};
}

declare const module: HotModule;

async function bootstrap() {
	const enableNestDevtools =
		process.env.ENABLE_NEST_DEVTOOLS === "true" &&
		process.env.NODE_ENV !== "production";

	// =================================================================
	// 1. 애플리케이션 생성 및 기본 설정
	// =================================================================
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true, // 로거 설정 전까지 로그 버퍼링
		snapshot: enableNestDevtools,
	});

	// 로거 설정 (가장 먼저 설정하여 모든 로그 캐치)
	app.useLogger(app.get(Logger));

	// =================================================================
	// 2. Express 미들웨어 설정 (HTTP 레벨 - 가장 먼저 실행)
	// =================================================================
	// Express 쿼리 파서 설정 - 복잡한 쿼리 객체 파싱 지원
	app.set("query parser", "extended");

	// =================================================================
	// 3. CORS 설정 (브라우저 보안 정책 - HTTP 레벨에서 처리)
	// =================================================================
	app.enableCors({
		origin: true, // 모든 도메인 허용 (개발환경용, 프로덕션에서는 특정 도메인 지정 권장)
		credentials: true, // 쿠키, 인증 헤더 포함 허용
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: "*", // 모든 헤더 허용
	});

	// =================================================================
	// 4. Global 설정 (Guards, Pipes, Filters, Interceptors)
	// =================================================================
	setNestApp(app);

	// =================================================================
	// 5. API 문서 설정 (Swagger)
	// =================================================================
	const oidcIssuer = process.env.OIDC_ISSUER || "http://localhost:3000";

	const swaggerConfig = new DocumentBuilder()
		.setTitle(process.env.APP_NAME || "Onora")
		.setVersion("1.0.0")
		.setDescription(
			"API 문서입니다. Core API와 IDP 관리 API를 함께 제공합니다. 대부분의 엔드포인트는 인증이 필요합니다.\n\n" +
				"**인증 방법:**\n" +
				"1. OAuth2 (권장) - Authorize 버튼 클릭 후 OIDC 로그인\n" +
				"2. Cookie - 브라우저에서 로그인 후 쿠키 자동 전송\n\n" +
				"**Tenant Scope:**\n" +
				"- 보호 API는 `x-tenant-id` header로 현재 Tenant를 선택합니다.\n" +
				"- 서버는 Tenant에서 Space를 파생하고, 기본적으로 현재 Space와 모든 하위 Space category 리소스를 조회합니다.\n" +
				"- `@WithAncestorSpaces`/`@WithSpaceTree`가 적용된 API는 Swagger JSON의 `x-space-resource-scope` 확장 필드로 scope를 표시합니다.",
		)
		.addCookieAuth(Token.ACCESS, {
			type: "apiKey",
			in: "cookie",
			name: Token.ACCESS,
			description: "JWT Access Token (HttpOnly 쿠키로 자동 전송)",
		})
		.addOAuth2({
			type: "oauth2",
			description: "OIDC Authorization Code + PKCE 인증",
			flows: {
				authorizationCode: {
					authorizationUrl: `${oidcIssuer}/oidc/auth`,
					tokenUrl: `${oidcIssuer}/oidc/token`,
					scopes: {
						openid: "OpenID Connect 기본 인증",
						profile: "프로필 정보 (이름)",
						email: "이메일 주소",
						roles: "역할 및 Tenant/Space 정보",
					},
				},
			},
		})
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (_controllerKey: string, methodKey: string) =>
			methodKey, // API 작업 ID를 메소드명으로 설정
	};

	const document = SwaggerModule.createDocument(app, swaggerConfig, {
		...options,
		include: SWAGGER_MODULES,
	});

	const port = process.env.APP_PORT || 3006;

	SwaggerModule.setup("api", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			oauth2RedirectUrl: `http://localhost:${port}/api/oauth2-redirect.html`,
			initOAuth: {
				clientId: "swagger-web",
				scopes: ["openid", "profile", "email", "roles"],
				usePkceWithAuthorizationCodeGrant: true,
			},
			requestInterceptor: (request: {
				url?: string;
				headers?: Record<string, string>;
			}) => {
				const browserGlobal = globalThis as {
					localStorage?: { getItem(key: string): string | null };
				};
				const tenantId = browserGlobal.localStorage?.getItem(
					"swagger:x-tenant-id",
				);

				if (tenantId && request.url?.includes("/api/v1/")) {
					request.headers = request.headers ?? {};

					const hasTenantHeader = Object.keys(request.headers).some(
						(headerName) => headerName.toLowerCase() === "x-tenant-id",
					);
					if (!hasTenantHeader) {
						request.headers["x-tenant-id"] = tenantId;
					}
				}

				return request;
			},
		},
		customJsStr: `window.__IDP_SERVER_URL = '${oidcIssuer}';\n${SWAGGER_TENANT_SELECTOR_JS}`,
	});

	// =================================================================
	// 6. 서버 시작 및 로깅
	// =================================================================
	await app.listen(port);

	const logger = app.get(Logger);
	logger.log(`🚀 서버가 ${port} 포트에서 시작되었습니다`);
	logger.log(`📱 환경: ${process.env.NODE_ENV}`);
	logger.log(`🐳 Docker: ${process.env.DOCKER_ENV === "true" ? "Yes" : "No"}`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
	logger.log(`📊 API Spec: http://localhost:${port}/api-json`);
	logger.log(
		`🔑 OIDC Discovery: http://localhost:${port}/oidc/.well-known/openid-configuration`,
	);
	if (enableNestDevtools) {
		const devtoolsPort =
			Number.parseInt(process.env.CORE_API_NEST_DEVTOOLS_PORT ?? "8000", 10) ||
			8000;
		logger.log(`🕸️ Nest Devtools: http://localhost:${devtoolsPort}`);
	}

	return app;
}

bootstrap().then((app) => {
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
});
