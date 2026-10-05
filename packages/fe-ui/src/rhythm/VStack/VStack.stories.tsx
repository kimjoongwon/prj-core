import type { Meta, StoryObj } from "@storybook/react";
import { VStack } from "./VStack";

const meta = {
	title: "rhythm/VStack",
	component: VStack,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A vertical stack component that arranges children in a column with a default gap.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
			description: "Horizontal alignment of items",
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
			description: "Vertical distribution of items",
		},
		gap: {
			control: "select",
			options: [
				"flush",
				"dense",
				"inline",
				"block",
				"section",
				"page",
				"roomy",
			],
			description:
				"세로 간격 (flush=0, dense=4, inline=8, block=12, section=16, page=24, roomy=32px)",
			defaultValue: "section",
		},
		fullWidth: {
			control: "boolean",
			description: "Whether the stack should take full width",
			defaultValue: false,
		},
		className: {
			control: "text",
			description: "Additional CSS classes to apply",
		},
	},
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleItem = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div
		className={`rounded border border-border bg-surface-secondary p-2 ${className}`}
	>
		{children}
	</div>
);

export const Default: Story = {
	args: {
		children: (
			<>
				<SampleItem>Item 1</SampleItem>
				<SampleItem>Item 2</SampleItem>
				<SampleItem>Item 3</SampleItem>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Default vertical stack using the built-in gap.",
			},
		},
	},
};

export const GapScale: Story = {
	args: {},
	render: () => (
		<VStack gap="page" className="w-full max-w-md">
			{(
				[
					["flush", "flush — 붙어야 하는 조합 (0px)"],
					["dense", "dense — metadata·보조 label 묶음 (4px)"],
					["inline", "inline — 버튼 행·chip (8px)"],
					["block", "block — 제목-본문 짧은 묶음 (12px)"],
					["section", "section — 섹션 내부 기본 흐름 (16px)"],
					["page", "page — 페이지 주요 블록 사이 (24px)"],
					["roomy", "roomy — empty·auth·intro 여유 (32px)"],
				] as const
			).map(([gap, label]) => (
				<div key={gap}>
					<h4 className="mb-2 font-semibold text-sm">{label}</h4>
					<VStack gap={gap} className="w-full border border-border p-2">
						<SampleItem>항목 A</SampleItem>
						<SampleItem>항목 B</SampleItem>
					</VStack>
				</div>
			))}
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story: "시맨틱 간격 체계. 규칙은 DESIGN.md를 참고하세요.",
			},
		},
	},
};

export const AlignItems: Story = {
	args: {},
	render: () => (
		<div className="w-full max-w-md space-y-4">
			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Start</h4>
				<VStack alignItems="start" className="w-full border border-border p-2">
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Center</h4>
				<VStack alignItems="center" className="w-full border border-border p-2">
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align End</h4>
				<VStack alignItems="end" className="w-full border border-border p-2">
					<SampleItem className="w-16">Short</SampleItem>
					<SampleItem className="w-24">Medium</SampleItem>
					<SampleItem className="w-32">Long Content</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Align Stretch</h4>
				<VStack
					alignItems="stretch"
					className="w-full border border-border p-2"
				>
					<SampleItem>Short</SampleItem>
					<SampleItem>Medium</SampleItem>
					<SampleItem>Long Content</SampleItem>
				</VStack>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different horizontal alignment options for items.",
			},
		},
	},
};

export const JustifyContent: Story = {
	args: {},
	render: () => (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Start</h4>
				<VStack
					justifyContent="start"
					className="h-40 border border-border p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Center</h4>
				<VStack
					justifyContent="center"
					className="h-40 border border-border p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify End</h4>
				<VStack justifyContent="end" className="h-40 border border-border p-2">
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>

			<div>
				<h4 className="mb-2 font-semibold text-sm">Justify Between</h4>
				<VStack
					justifyContent="between"
					className="h-40 border border-border p-2"
				>
					<SampleItem>A</SampleItem>
					<SampleItem>B</SampleItem>
					<SampleItem>C</SampleItem>
				</VStack>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different vertical distribution options for items.",
			},
		},
	},
};

export const FormLayoutExample: Story = {
	args: {},
	render: () => (
		<VStack
			alignItems="stretch"
			className="mx-auto max-w-sm rounded-lg border border-border bg-surface p-6 shadow-surface"
		>
			<h3 className="text-center font-semibold text-lg">Contact Form</h3>

			<VStack alignItems="stretch">
				<label
					htmlFor="contact-name"
					className="font-medium text-foreground text-sm"
				>
					Name
				</label>
				<input
					id="contact-name"
					type="text"
					placeholder="Enter your name"
					className="w-full rounded border border-field-border bg-field p-2 focus:border-field-border-focus focus:ring-2 focus:ring-focus"
				/>
			</VStack>

			<VStack alignItems="stretch">
				<label
					htmlFor="contact-email"
					className="font-medium text-foreground text-sm"
				>
					Email
				</label>
				<input
					id="contact-email"
					type="email"
					placeholder="Enter your email"
					className="w-full rounded border border-field-border bg-field p-2 focus:border-field-border-focus focus:ring-2 focus:ring-focus"
				/>
			</VStack>

			<VStack alignItems="stretch">
				<label
					htmlFor="contact-message"
					className="font-medium text-foreground text-sm"
				>
					Message
				</label>
				<textarea
					id="contact-message"
					placeholder="Enter your message"
					rows={4}
					className="w-full resize-none rounded border border-field-border bg-field p-2 focus:border-field-border-focus focus:ring-2 focus:ring-focus"
				/>
			</VStack>

			<button
				type="button"
				className="w-full rounded bg-accent px-4 py-2 text-accent-foreground hover:bg-accent-hover focus:ring-2 focus:ring-focus focus:ring-offset-2"
			>
				Send Message
			</button>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Example form layout using VStack for organized vertical structure.",
			},
		},
	},
};

export const CardExample: Story = {
	args: {},
	render: () => (
		<VStack className="max-w-sm overflow-hidden rounded-lg border border-border bg-surface shadow-surface">
			<div className="h-32 w-full bg-surface-tertiary"></div>

			<VStack className="px-6 pb-6">
				<VStack alignItems="center">
					<h3 className="font-bold text-foreground text-xl">Product Title</h3>
					<p className="font-bold text-2xl text-accent">$99.99</p>
				</VStack>

				<p className="text-center text-muted">
					This is a sample product description that demonstrates how VStack can
					be used for card layouts.
				</p>

				<VStack alignItems="stretch">
					<button
						type="button"
						className="w-full rounded bg-accent px-4 py-2 text-accent-foreground hover:bg-accent-hover"
					>
						Add to Cart
					</button>
					<button
						type="button"
						className="w-full rounded border border-border px-4 py-2 hover:bg-surface-secondary"
					>
						Add to Wishlist
					</button>
				</VStack>
			</VStack>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Example product card layout using VStack for vertical organization.",
			},
		},
	},
};

export const NavigationSidebarExample: Story = {
	args: {},
	render: () => (
		<VStack
			alignItems="stretch"
			className="h-64 w-48 border-r border-border bg-surface-secondary p-4"
		>
			<h4 className="mb-2 font-semibold text-foreground">Navigation</h4>

			<a
				href="#"
				className="rounded px-3 py-2 text-muted hover:bg-surface-tertiary hover:text-foreground"
			>
				Dashboard
			</a>
			<a
				href="#"
				className="rounded px-3 py-2 text-muted hover:bg-surface-tertiary hover:text-foreground"
			>
				Projects
			</a>
			<a
				href="#"
				className="rounded px-3 py-2 text-muted hover:bg-surface-tertiary hover:text-foreground"
			>
				Team
			</a>
			<a
				href="#"
				className="rounded px-3 py-2 text-muted hover:bg-surface-tertiary hover:text-foreground"
			>
				Settings
			</a>

			<div className="mt-auto border-t pt-4">
				<a
					href="#"
					className="rounded px-3 py-2 text-muted hover:bg-danger-soft hover:text-danger-soft-foreground"
				>
					Logout
				</a>
			</div>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story: "Example sidebar navigation using VStack for menu organization.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		children: (
			<>
				<SampleItem>Item 1</SampleItem>
				<SampleItem>Item 2</SampleItem>
				<SampleItem>Item 3</SampleItem>
			</>
		),
		alignItems: "stretch",
		justifyContent: "start",
		fullWidth: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different VStack configurations.",
			},
		},
	},
};
