"use client";

import { HStack, Surface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Chip } from "../../../data-display/Chip/Chip";
import type {
	CourseManagementSection,
	CourseManagementSectionId,
} from "../types";

export interface CourseSectionTabsProps {
	activeSectionId: CourseManagementSectionId;
	sections: CourseManagementSection[];
	onClickSection: (href: string) => void;
}

interface CourseSectionTabButtonProps {
	isActive: boolean;
	section: CourseManagementSection;
	onClickSection: (href: string) => void;
}

const CourseSectionTabButton = observer(
	({ isActive, section, onClickSection }: CourseSectionTabButtonProps) => {
		const onClickCourseSectionTabButton = () => {
			onClickSection(section.href);
		};

		return (
			<button
				type="button"
				onClick={onClickCourseSectionTabButton}
				className={[
					"min-h-28 rounded-xl p-4 text-left transition-colors",
					isActive
						? "bg-accent/15 text-foreground"
						: "text-muted hover:bg-surface-secondary/70",
				].join(" ")}
			>
				<HStack alignItems="center" justifyContent="between" fullWidth>
					<span className="text-sm font-semibold">{section.label}</span>
					<Chip size="sm" variant="flat" color={section.tone}>
						{section.count}
					</Chip>
				</HStack>
				<p className="mt-3 text-sm leading-5">{section.description}</p>
			</button>
		);
	},
);

export const CourseSectionTabs = observer(
	({ activeSectionId, sections, onClickSection }: CourseSectionTabsProps) => {
		return (
			<Surface className="rounded-2xl border-border/80 bg-surface/70 p-3">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
					{sections.map((section) => (
						<CourseSectionTabButton
							key={section.id}
							isActive={section.id === activeSectionId}
							section={section}
							onClickSection={onClickSection}
						/>
					))}
				</div>
			</Surface>
		);
	},
);

CourseSectionTabs.displayName = "CourseSectionTabs";
