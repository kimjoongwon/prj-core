import type { DateRangePickerProps } from "@heroui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { DateRangePicker } from "./DateRangePicker";
import { DateRangePicker as DateRangePickerWithMobx } from "./index";

const meta: Meta<typeof DateRangePicker> = {
	title: "Inputs/DateRangePicker",
	component: DateRangePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본 DateRangePicker 예제 (React state 사용)
 */
export const Default: Story = {
	args: {
		label: "날짜 범위 선택",
	},
	render: (args) => {
		const [value, setValue] = useState<DateRangePickerProps["value"]>();

		const handleChange: DateRangePickerProps["onChange"] = (value) => {
			setValue(value);
		};

		return <DateRangePicker {...args} onChange={handleChange} value={value} />;
	},
};

// MobX State 클래스
class DateRangeFormState {
	startDate: string = new Date().toISOString();
	endDate: string = new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000,
	).toISOString();

	constructor() {
		makeAutoObservable(this);
	}
}

/**
 * MobX 상태 관리 예제
 * paths 배열을 통해 state의 두 필드에 자동으로 값을 설정합니다.
 */
export const WithMobxState: Story = {
	args: {
		label: "MobX 상태 관리",
	},
	render: (args) => {
		const FormComponent = observer(() => {
			const [state] = useState(() => new DateRangeFormState());

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					<DateRangePickerWithMobx
						{...args}
						state={state}
						paths={["startDate", "endDate"]}
					/>

					<div
						style={{
							padding: "1rem",
							backgroundColor: "#f5f5f5",
							borderRadius: "8px",
							fontSize: "0.875rem",
							fontFamily: "monospace",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							📊 현재 상태:
						</div>
						<div>
							<strong>startDate:</strong> {state.startDate}
						</div>
						<div>
							<strong>endDate:</strong> {state.endDate}
						</div>
					</div>
				</div>
			);
		});

		return <FormComponent />;
	},
};

// 중첩된 객체 구조 State 클래스
class NestedDateRangeFormState {
	filters = {
		dateRange: {
			start: new Date().toISOString(),
			end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
		},
	};

	constructor() {
		makeAutoObservable(this);
	}
}

/**
 * 중첩된 객체 구조에서의 MobX 상태 관리
 * paths에 점(dot) 표기법을 사용하여 깊은 속성에 접근합니다.
 */
export const WithNestedMobxState: Story = {
	args: {
		label: "중첩 객체 상태 관리",
	},
	render: (args) => {
		const FormComponent = observer(() => {
			const [state] = useState(() => new NestedDateRangeFormState());

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					<DateRangePickerWithMobx
						{...args}
						state={state}
						paths={["filters.dateRange.start", "filters.dateRange.end"]}
					/>

					<div
						style={{
							padding: "1rem",
							backgroundColor: "#f5f5f5",
							borderRadius: "8px",
							fontSize: "0.875rem",
							fontFamily: "monospace",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							📊 현재 중첩 상태:
						</div>
						<div>
							<strong>filters.dateRange.start:</strong>{" "}
							{state.filters.dateRange.start}
						</div>
						<div>
							<strong>filters.dateRange.end:</strong>{" "}
							{state.filters.dateRange.end}
						</div>
					</div>
				</div>
			);
		});

		return <FormComponent />;
	},
};

// 다중 DateRangePicker 폼 예제
class MultiDateRangeFormState {
	trip = {
		outbound: {
			start: new Date().toISOString(),
			end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
		},
		return: {
			start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
			end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
		},
	};

	constructor() {
		makeAutoObservable(this);
	}
}

/**
 * 여러 DateRangePicker를 사용하는 복잡한 폼 예제
 * 각 DateRangePicker가 독립적인 paths를 가집니다.
 */
export const MultipleRanges: Story = {
	args: {},
	render: () => {
		const FormComponent = observer(() => {
			const [state] = useState(() => new MultiDateRangeFormState());

			return (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1.5rem",
						minWidth: "400px",
					}}
				>
					<div>
						<h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
							여행 일정 관리
						</h3>
						<p
							style={{
								fontSize: "0.875rem",
								color: "#666",
								marginBottom: "1rem",
							}}
						>
							출발과 귀국 일정을 각각 설정할 수 있습니다.
						</p>
					</div>

					<DateRangePickerWithMobx
						label="출발 일정"
						state={state}
						paths={["trip.outbound.start", "trip.outbound.end"]}
					/>

					<DateRangePickerWithMobx
						label="귀국 일정"
						state={state}
						paths={["trip.return.start", "trip.return.end"]}
					/>

					<div
						style={{
							padding: "1rem",
							backgroundColor: "#f5f5f5",
							borderRadius: "8px",
							fontSize: "0.875rem",
							fontFamily: "monospace",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							📊 현재 여행 일정:
						</div>
						<div style={{ marginTop: "0.5rem" }}>
							<strong>출발:</strong>
							<div style={{ marginLeft: "1rem", fontSize: "0.8rem" }}>
								시작: {state.trip.outbound.start}
								<br />
								종료: {state.trip.outbound.end}
							</div>
						</div>
						<div style={{ marginTop: "0.5rem" }}>
							<strong>귀국:</strong>
							<div style={{ marginLeft: "1rem", fontSize: "0.8rem" }}>
								시작: {state.trip.return.start}
								<br />
								종료: {state.trip.return.end}
							</div>
						</div>
					</div>
				</div>
			);
		});

		return <FormComponent />;
	},
};

/**
 * 타입 안전성 데모
 * paths는 state의 실제 경로만 허용합니다.
 *
 * ✅ 올바른 경로: ["startDate", "endDate"]
 * ❌ 잘못된 경로: ["invalidPath", "anotherInvalid"] <- TypeScript 에러 발생
 */
export const TypeSafetyDemo: Story = {
	args: {
		label: "타입 안전 경로",
	},
	render: (args) => {
		const FormComponent = observer(() => {
			const [state] = useState(() => new DateRangeFormState());

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
					{/* 타입 추론이 작동합니다! IDE에서 자동완성을 확인하세요 */}
					<DateRangePickerWithMobx
						{...args}
						state={state}
						paths={["startDate", "endDate"]} // ✅ 타입 안전
					/>

					<div
						style={{
							padding: "1rem",
							backgroundColor: "#e8f5e9",
							borderRadius: "8px",
							fontSize: "0.875rem",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							✅ 타입 안전성 혜택:
						</div>
						<ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
							<li>IDE 자동완성으로 사용 가능한 경로 확인</li>
							<li>잘못된 경로 입력 시 컴파일 타임 에러</li>
							<li>리팩토링 시 안전한 경로 업데이트</li>
							<li>오타로 인한 런타임 에러 방지</li>
						</ul>
					</div>

					<div
						style={{
							padding: "1rem",
							backgroundColor: "#f5f5f5",
							borderRadius: "8px",
							fontSize: "0.875rem",
							fontFamily: "monospace",
						}}
					>
						<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
							📊 현재 상태:
						</div>
						<div>
							<strong>startDate:</strong> {state.startDate}
						</div>
						<div>
							<strong>endDate:</strong> {state.endDate}
						</div>
					</div>
				</div>
			);
		});

		return <FormComponent />;
	},
};
