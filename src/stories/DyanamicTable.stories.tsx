import type { Meta, StoryObj } from '@storybook/react-vite';
import DyanamicTable from '../components/DyanamicTable';

const meta: Meta<typeof DyanamicTable> = {
  title: 'Components/DyanamicTable',
  component: DyanamicTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MainData: Story = {
    args: {
        columns: [
            { key: 'name', title: 'Name' },
            { key: 'age', title: 'Age' },
            { key: 'email', title: 'Email' },
        ] as never[],
        data: [
            { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
            { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
            { name: 'Bob Johnson', age: 35, email: 'bob.johnson@example.com' },
        ] as never[],
        columnWidths: ['400px', '150px', '250px'] as never[],
        compact: true,
        bordered: true, 
        striped: true,
        onRowClick: undefined,
    },
};

export const TitleTable: Story = {
    args: {
        title: 'User Information',

        columns: [
            { key: 'name', title: 'Name' } as never,
            { key: 'age', title: 'Age' } as never,
            { key: 'email', title: 'Email' } as never,
        ],

        data: [
            { name: 'John Doe', age: 30, email: 'john.doe@example.com' } as never,
            { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' } as never,
            { name: 'Bob Johnson', age: 35, email: 'bob.johnson@example.com' } as never,
        ],

        columnWidths: ['200px', '100px', '250px'] as never[],
        compact: true,
        bordered: true,
        striped: true,
        emptyMessage: "No history available for this asset",
        onRowClick: undefined,
    },
};

export const EmptyTable: Story = {
    args: {
        columns: [
            { key: 'name', title: 'Name' } as never,
            { key: 'age', title: 'Age' } as never,
            { key: 'email', title: 'Email' } as never,
        ],

        data: [] as never[],

        columnWidths: ['200px', '100px', '250px'] as never[],
        compact: true,
        bordered: true,
        striped: true,
        emptyMessage: "No history available for this asset",
        onRowClick: undefined,
    },
};

export const LoadingTable: Story = {
    args: {
        columns: [
            { key: 'name', title: 'Name' } as never,
            { key: 'age', title: 'Age' } as never,
            { key: 'email', title: 'Email' } as never,
        ],

        data: [] as never[],

        columnWidths: ['200px', '100px', '250px'] as never[],
        compact: true,
        bordered: true,
        striped: true,
        loading: true,
        onRowClick: undefined,
    },
};