"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	Button,
	Listbox,
	ListboxItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "../../design-system/primitives";

/** 그라운드 정보 */
interface Ground {
	/** 그라운드 ID */
	id: string;
	/** 그라운드 이름 */
	name: string;
}

export interface GroundsSelectPageProps {
	/** 그라운드 목록 */
	grounds: Ground[];
	/** 그라운드 선택 핸들러 */
	onSelect: (groundId: string) => void;
}

/**
 * GroundsSelectPage 컴포넌트
 * 그라운드 선택 모달 페이지입니다.
 * 여러 그라운드에 속한 사용자가 접근할 그라운드를 선택합니다.
 *
 * @example
 * ```tsx
 * <GroundsSelectPage
 *   grounds={[
 *     { id: "g1", name: "메인 그라운드" },
 *     { id: "g2", name: "테스트 그라운드" },
 *   ]}
 *   onSelect={(groundId) => handleGroundSelect(groundId)}
 * />
 * ```
 */
export const GroundsSelectPage = observer(
	({ grounds, onSelect }: GroundsSelectPageProps) => {
		const [selectedGround, setSelectedGround] = useState("");

		const handleSelect = () => {
			if (!selectedGround) {
				alert("그라운드를 선택해주세요.");
				return;
			}
			onSelect(selectedGround);
		};

		return (
			<Modal isOpen={true} size="lg">
				<ModalContent>
					<ModalHeader>그라운드 선택</ModalHeader>
					<ModalBody>
						<Listbox
							aria-label="그라운드 선택"
							selectionMode="single"
							selectedKeys={
								selectedGround ? new Set([selectedGround]) : new Set()
							}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setSelectedGround(selected);
							}}
						>
							{grounds.map((ground) => (
								<ListboxItem key={ground.id}>{ground.name}</ListboxItem>
							))}
						</Listbox>
						<ModalFooter>
							<Button
								color="primary"
								size="md"
								className="w-full"
								onPress={handleSelect}
							>
								선택
							</Button>
						</ModalFooter>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	},
);

GroundsSelectPage.displayName = "GroundsSelectPage";
