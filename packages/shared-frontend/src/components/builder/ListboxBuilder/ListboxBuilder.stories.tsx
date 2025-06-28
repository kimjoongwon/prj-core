import type { Meta, StoryObj } from '@storybook/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ListboxBuilder } from './ListboxBuilder';
import { PageProvider } from '../../../provider';

const meta: Meta<typeof ListboxBuilder> = {
  title: 'Builder/ListboxBuilder',
  component: ListboxBuilder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    path: {
      control: 'text',
      description: 'The path in the state object where the selected value will be stored',
    },
    query: {
      control: 'object',
      description: 'API query configuration for fetching listbox options',
    },
    selectionMode: {
      control: { type: 'radio' },
      options: ['single', 'multiple'],
      description: 'Selection mode for the listbox',
    },
    title: {
      control: 'text',
      description: 'Title to display above the listbox',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const StoryWrapper = observer(({ children }: { children: React.ReactNode }) => {
  const pageState = useLocalObservable(() => ({ selectedValue: '' }));
  
  return (
    <div className="w-80">
      <PageProvider pageBuilder={{ state: pageState }}>
        {children}
      </PageProvider>
    </div>
  );
});

export const Default: Story = {
  args: {
    path: 'selectedValue',
    query: {
      type: 'list',
      query: {
        name: 'options',
        params: {},
      },
      listOptions: {
        valueField: 'value',
        labelField: 'text',
      },
    },
    title: 'Select Options',
    selectionMode: 'single',
  },
  render: (args) => (
    <StoryWrapper>
      <ListboxBuilder {...args} />
    </StoryWrapper>
  ),
};

export const Multiple: Story = {
  args: {
    ...Default.args,
    selectionMode: 'multiple',
    title: 'Select Multiple Options',
  },
  render: (args) => (
    <StoryWrapper>
      <ListboxBuilder {...args} />
    </StoryWrapper>
  ),
};

export const WithoutTitle: Story = {
  args: {
    ...Default.args,
    title: undefined,
  },
  render: (args) => (
    <StoryWrapper>
      <ListboxBuilder {...args} />
    </StoryWrapper>
  ),
};

export const DarkMode: Story = {
  args: {
    ...Default.args,
    title: 'Dark Mode Listbox',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (args) => (
    <div className="dark">
      <StoryWrapper>
        <ListboxBuilder {...args} />
      </StoryWrapper>
    </div>
  ),
};
