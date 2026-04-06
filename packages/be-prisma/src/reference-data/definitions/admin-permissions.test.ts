import {
	ADMIN_MENU_PERMISSION_SUBJECTS,
	ADMIN_PAGE_ACCESS_ITEMS,
} from "@cocrepo/constant";
import { describe, expect, it } from "vitest";
import {
	adminFullAccessAbilitySeedData,
	adminMenuSubjectSeedData,
	adminPageSubjectSeedData,
} from "./admin-permissions";
import { fullAccessAbilitySeedData } from "./abilities";

describe("admin permission derived seeds", () => {
	it("covers every admin menu subject from the shared catalog", () => {
		expect(adminMenuSubjectSeedData.map((subject) => subject.name)).toEqual(
			expect.arrayContaining(ADMIN_MENU_PERMISSION_SUBJECTS),
		);
	});

	it("creates page subjects and FULL_ACCESS grants from the page catalog", () => {
		const pageSubjects = ADMIN_PAGE_ACCESS_ITEMS.map((item) => item.subject);
		const derivedPageSubjects = adminPageSubjectSeedData.map(
			(subject) => subject.name,
		);
		const pageAccessGrants = adminFullAccessAbilitySeedData
			.filter((ability) => ability.actionName === "access")
			.map((ability) => ability.subject);

		expect(derivedPageSubjects).toEqual(expect.arrayContaining(pageSubjects));
		expect(pageAccessGrants).toEqual(expect.arrayContaining(pageSubjects));
	});

	it("includes menu grants for newly added admin menus like assets", () => {
		expect(
			adminFullAccessAbilitySeedData.some(
				(ability) =>
					ability.subject === "menu:assets" && ability.actionName === "manage",
			),
		).toBe(true);
		expect(
			adminFullAccessAbilitySeedData.some(
				(ability) =>
					ability.subject === "menu:assets:list" &&
					ability.actionName === "manage",
			),
		).toBe(true);
	});

	it("keeps FULL_ACCESS as a true super role with manage all", () => {
		expect(
			fullAccessAbilitySeedData.some(
				(ability) =>
					ability.subject === "all" &&
					ability.actionName === "manage" &&
					ability.inverted === false,
			),
		).toBe(true);
	});
});
