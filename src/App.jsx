








import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OrgProvider } from './context/OrgContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// ====================== SCHOOL PAGES ======================
import SchoolDashboard from './pages/school/Dashboard';
import SchoolEnquiry from './pages/school/Enquiry/Enquiry';
import SchoolAddEnquiry from './pages/school/Enquiry/AddEnquiry';
import Followups from './pages/school/Followups/Followups';
import SchoolAdmission from './pages/school/admission/Admissions';
import AddAdmission from './pages/school/admission/AddAdmissionForm';
import ViewAdmission from './pages/school/admission/ViewAdmission';
import EditAdmission from './pages/school/admission/EditAdmission';
import StudentList from './pages/school/Student/StudentList';
import Studentview from './pages/school/Student/Studentview';
import SchoolStaff from './components/staff/Staff';
import SchoolStaffDetail from './pages/school/Staff/Staffdetail';
import SchoolViewAttendance from './pages/school/Staff/Viewattendance';
import SchoolStaffAttendanceDetail from './pages/school/Staff/Staffattendancedetail';
import SchoolActivities from './pages/school/Activities/Activities';
import SchoolAttendance from './pages/school/Attendance/Attendance';
import ViewStudentAttandance from './pages/school/Attendance/Viewstudentattendance';
import SchoolFees from './pages/school/Fees/Fees';
import HealthRecords from './pages/school/HealthRecords/HealthRecords';
import Viewhealthrecords from './pages/school/HealthRecords/Viewhealthrecords';
import Addupdatehealthrecord from './pages/school/HealthRecords/Addupdatehealthrecord';
import SchoolEvents from './pages/school/Events/Events';
import SchoolAddevent from './pages/school/Events/Addevent';
import EmergencyContacts from './pages/school/EmergencyContacts/EmergencyContacts';
import SchoolReports from './pages/school/Reports/Reports';
import SchoolUserManagement from './pages/school/UserManagement/UserManagement';
import SchoolAdduser from './pages/school/UserManagement/Adduser';
import Profile from './pages/school/Profile/Profile';
import TimeTable from './pages/school/TimeTable/TimeTable'
import Services from './pages/school/AddonServices/Services'

// school staff panel 
import SchoolStaffDashboard from "./pages/SchoolStaff/Dashboard";
import SchoolStaffAttendance from './pages/SchoolStaff/Attendance';
import SchoolStaffMySchedule from './pages/SchoolStaff/Myschedule';
import SchoolStaffEnquiry from './pages/SchoolStaff/enquiry/EnquiryList';
import SchoolStaffAddEnquiry from './pages/SchoolStaff/enquiry/AddEnquiry';
import SchoolStaffFollowups from './pages/SchoolStaff/Followups/SchoolFollowups';
import SchoolStaffAdmission from './pages/SchoolStaff/Admission/AdmissionList';
import SchoolStaffAddAdmission from './pages/SchoolStaff/Admission/AddAdmission';
import SchoolStaffViewAdmission from './pages/SchoolStaff/Admission/ViewAdmission';
import SchoolStaffEditAdmission from './pages/SchoolStaff/Admission/EditAdmission';
import SchoolStaffStudents from './pages/SchoolStaff/Students/StudentsList';
import SchoolStaffViewStudent from './pages/SchoolStaff/Students/ViewStudent';
import SchoolStaffViewStudentAttendance from './pages/SchoolStaff/Attendance/ViewStudentAttendance';
import SchoolStaffFees from './pages/SchoolStaff/Fees/Fees';
import SchoolStaffHealthRecords from './pages/SchoolStaff/HealthRecords/HealthRecords';
import SchoolStaffViewHealthRecord from './pages/SchoolStaff/HealthRecords/ViewHealthRecord';
import SchoolStaffAddHealthRecord from './pages/SchoolStaff/HealthRecords/AddHealthRecord';
import SchoolStaffServices from './pages/SchoolStaff/Services/Services';
import SchoolStaffEmergencyContacts from './pages/SchoolStaff/EmergencyContacts/EmergencyContacts';
import SchoolStaffReports from './pages/SchoolStaff/Reports';
import SchoolStaffProfile from './pages/SchoolStaff/Profile';

// ====================== FITNESS CLUB PAGES ======================
import FitnessDashboard from './pages/fitnessClub/Dashboard';
import FitnessEnquiry from './pages/fitnessClub/enquiry/EnquiryList';
import FitnessAddEnquiry from './pages/fitnessClub/enquiry/AddEnquiry';
import FitnessFollowups from './pages/fitnessClub/Followups/FitnessFollowups';
import FitnessMembers from './pages/fitnessClub/Members/Members';
import Addmember from './pages/fitnessClub/Members/Addmember';
import Viewmember from './pages/fitnessClub/Members/Viewmember';
import Editmember from './pages/fitnessClub/Members/Editmember';
import FitnessStaff from './components/fitnessClubStaff/Staff';                    // As per your requirement
import FitnessStaffDetail from './pages/fitnessClub/Staff/Staffdetail';           // Dedicated fitness version
import FitnessViewAttendance from './pages/fitnessClub/Staff/Viewattendance';     // Dedicated
import FitnessStaffAttendanceDetail from './pages/fitnessClub/Staff/Staffattendancedetail'; // Dedicated
import FitnessActivities from './pages/fitnessClub/Activities/Activities';
import FitnessAttendance from './pages/fitnessClub/Attendance/Attendance';
import FitnessViewStudentAttendance from './pages/fitnessClub/Attendance/Viewstudentattendance'; // Dedicated if exists, else adjust
import FitnessFee from './pages/fitnessClub/Fee/Fees';
import FitnessEvents from './pages/fitnessClub/Events/Events';
import FitnessAddevent from './pages/fitnessClub/Events/Addevent';                // Dedicated version
import FitnessReports from './pages/fitnessClub/Reports/Reports';
import FitnessUserManagement from './pages/fitnessClub/UserManagement/UserManagement';
import FitnessAdduser from './pages/fitnessClub/UserManagement/Adduser';           // Dedicated version
// import DashboardPage from './pages/FitnessStaff/Dashboard';
// aadi 


import FitnessStaffDashboard from "./pages/FitnessStaff/Dashboard";
import FitnessStaffEnquiry from './pages/FitnessStaff/enquiry/EnquiryList';
import FitnessStaffAddEnquiry from './pages/FitnessStaff/enquiry/AddEnquiry';
import FitnessStaffFollowups from './pages/FitnessStaff/Followups/FitnessFollowups';
import FitnessStaffAttendance from "./pages/FitnessStaff/Attendance"
import FitnessStaffFees from "./pages/FitnessStaff/fee"
import FitnessStaffReport from "./pages/FitnessStaff/Reports"
import FitnessStaffMySchedule from "./pages/FitnessStaff/MySchedule";
import FitnessStaffMember from "./pages/FitnessStaff/Members/Members";
import FitnessStaffAddmember from "./pages/FitnessStaff/Members/Addmember";
import FitnessStaffViewmember from "./pages/FitnessStaff/Members/Viewmember";
import FitnessStaffEditmember from "./pages/FitnessStaff/Members/Editmember";
import FitnessStaffAddPassMember from "./pages/FitnessStaff/Members/AddPassMember";
// import Profile from "./pages/FitnessStaff/Profile"

import AddPassMember from './pages/fitnessClub/Members/AddPassMember';
import ViewPassMember from './pages/fitnessClub/Members/ViewPassMember';
import StaffProfilePage from './pages/FitnessStaff/Profile';




function App() {
  return (
    <OrgProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* ====================== SCHOOL ROUTES ====================== */}
            <Route path="/school/dashboard" element={<SchoolDashboard />} />
            <Route path="/school/enquiry" element={<SchoolEnquiry />} />
            <Route path="/school/enquiry/add" element={<SchoolAddEnquiry />} />
            <Route path="/school/follow-ups" element={<Followups />} />
            <Route path="/school/admission" element={<SchoolAdmission />} />
            <Route path="/school/admission/add" element={<AddAdmission />} />
            <Route path="/school/admission/view/:id" element={<ViewAdmission />} />
            <Route path="/school/admission/edit/:id" element={<EditAdmission />} />
            <Route path="/school/participants" element={<StudentList />} />
            <Route path="/school/participants/view/:id" element={<Studentview />} />
            <Route path="/school/staff" element={<SchoolStaff />} />
            <Route path="/school/staff/view/:id" element={<SchoolStaffDetail />} />
            <Route path="/school/staff/Viewattendance" element={<SchoolViewAttendance />} />
            <Route path="/school/staff/attendance-detail/:id" element={<SchoolStaffAttendanceDetail />} />
            <Route path="/school/activities" element={<SchoolActivities />} />
            <Route path="/school/attendance" element={<SchoolAttendance />} />
            <Route path="/school/student-attendance/:id" element={<ViewStudentAttandance />} />
            <Route path="/school/fees" element={<SchoolFees />} />
            <Route path="/school/health-records" element={<HealthRecords />} />
            <Route path="/school/health-records/view/:id" element={<Viewhealthrecords />} />
            <Route path="/school/health-records/add-update" element={<Addupdatehealthrecord />} />
            <Route path="/school/events" element={<SchoolEvents />} />
            <Route path="/school/timetable" element={<TimeTable />} />
            <Route path="/school/services" element={<Services />} />
            <Route path="/school/Addevent" element={<SchoolAddevent />} />
            
            <Route path="/school/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/school/reports" element={<SchoolReports />} />
            <Route path="/school/user-management" element={<SchoolUserManagement />} />
            <Route path="/school/user-management/Add-user" element={<SchoolAdduser />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/school-staff/dashboard" element={<SchoolStaffDashboard/>} />
            <Route path="/school-staff" element={<SchoolStaffDashboard/>} />
            <Route path="/school-staff/my-schedule" element={<SchoolStaffMySchedule />} />
            <Route path="/school-staff/enquiry" element={<SchoolStaffEnquiry />} />
            <Route path="/school-staff/enquiry/add" element={<SchoolStaffAddEnquiry />} />
            <Route path="/school-staff/follow-ups" element={<SchoolStaffFollowups />} />
            <Route path="/school-staff/admission" element={<SchoolStaffAdmission />} />
            <Route path="/school-staff/admission/add" element={<SchoolStaffAddAdmission />} />
            <Route path="/school-staff/admission/view/:id" element={<SchoolStaffViewAdmission />} />
            <Route path="/school-staff/admission/edit/:id" element={<SchoolStaffEditAdmission />} />
            <Route path="/school-staff/participants" element={<SchoolStaffStudents />} />
            <Route path="/school-staff/participants/view/:id" element={<SchoolStaffViewStudent />} />
            <Route path="/school-staff/attendance" element={<SchoolStaffAttendance />} />
            <Route path="/school-staff/student-attendance/:id" element={<SchoolStaffViewStudentAttendance />} />
            <Route path="/school-staff/fees" element={<SchoolStaffFees />} />
            <Route path="/school-staff/health-records" element={<SchoolStaffHealthRecords />} />
            <Route path="/school-staff/health-records/view/:id" element={<SchoolStaffViewHealthRecord />} />
            <Route path="/school-staff/health-records/add-update" element={<SchoolStaffAddHealthRecord />} />
            <Route path="/school-staff/health-records/edit/:id" element={<SchoolStaffAddHealthRecord />} />
            <Route path="/school-staff/services" element={<SchoolStaffServices />} />
            <Route path="/school-staff/emergency-contacts" element={<SchoolStaffEmergencyContacts />} />
            <Route path="/school-staff/reports" element={<SchoolStaffReports />} />
            <Route path="/school-staff/profile" element={<SchoolStaffProfile />} />

            {/* ====================== FITNESS CLUB ROUTES ====================== */}
            <Route path="/fitness/dashboard" element={<FitnessDashboard />} />
            <Route path="/fitness/enquiry" element={<FitnessEnquiry />} />
            <Route path="/fitness/enquiry/add" element={<FitnessAddEnquiry />} />
            <Route path="/fitness/follow-ups" element={<FitnessFollowups />} />  {/* Keep if truly shared, otherwise create FitnessFollowups */}
            <Route path="/fitness/members" element={<FitnessMembers />} />
            <Route path="/fitness/members/add-members" element={<Addmember />} />
            <Route path="/fitness/members/add-pass" element={<AddPassMember />} />
            <Route path="/fitness/members/view-member/:id" element={<Viewmember />} />
            <Route path="/fitness/members/edit-member/:id" element={<Editmember />} />

            <Route path="/fitness/members/edit-pass/:id" element={<AddPassMember />} />
            <Route path="/fitness/members/view-pass/:id" element={<AddPassMember viewMode={true} />} />

            <Route path="/fitness/staff" element={<FitnessStaff />} />
            <Route path="/fitness/staff/view/:id" element={<FitnessStaffDetail />} />
            <Route path="/fitness/staff/Viewattendance" element={<FitnessViewAttendance />} />
            <Route path="/fitness/staff/attendance-detail/:id" element={<FitnessStaffAttendanceDetail />} />
            <Route path="/fitness/activities" element={<FitnessActivities />} />
            <Route path="/fitness/attendance" element={<FitnessAttendance />} />
            <Route path="/fitness/attendance/:activityid" element={<FitnessViewStudentAttendance />} />
            <Route path="/fitness/fee" element={<FitnessFee />} />
            <Route path="/fitness/events" element={<FitnessEvents />} />
            <Route path="/fitness/Addevent" element={<FitnessAddevent />} />
            <Route path="/fitness/reports" element={<FitnessReports />} />
            <Route path="/fitness/user-management" element={<FitnessUserManagement />} />
            <Route path="/fitness/user-management/Add-user" element={<FitnessAdduser />} />

             {/* fitness staff panel routes... */}
            <Route path="/fitness-staff" element={<FitnessStaffDashboard/>} />
            <Route path="/fitness-staff/enquiry" element={<FitnessStaffEnquiry />} />
            <Route path="/fitness-staff/enquiry/add" element={<FitnessStaffAddEnquiry />} />
            <Route path="/fitness-staff/follow-ups" element={<FitnessStaffFollowups />} />  
            <Route path="/fitness-staff/attendance" element={<FitnessStaffAttendance />} /> 
            <Route path="/fitness-staff/my-Schedule" element={< FitnessStaffMySchedule />} /> 
            <Route path="/fitness-staff/members" element={<FitnessStaffMember />} />
            <Route path="/fitness-staff/members/add-members" element={<FitnessStaffAddmember />} />
            <Route path="/fitness-staff/members/add-pass" element={<FitnessStaffAddPassMember />} />
            <Route path="/fitness-staff/members/view-member/:id" element={<FitnessStaffViewmember />} />
            <Route path="/fitness-staff/members/edit-member/:id" element={<FitnessStaffEditmember />} />

            <Route path="/fitness-staff/members/edit-pass/:id" element={<FitnessStaffAddmember />} />
            <Route path="/fitness-staff/members/view-pass/:id" element={<FitnessStaffAddmember viewMode={true} />} />
             <Route path="/fitness-staff/fees" element={< FitnessStaffFees />} /> 
             <Route path="/fitness-staff/reports" element={< FitnessStaffReport />} /> 
             <Route path="/fitness-staff/profile" element={<StaffProfilePage />} /> 


        
          </Route>

          {/* Root Redirect */}
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? (
                <Navigate to="/school/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </OrgProvider>
  );
}

export default App;