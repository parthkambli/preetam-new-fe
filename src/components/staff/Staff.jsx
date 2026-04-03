// pages/school/Staff/Staff.jsx

import { useState } from 'react';
import StaffTabs from './StaffTabs';
import StaffList from '../../pages/school/Staff/Stafflist';
import AddStaff from '../../pages/school/Staff/AddStaff';
import AddRole from '../../pages/school/Staff/AddRole';
import AddEmploymentType from '../../pages/school/Staff/AddEmploymentType';
import ViewAttendance from '../../pages/school/Staff/Viewattendance';

export default function Staff() {
  // Changed default from 'add-staff' to 'staff'
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

      {/* Title + tabs — always visible */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-gray-800">Staff</h1>
        <StaffTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Active tab content */}
      {activeTab === 'add-staff'           && <AddStaff />}
      {activeTab === 'staff'               && <StaffList />}
      {activeTab === 'add-role'            && <AddRole />}
      {activeTab === 'add-employment-type' && <AddEmploymentType />}
      {activeTab === 'view-attendance'     && <ViewAttendance />}

    </div>
  );
}