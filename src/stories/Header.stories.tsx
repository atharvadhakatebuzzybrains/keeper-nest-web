import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { fn } from 'storybook/test';
import { BrowserRouter } from 'react-router-dom';

import Header from '../components/Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title text displayed in header',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text displayed below title',
    },
    showBackButton: {
      control: 'boolean',
      description: 'Show/hide back button',
    },
    showProfile: {
      control: 'boolean',
      description: 'Show/hide profile avatar',
    },
    showSearch: {
      control: 'boolean',
      description: 'Show/hide search bar',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for search input',
    },
    searchValue: {
      control: 'text',
      description: 'Current search value',
    },
    searchDebounce: {
      control: 'number',
      description: 'Debounce delay in milliseconds for search',
    },
    onSearchChange: {
      action: 'onSearchChange',
      description: 'Callback function fired when search value changes (with debounce)',
    },
  },
  args: {
    onSearchChange: fn(),
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSubtitle: Story = {
  args: {
    title: 'Employee Management',
    subtitle: 'View and manage all employees',
    showBackButton: true,
    showProfile: true,
    showSearch: false,
  },
};

export const WithSearch: Story = {
  args: {
    title: 'Assets',
    showBackButton: true,
    showProfile: true,
    showSearch: true,
    searchPlaceholder: 'Search assets...',
    searchValue: '',
    onSearchChange: fn(),
  },
};

export const FullFeatured: Story = {
  args: {
    title: 'Users',
    subtitle: 'Manage system users',
    showBackButton: true,
    showProfile: true,
    showSearch: true,
    searchPlaceholder: 'Search users...',
    searchValue: '',
    onSearchChange: fn(),
  },
};

export const WithActiveSearch: Story = {
  args: {
    title: 'Employees',
    subtitle: '250 employees in total',
    showBackButton: true,
    showProfile: true,
    showSearch: true,
    searchPlaceholder: 'Search employees...',
    searchValue: 'John',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Asset Management System - Inventory Dashboard',
    subtitle: 'Track all company assets and their current status',
    showBackButton: true,
    showProfile: true,
    showSearch: true,
    searchPlaceholder: 'Search by asset name or ID...',
    searchValue: '',
  },
};

export const WithoutBackButton: Story = {
  args: {
    title: 'Home',
    showBackButton: false,
    showProfile: true,
    showSearch: true,
    searchPlaceholder: 'Search...',
    searchValue: '',
  },
};

export const WithoutProfile: Story = {
  args: {
    title: 'Public View',
    showBackButton: true,
    showProfile: false,
    showSearch: false,
  },
};
