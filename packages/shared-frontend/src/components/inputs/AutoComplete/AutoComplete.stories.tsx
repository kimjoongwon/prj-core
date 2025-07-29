import type { Meta, StoryObj } from "@storybook/react";
import { AutoComplete } from "./AutoComplete";

type AutoCompleteState = {
  country?: string;
  city?: string;
  category?: string;
  user?: string;
  product?: string;
};

const meta = {
  title: "입력 컴포넌트/AutoComplete",
  component: AutoComplete<AutoCompleteState>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "검색 가능한 자동완성 입력 컴포넌트입니다. HeroUI Autocomplete를 기반으로 MobX 상태 관리와 통합되어 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultItems: {
      description: "자동완성에 표시할 옵션 배열",
    },
    label: {
      control: "text",
      description: "컴포넌트 라벨 텍스트",
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 텍스트",
    },
    isDisabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    isRequired: {
      control: "boolean",
      description: "필수 입력 여부",
    },
    isInvalid: {
      control: "boolean",
      description: "유효성 검사 실패 상태",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "컴포넌트 크기",
    },
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined"],
      description: "시각적 변형",
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      description: "색상 테마",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "모서리 둥근 정도",
    },
    state: {
      description: "MobX 상태 객체",
    },
    path: {
      control: "text",
      description: "상태 객체에서 값이 바인딩될 경로",
    },
  },
} satisfies Meta<typeof AutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 옵션 데이터
const countryOptions = [
  { key: "kr", label: "대한민국" },
  { key: "us", label: "미국" },
  { key: "jp", label: "일본" },
  { key: "cn", label: "중국" },
  { key: "uk", label: "영국" },
  { key: "de", label: "독일" },
  { key: "fr", label: "프랑스" },
  { key: "ca", label: "캐나다" },
  { key: "au", label: "호주" },
  { key: "sg", label: "싱가포르" },
];

const cityOptions = [
  { key: "seoul", label: "서울" },
  { key: "busan", label: "부산" },
  { key: "incheon", label: "인천" },
  { key: "daegu", label: "대구" },
  { key: "daejeon", label: "대전" },
  { key: "gwangju", label: "광주" },
  { key: "ulsan", label: "울산" },
  { key: "sejong", label: "세종" },
];

const categoryOptions = [
  { key: "tech", label: "기술" },
  { key: "design", label: "디자인" },
  { key: "marketing", label: "마케팅" },
  { key: "sales", label: "영업" },
  { key: "finance", label: "재무" },
  { key: "hr", label: "인사" },
  { key: "operations", label: "운영" },
];

const userOptions = [
  { key: "john", label: "John Smith" },
  { key: "jane", label: "Jane Doe" },
  { key: "alex", label: "Alex Johnson" },
  { key: "sarah", label: "Sarah Wilson" },
  { key: "mike", label: "Mike Brown" },
  { key: "lisa", label: "Lisa Davis" },
];

const productOptions = [
  { key: "laptop", label: "노트북" },
  { key: "mouse", label: "마우스" },
  { key: "keyboard", label: "키보드" },
  { key: "monitor", label: "모니터" },
  { key: "headphone", label: "헤드폰" },
  { key: "speaker", label: "스피커" },
];

export const 기본: Story = {
  args: {
    defaultItems: countryOptions,
    label: "국가",
    state: { country: "" },
    path: "country",
  },
};

export const 선택된상태: Story = {
  args: {
    defaultItems: countryOptions,
    label: "국가",
    state: { country: "kr" },
    path: "country",
  },
};

export const 비활성화: Story = {
  args: {
    defaultItems: countryOptions,
    label: "국가",
    state: { country: "" },
    path: "country",
    isDisabled: true,
  },
};

export const 필수입력: Story = {
  args: {
    defaultItems: countryOptions,
    label: "국가",
    state: { country: "" },
    path: "country",
    isRequired: true,
  },
};

export const 오류상태: Story = {
  args: {
    defaultItems: countryOptions,
    label: "국가",
    state: { country: "" },
    path: "country",
    isInvalid: true,
    errorMessage: "국가를 선택해주세요.",
  },
};

export const 다양한크기: Story = {
  args: {
    items: cityOptions,
    label: "크기 예시",
    state: { city: "" },
    path: "city",
  },
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      <AutoComplete {...args} size="sm" label="작은 크기" />
      <AutoComplete {...args} size="md" label="보통 크기" />
      <AutoComplete {...args} size="lg" label="큰 크기" />
    </div>
  ),
};

export const 다양한변형: Story = {
  args: {
    items: categoryOptions,
    label: "변형 예시",
    state: { category: "" },
    path: "category",
  },
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      <AutoComplete {...args} variant="flat" label="Flat" />
      <AutoComplete {...args} variant="bordered" label="Bordered" />
      <AutoComplete {...args} variant="faded" label="Faded" />
      <AutoComplete {...args} variant="underlined" label="Underlined" />
    </div>
  ),
};

export const 다양한색상: Story = {
  args: {
    items: categoryOptions,
    label: "색상 예시",
    state: { category: "" },
    path: "category",
  },
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      <AutoComplete {...args} color="default" label="기본" />
      <AutoComplete {...args} color="primary" label="주요" />
      <AutoComplete {...args} color="secondary" label="보조" />
      <AutoComplete {...args} color="success" label="성공" />
      <AutoComplete {...args} color="warning" label="경고" />
      <AutoComplete {...args} color="danger" label="위험" />
    </div>
  ),
};

export const 폼예시: Story = {
  args: {
    items: countryOptions,
    label: "폼 예시",
    state: { country: "", city: "", user: "" },
    path: "country",
  },
  render: () => (
    <div className="max-w-md p-6 bg-white border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">사용자 정보</h3>
      <div className="flex flex-col gap-4">
        <AutoComplete
          defaultItems={countryOptions}
          label="국가"
          state={{ country: "" }}
          path="country"
          isRequired
        />
        <AutoComplete
          defaultItems={cityOptions}
          label="도시"
          state={{ city: "" }}
          path="city"
          isRequired
        />
        <AutoComplete
          defaultItems={userOptions}
          label="담당자"
          state={{ user: "" }}
          path="user"
        />
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          제출
        </button>
      </div>
    </div>
  ),
};

export const 플레이그라운드: Story = {
  args: {
    defaultItems: productOptions,
    label: "제품",
    state: { product: "" },
    path: "product",
    size: "md",
    variant: "bordered",
    color: "default",
    isRequired: false,
    isDisabled: false,
    isInvalid: false,
  },
};