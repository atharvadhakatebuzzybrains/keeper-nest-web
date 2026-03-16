import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import ConfirmModal from '../components/ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
        description: 'Title text displayed at the top of the dialog',
        },
    description: {
      control: 'text',
        description: 'Description text providing more details about the confirmation action',
        },
    confirmText: {
      control: 'text',
        description: 'Text displayed on the confirm button',
        },
    cancelText: {
      control: 'text',
        description: 'Text displayed on the cancel button',
        },
    type: {
      control: 'select',
        options: ['danger', 'warning', 'info', 'success'],
        description: 'Type of confirmation dialog, affecting styling and icon',
        },
    onConfirm: {
      action: 'onConfirm',
        description: 'Callback function fired when the confirm button is clicked',
        },
    onClose: {
      action: 'onClose',
        description: 'Callback function fired when the close button is clicked or dialog is dismissed',
        },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    description: 'Are you sure you want to perform this action? This cannot be undone.',
    confirmText: 'Yes, Confirm',
    cancelText: 'No, Cancel',
    type: 'warning',
  },
};