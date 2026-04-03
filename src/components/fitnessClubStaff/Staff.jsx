// pages/fitness/Staff/Staff.jsx

import { useState } from 'react';
import StaffTabs from './StaffTabs';
import StaffList from '../../pages/fitnessClub/Staff/Stafflist';
import AddStaff from '../../pages/fitnessClub/Staff/AddStaff';
import AddRole from '../../pages/fitnessClub/Staff/AddRole';
import AddEmploymentType from '../../pages/fitnessClub/Staff/AddEmploymentType';
import ViewAttendance from '../../pages/fitnessClub/Staff/Viewattendance';

export default function FitnessClubStaff() {   // ← Better name to avoid confusion
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

      {/* Title + tabs */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-gray-800">Fitness Club Staff</h1>
        <StaffTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
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