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