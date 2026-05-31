import { existsSync } from "node:fs";
import { join } from "node:path";
import { SERVICE_PKG_ROOT_CANDIDATES } from "./service-pkg-root-candidates";

export const SERVICE_PKG_ROOT =
	SERVICE_PKG_ROOT_CANDIDATES.find((candidate) =>
		existsSync(join(candidate, "src/i18n/locales")),
	) ?? SERVICE_PKG_ROOT_CANDIDATES[0];
