"use client";

import type { ModalState } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { TextField } from "../../../input/TextField";
import type { ProgramPickerState } from "./ProgramPickerState";

/** Program 후보를 검색하고 선택하는 Modal body content입니다. */
export const ProgramPicker = observer(function ProgramPicker({
	state,
}: {
	state: ModalState<ProgramPickerState>;
}) {
	const t = useT();
	const programPicker = state.contentState;

	return (
		<>
			<TextField
				label={programPicker.searchLabel}
				labelPlacement="outside"
				placeholder={programPicker.searchPlaceholder}
				value={programPicker.searchValue}
				onValueChange={(value) => programPicker.setSearchValue(value)}
			/>
			<div className="flex max-h-80 flex-col gap-2 overflow-auto">
				{programPicker.visibleOptions.map((option) => (
					<button
						type="button"
						key={option.id}
						onClick={() => {
							programPicker.select(option.id);
							state.close();
						}}
						aria-pressed={programPicker.selectedId === option.id}
						className={`rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
							programPicker.selectedId === option.id
								? "bg-accent/15 text-accent"
								: "bg-surface-secondary hover:bg-surface-tertiary"
						}`}
					>
						<p className="font-medium">{option.name}</p>
						{option.subtitle ? (
							<p className="text-xs text-muted">{option.subtitle}</p>
						) : null}
					</button>
				))}
				{programPicker.visibleOptions.length === 0 ? (
					<p className="text-sm text-muted">{t("검색 결과가 없습니다.")}</p>
				) : null}
			</div>
			<div className="flex justify-end">
				<Button variant="flat" onPress={() => state.close()}>
					닫기
				</Button>
			</div>
		</>
	);
});

ProgramPicker.displayName = "ProgramPicker";
