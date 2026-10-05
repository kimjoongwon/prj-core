import {
	ADMIN_MENU_PERMISSION_SUBJECTS,
	ADMIN_PAGE_ACCESS_ITEMS,
} from "@cocrepo/constant";
import { describe, expect, it } from "vitest";
import { platformAdminAbilitySeedData } from "./abilities";
import { subjectSeedData } from "./actions-subjects";
import {
	adminCompanyManagerMenuAccessAbilitySeedData,
	adminMenuSubjectSeedData,
	adminPageSubjectSeedData,
	adminPlatformAdminAbilitySeedData,
	legacyAdminMenuSubjectNames,
	legacyAdminPageSubjectNames,
} from "./admin-permissions";

const legacyRolePageSubjectNames = [
	"page:role-groups:list",
	"page:role-groups:new",
	"page:role-groups:detail",
	"page:role-groups:edit",
	"page:role-categories:list",
	"page:role-categories:new",
	"page:role-categories:detail",
	"page:role-categories:edit",
] as const;

describe("admin permission derived seeds", () => {
	it("covers every admin menu subject from the shared catalog", () => {
		expect(adminMenuSubjectSeedData.map((subject) => subject.name)).toEqual(
			expect.arrayContaining(ADMIN_MENU_PERMISSION_SUBJECTS),
		);
	});

	it("creates page subjects and PLATFORM_ADMIN grants from the page catalog", () => {
		const pageSubjects = ADMIN_PAGE_ACCESS_ITEMS.map((item) => item.subject);
		const derivedPageSubjects = adminPageSubjectSeedData.map(
			(subject) => subject.name,
		);
		const pageAccessGrants = adminPlatformAdminAbilitySeedData
			.filter((ability) => ability.actionName === "access")
			.map((ability) => ability.subject);

		expect(derivedPageSubjects).toEqual(expect.arrayContaining(pageSubjects));
		expect(pageAccessGrants).toEqual(expect.arrayContaining(pageSubjects));
	});

	it("includes menu grants for newly added admin menus like assets", () => {
		expect(
			adminPlatformAdminAbilitySeedData.some(
				(ability) =>
					ability.subject === "menu:assets" && ability.actionName === "manage",
			),
		).toBe(true);
		expect(
			adminPlatformAdminAbilitySeedData.some(
				(ability) =>
					ability.subject === "menu:assets:list" &&
					ability.actionName === "manage",
			),
		).toBe(true);
		expect(
			adminPlatformAdminAbilitySeedData.some(
				(ability) =>
					ability.subject === "page:assets:list" &&
					ability.actionName === "access",
			),
		).toBe(true);
		expect(
			adminPlatformAdminAbilitySeedData.some(
				(ability) =>
					ability.subject === "page:assets:detail" &&
					ability.actionName === "access",
			),
		).toBe(true);
		expect(
			adminCompanyManagerMenuAccessAbilitySeedData.some(
				(ability) =>
					ability.subject === "menu:assets" && ability.actionName === "access",
			),
		).toBe(true);
	});

	it("keeps PLATFORM_ADMIN as a true super role with manage all", () => {
		expect(
			platformAdminAbilitySeedData.some(
				(ability) =>
					ability.subject === "all" &&
					ability.actionName === "manage" &&
					ability.inverted === false,
			),
		).toBe(true);
	});

	it("keeps legacy admin prune targets separate from the current catalog", () => {
		expect(legacyAdminMenuSubjectNames).toEqual(
			expect.arrayContaining([
				"menu:schedules",
				"menu:files",
				"menu:settings",
				"menu:role-groups:list",
				"menu:role-categories:list",
			]),
		);
		expect(legacyAdminPageSubjectNames).toEqual(
			expect.arrayContaining([...legacyRolePageSubjectNames]),
		);
		expect(legacyAdminMenuSubjectNames).not.toContain("menu:assets");
		expect(legacyAdminMenuSubjectNames).not.toContain("menu:oidc-clients");
	});

	it("seeds only current admin menu/page subjects into the shared subject catalog", () => {
		const seededSubjectNames = subjectSeedData.map((subject) => subject.name);

		expect(seededSubjectNames).toEqual(
			expect.arrayContaining([
				"menu:assets",
				"menu:assets:list",
				"page:assets:list",
				"page:assets:detail",
			]),
		);
		expect(seededSubjectNames).not.toContain("menu:schedules");
		expect(seededSubjectNames).not.toContain("menu:files");
		for (const subjectName of legacyRolePageSubjectNames) {
			expect(seededSubjectNames).not.toContain(subjectName);
		}
	});

	it("removes legacy admin PLATFORM_ADMIN menu/page grants from the seed set", () => {
		expect(
			platformAdminAbilitySeedData.some(
				(ability) => ability.subject === "menu:schedules",
			),
		).toBe(false);
		expect(
			platformAdminAbilitySeedData.some(
				(ability) => ability.subject === "menu:files",
			),
		).toBe(false);
		for (const subjectName of legacyRolePageSubjectNames) {
			expect(
				platformAdminAbilitySeedData.some(
					(ability) =>
						ability.subject === subjectName && ability.actionName === "access",
				),
			).toBe(false);
		}
	});
});
