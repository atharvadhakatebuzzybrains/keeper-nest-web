import type { Meta, StoryObj } from '@storybook/react-vite';
import AdminDashboard from '../screen/AdminDashboard';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof AdminDashboard> = {
  title: 'Components/AdminDashboard',
  component: AdminDashboard,
  tags: ['autodocs'],
  decorators: [
      (Story) => (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      ),
    ],
};
export default meta;

export const Main: StoryObj<typeof meta> = {
  args: {},
};