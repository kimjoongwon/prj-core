import type { Option } from "@cocrepo/type";
import { Tabs as HeroTabs } from "@heroui/react";
import type { Key } from "react";

export interface TabsProps {
	/** 탭 옵션 목록 */
	options: Option[];
	/** 선택된 탭 키 */
	selectedKey?: string;
	/** 탭 선택 변경 핸들러 */
	onSelectionChange?: (key: Key) => void;
}

/**
 * Tabs 컴포넌트
 * Option 배열 기반의 탭 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "all", text: "전체" },
 *   { value: "active", text: "활성" },
 *   { value: "inactive", text: "비활성" },
 * ];
 *
 * <Tabs
 *   options={options}
 *   selectedKey={filter}
 *   onSelectionChange={(key) => setFilter(key as string)}
 * />
 * ```
 */
export const Tabs = (props: TabsProps) => {
	const { options, selectedKey, onSelectionChange } = props;

	return (
		<HeroTabs selectedKey={selectedKey} onSelectionChange={onSelectionChange}>
			<HeroTabs.List>
				{options?.map((item) => (
					<HeroTabs.Tab key={item.value} id={item.value}>
						{item.text}
					</HeroTabs.Tab>
				))}
			</HeroTabs.List>
		</HeroTabs>
	);
};
