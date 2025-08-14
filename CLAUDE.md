## Storybook Development

- 스토리북을 만들떄 args를 빼먹어서 타입에러가 나지 않도록 합니다.
- Storybook 컴포넌트 스토리 작성 시 올바른 패턴:
  ```typescript
  ✅ 올바른 패턴:
  export const StoryName: Story = {
    args: {
      children: <SomeJSX />,
      className: "some-classes",
      // 기타 props
    },
    render: (args) => <Component {...args} />,
    parameters: { /* ... */ }
  };

  ❌ 잘못된 패턴:
  export const StoryName: Story = {
    render: () => <Component prop="value" />, // args 없이 render만 사용
    parameters: { /* ... */ }
  };
  ```

## Storybook React Component Args 규칙

**절대 금지**: React 컴포넌트나 함수를 args 객체에 직접 전달하지 마세요!

```typescript
❌ 잘못된 패턴 - JSON 직렬화 오류 발생:
export const WithIcon: Story = {
  args: {
    startContent: <Icon name="star" />, // 🚨 에러 발생!
    endContent: <Button>Click</Button>, // 🚨 에러 발생!
    avatar: <Image source={{uri: "..."}} />, // 🚨 에러 발생!
    onPress: () => console.log("pressed"), // 🚨 함수도 에러 발생!
    onClose: () => alert("closed"), // 🚨 함수도 에러 발생!
  },
};

✅ 올바른 패턴 - render 함수 사용:
export const WithIcon: Story = {
  render: (args) => (
    <Component
      {...args}
      startContent={<Icon name="star" />}
      endContent={<Button>Click</Button>}
      avatar={<Image source={{uri: "..."}} />}
      onPress={() => console.log("pressed")}
      onClose={() => alert("closed")}
    />
  ),
  args: {
    // React 컴포넌트나 함수가 아닌 직렬화 가능한 기본 props만
    variant: "solid",
    color: "primary",
    disabled: false,
    isClosable: true,
  },
};
```

**이유**: Storybook은 args를 JSON으로 직렬화하는데, React 컴포넌트와 함수는 직렬화할 수 없어서 "cycle detected" 오류가 발생합니다.

**해결법**: React 컴포넌트나 함수가 포함된 props는 항상 `render` 함수 내에서 직접 전달하세요.

## Storybook Interaction Testing 가이드

Storybook에서 interaction testing을 할 때는 `screen` 대신 `within(canvasElement)`를 사용해야 합니다.

```typescript
❌ 잘못된 패턴:
import { screen } from '@storybook/test';

export const InteractiveStory: Story = {
  play: async () => {
    await screen.getByRole('button'); // 🚨 경고 발생!
  },
};

✅ 올바른 패턴:
import { within, userEvent } from '@storybook/test';

export const InteractiveStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByRole('button');
    await userEvent.click(button);
  },
};
```

**이유**: Storybook의 캔버스는 격리된 환경이므로 전역 `screen`이 아닌 `within(canvasElement)`를 사용해야 합니다.

## 🚨 Storybook JSON 직렬화 오류 방지 체크리스트

### **절대 금지 - args에 넣으면 안 되는 것들**
- **React 컴포넌트**: `<Icon />`, `<Image />`, `<Button />`, `<View />` 등
- **함수**: `onPress`, `onClose`, `onValueChange`, `onClick`, `() => {}` 등  
- **복잡한 객체**: `{ nested: { data: () => {} } }`, 순환 참조가 있는 객체

### **허용되는 args 타입**
```typescript
✅ 안전한 args:
{
  // 기본 타입
  title: "Hello",              // string
  count: 42,                   // number
  isVisible: true,             // boolean
  value: null,                 // null
  
  // 단순 컬렉션
  items: ["a", "b", "c"],      // simple array
  config: { name: "John" },    // simple object
  
  // 열거형 값
  variant: "solid",            // enum
  size: "md",                  // enum
}
```

### **오류 해결 패턴**
| 오류 메시지 | 원인 | 해결법 |
|-------------|------|--------|
| "cycle detected" | React 컴포넌트를 args에 전달 | render 함수로 이동 |
| "JSON.stringify error" | 함수를 args에 전달 | render 함수로 이동 |
| "Cannot serialize" | 복잡한 객체를 args에 전달 | render 함수로 이동 |

### **검증 체크리스트**
```
□ React 컴포넌트가 args에 있는가? → render로 이동
□ 함수가 args에 있는가? → render로 이동  
□ 복잡한 객체가 args에 있는가? → render로 이동
□ args에는 직렬화 가능한 기본값만 있는가?
□ 모든 상호작용 요소가 render 함수 내에 있는가?
```