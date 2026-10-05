import "reflect-metadata";
import { Asset, Folder, hydrateEntity } from "@cocrepo/entity";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { assert, describe, expect, it } from "vitest";
import { AlbumDetailResponseDto } from "../album/album-detail-response.dto";
import { AssetDto } from "../asset/asset.dto";
import { AssetDetailWrapperResponseDto } from "../asset/asset-detail-wrapper-response.dto";
import { FolderDto } from "../folder/folder.dto";
import { InquiryDetailDto } from "../inquiries/inquiry-detail.dto";
import { InquiryMessageDto } from "../inquiries/inquiry-message.dto";
import { SentimentResultDto } from "../inquiries/sentiment-result.dto";
import { prepareEntityResponseType } from "../mapped-types";
import { TranslationResponseDto } from "../translations/translation-response.dto";

const publicDates = {
	createdAt: new Date("2026-08-01T00:00:00Z"),
	updatedAt: null,
	removedAt: null,
};

const assetInput = {
	...publicDates,
	id: 1n,
	assetId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	spaceId: 2n,
	folderId: 3n,
	kind: "IMAGE",
	status: "READY",
	originalName: "cover.png",
	storageKey: "files/cover.png",
	mimeType: "image/png",
	sizeBytes: 4096n,
	extension: "png",
	checksum: null,
	metadata: { dimensions: { width: 300 }, custom: true },
	createdById: null,
	publicUrl: "https://example.com/cover.png",
	password: "secret",
	unexpected: "private",
	createdBy: { password: "nested secret" },
};

describe("Entity 기반 콘텐츠 응답의 공개 필드 계약", () => {
	it("내부 Asset은 bigint와 도메인 메서드를 보존하고 응답은 숫자 크기와 API URL만 노출한다", () => {
		const entity = hydrateEntity(Asset, assetInput);
		assert(!Array.isArray(entity));
		prepareEntityResponseType(AssetDto);
		const response = plainToInstance(AssetDto, entity);
		const serialized = instanceToPlain(response);

		expect(entity.sizeBytes).toBe(4096n);
		expect(entity.isReady()).toBe(true);
		expect(response.sizeBytes).toBe(4096);
		expect(response.publicUrl).toBe(assetInput.publicUrl);
		expect(serialized).toMatchObject({
			id: "1",
			sizeBytes: 4096,
			metadata: assetInput.metadata,
			publicUrl: assetInput.publicUrl,
		});
		for (const privateField of [
			"assetId",
			"password",
			"unexpected",
			"createdBy",
		])
			expect(response).not.toHaveProperty(privateField);
		expect("isReady" in response).toBe(false);
		expect(() => JSON.stringify(serialized)).not.toThrow();
	});

	it("폴더의 재귀 관계와 상세 wrapper 안의 파생 리소스에서도 비공개 필드를 제외한다", () => {
		prepareEntityResponseType(FolderDto);
		const folder = plainToInstance(FolderDto, {
			id: "3",
			folderId: "root-ulid",
			name: "images",
			children: [
				{ id: "4", name: "nested", folderId: "child-ulid", unexpected: true },
			],
		});
		expect(folder.children?.[0]).toBeInstanceOf(FolderDto);
		expect(folder.children?.[0]).not.toHaveProperty("folderId");
		expect(folder.children?.[0]).not.toHaveProperty("unexpected");
		expect(folder).not.toHaveProperty("folderId");
		expect(hydrateEntity(Folder, { parentFolderId: null }).isRoot()).toBe(true);

		prepareEntityResponseType(AssetDetailWrapperResponseDto);
		const wrapper = plainToInstance(AssetDetailWrapperResponseDto, {
			data: {
				...assetInput,
				derivatives: [
					{
						id: "9",
						sizeBytes: 1024n,
						derivativeId: "secret-ulid",
						asset: assetInput,
						unexpected: true,
					},
				],
			},
		});
		expect(wrapper.data.derivatives?.[0].sizeBytes).toBe(1024);
		expect(wrapper.data.derivatives?.[0]).not.toHaveProperty("derivativeId");
		expect(wrapper.data.derivatives?.[0]).not.toHaveProperty("asset");
		expect(wrapper.data.derivatives?.[0]).not.toHaveProperty("unexpected");
	});

	it("앨범 상세의 엔트리와 커버 에셋을 각각 공개 응답 DTO로 변환한다", () => {
		prepareEntityResponseType(AlbumDetailResponseDto);
		const response = plainToInstance(AlbumDetailResponseDto, {
			id: "6",
			albumId: "secret-ulid",
			coverAsset: assetInput,
			entries: [
				{
					id: "7",
					albumEntryId: "secret-ulid",
					asset: assetInput,
					unexpected: true,
				},
			],
		});
		expect(response.coverAsset).toBeInstanceOf(AssetDto);
		expect(response.entries?.[0].asset).toBeInstanceOf(AssetDto);
		expect(response.entries?.[0]).not.toHaveProperty("albumEntryId");
		expect(response.entries?.[0].asset).not.toHaveProperty("password");
		expect(response).not.toHaveProperty("albumId");
	});

	it("문의 상세의 별도 감정 분석과 스레드·참여자 관계를 유지한다", () => {
		prepareEntityResponseType(InquiryDetailDto);
		const response = plainToInstance(InquiryDetailDto, {
			id: "10",
			inquiryId: "secret-ulid",
			aiAgentLogs: [{ prompt: "private" }],
			sentiment: {
				id: "11",
				sentiment: "POSITIVE",
				score: 0.9,
				sentimentAnalysisId: "secret-ulid",
				emotions: { private: true },
			},
			threads: [
				{
					id: "12",
					title: null,
					inquiryThreadId: "secret-ulid",
					messages: [{}],
				},
			],
			participants: [
				{
					id: "13",
					userName: "고객",
					userAvatar: null,
					inquiryParticipantId: "secret-ulid",
					user: { password: "secret" },
				},
			],
		});
		expect(response.sentiment).toBeInstanceOf(SentimentResultDto);
		expect(response.sentiment).toMatchObject({ score: 0.9 });
		expect(response.sentiment).not.toHaveProperty("emotions");
		expect(response.threads[0].title).toBeNull();
		expect(response.threads[0]).not.toHaveProperty("messages");
		expect(response.participants[0]).toMatchObject({
			userName: "고객",
			userAvatar: null,
		});
		expect(response.participants[0]).not.toHaveProperty("user");
		expect(response).not.toHaveProperty("aiAgentLogs");
	});

	it("메시지 발신자 표시 정보와 첨부 크기의 number 계약을 유지한다", () => {
		prepareEntityResponseType(InquiryMessageDto);
		const response = plainToInstance(InquiryMessageDto, {
			id: "15",
			senderName: "고객",
			senderAvatar: null,
			inquiryMessageId: "secret-ulid",
			attachments: [
				{
					id: "16",
					fileSize: 512n,
					fileName: "photo.png",
					inquiryAttachmentId: "secret-ulid",
					fileType: "IMAGE",
					unexpected: true,
				},
			],
		});
		expect(response).toMatchObject({ senderName: "고객", senderAvatar: null });
		expect(response.attachments?.[0].fileSize).toBe(512);
		expect(response.attachments?.[0]).not.toHaveProperty("fileType");
		expect(response.attachments?.[0]).not.toHaveProperty("inquiryAttachmentId");
		expect(response.attachments?.[0]).not.toHaveProperty("unexpected");
	});

	it("번역 API의 문자열 식별자와 명시한 공통 필드를 유지한다", () => {
		prepareEntityResponseType(TranslationResponseDto);
		const response = plainToInstance(TranslationResponseDto, {
			id: "clxxx12345",
			languageCode: "ko_KR",
			key: "성공",
			text: "성공",
			category: "공통",
			isTranslated: true,
			...publicDates,
			unexpected: true,
		});
		expect(response.id).toBe("clxxx12345");
		expect(response.text).toBe("성공");
		expect(response.updatedAt).toBeNull();
		expect(response).not.toHaveProperty("removedAt");
		expect(response).not.toHaveProperty("unexpected");
	});
});
