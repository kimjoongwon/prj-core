import {
	inquiryMessageSeedData,
	inquiryParticipantSeedData,
	inquirySeedData,
	inquiryTagMasterData,
	inquiryThreadSeedData,
	sentimentAnalysisSeedData,
} from "../demo-data";
import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";
import { requireTenantIdForSpace } from "./tenant-scope";

/**
 * inquiry 도메인 데모 데이터를 단계적으로 적재합니다.
 *
 * inquiryNumber를 축으로 inquiry -> thread -> message/participant/tag/sentiment가 이어지므로,
 * 이 함수는 seed 배열의 business key를 실제 DB id로 해석하는 브리지 역할을 합니다.
 */
export async function createInquiryDomainData(
	prisma: PrismaClient,
): Promise<void> {
	console.log("\n========================================");
	console.log("Inquiry Domain 시드 데이터 삽입 중...");
	console.log("========================================");

	const users = await prisma.user.findMany();
	const grounds = await prisma.ground.findMany({
		include: {
			company: true,
		},
	});

	// Inquiry seeds reference users/grounds by business keys, so materialize
	// lookup maps once before the staged inserts below.
	const userByEmail = new Map(users.map((user) => [user.email, user]));
	const groundByName = new Map(grounds.map((ground) => [ground.name, ground]));

	console.log("\n[1/6] Inquiry 생성 중...");
	// Later inquiry child tables are all keyed off the inquiry number from the
	// seed source, so we keep the resolved DB ids here.
	const inquiryByNumber = new Map<string, { id: string }>();
	let inquiryCreated = 0;
	let inquirySkipped = 0;

	for (const inquiryData of inquirySeedData) {
		const existing = await prisma.inquiry.findUnique({
			where: { inquiryNumber: inquiryData.inquiryNumber },
		});

		if (!existing) {
			const ground = groundByName.get(inquiryData.groundName);
			if (!ground) {
				console.warn(`  - Ground를 찾을 수 없음: ${inquiryData.groundName}`);
				continue;
			}

			const customer = userByEmail.get(inquiryData.customerEmail);
			const assignee = inquiryData.assigneeEmail
				? userByEmail.get(inquiryData.assigneeEmail)
				: null;
			const tenantId = await requireTenantIdForSpace(
				prisma,
				ground.company.spaceId,
				assignee?.id ?? customer?.id,
			);

			const now = new Date();
			const slaResponseDue = new Date(now.getTime() + 24 * 60 * 60 * 1000);
			const slaResolveDue = new Date(now.getTime() + 72 * 60 * 60 * 1000);

			const inquiry = await prisma.inquiry.create({
				data: {
					tenantId,
					inquiryNumber: inquiryData.inquiryNumber,
					title: inquiryData.title,
					category: inquiryData.category as
						| "GENERAL"
						| "DELIVERY"
						| "PAYMENT"
						| "REFUND"
						| "PRODUCT"
						| "ACCOUNT"
						| "TECHNICAL"
						| "COMPLAINT"
						| "OTHER",
					channel: inquiryData.channel as
						| "WEB"
						| "EMAIL"
						| "CHAT"
						| "SMS"
						| "PHONE"
						| "WALK_IN",
					source: inquiryData.source as "ONLINE" | "OFFLINE",
					status: inquiryData.status as
						| "NEW"
						| "OPEN"
						| "IN_PROGRESS"
						| "WAITING_CUSTOMER"
						| "RESOLVED"
						| "CLOSED"
						| "ESCALATED",
					priority: inquiryData.priority as
						| "LOW"
						| "NORMAL"
						| "HIGH"
						| "URGENT",
					customerId: customer?.id,
					assigneeId: assignee?.id,
					slaResponseDue,
					slaResolveDue,
					sentiment: inquiryData.sentiment as
						| "POSITIVE"
						| "NEUTRAL"
						| "NEGATIVE"
						| null,
					sentimentScore: inquiryData.sentimentScore,
					aiResolutionAttempted: inquiryData.aiResolutionAttempted ?? false,
					aiResolved: inquiryData.aiResolved ?? false,
					isRealtimeChat: inquiryData.isRealtimeChat ?? false,
				},
			});

			inquiryByNumber.set(inquiryData.inquiryNumber, {
				id: inquiry.id,
			});
			inquiryCreated++;
			console.log(`  - Inquiry 생성: ${inquiryData.inquiryNumber}`);
		} else {
			inquiryByNumber.set(inquiryData.inquiryNumber, {
				id: existing.id,
			});
			inquirySkipped++;
		}
	}
	console.log(
		`Inquiry 완료! (생성: ${inquiryCreated}개, 스킵: ${inquirySkipped}개)`,
	);

	console.log("\n[2/6] InquiryThread 생성 중...");
	// A single inquiry can own multiple threads; preserve the created thread ids
	// in seed order so message/participant rows can address them by index.
	const threadByInquiryNumber = new Map<string, { id: string }[]>();
	let threadCreated = 0;
	let threadSkipped = 0;

	for (const threadData of inquiryThreadSeedData) {
		const inquiryInfo = inquiryByNumber.get(threadData.inquiryNumber);
		if (!inquiryInfo) continue;

		const creator = userByEmail.get(threadData.creatorEmail);
		if (!creator) continue;

		const existing = await prisma.inquiryThread.findFirst({
			where: {
				inquiryId: inquiryInfo.id,
				createdBy: creator.id,
			},
		});

		if (!existing) {
			const thread = await prisma.inquiryThread.create({
				data: {
					inquiryId: inquiryInfo.id,
					title: threadData.title,
					status: threadData.status as "ACTIVE" | "RESOLVED" | "CLOSED",
					createdBy: creator.id,
				},
			});

			if (!threadByInquiryNumber.has(threadData.inquiryNumber)) {
				threadByInquiryNumber.set(threadData.inquiryNumber, []);
			}
			threadByInquiryNumber.get(threadData.inquiryNumber)?.push({
				id: thread.id,
			});
			threadCreated++;
		} else {
			if (!threadByInquiryNumber.has(threadData.inquiryNumber)) {
				threadByInquiryNumber.set(threadData.inquiryNumber, []);
			}
			threadByInquiryNumber.get(threadData.inquiryNumber)?.push({
				id: existing.id,
			});
			threadSkipped++;
		}
	}
	console.log(
		`InquiryThread 완료! (생성: ${threadCreated}개, 스킵: ${threadSkipped}개)`,
	);

	console.log("\n[3/6] InquiryMessage 생성 중...");
	let messageCreated = 0;
	let messageSkipped = 0;

	for (const messageData of inquiryMessageSeedData) {
		const inquiryInfo = inquiryByNumber.get(messageData.inquiryNumber);
		if (!inquiryInfo) continue;

		const threads = threadByInquiryNumber.get(messageData.inquiryNumber);
		if (!threads || threads.length === 0) continue;

		// Seed data points to a thread by index rather than db id.
		const threadIndex = Math.min(messageData.threadIndex, threads.length - 1);
		const threadId = threads[threadIndex].id;
		const sender = messageData.senderEmail
			? userByEmail.get(messageData.senderEmail)
			: null;

		const existing = await prisma.inquiryMessage.findFirst({
			where: {
				threadId,
				content: messageData.content,
			},
		});

		if (!existing) {
			await prisma.inquiryMessage.create({
				data: {
					threadId,
					inquiryId: inquiryInfo.id,
					senderId: sender?.id,
					senderType: messageData.senderType as "USER" | "AI" | "SYSTEM",
					content: messageData.content,
					contentType: messageData.contentType as
						| "TEXT"
						| "HTML"
						| "MARKDOWN"
						| "IMAGE"
						| "FILE"
						| "SYSTEM",
					isEdited: messageData.isEdited ?? false,
				},
			});
			messageCreated++;
		} else {
			messageSkipped++;
		}
	}
	console.log(
		`InquiryMessage 완료! (생성: ${messageCreated}개, 스킵: ${messageSkipped}개)`,
	);

	console.log("\n[4/6] InquiryParticipant 생성 중...");
	let participantCreated = 0;
	let participantSkipped = 0;

	for (const participantData of inquiryParticipantSeedData) {
		const inquiryInfo = inquiryByNumber.get(participantData.inquiryNumber);
		if (!inquiryInfo) continue;

		const user = userByEmail.get(participantData.userEmail);
		if (!user) continue;

		let threadId: string | undefined;
		if (participantData.threadIndex !== undefined) {
			const threads = threadByInquiryNumber.get(participantData.inquiryNumber);
			if (threads && threads.length > 0) {
				const threadIndex = Math.min(
					participantData.threadIndex,
					threads.length - 1,
				);
				threadId = threads[threadIndex].id;
			}
		}

		const existing = await prisma.inquiryParticipant.findFirst({
			where: {
				inquiryId: inquiryInfo.id,
				threadId: threadId ?? null,
				userId: user.id,
			},
		});

		if (!existing) {
			await prisma.inquiryParticipant.create({
				data: {
					inquiryId: inquiryInfo.id,
					threadId,
					userId: user.id,
					role: participantData.role as
						| "CUSTOMER"
						| "AGENT"
						| "SUPERVISOR"
						| "VIEWER",
					isOnline: participantData.isOnline ?? false,
				},
			});
			participantCreated++;
		} else {
			participantSkipped++;
		}
	}
	console.log(
		`InquiryParticipant 완료! (생성: ${participantCreated}개, 스킵: ${participantSkipped}개)`,
	);

	console.log("\n[5/6] InquiryTag 생성 중...");
	let tagCreated = 0;
	let tagSkipped = 0;

	for (const inquiryData of inquirySeedData) {
		const inquiryInfo = inquiryByNumber.get(inquiryData.inquiryNumber);
		if (!inquiryInfo) continue;

		for (const tagName of inquiryData.tags) {
			const tagMaster = inquiryTagMasterData.find(
				(tag) => tag.name === tagName,
			);

			const existing = await prisma.inquiryTag.findFirst({
				where: {
					inquiryId: inquiryInfo.id,
					name: tagName,
				},
			});

			if (!existing) {
				await prisma.inquiryTag.create({
					data: {
						inquiryId: inquiryInfo.id,
						name: tagName,
						color: tagMaster?.color,
					},
				});
				tagCreated++;
			} else {
				tagSkipped++;
			}
		}
	}
	console.log(
		`InquiryTag 완료! (생성: ${tagCreated}개, 스킵: ${tagSkipped}개)`,
	);

	console.log("\n[6/6] SentimentAnalysis 생성 중...");
	let sentimentCreated = 0;
	let sentimentSkipped = 0;

	for (const sentimentData of sentimentAnalysisSeedData) {
		const inquiryInfo = inquiryByNumber.get(sentimentData.inquiryNumber);
		if (!inquiryInfo) continue;

		const existing = await prisma.sentimentAnalysis.findUnique({
			where: { inquiryId: inquiryInfo.id },
		});

		if (!existing) {
			await prisma.sentimentAnalysis.create({
				data: {
					inquiryId: inquiryInfo.id,
					sentiment: sentimentData.sentiment as
						| "POSITIVE"
						| "NEUTRAL"
						| "NEGATIVE",
					score: sentimentData.score,
					confidence: sentimentData.confidence,
					emotions: sentimentData.emotions
						? (sentimentData.emotions as unknown as Prisma.InputJsonObject)
						: undefined,
					keywords: sentimentData.keywords
						? (sentimentData.keywords as unknown as Prisma.InputJsonValue)
						: undefined,
					urgency: sentimentData.urgency,
				},
			});
			sentimentCreated++;
		} else {
			sentimentSkipped++;
		}
	}
	console.log(
		`SentimentAnalysis 완료! (생성: ${sentimentCreated}개, 스킵: ${sentimentSkipped}개)`,
	);

	console.log(
		`\n✅ Inquiry Domain 시드 완료! Inquiry(${inquiryCreated}), Thread(${threadCreated}), Message(${messageCreated}), Participant(${participantCreated}), Tag(${tagCreated}), SentimentAnalysis(${sentimentCreated})`,
	);
}
