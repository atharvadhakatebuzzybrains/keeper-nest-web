import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

import CustomDropdown from '../components/CustomDropdown';

const meta = {
  title: 'Components/CustomDropdown',
  component: CustomDropdown,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
];

const Template = (args: any) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div style={{ width: '300px' }}>
      <CustomDropdown
        {...args}
        value={value}
        onChange={(val) => setValue(val)}
      />
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    options: sampleOptions,
    placeholder: 'Select framework',
  },
};

export const PreSelected: Story = {
  render: Template,
  args: {
    options: sampleOptions,
    value: 'react',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    options: sampleOptions,
    disabled: true,
    value: 'vue',
  },
};

export const ManyOptions: Story = {
  render: Template,
  args: {
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
      { value: '5', label: 'Option 5' },
      { value: '6', label: 'Option 6' },
      { value: '7', label: 'Option 7' },
      { value: '8', label: 'Option 8' },
      { value: '9', label: 'Option 9' },
      { value: '10', label: 'Option 10' },
    ],
  },
};

export const EmptyOptions: Story = {
  render: Template,
  args: {
    options: [],
  },
};