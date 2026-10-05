import objectStorageConfig from "./object-storage.config";

type ObjectStorageConfigShape = {
	endpoint?: string;
	forcePathStyle?: boolean;
	publicBaseUrl?: string;
};

const loadObjectStorageConfig =
	objectStorageConfig as unknown as () => ObjectStorageConfigShape;

describe("objectStorageConfig", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = {
			...originalEnv,
			OBJECT_STORAGE_PROVIDER: "cloudflare-r2",
			OBJECT_STORAGE_ACCESS_KEY: "access-key",
			OBJECT_STORAGE_SECRET_KEY: "secret-key",
			OBJECT_STORAGE_REGION: "auto",
			OBJECT_STORAGE_BUCKET: "asset-bucket",
			OBJECT_STORAGE_ENDPOINT: "https://example.r2.cloudflarestorage.com",
		};
		delete process.env.OBJECT_STORAGE_API_TOKEN;
		delete process.env.OBJECT_STORAGE_PUBLIC_BASE_URL;
		delete process.env.OBJECT_STORAGE_FORCE_PATH_STYLE;
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it("backblaze-b2는 forcePathStyle이 비어 있으면 안전한 기본값 true를 사용해야 한다", () => {
		process.env.OBJECT_STORAGE_PROVIDER = "backblaze-b2";
		process.env.OBJECT_STORAGE_ENDPOINT =
			"https://s3.us-west-004.backblazeb2.com";

		expect(loadObjectStorageConfig().forcePathStyle).toBe(true);
	});

	it("cloudflare-r2는 forcePathStyle이 비어 있으면 기본값 false를 유지해야 한다", () => {
		expect(loadObjectStorageConfig().forcePathStyle).toBe(false);
	});

	it("endpoint에 bucket path가 포함되면 origin-only endpoint로 정규화해야 한다", () => {
		process.env.OBJECT_STORAGE_PROVIDER = "backblaze-b2";
		process.env.OBJECT_STORAGE_ENDPOINT =
			"https://s3.us-west-004.backblazeb2.com/asset-bucket/";

		expect(loadObjectStorageConfig().endpoint).toBe(
			"https://s3.us-west-004.backblazeb2.com",
		);
	});

	it("endpoint에 bucket 외 path가 포함되면 설정 오류를 발생시켜야 한다", () => {
		process.env.OBJECT_STORAGE_ENDPOINT =
			"https://example.r2.cloudflarestorage.com/custom-prefix";

		expect(() => loadObjectStorageConfig()).toThrow(
			"OBJECT_STORAGE_ENDPOINT must be origin-only",
		);
	});

	it("publicBaseUrl 공백은 undefined로 정규화해야 한다", () => {
		process.env.OBJECT_STORAGE_PUBLIC_BASE_URL = "   ";

		expect(loadObjectStorageConfig().publicBaseUrl).toBeUndefined();
	});
});
