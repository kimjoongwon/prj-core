import { SetMetadata } from "@nestjs/common";

export const INJECT_TENANT_ID_KEY = "injectTenantId";
export const InjectTenantId = () => SetMetadata(INJECT_TENANT_ID_KEY, true);
