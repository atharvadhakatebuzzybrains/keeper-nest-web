import type { Meta, StoryObj } from '@storybook/react-vite';
import EmployeeDashboard from '../screen/EmployeeDashboard';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof EmployeeDashboard> = {
  title: 'Components/EmployeeDashboard',
  component: EmployeeDashboard, 
  tags: ['autodocs'],
  decorators: [    (Story) => (    <BrowserRouter>      <Story />    </BrowserRouter>  ),],
};
export default meta;

export const Main: StoryObj<typeof meta> = {
  args: {},
};