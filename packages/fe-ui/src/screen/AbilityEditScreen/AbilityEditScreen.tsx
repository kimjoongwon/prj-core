"use client";

import { HStack, Screen, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	AbilityForm,
	type AbilityFormOption,
	type AbilityFormState,
} from "../../form/AbilityForm";
import { Button } from "../../input/Button/Button";

export type {
	AbilityFormField,
	AbilityFormOption,
	AbilityFormState,
} from "../../form/AbilityForm";
export interface AbilityEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: AbilityFormState;
	subjects: AbilityFormOption[];
	actions: AbilityFormOption[];
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	pageActions?: ReactNode;
	children?: ReactNode;
}

/**
 * Ability create/detail/edit route가 공유하는 screen입니다.
 * route가 title, pageActions, readOnly을 결정합니다.
 */
export const AbilityEditScreen = observer((props: AbilityEditScreenProps) => {
	const {
		title,
		description,
		state,
		subjects,
		actions,
		readOnly = false,
		isLoading = false,
		notFound = false,
		loadingMessage = "로딩 중...",
		notFoundMessage = "권한을 찾을 수 없습니다.",
		notFoundAction,
		pageActions,
		children,
	} = props;
	if (isLoading) {
		return (
			<VStack fullWidth>
				<Screen.Header title={title} description={loadingMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<HStack
								alignItems="center"
								justifyContent="center"
								className="p-8"
							>
								<Spinner size="sm" />
								<span className="text-muted">{loadingMessage}</span>
							</HStack>
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
							<VStack
								gap="section"
								alignItems="center"
								justifyContent="center"
								className="p-8"
							>
								<p className="text-muted">{notFoundMessage}</p>
								{notFoundAction ?? <Button variant="tertiary">목록으로</Button>}
							</VStack>
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
				actions={pageActions}
			/>
			<SectionSurface>
				<Section>
					<Section.Body>
						<VStack>
							<Section>
								<Section.Body>
									<AbilityForm
										state={state}
										subjects={subjects}
										actions={actions}
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
