import Header from '../Header'
import EmployeeForm from './EmployeeForm';

export default function AddEmployee() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Header title='Add Employee' subtitle='Please fill in the details of new employee' />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <EmployeeForm />
      </div>
    </div>
  )
}
