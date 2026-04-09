// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { OrgProvider } from './context/OrgContext';
// import DashboardLayout from './components/layout/DashboardLayout';
// import Login from './pages/auth/Login';
// import ProtectedRoute from './components/ProtectedRoute';




// // School Pages
// import SchoolDashboard from './pages/school/Dashboard';
// import SchoolEnquiry from './pages/school/Enquiry/Enquiry';
// import SchoolAddEnquiry from './pages/school/Enquiry/AddEnquiry';
// import Followups from './pages/school/Followups/Followups';
// import SchoolAdmission from './pages/school/admission/Admissions';
// import AddAdmission from './pages/school/admission/AddAdmissionForm';
// import ViewAdmission from './pages/school/admission/ViewAdmission';
// import EditAdmission from './pages/school/admission/EditAdmission';
// import StudentList from './pages/school/Student/StudentList';
// import Studentview from './pages/school/Student/Studentview';
// import Staff from './components/staff/Staff';
// import Staffdetail from './pages/school/Staff/Staffdetail';
// import Viewattendance from './pages/school/Staff/Viewattendance';
// import Staffattendancedetail from './pages/school/Staff/Staffattendancedetail';
// import Activities from './pages/school/Activities/Activities';
// import Attendance from './pages/school/Attendance/Attendance';
// import ViewStudentAttandance from './pages/school/Attendance/Viewstudentattendance';
// import Fees from './pages/school/Fees/Fees';
// import HealthRecords from './pages/school/HealthRecords/HealthRecords';
// import Viewhealthrecords from './pages/school/HealthRecords/Viewhealthrecords';
// import Addupdatehealthrecord from './pages/school/HealthRecords/Addupdatehealthrecord';
// import Events from './pages/school/Events/Events';
// import Addevent from './pages/school/Events/Addevent';
// import EmergencyContacts from './pages/school/EmergencyContacts/EmergencyContacts';
// import Reports from './pages/school/Reports/Reports';
// import UserManagement from './pages/school/UserManagement/UserManagement';
// import Adduser from './pages/school/UserManagement/Adduser';
// import Profile from './pages/school/Profile/Profile';

// // Fitness Pages
// import FitnessDashboard from './pages/fitnessClub/Dashboard';
// import FitnessEnquiry from './pages/fitnessClub/enquiry/EnquiryList';
// import FitnessAddEnquiry from './pages/fitnessClub/enquiry/AddEnquiry';
// import FitnessMembers from './pages/fitnessClub/Members/Members';
// import Addmember from './pages/fitnessClub/Members/Addmember';
// import Viewmember from './pages/fitnessClub/Members/Viewmember';
// import Editmember from './pages/fitnessClub/Members/Editmember';
// import FitnessStaff from './components/fitnessClubStaff/Staff';
// import FitnessActivities from './pages/fitnessClub/Activities/Activities';
// import FitnessAttendance from './pages/fitnessClub/Attendance/Attendance';
// import FitnessFee from './pages/fitnessClub/Fee/Fees';
// import FitnessEvents from './pages/fitnessClub/Events/Events';
// import FitnessReports from './pages/fitnessClub/Reports/Reports';
// import FitnessUserManagement from './pages/fitnessClub/UserManagement/UserManagement';

// function App() {
//   return (
//     <OrgProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Route - Login */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Routes */}
//           <Route
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* School Routes */}
//             <Route path="/school/dashboard" element={<SchoolDashboard />} />
//             <Route path="/school/enquiry" element={<SchoolEnquiry />} />
//             <Route path="/school/enquiry/add" element={<SchoolAddEnquiry />} />
//             <Route path="/school/follow-ups" element={<Followups />} />
//             <Route path="/school/admission" element={<SchoolAdmission />} />
//             <Route path="/school/admission/add" element={<AddAdmission />} />
//             <Route path="/school/admission/view/:id" element={<ViewAdmission />} />
//             <Route path="/school/admission/edit/:id" element={<EditAdmission />} />
//             <Route path="/school/participants" element={<StudentList />} />
//             <Route path="/school/participants/view/:id" element={<Studentview />} />
//             <Route path="/school/staff" element={<Staff />} />
//             <Route path="/school/staff/view/:id" element={<Staffdetail />} />
//             <Route path="/school/staff/Viewattendance" element={<Viewattendance />} />
//             <Route path="/school/staff/attendance-detail/:id" element={<Staffattendancedetail />} />
//             <Route path="/school/activities" element={<Activities />} />
//             <Route path="/school/attendance" element={<Attendance />} />
//             <Route path="/school/student-attendance/:id" element={<ViewStudentAttandance />} />
//             <Route path="/school/fees" element={<Fees />} />
//             <Route path="/school/health-records" element={<HealthRecords />} />
//             <Route path="/school/health-records/view/:id" element={<Viewhealthrecords />} />
//             <Route path="/school/health-records/add-update" element={<Addupdatehealthrecord />} />
//             <Route path="/school/events" element={<Events />} />
//             <Route path="/school/Addevent" element={<Addevent />} />
//             <Route path="/school/emergency-contacts" element={<EmergencyContacts />} />
//             <Route path="/school/reports" element={<Reports />} />
//             <Route path="/school/user-management" element={<UserManagement />} />
//             <Route path="/school/user-management/Add-user" element={<Adduser />} />
//             <Route path="/profile" element={<Profile />} />

//             {/* Fitness Routes */}
//             <Route path="/fitness/dashboard" element={<FitnessDashboard />} />
//             <Route path="/fitness/enquiry" element={<FitnessEnquiry />} />
//             <Route path="/fitness/enquiry/add" element={<FitnessAddEnquiry />} />
//             <Route path="/fitness/follow-ups" element={<Followups />} />
//             <Route path="/fitness/members" element={<FitnessMembers />} />
//             <Route path="/fitness/members/add-members" element={<Addmember />} />
//             <Route path="/fitness/members/view-member/:id" element={<Viewmember />} />
//             <Route path="/fitness/members/edit-member/:id" element={<Editmember />} />
//             <Route path="/fitness/staff" element={<FitnessStaff />} />
//             <Route path="/fitness/staff/view/:id" element={<Staffdetail />} />
//             <Route path="/fitness/staff/Viewattendance" element={<Viewattendance />} />
//             <Route path="/fitness/staff/attendance-detail/:id" element={<Staffattendancedetail />} />
//             <Route path="/fitness/activities" element={<FitnessActivities />} />
//             <Route path="/fitness/attendance" element={<FitnessAttendance />} />
//             <Route path="/fitness/student-attendance/:id" element={<ViewStudentAttandance />} />
//             <Route path="/fitness/fee" element={<FitnessFee />} />
//             <Route path="/fitness/events" element={<FitnessEvents />} />
//             <Route path="/fitness/Addevent" element={<Addevent />} />
//             <Route path="/fitness/reports" element={<FitnessReports />} />
//             <Route path="/fitness/user-management" element={<FitnessUserManagement />} />
//             <Route path="/fitness/user-management/Add-user" element={<Adduser />} />
//           </Route>

//           {/* Redirect root to login if not authenticated, otherwise to school dashboard */}
//           <Route
//             path="/"
//             element={
//               localStorage.getItem('token') ? (
//                 <Navigate to="/school/dashboard" replace />
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             }
//           />

//           {/* 404 Route */}
//           <Route path="*" element={<div>404 - Not Found</div>} />
//         </Routes>
//       </BrowserRouter>
//     </OrgProvider>
//   );
// }

// export default App;













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
            <Route path="/school/Addevent" element={<SchoolAddevent />} />
            <Route path="/school/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/school/reports" element={<SchoolReports />} />
            <Route path="/school/user-management" element={<SchoolUserManagement />} />
            <Route path="/school/user-management/Add-user" element={<SchoolAdduser />} />
            <Route path="/profile" element={<Profile />} />

            {/* ====================== FITNESS CLUB ROUTES ====================== */}
            <Route path="/fitness/dashboard" element={<FitnessDashboard />} />
            <Route path="/fitness/enquiry" element={<FitnessEnquiry />} />
            <Route path="/fitness/enquiry/add" element={<FitnessAddEnquiry />} />
            <Route path="/fitness/follow-ups" element={<FitnessFollowups />} />  {/* Keep if truly shared, otherwise create FitnessFollowups */}
            <Route path="/fitness/members" element={<FitnessMembers />} />
            <Route path="/fitness/members/add-members" element={<Addmember />} />
            <Route path="/fitness/members/view-member/:id" element={<Viewmember />} />
            <Route path="/fitness/members/edit-member/:id" element={<Editmember />} />
            <Route path="/fitness/staff" element={<FitnessStaff />} />
            <Route path="/fitness/staff/view/:id" element={<FitnessStaffDetail />} />
            <Route path="/fitness/staff/Viewattendance" element={<FitnessViewAttendance />} />
            <Route path="/fitness/staff/attendance-detail/:id" element={<FitnessStaffAttendanceDetail />} />
            <Route path="/fitness/activities" element={<FitnessActivities />} />
            <Route path="/fitness/attendance" element={<FitnessAttendance />} />
            <Route path="/fitness/student-attendance/:id" element={<FitnessViewStudentAttendance />} />
            <Route path="/fitness/fee" element={<FitnessFee />} />
            <Route path="/fitness/events" element={<FitnessEvents />} />
            <Route path="/fitness/Addevent" element={<FitnessAddevent />} />
            <Route path="/fitness/reports" element={<FitnessReports />} />
            <Route path="/fitness/user-management" element={<FitnessUserManagement />} />
            <Route path="/fitness/user-management/Add-user" element={<FitnessAdduser />} />
            
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