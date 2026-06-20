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

const packagesDir = path.resolve(__dirname, "../../packages");
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
