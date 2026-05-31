import { Token } from "@cocrepo/constant";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { AppModule } from "./module/app.module";
import { setNestApp } from "./setNestApp";

/**
 * Swagger UI Space 선택 플러그인
 * - topbar에 Space 드롭다운 추가
 * - 인증 후 Load 버튼으로 접근 가능한 Space 목록 로드
 * - 선택된 Space는 auth/current-space API를 통해 HttpOnly 쿠키로 설정
 */
const SWAGGER_SPACE_SELECTOR_JS = `
(function() {
  'use strict';
  var origFetch = window.fetch;
  var isReauthorizing = false;
  var spacesCache = [];

  window.fetch = function(url, init) {
    return origFetch.apply(this, arguments).then(function(response) {
      if (response.status === 401 && !isReauthorizing && typeof url === 'string' && url.indexOf('/api/v1/') !== -1) {
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

  function createSpaceSelector() {
    var topbar = document.querySelector('.topbar-wrapper');
    if (!topbar || document.getElementById('space-selector')) return;

    var container = document.createElement('div');
    container.id = 'space-selector';
    container.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;padding-right:12px;';

    var label = document.createElement('span');
    label.textContent = 'Space:';
    label.style.cssText = 'color:#fff;font-size:13px;font-weight:600;white-space:nowrap;';

    var select = document.createElement('select');
    select.id = 'space-select';
    select.style.cssText = 'padding:5px 10px;border-radius:4px;background:#2b3137;color:#fff;border:1px solid #555;font-size:13px;min-width:220px;cursor:pointer;';
    select.innerHTML = '<option value="">-- Authorize 후 Load 클릭 --</option>';

    var loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.style.cssText = 'padding:5px 14px;border-radius:4px;background:#4990e2;color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;';
    loadBtn.title = 'Authorize 인증 후 클릭하면 Space 목록을 불러옵니다';

    loadBtn.addEventListener('click', function() {
      var token = getAuthToken();
      if (!token) {
        alert('먼저 Authorize 버튼으로 인증해주세요.');
        return;
      }
      loadBtn.textContent = '...';
      loadBtn.disabled = true;

      Promise.all([
        origFetch((window.__IDP_SERVER_URL || 'http://localhost:3007') + '/api/v1/auth/my-spaces', {
          credentials: 'include',
          headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(r) { return r.json(); }),
        origFetch((window.__IDP_SERVER_URL || 'http://localhost:3007') + '/api/v1/auth/current-space', {
          credentials: 'include',
          headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(r) { return r.json(); })
      ])
      .then(function(results) {
        var spacesResponse = results[0];
        var currentSpaceResponse = results[1];
        var raw = spacesResponse && spacesResponse.data;
        var currentSpace = currentSpaceResponse && currentSpaceResponse.data;
        var spaces = Array.isArray(raw) ? raw : [];
        spacesCache = spaces;
        select.innerHTML = '<option value="">-- Space 선택 --</option>';
        spaces.forEach(function(s) {
          var opt = document.createElement('option');
          opt.value = s.id;
          var text = (s.ground && s.ground.name) ? s.ground.name : s.id;
          opt.textContent = text;
          if (currentSpace && s.id === currentSpace.id) opt.selected = true;
          select.appendChild(opt);
        });
        if (spaces.length === 0) {
          select.innerHTML = '<option value="">접근 가능한 Space가 없습니다</option>';
        }
      })
      .catch(function(err) {
        alert('Space 로드 실패: ' + err.message);
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
        return;
      }

      select.disabled = true;
      origFetch((window.__IDP_SERVER_URL || 'http://localhost:3007') + '/api/v1/auth/current-space', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ spaceId: value })
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Space 선택 변경에 실패했습니다.');
        }
        return response.json();
      })
      .then(function(response) {
        var currentSpace = response && response.data;
        if (!currentSpace) {
          return;
        }
        for (var i = 0; i < select.options.length; i += 1) {
          select.options[i].selected = select.options[i].value === currentSpace.id;
        }
      })
      .catch(function(err) {
        alert('Space 변경 실패: ' + err.message);
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
      createSpaceSelector();
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
	const oidcIssuer = process.env.OIDC_ISSUER || "http://localhost:3007";

	const config = new DocumentBuilder()
		.setTitle(process.env.APP_NAME || "Onora")
		.setVersion("1.0.0")
		.setDescription(
			"API 문서입니다. 대부분의 엔드포인트는 인증이 필요합니다.\n\n" +
				"**인증 방법:**\n" +
				"1. OAuth2 (권장) - Authorize 버튼 클릭 후 OIDC 로그인\n" +
				"2. Cookie - 브라우저에서 로그인 후 쿠키 자동 전송",
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
						roles: "역할 및 Space 정보",
					},
				},
			},
		})
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (_controllerKey: string, methodKey: string) =>
			methodKey, // API 작업 ID를 메소드명으로 설정
	};

	const document = SwaggerModule.createDocument(app, config, options);

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
		},
		customJsStr: `window.__IDP_SERVER_URL = '${oidcIssuer}';\n${SWAGGER_SPACE_SELECTOR_JS}`,
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
