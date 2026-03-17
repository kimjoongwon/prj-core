// ============================================================================
// Template 시드 데이터 (알림/메시지 템플릿)
// ============================================================================

/**
 * 템플릿 변수 시드 데이터 인터페이스
 */
export interface TemplateVariableSeedData {
	name: string;
	description?: string;
	defaultValue?: string;
	isRequired: boolean;
}

/**
 * 템플릿 시드 데이터 인터페이스
 */
export interface TemplateSeedData {
	code: string;
	name: string;
	type: "EMAIL" | "SMS" | "PUSH";
	subject?: string;
	content: string;
	description?: string;
	isActive: boolean;
	variables: TemplateVariableSeedData[];
}

/**
 * 템플릿 시드 데이터
 * 피트니스 서비스에서 사용하는 현실적인 알림 템플릿 (EMAIL 2개, SMS 2개, PUSH 2개)
 */
export const templateSeedData: TemplateSeedData[] = [
	// ---- EMAIL 템플릿 ----
	{
		code: "EMAIL_WELCOME",
		name: "회원 가입 환영",
		type: "EMAIL",
		subject: "{{groundName}}에 오신 것을 환영합니다!",
		content: `안녕하세요, {{userName}}님!\n\n{{groundName}}에 가입해 주셔서 감사합니다.\n\n첫 방문 시 프론트에서 본인 확인 후 이용 가능합니다.\n\n문의사항은 {{groundPhone}}으로 연락 주시기 바랍니다.\n\n감사합니다.\n{{groundName}} 드림`,
		description: "신규 회원 가입 시 발송하는 환영 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "groundPhone", description: "시설 연락처", isRequired: true },
		],
	},
	{
		code: "EMAIL_RESERVATION_CONFIRM",
		name: "예약 확인",
		type: "EMAIL",
		subject: "[{{groundName}}] 예약이 확정되었습니다",
		content: `안녕하세요, {{userName}}님.\n\n아래 예약이 확정되었습니다.\n\n- 일시: {{reservationDate}} {{reservationTime}}\n- 프로그램: {{programName}}\n- 장소: {{groundName}}\n\n예약 변경/취소는 시작 2시간 전까지 가능합니다.\n\n감사합니다.`,
		description: "예약 확정 시 발송하는 확인 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "reservationDate", description: "예약 날짜", isRequired: true },
			{ name: "reservationTime", description: "예약 시간", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
		],
	},
	// ---- SMS 템플릿 ----
	{
		code: "SMS_RESERVATION_REMINDER",
		name: "예약 리마인더",
		type: "SMS",
		content:
			"[{{groundName}}] {{userName}}님, 오늘 {{reservationTime}} {{programName}} 예약이 있습니다. 시작 10분 전까지 도착해 주세요.",
		description: "예약 당일 리마인더 SMS",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "reservationTime", description: "예약 시간", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
		],
	},
	{
		code: "SMS_PAYMENT_COMPLETE",
		name: "결제 완료",
		type: "SMS",
		content:
			"[{{groundName}}] {{userName}}님, {{amount}}원 결제가 완료되었습니다. 이용권: {{membershipName}} ({{expiryDate}}까지)",
		description: "결제 완료 알림 SMS",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "groundName", description: "시설 이름", isRequired: true },
			{ name: "amount", description: "결제 금액", isRequired: true },
			{ name: "membershipName", description: "이용권 이름", isRequired: true },
			{ name: "expiryDate", description: "만료일", isRequired: true },
		],
	},
	// ---- PUSH 템플릿 ----
	{
		code: "PUSH_CLASS_START",
		name: "수업 시작 알림",
		type: "PUSH",
		subject: "수업이 곧 시작됩니다!",
		content:
			"{{userName}}님, {{programName}} 수업이 {{minutesBefore}}분 후 시작됩니다. {{groundName}}에서 만나요!",
		description: "수업 시작 전 푸시 알림",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
			{
				name: "minutesBefore",
				description: "시작 전 분",
				defaultValue: "30",
				isRequired: false,
			},
			{ name: "groundName", description: "시설 이름", isRequired: true },
		],
	},
	{
		code: "PUSH_MEMBERSHIP_EXPIRY",
		name: "이용권 만료 예정",
		type: "PUSH",
		subject: "이용권 만료 예정 안내",
		content:
			"{{userName}}님, {{membershipName}} 이용권이 {{daysLeft}}일 후 만료됩니다. 갱신 시 {{discountRate}} 할인 혜택을 받으실 수 있습니다.",
		description: "이용권 만료 예정 푸시 알림",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "membershipName", description: "이용권 이름", isRequired: true },
			{ name: "daysLeft", description: "남은 일수", isRequired: true },
			{
				name: "discountRate",
				description: "할인율",
				defaultValue: "10%",
				isRequired: false,
			},
		],
	},
];
