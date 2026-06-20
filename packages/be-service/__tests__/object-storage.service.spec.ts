import * as S3Module from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import {
	ObjectStorageService,
	S3CompatibleStorageService,
} from "../src/object-storage";

jest.mock("@aws-sdk/client-s3", () => {
	const mockSend = jest.fn();

	return {
		__mockSend: mockSend,
		S3Client: jest.fn().mockImplementation(function (
			this: {
				config?: unknown;
				send?: typeof mockSend;
			},
			config,
		) {
			this.config = config;
			this.send = mockSend;
		}),
		PutObjectCommand: jest.fn().mockImplementation((input) => ({
			type: "PutObjectCommand",
			input,
		})),
		DeleteObjectCommand: jest.fn().mockImplementation((input) => ({
			type: "DeleteObjectCommand",
			input,
		})),
		GetObjectCommand: jest.fn().mockImplementation((input) => ({
			type: "GetObjectCommand",
			input,
		})),
	};
});

const mockSend = (S3Module as typeof S3Module & { __mockSend: jest.Mock })
	.__mockSend;
const S3ClientMock = S3Module.S3Client as unknown as jest.Mock;
const PutObjectCommandMock = S3Module.PutObjectCommand as unknown as jest.Mock;
const DeleteObjectCommandMock =
	S3Module.DeleteObjectCommand as unknown as jest.Mock;
const GetObjectCommandMock = S3Module.GetObjectCommand as unknown as jest.Mock;

describe("S3CompatibleStorageService", () => {
	let service: ObjectStorageService;
	let mockConfigService: jest.Mocked<ConfigService>;

	const mockObjectStorageConfig = {
		provider: "backblaze-b2" as const,
		accessKeyId: "key-id",
		secretAccessKey: "secret-key",
		region: "us-west-004",
		bucket: "asset-bucket",
		endpoint: "https://s3.us-west-004.backblazeb2.com",
		publicBaseUrl: "https://cdn.example.com/assets",
		forcePathStyle: true,
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		mockSend.mockReset();

		mockConfigService = {
			get: jest.fn().mockReturnValue(mockObjectStorageConfig),
		} as unknown as jest.Mocked<ConfigService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3CompatibleStorageService,
				{
					provide: ObjectStorageService,
					useExisting: S3CompatibleStorageService,
				},
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get<ObjectStorageService>(ObjectStorageService);
		Object.defineProperty(service, "client", {
			value: { send: mockSend },
		});
	});

	async function createService(
		overrideConfig?: Partial<typeof mockObjectStorageConfig>,
	): Promise<ObjectStorageService> {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3CompatibleStorageService,
				{
					provide: ObjectStorageService,
					useExisting: S3CompatibleStorageService,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue({
							...mockObjectStorageConfig,
							...overrideConfig,
						}),
					},
				},
			],
		}).compile();

		const createdService =
			module.get<ObjectStorageService>(ObjectStorageService);
		Object.defineProperty(createdService, "client", {
			value: { send: mockSend },
		});
		return createdService;
	}

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	it("S3-compatible client를 endpoint 기반으로 초기화해야 한다", () => {
		expect(S3ClientMock).toHaveBeenCalledWith({
			region: "us-west-004",
			endpoint: "https://s3.us-west-004.backblazeb2.com",
			forcePathStyle: true,
			credentials: {
				accessKeyId: "key-id",
				secretAccessKey: "secret-key",
			},
		});
	});

	it("object를 업로드하고 public url을 반환해야 한다", async () => {
		mockSend.mockResolvedValue({ ETag: '"etag-123"' });

		const result = await service.putObject({
			key: "spaces/space-1/assets/image/file.png",
			body: Buffer.from("file-body"),
			contentType: "image/png",
			contentLength: 9,
			checksum: "checksum-hex",
			metadata: {
				originalName: "file.png",
			},
		});

		expect(PutObjectCommandMock).toHaveBeenCalledWith({
			Bucket: "asset-bucket",
			Key: "spaces/space-1/assets/image/file.png",
			Body: Buffer.from("file-body"),
			ContentType: "image/png",
			ContentLength: 9,
			Metadata: {
				originalName: "file.png",
				checksumSha256: "checksum-hex",
			},
		});
		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(result).toEqual({
			key: "spaces/space-1/assets/image/file.png",
			publicUrl:
				"https://cdn.example.com/assets/spaces/space-1/assets/image/file.png",
			etag: '"etag-123"',
		});
	});

	it("metadata에 비ASCII 파일명이 오면 서명 안정성을 위해 ASCII-safe 값으로 인코딩해야 한다", async () => {
		mockSend.mockResolvedValue({ ETag: '"etag-utf8"' });

		await service.putObject({
			key: "spaces/space-1/assets/image/hangul-file.png",
			body: Buffer.from("file-body"),
			contentType: "image/png",
			metadata: {
				originalName: "한글-테스트.png",
			},
		});

		expect(PutObjectCommandMock).toHaveBeenCalledWith({
			Bucket: "asset-bucket",
			Key: "spaces/space-1/assets/image/hangul-file.png",
			Body: Buffer.from("file-body"),
			ContentType: "image/png",
			ContentLength: undefined,
			Metadata: {
				originalName: "%ED%95%9C%EA%B8%80-%ED%85%8C%EC%8A%A4%ED%8A%B8.png",
			},
		});
	});

	it("object를 삭제해야 한다", async () => {
		mockSend.mockResolvedValue({});

		await service.deleteObject("spaces/space-1/assets/image/file.png");

		expect(DeleteObjectCommandMock).toHaveBeenCalledWith({
			Bucket: "asset-bucket",
			Key: "spaces/space-1/assets/image/file.png",
		});
		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it("object를 조회해야 한다", async () => {
		mockSend.mockResolvedValue({
			Body: {
				transformToByteArray: jest
					.fn()
					.mockResolvedValue(Uint8Array.from([104, 105])),
			},
			ContentType: "image/png",
			ContentLength: 2,
			ETag: '"etag-789"',
			LastModified: new Date("2026-04-05T06:00:00.000Z"),
		});

		const result = await service.getObject(
			"spaces/space-1/assets/image/file.png",
		);

		expect(GetObjectCommandMock).toHaveBeenCalledWith({
			Bucket: "asset-bucket",
			Key: "spaces/space-1/assets/image/file.png",
		});
		expect(result).toEqual({
			body: Buffer.from("hi"),
			contentType: "image/png",
			contentLength: 2,
			etag: '"etag-789"',
			lastModified: new Date("2026-04-05T06:00:00.000Z"),
		});
	});

	it("publicBaseUrl이 없으면 public url은 null이어야 한다", () => {
		return expect(
			createService({ publicBaseUrl: undefined }).then((createdService) =>
				createdService.getPublicUrl("spaces/space-1/assets/image/file.png"),
			),
		).resolves.toBeNull();
	});
});
