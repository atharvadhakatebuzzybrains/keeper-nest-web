import React from 'react'
import Header from '../Header'
import DynamicTable from '../DyanamicTable';
import EmployeeForm from './EmployeeForm';

export default function AddEmployee() {
  const columns = [
    { key: 'id', title: 'ID', width: 100 },
    { key: 'name', title: 'Name', width: 200 },
    { key: 'email', title: 'Email', width: 250 },
    { key: 'status', title: 'Status', width: 150 },
    { key: 'date', title: 'Join Date', width: 150 },
  ];

  const columnWidths = [80, 180, 240, 120, 140]; // Optional: override column widths

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', date: '2024-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', date: '2024-01-05' },
  ];
  return (
    <>
    <Header title='Create Employee' subtitle='Please fill in the details of new employee' />
    <EmployeeForm />
    </>
  )
}
