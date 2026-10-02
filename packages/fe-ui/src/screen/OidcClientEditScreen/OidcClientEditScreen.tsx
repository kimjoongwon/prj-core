"use client";

import { HStack, Screen, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	OidcClientForm,
	type OidcClientFormState,
} from "../../form/OidcClientForm";
import { Button } from "../../input/Button/Button";

export type {
	OidcClientFormField,
	OidcClientFormState,
} from "../../form/OidcClientForm";
export interface OidcClientEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: OidcClientFormState;
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
 * OIDC client create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const OidcClientEditScreen = observer(
	(props: OidcClientEditScreenProps) => {
		const {
			title,
			description,
			state,
			readOnly = false,
			isLoading = false,
			notFound = false,
			loadingMessage = "로딩 중...",
			notFoundMessage = "OIDC 클라이언트를 찾을 수 없습니다.",
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
									{notFoundAction ?? (
										<Button variant="tertiary">목록으로</Button>
									)}
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
					actions={actions}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Body>
										<OidcClientForm state={state} readOnly={readOnly} />
									</Section.Body>
								</Section>
								{children}
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
