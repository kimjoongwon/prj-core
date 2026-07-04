"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	ActionForm,
	type ActionFormState,
} from "../../form/ActionForm";
import { Button } from "../../input/Button/Button";

export type {
	ActionFormField,
	ActionFormState,
} from "../../form/ActionForm";

export interface ActionEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: ActionFormState;
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
 * Action create/detail/edit route가 공유하는 screen입니다.
 * 생성/수정/상세 판단은 route가 title, actions, readOnly로 결정합니다.
 */
export const ActionEditScreen = observer((props: ActionEditScreenProps) => {
	const {
		title,
		description,
		state,
		readOnly = false,
		isLoading = false,
		notFound = false,
		loadingMessage = "로딩 중...",
		notFoundMessage = "Action을 찾을 수 없습니다.",
		notFoundAction,
		actions,
		children,
	} = props;

	if (isLoading) {
		return (
			<VStack fullWidth>
				<PageTitleBar title={title} description={loadingMessage} />
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
				<PageTitleBar title={title} description={notFoundMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">{notFoundMessage}</p>
								{notFoundAction ?? <Button variant="flat">목록으로</Button>}
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	}

	return (
		<VStack fullWidth>
			<PageTitleBar title={title} description={description} actions={actions} />
			<SectionSurface>
				<Section>
					<Section.Body>
						<VStack>
							<Section>
								<Section.Body>
									<ActionForm
										state={state}
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
