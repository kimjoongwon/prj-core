import type { Subject } from "@cocrepo/entity";
import { SubjectsRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { SubjectAggregate } from "../src/subject/subject.aggregate";

describe("SubjectAggregate", () => {
	let service: SubjectAggregate;
	let repository: DeepMockProxy<SubjectsRepository>;

	beforeEach(async () => {
		repository = mockDeep<SubjectsRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubjectAggregate,
				{ provide: SubjectsRepository, useValue: repository },
			],
		}).compile();

		service = module.get<SubjectAggregate>(SubjectAggregate);
	});

	afterEach(() => {
		mockReset(repository);
	});

	it("Subject 정보를 응답 형태로 매핑해야 한다", () => {
		// Given
		(service as unknown as { cachedFieldsByModel: Map<string, unknown[]> })
			.cachedFieldsByModel = new Map([["User", []]]);
		const subject = {
			id: 1n,
			name: "entity:User",
			displayName: "사용자",
			icon: "user",
			group: "entity",
			order: 1,
		};

		// When
		const result = (
			service as unknown as {
				toSubjectInfo(subject: Subject): Record<string, unknown>;
			}
		).toSubjectInfo(subject as unknown as Subject);

		// Then
		expect(result).toEqual({
			id: 1n,
			name: "entity:User",
			displayName: "사용자",
			icon: "user",
			group: "entity",
			order: 1,
			fields: [],
		});
	});
});
