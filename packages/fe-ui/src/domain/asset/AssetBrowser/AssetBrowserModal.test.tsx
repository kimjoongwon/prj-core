import { act, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AssetBrowserModal } from "./AssetBrowserModal";

describe("AssetBrowserModal 조회 mount 경계", () => {
	it("닫힌 모달에서는 조회 자식을 mount하지 않는다", () => {
		const QueryContent = vi.fn(() => <span>조회 결과</span>);
		render(
			<AssetBrowserModal title="에셋 선택" isOpen={false}>
				<QueryContent />
			</AssetBrowserModal>,
		);
		expect(QueryContent).not.toHaveBeenCalled();
	});

	it("모달 조회가 suspend되어도 폼과 입력값은 유지한다", async () => {
		let resolveQuery: (() => void) | undefined;
		let hasQueryResult = false;
		const pendingQuery = new Promise<void>((resolve) => {
			resolveQuery = resolve;
		});
		function QueryContent() {
			if (!hasQueryResult) {
				throw pendingQuery;
			}
			return <span>조회 결과</span>;
		}
		function FormWithAssetPicker() {
			const [name] = useState("편집 중인 운동명");
			return (
				<>
					<input aria-label="운동명" value={name} readOnly />
					<AssetBrowserModal title="에셋 선택" isOpen>
						<QueryContent />
					</AssetBrowserModal>
				</>
			);
		}

		render(<FormWithAssetPicker />);
		expect(screen.getByLabelText("운동명")).toHaveValue("편집 중인 운동명");
		expect(screen.queryByText("조회 결과")).not.toBeInTheDocument();
		await act(async () => {
			hasQueryResult = true;
			resolveQuery?.();
			await pendingQuery;
		});
		expect(await screen.findByText("조회 결과")).toBeInTheDocument();
		expect(screen.getByLabelText("운동명")).toHaveValue("편집 중인 운동명");
	});
});
