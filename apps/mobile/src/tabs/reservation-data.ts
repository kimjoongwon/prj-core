export interface ReservationPreview {
	date: string;
	id: string;
	label: string;
	place: string;
	status: string;
	time: string;
}

export const todayReservations: ReservationPreview[] = [
	{
		date: "오늘",
		id: "visit-1",
		label: "헤어 케어 예약",
		place: "라운지 온 성수",
		status: "방문 예정",
		time: "14:30",
	},
	{
		date: "오늘",
		id: "visit-2",
		label: "피부 상담",
		place: "오노라 클리닉 한남",
		status: "확정",
		time: "18:00",
	},
];

export const upcomingReservations: ReservationPreview[] = [
	{
		date: "5월 8일",
		id: "upcoming-1",
		label: "스튜디오 촬영 상담",
		place: "무드 스튜디오",
		status: "예약 요청",
		time: "11:00",
	},
	{
		date: "5월 10일",
		id: "upcoming-2",
		label: "필라테스 체험",
		place: "바른핏 센터",
		status: "확정",
		time: "09:30",
	},
];
