import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/cover-letter/",
	plugins: [
		react(),
		{
			name: "assert-document-sdk-is-build-only",
			generateBundle(_outputOptions, applicationBundle) {
				for (const applicationChunk of Object.values(applicationBundle)) {
					if (applicationChunk.type !== "chunk") continue;
					for (const moduleId of Object.keys(applicationChunk.modules)) {
						if (
							/\/node_modules\/(?:@react-docx\/core|docx|react-reconciler)(?:\/|$)/.test(
								moduleId.replaceAll("\\", "/"),
							)
						) {
							this.error(
								`문서 생성 SDK가 브라우저 번들에 포함됐습니다: ${moduleId}`,
							);
						}
					}
				}
			},
		},
	],
	build: {
		outDir: "dist",
	},
});
