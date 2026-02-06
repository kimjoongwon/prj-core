import { Token } from "@cocrepo/constant";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";
import { AppModule } from "./module/app.module";
import { setNestApp } from "./setNestApp";

/**
 * Swagger UI Space 선택 플러그인
 * - topbar에 Space 드롭다운 추가
 * - 인증 후 Load 버튼으로 접근 가능한 Space 목록 로드
 * - 선택된 Space ID를 모든 API 요청의 X-Space-ID 헤더에 자동 주입
 */
const SWAGGER_SPACE_SELECTOR_JS = `
(function() {
  'use strict';
  var STORAGE_KEY = 'swagger-space-id';

  // fetch를 패치하여 X-Space-ID 헤더 자동 주입
  var origFetch = window.fetch;
  window.fetch = function(url, init) {
    var spaceId = localStorage.getItem(STORAGE_KEY);
    if (spaceId && typeof url === 'string' && url.indexOf('/api/v1/') !== -1) {
      init = init || {};
      if (init.headers instanceof Headers) {
        init.headers.set('X-Space-ID', spaceId);
      } else if (typeof init.headers === 'object') {
        init.headers['X-Space-ID'] = spaceId;
      } else {
        init.headers = { 'X-Space-ID': spaceId };
      }
    }
    return origFetch.apply(this, arguments);
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

    var savedSpaceId = localStorage.getItem(STORAGE_KEY) || '';

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

      origFetch('/api/v1/auth/my-spaces', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(function(r) { return r.json(); })
      .then(function(response) {
        var spaces = (response && response.data) || [];
        select.innerHTML = '<option value="">-- Space 선택 --</option>';
        spaces.forEach(function(s) {
          var opt = document.createElement('option');
          opt.value = s.id;
          var text = (s.ground && s.ground.name) ? s.ground.name : s.id;
          opt.textContent = text;
          if (s.id === savedSpaceId) opt.selected = true;
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
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
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

async function bootstrap() {
	// =================================================================
	// 1. 애플리케이션 생성 및 기본 설정
	// =================================================================
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true, // 로거 설정 전까지 로그 버퍼링
	});

	// 로거 설정 (가장 먼저 설정하여 모든 로그 캐치)
	app.useLogger(app.get(Logger));

	// =================================================================
	// 2. Express 미들웨어 설정 (HTTP 레벨 - 가장 먼저 실행)
	// =================================================================
	// 쿠키 파싱 미들웨어 - 모든 요청에서 쿠키를 자동 파싱
	app.use(cookieParser());

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
		.setTitle(process.env.APP_NAME || "NestJS Application")
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
				clientId: "prj-core-swagger",
				scopes: ["openid", "profile", "email", "roles"],
				usePkceWithAuthorizationCodeGrant: true,
			},
		},
		customJsStr: SWAGGER_SPACE_SELECTOR_JS,
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
}

bootstrap();
