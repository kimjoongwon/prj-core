import type { IdpAccountInfo } from "./idp-account.info";
import type { IdpAccountAccessGrantInfo } from "./idp-account-access-grant.info";

export interface IdpAccountDetailInfo extends IdpAccountInfo {
	accessGrants: IdpAccountAccessGrantInfo[];
}
