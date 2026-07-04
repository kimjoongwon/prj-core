import type { CourseSectionId } from "@cocrepo/ui";
import { CoursesPageRouteClient } from "./CoursesPageRouteClient";

interface CoursesPageRouteProps {
	searchParams?: Promise<{
		section?: string | string[];
	}>;
}

const courseSectionIds = new Set<CourseSectionId>([
	"courses",
	"offerings",
	"enrollments",
	"passes",
]);

/**
 * Course aggregate route의 section query를 화면 섹션 ID로 정규화합니다.
 */
function getCourseSectionId(section: string | null): CourseSectionId {
	if (section && courseSectionIds.has(section as CourseSectionId)) {
		return section as CourseSectionId;
	}

	return "courses";
}

/**
 * Next searchParams 값을 단일 section 문자열로 변환합니다.
 */
function getSearchParamValue(value: string | string[] | undefined) {
	if (Array.isArray(value)) {
		return value[0] ?? null;
	}

	return value ?? null;
}

export default async function CoursesPageRoute({
	searchParams,
}: CoursesPageRouteProps) {
	const params = await searchParams;
	const activeSectionId = getCourseSectionId(
		getSearchParamValue(params?.section),
	);

	return <CoursesPageRouteClient activeSectionId={activeSectionId} />;
}
