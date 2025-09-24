import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const GroundModifyRouteComponent = () => {
	const { groundId } = Route.useParams();

	// Mock existing data - in real app this would come from API
	const [formData, setFormData] = useState({
		name: "서울 그라운드",
		location: "서울시 강남구 테헤란로 123",
		capacity: "50",
		description: "최신 시설을 갖춘 프리미엄 그라운드입니다.",
		category: "soccer",
		openingHours: "09:00 - 22:00",
		phone: "02-1234-5678",
		facilities: "주차장, 샤워실, 라커룸, 카페테리아",
	});

	const categories = [
		{ key: "soccer", label: "축구장" },
		{ key: "basketball", label: "농구장" },
		{ key: "tennis", label: "테니스장" },
		{ key: "badminton", label: "배드민턴장" },
	];

	const handleSubmit = () => {
		console.log("Modifying ground:", formData);
		// In real app, this would call an API
	};

	return (
		<div className="space-y-6">
			<h4 className="font-medium text-gray-900 text-lg">그라운드 수정</h4>

			<div className="rounded-lg bg-white p-6 shadow">
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<Input
							label="그라운드 이름"
							placeholder="그라운드 이름을 입력하세요"
							value={formData.name}
							onValueChange={(value) =>
								setFormData({ ...formData, name: value })
							}
						/>

						<Select
							label="카테고리"
							placeholder="카테고리를 선택하세요"
							selectedKeys={[formData.category]}
							onSelectionChange={(keys) =>
								setFormData({
									...formData,
									category: Array.from(keys)[0] as string,
								})
							}
						>
							{categories.map((category) => (
								<SelectItem key={category.key}>{category.label}</SelectItem>
							))}
						</Select>

						<Input
							label="위치"
							placeholder="주소를 입력하세요"
							value={formData.location}
							onValueChange={(value) =>
								setFormData({ ...formData, location: value })
							}
						/>

						<Input
							label="수용인원"
							placeholder="수용인원을 입력하세요"
							value={formData.capacity}
							onValueChange={(value) =>
								setFormData({ ...formData, capacity: value })
							}
						/>

						<Input
							label="운영시간"
							placeholder="예: 09:00 - 22:00"
							value={formData.openingHours}
							onValueChange={(value) =>
								setFormData({ ...formData, openingHours: value })
							}
						/>

						<Input
							label="연락처"
							placeholder="연락처를 입력하세요"
							value={formData.phone}
							onValueChange={(value) =>
								setFormData({ ...formData, phone: value })
							}
						/>
					</div>

					<Input
						label="편의시설"
						placeholder="편의시설을 쉼표로 구분하여 입력하세요"
						value={formData.facilities}
						onValueChange={(value) =>
							setFormData({ ...formData, facilities: value })
						}
					/>

					<Textarea
						label="설명"
						placeholder="그라운드에 대한 설명을 입력하세요"
						value={formData.description}
						onValueChange={(value) =>
							setFormData({ ...formData, description: value })
						}
					/>

					<div className="flex justify-end space-x-3">
						<Button variant="flat">취소</Button>
						<Button color="primary" onPress={handleSubmit}>
							수정
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Route = createFileRoute(
	"/admin/dashboard/space-service/grounds/$groundId/modify",
)({
	component: GroundModifyRouteComponent,
});
