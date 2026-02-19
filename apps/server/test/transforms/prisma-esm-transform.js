/**
 * Prisma 7 생성 클라이언트 Jest 호환 transform
 *
 * Prisma 7은 CommonJS 포맷 파일에도 `import.meta.url`을 사용합니다.
 * Jest는 CommonJS 모드에서 `import.meta` 구문을 파싱하지 못하므로
 * CJS 호환 코드로 변환합니다.
 */
module.exports = {
	process(sourceText) {
		const patched = sourceText.replace(
			/import\.meta\.url/g,
			"require('url').pathToFileURL(__filename).href",
		);
		return { code: patched };
	},
};
