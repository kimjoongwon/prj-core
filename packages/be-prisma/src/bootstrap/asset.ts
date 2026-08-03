import {
	albumEntrySeedData,
	albumSeedData,
	assetSeedData,
	derivativeSeedData,
	documentDetailSeedData,
	folderSeedData,
	imageDetailSeedData,
	videoDetailSeedData,
} from "../demo-data";
import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";

type DbId = bigint;

/**
 * asset 도메인 데모 데이터를 계층 순서대로 적재합니다.
 *
 * folder -> asset -> detail -> derivative -> album -> album entry 순서를 지키는 이유는
 * 뒤 단계가 앞 단계의 id 또는 storageKey 매핑을 참조하기 때문입니다.
 */
export async function createAssetDomainData(
	prisma: PrismaClient,
): Promise<void> {
	console.log("\n========================================");
	console.log("Asset Domain 시드 데이터 삽입 중...");
	console.log("========================================");

	const systemSpace = await prisma.space.findFirst({
		where: {
			classification: {
				category: { name: "루트" },
			},
		},
	});

	if (!systemSpace) {
		console.error("System Space를 찾을 수 없습니다. Asset 시드를 건너뜁니다.");
		return;
	}

	const adminUser = await prisma.user.findFirst({
		where: { email: "admin@plate.com" },
	});
	const createdByEmails = [
		...new Set(
			[
				...assetSeedData.map((asset) => asset.createdByEmail),
				...albumSeedData.map((album) => album.createdByEmail),
			].filter((email): email is string => Boolean(email)),
		),
	];
	const createdByUsers = await prisma.user.findMany({
		where: { email: { in: createdByEmails } },
	});
	// Reuse email -> internal user lookups while creating related rows.
	const userIdByCreatedByEmail = new Map(
		createdByUsers.map((user) => [user.email, user.id]),
	);

	console.log("\n[1/6] Folder 생성 중...");
	// Folders are resolved by path so later assets can attach without additional
	// hierarchical queries.
	const folderByPath = new Map<string, { id: DbId }>();
	let folderCreated = 0;
	let folderSkipped = 0;

	for (const folderData of folderSeedData) {
		const existing = await prisma.folder.findUnique({
			where: { path: folderData.path },
		});

		if (!existing) {
			let parentFolderId: DbId | undefined;
			if (folderData.parentFolderPath) {
				const parentFolder = folderByPath.get(folderData.parentFolderPath);
				if (parentFolder) {
					parentFolderId = parentFolder.id;
				}
			}

			const folder = await prisma.folder.create({
				data: {
					spaceId: systemSpace.id,
					name: folderData.name,
					path: folderData.path,
					parentFolderId,
					sortOrder: folderData.sortOrder,
					createdById: adminUser?.id,
				},
			});
			folderByPath.set(folderData.path, { id: folder.id });
			folderCreated++;
			console.log(`  - Folder 생성: ${folderData.path}`);
		} else {
			folderByPath.set(folderData.path, { id: existing.id });
			folderSkipped++;
		}
	}
	console.log(
		`Folder 완료! (생성: ${folderCreated}개, 스킵: ${folderSkipped}개)`,
	);

	console.log("\n[2/6] Asset 생성 중...");
	// Child tables (Image/Video/Document/Derivative/AlbumEntry) all resolve back
	// to assets through storageKey, so cache that mapping here.
	const assetByStorageKey = new Map<string, { id: DbId; kind: string }>();
	let assetCreated = 0;
	let assetSkipped = 0;

	for (const assetData of assetSeedData) {
		const existing = await prisma.asset.findUnique({
			where: { storageKey: assetData.storageKey },
		});

		if (!existing) {
			const folder = folderByPath.get(assetData.folderPath);
			if (!folder) {
				console.warn(`  - Folder를 찾을 수 없음: ${assetData.folderPath}`);
				continue;
			}

			const asset = await prisma.asset.create({
				data: {
					spaceId: systemSpace.id,
					folderId: folder.id,
					kind: assetData.kind as "IMAGE" | "VIDEO" | "DOCUMENT",
					status: "READY",
					originalName: assetData.originalName,
					storageKey: assetData.storageKey,
					mimeType: assetData.mimeType,
					extension: assetData.extension,
					sizeBytes: BigInt(assetData.sizeBytes),
					checksum: assetData.checksum,
					metadata: assetData.metadata
						? (assetData.metadata as unknown as Prisma.InputJsonObject)
						: undefined,
					createdById: assetData.createdByEmail
						? userIdByCreatedByEmail.get(assetData.createdByEmail)
						: undefined,
				},
			});
			assetByStorageKey.set(assetData.storageKey, {
				id: asset.id,
				kind: assetData.kind,
			});
			assetCreated++;
			console.log(
				`  - Asset 생성: ${assetData.originalName} (${assetData.kind})`,
			);
		} else {
			assetByStorageKey.set(assetData.storageKey, {
				id: existing.id,
				kind: existing.kind,
			});
			assetSkipped++;
		}
	}
	console.log(`Asset 완료! (생성: ${assetCreated}개, 스킵: ${assetSkipped}개)`);

	console.log("\n[3/6] Image Detail 생성 중...");
	let imageCreated = 0;
	let imageSkipped = 0;

	for (const imageData of imageDetailSeedData) {
		const asset = assetByStorageKey.get(imageData.storageKey);
		if (!asset || asset.kind !== "IMAGE") {
			continue;
		}

		const existing = await prisma.image.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.image.create({
				data: {
					assetId: asset.id,
					width: imageData.width,
					height: imageData.height,
					orientation: imageData.orientation,
					colorSpace: imageData.colorSpace,
					hasAlpha: imageData.hasAlpha,
				},
			});
			imageCreated++;
		} else {
			imageSkipped++;
		}
	}
	console.log(
		`Image Detail 완료! (생성: ${imageCreated}개, 스킵: ${imageSkipped}개)`,
	);

	console.log("\n[4/6] Video Detail 생성 중...");
	let videoCreated = 0;
	let videoSkipped = 0;

	for (const videoData of videoDetailSeedData) {
		const asset = assetByStorageKey.get(videoData.storageKey);
		if (!asset || asset.kind !== "VIDEO") {
			continue;
		}

		const existing = await prisma.video.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.video.create({
				data: {
					assetId: asset.id,
					width: videoData.width,
					height: videoData.height,
					durationMs: videoData.durationMs,
					frameRate: videoData.frameRate,
					codec: videoData.codec,
					bitrate: videoData.bitrate,
					hasAudio: videoData.hasAudio,
				},
			});
			videoCreated++;
		} else {
			videoSkipped++;
		}
	}
	console.log(
		`Video Detail 완료! (생성: ${videoCreated}개, 스킵: ${videoSkipped}개)`,
	);

	console.log("\n[5/6] Document Detail 생성 중...");
	let documentCreated = 0;
	let documentSkipped = 0;

	for (const docData of documentDetailSeedData) {
		const asset = assetByStorageKey.get(docData.storageKey);
		if (!asset || asset.kind !== "DOCUMENT") {
			continue;
		}

		const existing = await prisma.document.findUnique({
			where: { assetId: asset.id },
		});

		if (!existing) {
			await prisma.document.create({
				data: {
					assetId: asset.id,
					pageCount: docData.pageCount,
					wordCount: docData.wordCount,
					author: docData.author,
					title: docData.title,
					subject: docData.subject,
					keywords: docData.keywords,
				},
			});
			documentCreated++;
		} else {
			documentSkipped++;
		}
	}
	console.log(
		`Document Detail 완료! (생성: ${documentCreated}개, 스킵: ${documentSkipped}개)`,
	);

	console.log("\n[6/6] Derivative 생성 중...");
	let derivativeCreated = 0;
	let derivativeSkipped = 0;

	for (const derivativeData of derivativeSeedData) {
		const sourceAsset = assetByStorageKey.get(derivativeData.sourceStorageKey);
		if (!sourceAsset) {
			continue;
		}

		const existing = await prisma.derivative.findUnique({
			where: { storageKey: derivativeData.storageKey },
		});

		if (!existing) {
			await prisma.derivative.create({
				data: {
					spaceId: systemSpace.id,
					createdById: adminUser?.id,
					assetId: sourceAsset.id,
					kind: derivativeData.kind as
						| "THUMBNAIL"
						| "PREVIEW"
						| "TRANSCODE"
						| "TEXT",
					profile: "default",
					storageKey: derivativeData.storageKey,
					mimeType: derivativeData.mimeType,
					sizeBytes: BigInt(derivativeData.sizeBytes),
					width: derivativeData.width,
					height: derivativeData.height,
					durationMs: derivativeData.durationMs,
				},
			});
			derivativeCreated++;
			console.log(
				`  - Derivative 생성: ${derivativeData.kind} - ${derivativeData.storageKey}`,
			);
		} else {
			derivativeSkipped++;
		}
	}
	console.log(
		`Derivative 완료! (생성: ${derivativeCreated}개, 스킵: ${derivativeSkipped}개)`,
	);

	console.log("\n[7/8] Album 생성 중...");
	// Albums are keyed by name within the system space for this bootstrap path.
	const albumByName = new Map<string, { id: DbId }>();
	let albumCreated = 0;
	let albumSkipped = 0;

	for (const albumData of albumSeedData) {
		let coverAssetId: bigint | undefined;
		if (albumData.coverStorageKey) {
			const coverAsset = assetByStorageKey.get(albumData.coverStorageKey);
			if (coverAsset) {
				coverAssetId = coverAsset.id;
			}
		}

		const existing = await prisma.album.findFirst({
			where: {
				name: albumData.name,
				spaceId: systemSpace.id,
			},
		});

		if (!existing) {
			const album = await prisma.album.create({
				data: {
					spaceId: systemSpace.id,
					name: albumData.name,
					description: albumData.description,
					coverAssetId,
					sortOrder: albumData.sortOrder,
					createdById: albumData.createdByEmail
						? userIdByCreatedByEmail.get(albumData.createdByEmail)
						: undefined,
				},
			});
			albumByName.set(albumData.name, { id: album.id });
			albumCreated++;
			console.log(`  - Album 생성: ${albumData.name}`);
		} else {
			albumByName.set(albumData.name, { id: existing.id });
			albumSkipped++;
		}
	}
	console.log(`Album 완료! (생성: ${albumCreated}개, 스킵: ${albumSkipped}개)`);

	console.log("\n[8/8] AlbumEntry 생성 중...");
	let entryCreated = 0;
	let entrySkipped = 0;

	for (const entryData of albumEntrySeedData) {
		const album = albumByName.get(entryData.albumName);
		if (!album) {
			continue;
		}

		const asset = assetByStorageKey.get(entryData.assetStorageKey);
		if (!asset) {
			continue;
		}

		const existing = await prisma.albumEntry.findFirst({
			where: {
				albumId: album.id,
				assetId: asset.id,
			},
		});

		if (!existing) {
			await prisma.albumEntry.create({
				data: {
					spaceId: systemSpace.id,
					createdById: adminUser?.id,
					albumId: album.id,
					assetId: asset.id,
					position: entryData.position,
					caption: entryData.caption,
				},
			});
			entryCreated++;
		} else {
			entrySkipped++;
		}
	}
	console.log(
		`AlbumEntry 완료! (생성: ${entryCreated}개, 스킵: ${entrySkipped}개)`,
	);

	console.log(
		`\n✅ Asset Domain 시드 완료! Folder(${folderCreated}), Asset(${assetCreated}), Image(${imageCreated}), Video(${videoCreated}), Document(${documentCreated}), Derivative(${derivativeCreated}), Album(${albumCreated}), AlbumEntry(${entryCreated})`,
	);
}
