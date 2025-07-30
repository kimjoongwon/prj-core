import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "./Message";

const meta = {
	title: "ui/Message",
	component: Message,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"제목과 메시지 콘텐츠로 알림과 알림을 표시하는 메시지 컴포넌트입니다. 정보 메시지를 위해 파란색 스타일을 사용합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "메시지의 제목",
		},
		message: {
			control: "text",
			description: "주요 메시지 콘텐츠",
		},
	},
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		title: "정보",
		message: "이것은 정보 메시지입니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "제목과 콘텐츠가 있는 기본 메시지입니다.",
			},
		},
	},
};

export const 짧은_메시지: Story = {
	args: {
		title: "알림",
		message: "짧은 메시지입니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "짧은 콘텐츠를 가진 메시지입니다.",
			},
		},
	},
};

export const 긴_메시지: Story = {
	args: {
		title: "중요한 업데이트",
		message:
			"이것은 사용자가 알아야 할 중요한 업데이트나 알림에 대한 더 자세한 정보를 포함하는 더 긴 메시지입니다. 이것은 메시지 컴포넌트가 더 긴 텍스트 콘텐츠를 어떻게 처리하는지를 보여줍니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "텍스트 랩핑을 보여주는 긴 콘텐츠를 가진 메시지입니다.",
			},
		},
	},
};

export const 시스템_메시지들: Story = {
	args: {
		title: "시스템 유지보수",
		message:
			"예정된 유지보수가 오늘 밤 오전 12:00부터 오전 2:00까지 실시됩니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 사용 사례를 보여주는 여러 시스템 메시지들입니다.",
			},
		},
	},
};

export const 환영_메시지: Story = {
	args: {
		title: "환영합니다!",
		message:
			"저희 플랫폼에 가입해 주셔서 감사합니다. 대시보드를 탐색하고 프로필을 설정하여 시작하세요.",
	},
	parameters: {
		docs: {
			description: {
				story: "신규 사용자를 위한 환영 메시지입니다.",
			},
		},
	},
};

export const 업데이트_알림: Story = {
	args: {
		title: "업데이트 사용 가능",
		message:
			"새로운 기능과 버그 수정이 포함된 버전 2.1.0이 이제 사용 가능합니다. 최신 개선 사항을 얻으려면 지금 업데이트하세요.",
	},
	parameters: {
		docs: {
			description: {
				story: "소프트웨어 업데이트 알림 메시지입니다.",
			},
		},
	},
};

export const 정보_배너: Story = {
	args: {
		title: "COVID-19 업데이트",
		message:
			"저희는 계속해서 모든 보건 및 안전 지침을 따르고 있습니다. 강화된 안전 조치와 함께 서비스를 계속 이용할 수 있습니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "중요한 공지사항을 위한 넓은 정보 배너 메시지입니다.",
			},
		},
	},
};

export const 빠른_팁들: Story = {
	args: {
		title: "팁 #1",
		message: "작업을 빠르게 저장하려면 키보드 단축키 Ctrl+S를 사용하세요.",
	},
	parameters: {
		docs: {
			description: {
				story: "사용자를 위한 도움이 되는 팁 메시지 시리즈입니다.",
			},
		},
	},
};

export const 상태_업데이트들: Story = {
	args: {
		title: "처리 완료",
		message: "파일이 성공적으로 처리되었으며 다운로드할 준비가 되었습니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 시스템 상태에 대한 상태 업데이트 메시지들입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		title: "플레이그라운드 메시지",
		message:
			"이것은 다양한 설정을 테스트하기 위한 플레이그라운드 메시지입니다.",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 메시지 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
