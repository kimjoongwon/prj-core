import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminAuthTenantSelectPage } from "./AdminAuthTenantSelectPage";

const meta: Meta<typeof AdminAuthTenantSelectPage> = {
  title: "Pages/AdminAuthTenantSelectPage",
  component: AdminAuthTenantSelectPage,
  parameters: {
    docs: {
      description: {
        component: "관리자 인증 후 테넌트(그라운드)를 선택하는 페이지 컴포넌트입니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "500px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTenants = [
  { id: "1", name: "서울 그라운드" },
  { id: "2", name: "부산 그라운드" },
  { id: "3", name: "대구 그라운드" },
];

export const Default: Story = {
  name: "기본 상태",
  args: {
    tenants: mockTenants,
    onSelect: (tenantId: string) => console.log("Selected tenant:", tenantId),
  },
  parameters: {
    docs: {
      description: {
        story: "기본 테넌트 선택 페이지입니다.",
      },
    },
  },
};

export const EmptyTenants: Story = {
  name: "빈 테넌트 목록",
  args: {
    tenants: [],
    onSelect: (tenantId: string) => console.log("Selected tenant:", tenantId),
  },
  parameters: {
    docs: {
      description: {
        story: "테넌트 목록이 비어있는 상태입니다.",
      },
    },
  },
};

export const ManyTenants: Story = {
  name: "많은 테넌트 목록",
  args: {
    tenants: [
      { id: "1", name: "서울 그라운드" },
      { id: "2", name: "부산 그라운드" },
      { id: "3", name: "대구 그라운드" },
      { id: "4", name: "인천 그라운드" },
      { id: "5", name: "광주 그라운드" },
      { id: "6", name: "대전 그라운드" },
      { id: "7", name: "울산 그라운드" },
    ],
    onSelect: (tenantId: string) => console.log("Selected tenant:", tenantId),
  },
  parameters: {
    docs: {
      description: {
        story: "여러 테넌트가 있는 상태입니다.",
      },
    },
  },
};

export const SingleTenant: Story = {
  name: "단일 테넌트",
  args: {
    tenants: [{ id: "1", name: "서울 그라운드" }],
    onSelect: (tenantId: string) => console.log("Selected tenant:", tenantId),
  },
  parameters: {
    docs: {
      description: {
        story: "테넌트가 하나만 있는 상태입니다.",
      },
    },
  },
};