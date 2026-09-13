const fs = require("node:fs");
const path = require("node:path");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

/**
 * NestJS webpack HMR configuration
 *
 * 1. HMR: 코드 변경 시 프로세스 재시작 없이 모듈만 교체 (빠른 개발 루프)
 * 2. WatchPackagesPlugin: pnpm workspace 패키지의 dist/ 변경도 감지
 * 3. Custom externals: @cocrepo 패키지만 번들에 포함, 나머지 bare specifier는 모두 external
 *
 * nodeExternals 대신 커스텀 함수를 사용하는 이유:
 * - nodeExternals는 CWD의 node_modules 디렉토리를 스캔하여 패키지 목록을 구성
 * - pnpm workspace에서는 transitive 의존성이 apps/server/node_modules에 없음
 * - 따라서 @cocrepo 패키지가 import하는 npm 패키지를 external로 인식하지 못함
 * - 커스텀 함수는 import 문자열 패턴만으로 판단하므로 pnpm 구조에 무관하게 동작
 */

const packagesDir = path.resolve(__dirname, "../../../packages");
const watchPackages = [
	"be-common",
	"constant",
	"decorator",
	"dto",
	"entity",
	"enum",
	"prisma",
	"repository",
	"service",
	"toolkit",
	"vo",
];

/**
 * 워크스페이스 패키지 alias 목록
 *
 * injectWorkspacePackages(true) 환경에서는 peer 조합에 따라 일부 @cocrepo
 * 패키지가 node_modules/.pnpm 하드링크 사본으로 해석되고, 나머지는 원본
 * 링크로 해석된다. 두 경로가 한 번들에 섞이면 Symbol 기반 DI 토큰
 * (PRISMA_SERVICE_TOKEN)이 사본 수만큼 늘어나 Nest 의존성 해석이 깨진다.
 * 각 패키지의 exports 계약(require 조건)을 따라 살아 있는 워크스페이스
 * dist 파일로 통일해 모듈 정체성을 하나로 유지한다.
 */
const getRequireConditionTarget = (exportCondition) => {
	if (typeof exportCondition !== "object" || exportCondition === null) {
		return typeof exportCondition === "string" ? exportCondition : undefined;
	}
	return exportCondition.require ?? exportCondition.default;
};

const workspacePackageAliases = {};
for (const packageDirName of fs.readdirSync(packagesDir)) {
	const manifestPath = path.resolve(
		packagesDir,
		packageDirName,
		"package.json",
	);
	if (!fs.existsSync(manifestPath)) {
		continue;
	}
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
	const packageExportTargets = manifest.exports ?? { ".": manifest.main };
	for (const [subpath, exportCondition] of Object.entries(
		packageExportTargets,
	)) {
		if (subpath.includes("*") || subpath === "./package.json") {
			continue;
		}
		const exportTarget = getRequireConditionTarget(exportCondition);
		if (exportTarget === undefined) {
			continue;
		}
		const requestName =
			subpath === "." ? manifest.name : `${manifest.name}${subpath.slice(1)}`;
		// '$' 접미사는 exact 매칭이다. 없으면 '@cocrepo/decorator'가
		// '@cocrepo/decorator/field'를 접두사로 침범해 엔트리 파일 경로 뒤에
		// 서브패스를 붙인 존재하지 않는 경로를 만든다.
		workspacePackageAliases[`${requestName}$`] = path.resolve(
			packagesDir,
			packageDirName,
			exportTarget,
		);
	}
}

class WatchPackagesPlugin {
	apply(compiler) {
		compiler.hooks.afterCompile.tap("WatchPackagesPlugin", (compilation) => {
			for (const pkg of watchPackages) {
				const distDir = path.resolve(packagesDir, pkg, "dist");
				if (fs.existsSync(distDir)) {
					compilation.contextDependencies.add(distDir);
				}
			}
		});
	}
}

module.exports = (options, webpack) => ({
	...options,
	entry: ["webpack/hot/poll?100", options.entry],
	resolve: {
		...options.resolve,
		alias: workspacePackageAliases,
	},
	externals: [
		({ request }, callback) => {
			// 번들에 포함: @cocrepo workspace 패키지, HMR 클라이언트
			if (request === "webpack/hot/poll?100" || /^@cocrepo\//.test(request)) {
				return callback();
			}
			// 번들에 포함: 상대/절대 경로 import (번들된 @cocrepo 패키지 내부 파일)
			if (request.startsWith(".") || request.startsWith("/")) {
				return callback();
			}
			// external 처리: npm 패키지, Node.js 내장 모듈 등 모든 bare specifier
			return callback(null, `commonjs ${request}`);
		},
	],
	plugins: [
		...options.plugins,
		new webpack.HotModuleReplacementPlugin(),
		new RunScriptWebpackPlugin({
			name: options.output.filename,
			autoRestart: false,
		}),
		new WatchPackagesPlugin(),
	],
});
