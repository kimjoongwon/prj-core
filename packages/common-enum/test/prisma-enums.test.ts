import assert from "node:assert/strict";
import test from "node:test";
import * as generatedEnums from "@cocrepo/prisma/enums";
import * as sharedEnums from "../src/index";

test("모든 Prisma enum은 생성 모듈의 객체를 그대로 공개한다", () => {
	for (const enumName of Object.keys(generatedEnums) as Array<
		keyof typeof generatedEnums
	>) {
		// biome-ignore lint/performance/noDynamicNamespaceImportAccess: 전체 export의 동일성을 검사하는 테스트 전용 순회입니다.
		assert.strictEqual(sharedEnums[enumName], generatedEnums[enumName]);
	}
});

test("표시 라벨은 Prisma 값 전체와 정확히 대응한다", () => {
	const labelPairs = [
		[sharedEnums.AssetKind, sharedEnums.AssetKindLabel],
		[sharedEnums.AssetStatus, sharedEnums.AssetStatusLabel],
		[sharedEnums.GroupTypes, sharedEnums.GroupTypesLabel],
		[sharedEnums.RecurringDayOfWeek, sharedEnums.RecurringDayOfWeekLabel],
		[sharedEnums.RepeatCycleTypes, sharedEnums.RepeatCycleTypesLabel],
		[sharedEnums.SessionTypes, sharedEnums.SessionTypesLabel],
		[sharedEnums.InquiryCategory, sharedEnums.InquiryCategoryLabel],
		[sharedEnums.InquiryChannel, sharedEnums.InquiryChannelLabel],
		[sharedEnums.InquiryPriority, sharedEnums.InquiryPriorityLabel],
		[sharedEnums.InquirySource, sharedEnums.InquirySourceLabel],
		[sharedEnums.InquiryStatus, sharedEnums.InquiryStatusLabel],
	];
	for (const [enumConstants, enumLabels] of labelPairs) {
		assert.deepEqual(
			Object.keys(enumLabels).sort(),
			Object.values(enumConstants).sort(),
		);
	}
});

test("문의 선택지와 상태 전이는 생성 enum 값만 사용한다", () => {
	assert.deepEqual(
		sharedEnums.InquiryStatusOptions.map((option) => option.value),
		Object.values(generatedEnums.InquiryStatus),
	);
	for (const nextStatuses of Object.values(
		sharedEnums.InquiryStatusTransitions,
	)) {
		for (const nextStatus of nextStatuses) {
			assert.ok(
				Object.values(generatedEnums.InquiryStatus).includes(nextStatus),
			);
		}
	}
	assert.deepEqual(
		sharedEnums.getAllowedStatusOptions(generatedEnums.InquiryStatus.CLOSED),
		[],
	);
});
