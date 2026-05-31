"use client";

import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Input } from "../../../design-system/primitives";

/**
 * 회원 검색 위젯 Props
 */
export interface UserSearchWidgetProps {
	/** 검색어 */
	value: string;
	/** 검색어 변경 핸들러 */
	onChange: (value: string) => void;
	/** 검색 실행 핸들러 (Enter 키) */
	onSearch?: () => void;
	/** placeholder 텍스트 */
	placeholder?: string;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * 회원 검색 입력 위젯
 *
 * 통합 검색 기능을 제공하는 검색 바 UI 컴포넌트입니다.
 * - 이름, 이메일, 전화번호로 검색 가능
 * - Enter 키로 검색 실행
 */
export const UserSearchWidget = observer(
	({
		value,
		onChange,
		onSearch,
		placeholder = "이름, 이메일, 전화번호로 검색...",
		isLoading = false,
	}: UserSearchWidgetProps) => {
		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				onSearch?.();
			}
		};

		return (
			<Input
				value={value}
				onValueChange={onChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				startContent={<Search className="h-4 w-4 text-default-400" />}
				isClearable
				onClear={() => onChange("")}
				isDisabled={isLoading}
				classNames={{
					base: "max-w-sm",
					inputWrapper: "bg-content1",
				}}
			/>
		);
	},
);

UserSearchWidget.displayName = "UserSearchWidget";
