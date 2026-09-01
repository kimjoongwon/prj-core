"use client";

import { Screen, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	type PolicyEntryOption,
	PolicyForm,
	type PolicyFormState,
} from "../../form/PolicyForm";
import { Button } from "../../input/Button/Button";

export type {
	PolicyEntryOption,
	PolicyFormField,
	PolicyFormState,
} from "../../form/PolicyForm";
export interface PolicyEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: PolicyFormState;
	abilities: PolicyEntryOption[];
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
}

/**
 * Policy create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const PolicyEditScreen = observer((props: PolicyEditScreenProps) => {
	const {
		title,
		description,
		state,
		abilities,
		readOnly = false,
		isLoading = false,
		notFound = false,
		loadingMessage = "로딩 중...",
		notFoundMessage = "정책을 찾을 수 없습니다.",
		notFoundAction,
		actions,
		children,
	} = props;
	if (isLoading) {
		return (
			<VStack fullWidth>
				<Screen.Header title={title} description={loadingMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-muted">{loadingMessage}</span>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	}
	if (notFound || !state) {
		return (
			<VStack fullWidth>
				<Screen.Header title={title} description={notFoundMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">{notFoundMessage}</p>
								{notFoundAction ?? <Button variant="tertiary">목록으로</Button>}
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	}
	return (
		<VStack fullWidth>
			<Screen.Header
				title={title}
				description={description}
				actions={actions}
			/>
			<SectionSurface>
				<Section>
					<Section.Body>
						<VStack>
							<Section>
								<Section.Body>
									<PolicyForm
										state={state}
										abilities={abilities}
										readOnly={readOnly}
									/>
								</Section.Body>
							</Section>
							{children}
						</VStack>
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
});
