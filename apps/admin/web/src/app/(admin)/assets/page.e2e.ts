import {
	capturePageErrors,
	getAdminSpaceRequestHeaders,
	loginToConsole,
} from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

function onlyUnexpectedPageErrors(pageErrors: string[]) {
	return pageErrors.filter(
		(message) =>
			!message.includes(
				"A table must have at least one Column with the isRowHeader prop set to true",
			),
	);
}

const SYSTEM_TENANT_ID = (
	process.env.E2E_SYSTEM_TENANT_ID ?? "01J00000000000000000000002"
).toLowerCase();
const ADMIN_API_BASE_URL = new URL(
	"/api/v1/",
	process.env.E2E_CORE_API_BASE_URL ?? "http://localhost:3000/",
).toString();
const getSpaceHeaders = () => getAdminSpaceRequestHeaders(SYSTEM_TENANT_ID);

type FolderListResponse = {
	data?: Array<{
		id: string;
		name: string;
		parentFolderId?: string | null;
	}>;
};

type AssetMutationResponse = {
	httpStatus?: number;
	message?: string;
	data?: {
		id: string;
		originalName: string;
		folderId: string;
	};
};

test.describe("에셋 목록 페이지", () => {
	test.describe("[E2E-003] 실업로드 회귀 @real", () => {
		test("한글 파일명의 실제 multipart 업로드가 201로 완료되고 목록에서 바로 조회되어야 한다", async ({
			page,
		}) => {
			await loginToConsole(page);
			const pageErrors = capturePageErrors(page);
			const uploadFileName = `한글-업로드-${Date.now()}.png`;
			let uploadedAssetId: string | null = null;

			try {
				const foldersResponse = await page.request.get(
					new URL("folders", ADMIN_API_BASE_URL).toString(),
					{
						headers: getSpaceHeaders(),
					},
				);
				expect(foldersResponse.ok()).toBeTruthy();
				const foldersBody =
					((await foldersResponse.json()) as FolderListResponse) ?? {};
				const targetFolder = foldersBody.data?.find((folder) =>
					Boolean(folder.id),
				);

				expect(
					targetFolder,
					"실업로드에 사용할 폴더가 필요합니다.",
				).toBeTruthy();

				const uploadResponse = await page.request.post(
					new URL("assets", ADMIN_API_BASE_URL).toString(),
					{
						headers: getSpaceHeaders(),
						multipart: {
							folderId: targetFolder!.id,
							file: {
								name: uploadFileName,
								mimeType: "image/png",
								buffer: Buffer.from("e2e-real-upload-png"),
							},
						},
					},
				);
				const uploadBody =
					((await uploadResponse.json()) as AssetMutationResponse) ?? {};

				expect(uploadResponse.ok()).toBeTruthy();
				expect(uploadBody.httpStatus).toBe(201);
				expect(uploadBody.message).toBe("에셋 업로드 성공");
				expect(uploadBody.data?.originalName).toBe(uploadFileName);
				expect(uploadBody.data?.folderId).toBe(targetFolder!.id);

				uploadedAssetId = uploadBody.data?.id ?? null;
				expect(uploadedAssetId).toBeTruthy();

				await page.goto("./assets", { waitUntil: "domcontentloaded" });
				await page.getByPlaceholder("파일명 검색...").fill(uploadFileName);
				await expect(
					page.getByRole("link", { name: uploadFileName }).first(),
				).toBeVisible();
				expect(onlyUnexpectedPageErrors(pageErrors)).toEqual([]);
			} finally {
				if (uploadedAssetId) {
					await page.request.delete(
						new URL(`assets/${uploadedAssetId}`, ADMIN_API_BASE_URL).toString(),
						{
							headers: getSpaceHeaders(),
						},
					);
				}
			}
		});
	});
});
