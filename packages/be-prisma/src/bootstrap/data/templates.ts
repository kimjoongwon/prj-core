/**
 * bootstrap 기본 템플릿 정의입니다.
 *
 * 템플릿의 식별자는 `code`이며, 내용/변수는 초기값으로 취급합니다.
 * 운영 중 편집 가능한 정책이라면 재실행 시 무조건 덮어쓰지 않는 방향을 전제합니다.
 */

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
 * 피트니스 서비스에서 사용하는 현실적인 알림 템플릿과 인증 기본 템플릿입니다.
 */
export const templateSeedData: TemplateSeedData[] = [
	// ---- EMAIL 템플릿 ----
	{
		code: "AUTH_PASSWORD_RESET",
		name: "비밀번호 재설정",
		type: "EMAIL",
		subject: "[prj-core] 비밀번호 재설정 안내",
		content: `<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
	<h2 style="color: #0070f3;">비밀번호 재설정</h2>
	<p>비밀번호 재설정이 요청되었습니다.</p>
	<p>아래 버튼을 클릭하여 새 비밀번호를 설정하세요.</p>
	<div style="margin: 24px 0;">
		<a href="{{resetUrl}}"
			style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
			비밀번호 재설정하기
		</a>
	</div>
	<p style="color: #666; font-size: 14px;">
		이 링크는 {{expiresInMinutes}}분간 유효하며, 1회만 사용할 수 있습니다.
	</p>
	<p style="color: #999; font-size: 12px;">
		본인이 요청하지 않은 경우 이 이메일을 무시하세요. 비밀번호는 변경되지 않습니다.
	</p>
</div>`,
		description: "비밀번호 찾기 요청 시 발송하는 재설정 이메일",
		isActive: true,
		variables: [
			{
				name: "resetUrl",
				description: "비밀번호 재설정 링크",
				isRequired: true,
			},
			{
				name: "expiresInMinutes",
				description: "재설정 링크 유효 시간(분)",
				isRequired: true,
			},
		],
	},
	{
		code: "AUTH_TEMPORARY_PASSWORD",
		name: "임시 비밀번호 발급",
		type: "EMAIL",
		subject: "[prj-core] 임시 비밀번호 발급 안내",
		content: `<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
	<h2 style="color: #0070f3;">임시 비밀번호 발급</h2>
	<p>관리자에 의해 비밀번호가 재설정되었습니다.</p>
	<div style="margin: 24px 0; padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
		<p style="margin: 0; font-size: 14px; color: #666;">임시 비밀번호</p>
		<p style="margin: 8px 0 0; font-size: 20px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
			{{temporaryPassword}}
		</p>
	</div>
	<p style="color: #e53e3e; font-weight: 600;">
		로그인 후 즉시 비밀번호를 변경해주세요.
	</p>
	<p style="color: #999; font-size: 12px;">
		본인이 요청하지 않은 경우 관리자에게 문의하세요.
	</p>
</div>`,
		description: "관리자 강제 재설정 시 발송하는 임시 비밀번호 이메일",
		isActive: true,
		variables: [
			{
				name: "temporaryPassword",
				description: "발급된 임시 비밀번호",
				isRequired: true,
			},
		],
	},
	{
		code: "AUTH_EMAIL_VERIFICATION",
		name: "회원가입 이메일 인증",
		type: "EMAIL",
		subject: "[prj-core] 이메일 인증 안내",
		content: `<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
	<h2 style="color: #0070f3;">이메일 인증</h2>
	<p>회원가입을 완료하려면 이메일 인증이 필요합니다.</p>
	<p>아래 버튼을 클릭하여 이메일 인증을 완료하세요.</p>
	<div style="margin: 24px 0;">
		<a href="{{verificationUrl}}"
			style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
			이메일 인증하기
		</a>
	</div>
	<p style="color: #666; font-size: 14px;">
		이 링크는 {{expiresInMinutes}}분간 유효하며, 인증이 완료되면 계정이 생성됩니다.
	</p>
	<p style="color: #999; font-size: 12px;">
		본인이 요청하지 않은 경우 이 이메일을 무시하세요.
	</p>
</div>`,
		description: "회원가입 이메일 인증 요청 시 발송하는 이메일",
		isActive: true,
		variables: [
			{
				name: "verificationUrl",
				description: "이메일 인증 링크",
				isRequired: true,
			},
			{
				name: "expiresInMinutes",
				description: "인증 링크 유효 시간(분)",
				isRequired: true,
			},
		],
	},
	{
		code: "EMAIL_WELCOME",
		name: "회원 가입 환영",
		type: "EMAIL",
		subject: "{{fitnessCenterName}}에 오신 것을 환영합니다!",
		content: `안녕하세요, {{userName}}님!\n\n{{fitnessCenterName}}에 가입해 주셔서 감사합니다.\n\n첫 방문 시 프론트에서 본인 확인 후 이용 가능합니다.\n\n문의사항은 {{fitnessCenterPhone}}으로 연락 주시기 바랍니다.\n\n감사합니다.\n{{fitnessCenterName}} 드림`,
		description: "신규 회원 가입 시 발송하는 환영 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "fitnessCenterName", description: "피트니스센터 이름", isRequired: true },
			{ name: "fitnessCenterPhone", description: "피트니스센터 연락처", isRequired: true },
		],
	},
	{
		code: "EMAIL_RESERVATION_CONFIRM",
		name: "예약 확인",
		type: "EMAIL",
		subject: "[{{fitnessCenterName}}] 예약이 확정되었습니다",
		content: `안녕하세요, {{userName}}님.\n\n아래 예약이 확정되었습니다.\n\n- 일시: {{reservationDate}} {{reservationTime}}\n- 프로그램: {{programName}}\n- 장소: {{fitnessCenterName}}\n\n예약 변경/취소는 시작 2시간 전까지 가능합니다.\n\n감사합니다.`,
		description: "예약 확정 시 발송하는 확인 이메일",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "fitnessCenterName", description: "피트니스센터 이름", isRequired: true },
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
			"[{{fitnessCenterName}}] {{userName}}님, 오늘 {{reservationTime}} {{programName}} 예약이 있습니다. 시작 10분 전까지 도착해 주세요.",
		description: "예약 당일 리마인더 SMS",
		isActive: true,
		variables: [
			{ name: "userName", description: "회원 이름", isRequired: true },
			{ name: "fitnessCenterName", description: "피트니스센터 이름", isRequired: true },
			{ name: "reservationTime", description: "예약 시간", isRequired: true },
			{ name: "programName", description: "프로그램 이름", isRequired: true },
		],
	},
	// ---- PUSH 템플릿 ----
	{
		code: "PUSH_CLASS_START",
		name: "수업 시작 알림",
		type: "PUSH",
		subject: "수업이 곧 시작됩니다!",
		content:
			"{{userName}}님, {{programName}} 수업이 {{minutesBefore}}분 후 시작됩니다. {{fitnessCenterName}}에서 만나요!",
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
			{ name: "fitnessCenterName", description: "피트니스센터 이름", isRequired: true },
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
