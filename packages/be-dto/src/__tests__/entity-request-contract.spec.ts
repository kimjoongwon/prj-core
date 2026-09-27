import "reflect-metadata";
import { type Type, ValidationPipe } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { describe, expect, it } from "vitest";
import { CreateAbilityDto } from "../abilities/create-ability.dto";
import { CreateAssetDto } from "../asset/create-asset.dto";
import { UpdateAssetDto } from "../asset/update-asset.dto";
import { CreateRoleDto } from "../create/create-role.dto";
import { CreateFolderDto } from "../folder/create-folder.dto";
import { UpdateFolderDto } from "../folder/update-folder.dto";
import { CreateInquiryDto } from "../inquiries/create-inquiry.dto";
import { CreatePolicyDto } from "../policies/create-policy.dto";
import { UpdatePolicyDto } from "../policies/update-policy.dto";
import { CreateServiceDocumentDto } from "../service-documents/create-service-document.dto";
import { UpdateRoleDto } from "../update/update-role.dto";

const validationPipe = new ValidationPipe({
	transform: true,
	whitelist: true,
	forbidNonWhitelisted: true,
});

function validateRequest<T extends object>(requestType: Type<T>, body: object) {
	return validationPipe.transform(body, {
		type: "body",
		metatype: requestType,
	});
}

describe("Entity에서 파생한 요청 DTO 계약", () => {
	it("Role 생성은 필수 이름과 기존 패턴을 검증한다", async () => {
		await expect(validateRequest(CreateRoleDto, {})).rejects.toThrow();
		await expect(
			validateRequest(CreateRoleDto, { name: "invalid-role" }),
		).rejects.toThrow();
		await expect(
			validateRequest(CreateRoleDto, {
				name: "MANAGER",
				displayName: null,
				description: null,
			}),
		).resolves.toMatchObject({
			name: "MANAGER",
			displayName: null,
			description: null,
		});
	});

	it.each([
		CreateRoleDto,
		UpdateRoleDto,
	])("%s는 assignments와 알 수 없는 필드를 거부한다", async (requestType) => {
		const roleBody = requestType === CreateRoleDto ? { name: "MANAGER" } : {};
		await expect(
			validateRequest(requestType, { ...roleBody, assignments: [] }),
		).rejects.toThrow();
		await expect(
			validateRequest(requestType, { ...roleBody, unexpected: true }),
		).rejects.toThrow();
		await expect(
			validateRequest(requestType, {
				...roleBody,
				roleId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
			}),
		).rejects.toThrow();
	});

	it("Role 수정은 빈 요청과 null을 허용하고 name을 거부한다", async () => {
		await expect(validateRequest(UpdateRoleDto, {})).resolves.toBeInstanceOf(
			UpdateRoleDto,
		);
		await expect(
			validateRequest(UpdateRoleDto, { displayName: null }),
		).resolves.toMatchObject({ displayName: null });
		await expect(
			validateRequest(UpdateRoleDto, { name: "NEW_NAME" }),
		).rejects.toThrow();
	});

	it("Folder는 공통 ID 변환과 입력 전용 파일명 제약을 함께 유지한다", async () => {
		await expect(
			validateRequest(CreateFolderDto, {
				name: "images",
				parentFolderId: "42",
			}),
		).resolves.toMatchObject({ parentFolderId: 42n });
		await expect(
			validateRequest(CreateFolderDto, { name: "invalid/name" }),
		).rejects.toThrow();
		await expect(
			validateRequest(CreateFolderDto, {
				name: "images",
				parentFolderId: "invalid",
			}),
		).rejects.toThrow();
		await expect(
			validateRequest(CreateFolderDto, {
				name: "images",
				parentFolderId: null,
			}),
		).resolves.toBeInstanceOf(CreateFolderDto);
		await expect(
			validateRequest(UpdateFolderDto, { name: null }),
		).resolves.toMatchObject({ name: null });
	});

	it("독립적으로 선언하던 선택 입력은 null 금지 계약을 유지한다", async () => {
		await expect(
			validateRequest(CreatePolicyDto, { name: "policy", description: null }),
		).rejects.toThrow();
		await expect(
			validateRequest(UpdatePolicyDto, { description: null }),
		).resolves.toMatchObject({ description: null });
		await expect(
			validateRequest(CreateServiceDocumentDto, {
				kind: "TERMS_OF_SERVICE",
				title: "약관",
				content: "내용",
				version: "1",
				platform: null,
			}),
		).rejects.toThrow();
		await expect(
			validateRequest(CreateInquiryDto, {
				title: "문의 제목",
				category: "GENERAL",
				channel: "WEB",
				priority: null,
			}),
		).rejects.toThrow();
	});

	it("Ability의 엄격한 boolean과 JSON 입력은 DTO 전용 계약을 유지한다", async () => {
		await expect(
			validateRequest(CreateAbilityDto, {
				actionId: "1",
				subjectId: "2",
				name: "read",
				inverted: false,
				conditions: { ownerId: "1" },
			}),
		).resolves.toMatchObject({ actionId: 1n, subjectId: 2n });
		await expect(
			validateRequest(CreateAbilityDto, {
				actionId: "1",
				subjectId: "2",
				name: "read",
				inverted: "false",
			}),
		).rejects.toThrow();
	});

	it("파일 크기는 DB bigint와 구분하여 기존 숫자 입력으로 변환한다", async () => {
		const assetBody = {
			spaceId: "1",
			folderId: "2",
			kind: "IMAGE",
			status: "READY",
			originalName: "image.png",
			storageKey: "image.png",
			mimeType: "image/png",
			sizeBytes: 1024,
		};
		await expect(
			validateRequest(CreateAssetDto, assetBody),
		).resolves.toMatchObject({ sizeBytes: 1024 });
		await expect(
			validateRequest(UpdateAssetDto, { sizeBytes: "2048", publicUrl: null }),
		).resolves.toMatchObject({ sizeBytes: 2048, publicUrl: null });
		await expect(
			validateRequest(UpdateAssetDto, { sizeBytes: 1.5 }),
		).rejects.toThrow();
	});
});
