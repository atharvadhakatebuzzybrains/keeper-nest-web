import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import Snackbar from '../components/Alerts';

const meta: Meta<typeof Snackbar> = {
    title: 'Components/Alerts',
    component: Snackbar,
    tags: ['autodocs'],
    argTypes: {
        message: {
            control: 'text',
            description: 'The message text displayed in the alert',
        },
        isOpen: {
            control: 'boolean',
            description: 'Controls whether the alert is visible or hidden',
        },
        type: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
            description: 'The type of alert, affecting styling and icon',
        },
    }
}

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: {
        isOpen: true,
        message: 'This is a success alert!',
        type: 'success',
    },
};
