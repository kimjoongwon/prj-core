"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button } from "../../action/Button/Button";
import { ListBox, Modal, useOverlayState } from "@heroui/react";

/** 그라운드 정보 */
interface Ground {
	/** 그라운드 ID */
	id: string;
	/** 그라운드 이름 */
	name: string;
}

export interface GroundsSelectScreenProps {
	/** 그라운드 목록 */
	grounds: Ground[];
	/** 그라운드 선택 핸들러 */
	onSelect: (groundId: string) => void;
}

/**
 * GroundsSelectScreen 컴포넌트
 * 그라운드 선택 모달 페이지입니다.
 * 여러 그라운드에 속한 사용자가 접근할 그라운드를 선택합니다.
 *
 * @example
 * ```tsx
 * <GroundsSelectScreen
 *   grounds={[
 *     { id: "g1", name: "메인 그라운드" },
 *     { id: "g2", name: "테스트 그라운드" },
 *   ]}
 *   onSelect={(groundId) => handleGroundSelect(groundId)}
 * />
 * ```
 */
export const GroundsSelectScreen = observer(
	({ grounds, onSelect }: GroundsSelectScreenProps) => {
		const [selectedGround, setSelectedGround] = useState("");
		const modalState = useOverlayState({ isOpen: true });

		const handleSelect = () => {
			if (!selectedGround) {
				alert("그라운드를 선택해주세요.");
				return;
			}
			onSelect(selectedGround);
		};

		return (
			<Modal state={modalState}>
				<Modal.Backdrop>
					<Modal.Container size="lg">
						<Modal.Dialog>
							<Modal.Header>그라운드 선택</Modal.Header>
							<Modal.Body>
								<ListBox
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
										<ListBox.Item
											key={ground.id}
											id={ground.id}
											textValue={ground.name}
										>
											{ground.name}
										</ListBox.Item>
									))}
								</ListBox>
								<Modal.Footer>
									<Button
										color="primary"
										size="md"
										className="w-full"
										onPress={handleSelect}
									>
										선택
									</Button>
								</Modal.Footer>
							</Modal.Body>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>
		);
	},
);

GroundsSelectScreen.displayName = "GroundsSelectScreen";
