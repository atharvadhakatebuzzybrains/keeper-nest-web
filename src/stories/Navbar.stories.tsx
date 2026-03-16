import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import { BrowserRouter } from 'react-router-dom';

import Navbar from '../components/Navbar';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  argTypes: {
    name: {
      control: 'text',
      description: 'User name displayed in navbar',
    },
    email: {
      control: 'text',
      description: 'User email address',
    },
    role: {
      control: 'select',
      options: ['admin', 'employee'],
      description: 'User role in the application',
    },
  },

  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminUser: Story = {
  args: {
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
  },
};

// Employee user story
export const EmployeeUser: Story = {
  args: {
    name: 'Jane Employee',
    email: 'employee@example.com',
    role: 'employee',
  },
};

// User with long name
export const LongNameUser: Story = {
  args: {
    name: 'Alexander Christopher Richardson',
    email: 'alexander.richardson@company.com',
    role: 'admin',
  },
};
