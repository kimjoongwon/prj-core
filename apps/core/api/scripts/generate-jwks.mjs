#!/usr/bin/env node

/**
 * OIDC Provider용 RS256 JWKS 키 페어 생성 스크립트
 *
 * 사용법:
 *   node apps/core/api/scripts/generate-jwks.mjs
 *
 * 결과:
 *   - OIDC_JWKS_KEYS 환경변수에 설정할 JSON 문자열을 출력
 */

import { generateKeyPair, exportJWK, calculateJwkThumbprint } from "jose";

async function main() {
	const { privateKey } = await generateKeyPair("RS256");

	const privateJwk = await exportJWK(privateKey);
	const kid = await calculateJwkThumbprint(privateJwk, "sha256");

	const jwk = {
		...privateJwk,
		kid,
		use: "sig",
		alg: "RS256",
	};

	const jwks = { keys: [jwk] };

	console.log("=== JWKS Configuration ===\n");
	console.log("Add the following to your .env file:\n");
	console.log(`OIDC_JWKS_KEYS='${JSON.stringify(jwks)}'`);
	console.log("\n=== End ===");
}

main().catch(console.error);
