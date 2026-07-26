import type { LanguageCode } from "@cocrepo/prisma";

/**
 * 피트니스 센터(스페이스) 수정 요청 입력값입니다.
 */
export interface UpdateSpaceFitnessCenterCommandInput {
	contentLanguageCode?: LanguageCode;
	name?: string;
	label?: string | null;
	address?: string;
	phone?: string;
	email?: string;
	imageFileId?: string;
}
