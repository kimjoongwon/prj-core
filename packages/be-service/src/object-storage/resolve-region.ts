import type { ObjectStorageConfig } from "@cocrepo/type";
import { CLOUDFLARE_R2_REGIONS } from "./cloudflare-r2-regions";

export function resolveRegion(objectStorage: ObjectStorageConfig): string {
	if (objectStorage.provider !== "cloudflare-r2") {
		return objectStorage.region;
	}

	if (CLOUDFLARE_R2_REGIONS.has(objectStorage.region)) {
		return objectStorage.region;
	}

	return "auto";
}
