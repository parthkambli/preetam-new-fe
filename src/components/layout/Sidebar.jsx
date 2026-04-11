









// import { NavLink, useNavigate } from 'react-router-dom';
// import { useOrg } from '../../context/OrgContext';
// import logo from '../../assets/logo.png';

// const schoolMenu = [
//   { to: "/school/dashboard",          label: "Dashboard",              icon: "🏠" },
//   { to: "/school/enquiry",            label: "Enquiry",                icon: "✏️" },
//   { to: "/school/follow-ups",         label: "Follow-Ups",             icon: "💬" },
//   { to: "/school/admission",          label: "Admission",              icon: "🎓" },
//   { to: "/school/participants",       label: "Participants / Students", icon: "👥" },
//   { to: "/school/staff",              label: "Staff",                  icon: "👤" },
//   { to: "/school/activities",         label: "Activities",             icon: "🏃" },
//   { to: "/school/attendance",         label: "Attendance",             icon: "📅" },
//   { to: "/school/fees",               label: "Fees",                   icon: "💰" },
//   { to: "/school/health-records",     label: "Health Records",         icon: "🩺" },
//   { to: "/school/events",             label: "Events",                 icon: "🎉" },
//   { to: "/school/emergency-contacts", label: "Emergency Contacts",     icon: "🚨" },
//   { to: "/school/reports",            label: "Reports",                icon: "📊" },
//   { to: "/school/user-management",    label: "User Management",        icon: "👤" },
// ];

// const fitnessMenu = [
//   { to: "/fitness/dashboard",      label: "Dashboard",      icon: "🏠" },
//   { to: "/fitness/enquiry",        label: "Enquiry",        icon: "✏️" },
//   { to: "/fitness/follow-ups",     label: "Follow-ups",     icon: "💬" },
//   { to: "/fitness/members",        label: "Members",        icon: "👥" },
//   { to: "/fitness/staff",          label: "Staff",          icon: "👤" },
//   { to: "/fitness/activities",     label: "Activities",     icon: "🏃" },
//   { to: "/fitness/attendance",     label: "Attendance",     icon: "📅" },
//   { to: "/fitness/fee",            label: "Fee",            icon: "💰" },
//   { to: "/fitness/events",         label: "Events",         icon: "🎉" },
//   { to: "/fitness/reports",        label: "Reports",        icon: "📊" },
//   { to: "/fitness/user-management",label: "User Management",icon: "👤" },
// ];

// export default function Sidebar({ isOpen, onClose }) {
//   const { currentOrg, logout } = useOrg();
//   const navigate = useNavigate();
//   const menu = currentOrg.id === 'school' ? schoolMenu : fitnessMenu;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//     if (onClose) onClose();
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           bg-[#000359] text-white w-64 min-h-screen flex flex-col flex-shrink-0
//           fixed lg:static inset-y-0 left-0 z-50 my-2 ml-2 rounded-xl
//           transform transition-transform duration-300 ease-in-out
//           ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//         `}
//       >
//         {/* Logo + org name header */}
//         <div className="p-5 flex items-center gap-3 border-b border-blue-900">
//           <img src={logo} alt="logo" className="w-11 h-11 rounded-xl object-contain bg-white p-1" />
//           <div>
//             <p className="font-bold text-base leading-tight">Preetam</p>
//             <p className="text-xs text-blue-300 leading-tight">{currentOrg.label}</p>
//           </div>
//           {/* Mobile close */}
//           <button onClick={onClose} className="lg:hidden ml-auto text-white hover:text-gray-300">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Nav links - Improved Scrollbar */}
//         <nav className="flex-1 overflow-y-auto py-2 custom-sidebar-scroll">
//           {menu.map(item => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               onClick={() => onClose && onClose()}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
//                  ${isActive
//                    ? 'bg-[#00047a] border-l-4 border-blue-400 font-semibold text-white'
//                    : 'text-blue-100 hover:bg-[#00047a] border-l-4 border-transparent'
//                  }`
//               }
//             >
//               <span className="text-base w-5 text-center">{item.icon}</span>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-blue-900">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         .custom-sidebar-scroll {
//           scrollbar-width: thin;
//           scrollbar-color: #4a6cf7 #1e3a8a;
//         }

//         .custom-sidebar-scroll::-webkit-scrollbar {
//           width: 6px;
//         }

//         .custom-sidebar-scroll::-webkit-scrollbar-track {
//           background: #1e3a8a;
//           border-radius: 20px;
//           margin: 4px 0;
//         }

//         .custom-sidebar-scroll::-webkit-scrollbar-thumb {
//           background: #4a6cf7;
//           border-radius: 20px;
//         }

//         .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
//           background: #60a5fa;
//         }

//         /* Optional: Hide scrollbar when not hovering (clean look) */
//         .custom-sidebar-scroll:hover::-webkit-scrollbar-thumb {
//           background: #4a6cf7;
//         }
//       `}</style>
//     </>
//   );
// }











// import { NavLink, useNavigate } from 'react-router-dom';
// import { useOrg } from '../../context/OrgContext';
// import schoolLogo  from '../../assets/school-logo.png';
// import fitnessLogo from '../../assets/fitness-logo.png';

// const schoolMenu = [
//   { to: "/school/dashboard",          label: "Dashboard",               icon: "🏠" },
//   { to: "/school/enquiry",            label: "Enquiry",                 icon: "✏️" },
//   { to: "/school/follow-ups",         label: "Follow-Ups",              icon: "💬" },
//   { to: "/school/admission",          label: "Admission",               icon: "🎓" },
//   { to: "/school/participants",       label: "Participants / Students",  icon: "👥" },
//   { to: "/school/staff",              label: "Staff",                   icon: "👤" },
//   { to: "/school/activities",         label: "Activities",              icon: "🏃" },
//   { to: "/school/attendance",         label: "Attendance",              icon: "📅" },
//   { to: "/school/fees",               label: "Fees",                    icon: "💰" },
//   { to: "/school/health-records",     label: "Health Records",          icon: "🩺" },
//   { to: "/school/events",             label: "Events",                  icon: "🎉" },
//   { to: "/school/emergency-contacts", label: "Emergency Contacts",      icon: "🚨" },
//   { to: "/school/reports",            label: "Reports",                 icon: "📊" },
//   { to: "/school/user-management",    label: "User Management",         icon: "👤" },
// ];

// const fitnessMenu = [
//   { to: "/fitness/dashboard",       label: "Dashboard",       icon: "🏠" },
//   { to: "/fitness/enquiry",         label: "Enquiry",         icon: "✏️" },
//   { to: "/fitness/follow-ups",      label: "Follow-ups",      icon: "💬" },
//   { to: "/fitness/members",         label: "Members",         icon: "👥" },
//   { to: "/fitness/staff",           label: "Staff",           icon: "👤" },
//   { to: "/fitness/activities",      label: "Activities",      icon: "🏃" },
//   { to: "/fitness/attendance",      label: "Attendance",      icon: "📅" },
//   { to: "/fitness/fee",             label: "Fee",             icon: "💰" },
//   { to: "/fitness/events",          label: "Events",          icon: "🎉" },
//   { to: "/fitness/reports",         label: "Reports",         icon: "📊" },
//   { to: "/fitness/user-management", label: "User Management", icon: "👤" },
// ];

// export default function Sidebar({ isOpen, onClose }) {
//   const { currentOrg, logout } = useOrg();
//   const navigate = useNavigate();

//   const isSchool = currentOrg.id === 'school';
//   const menu     = isSchool ? schoolMenu : fitnessMenu;
//   const logo     = isSchool ? schoolLogo : fitnessLogo;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//     if (onClose) onClose();
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           bg-[#000359] text-white w-64 min-h-screen flex flex-col flex-shrink-0
//           fixed lg:static inset-y-0 left-0 z-50 my-2 ml-2 rounded-xl
//           transform transition-transform duration-300 ease-in-out
//           ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//         `}
//       >
//         {/* Logo + org name header */}
//         <div className="p-5 flex items-center gap-3 border-b border-blue-900">
//           <img
//             key={currentOrg.id}               /* key forces re-render on org switch */
//             src={logo}
//             alt={`${currentOrg.label} logo`}
//             className="w-11 h-11 rounded-xl object-contain bg-white p-1 transition-opacity duration-300"
//           />
//           <div className="flex-1 min-w-0">
//             <p className="font-bold text-base leading-tight truncate">Preetam</p>
//             <p className="text-xs text-blue-300 leading-tight truncate">{currentOrg.label}</p>
//           </div>

//           {/* Mobile close */}
//           <button
//             onClick={onClose}
//             className="lg:hidden ml-auto text-white hover:text-gray-300 shrink-0"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Nav links */}
//         <nav className="flex-1 overflow-y-auto py-2 custom-sidebar-scroll">
//           {menu.map(item => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               onClick={() => onClose && onClose()}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
//                  ${isActive
//                    ? 'bg-[#00047a] border-l-4 border-blue-400 font-semibold text-white'
//                    : 'text-blue-100 hover:bg-[#00047a] border-l-4 border-transparent'
//                  }`
//               }
//             >
//               <span className="text-base w-5 text-center">{item.icon}</span>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-blue-900">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Scrollbar styles */}
//       <style>{`
//         .custom-sidebar-scroll {
//           scrollbar-width: thin;
//           scrollbar-color: #4a6cf7 #1e3a8a;
//         }
//         .custom-sidebar-scroll::-webkit-scrollbar        { width: 6px; }
//         .custom-sidebar-scroll::-webkit-scrollbar-track  { background: #1e3a8a; border-radius: 20px; margin: 4px 0; }
//         .custom-sidebar-scroll::-webkit-scrollbar-thumb  { background: #4a6cf7; border-radius: 20px; }
//         .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #60a5fa; }
//       `}</style>
//     </>
//   );
// }








import { NavLink, useNavigate } from 'react-router-dom';
import { useOrg } from '../../context/OrgContext';
import schoolLogo from '../../assets/school-logo.png';
import fitnessLogo from '../../assets/fitness-logo.png';

export default function Sidebar({ isOpen, onClose }) {
  const { currentOrg, user, logout } = useOrg();
  const navigate = useNavigate();

  // Determine menu based on user role (priority) or organization (fallback)
  let menu = [];
// work from here 
  if (user?.role === 'SchoolStaff') {
    menu = [
      { to: "/school-staff", label: "Dashboard", icon: "🏠" }, 
      { to: "/school-staff/my-schedule", label: "My Schedule", icon: "📅" },
      { to: "/school-staff/attendance", label: "Attendance", icon: "✅" },
    ];
  } 
  else if (user?.role === 'FitnessStaff') {
    menu = [
      { to: "/fitness-staff", label: "Dashboard", icon: "🏠" },
      { to: "/fitness-staff/attendance", label: "Available Activities", icon: "🏃" },
      { to: "/fitness-staff/my-schedule", label: "My Schedule", icon: "💰" },
    ];
  } 
  else {
    // Fallback for Admin or other roles - keep your original full menus
    const schoolMenu = [
      { to: "/school/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/school/enquiry", label: "Enquiry", icon: "✏️" },
      { to: "/school/follow-ups", label: "Follow-Ups", icon: "💬" },
      { to: "/school/admission", label: "Admission", icon: "🎓" },
      { to: "/school/participants", label: "Participants / Students", icon: "👥" },
      { to: "/school/staff", label: "Staff", icon: "👤" },
      { to: "/school/activities", label: "Activities", icon: "🏃" },
      { to: "/school/attendance", label: "Attendance", icon: "📅" },
      { to: "/school/fees", label: "Fees", icon: "💰" },
      { to: "/school/health-records", label: "Health Records", icon: "🩺" },
      { to: "/school/events", label: "Events", icon: "🎉" },
      { to: "/school/emergency-contacts", label: "Emergency Contacts", icon: "🚨" },
      { to: "/school/reports", label: "Reports", icon: "📊" },
      { to: "/school/user-management", label: "User Management", icon: "👤" },
    ];

    const fitnessMenu = [
      { to: "/fitness/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/fitness/enquiry", label: "Enquiry", icon: "✏️" },
      { to: "/fitness/follow-ups", label: "Follow-ups", icon: "💬" },
      { to: "/fitness/members", label: "Members", icon: "👥" },
      { to: "/fitness/staff", label: "Staff", icon: "👤" },
      { to: "/fitness/activities", label: "Booking", icon: "🏃" },
      { to: "/fitness/attendance", label: "Attendance", icon: "📅" },
      { to: "/fitness/fee", label: "Fee", icon: "💰" },
      { to: "/fitness/events", label: "Events", icon: "🎉" },
      { to: "/fitness/reports", label: "Reports", icon: "📊" },
      { to: "/fitness/user-management", label: "User Management", icon: "👤" },
    ];

    menu = currentOrg?.id === 'school' ? schoolMenu : fitnessMenu;
  }

  const logo = currentOrg?.id === 'school' ? schoolLogo : fitnessLogo;

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-[#000359] text-white w-64 min-h-screen flex flex-col flex-shrink-0
          fixed lg:static inset-y-0 left-0 z-50 my-2 ml-2 rounded-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo + org name header - unchanged */}
        <div className="p-5 flex items-center gap-3 border-b border-blue-900">
          <img
            key={currentOrg?.id}
            src={logo}
            alt={`${currentOrg?.label} logo`}
            className="w-11 h-11 rounded-xl object-contain bg-white p-1 transition-opacity duration-300"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight truncate">Preetam</p>
            <p className="text-xs text-blue-300 leading-tight truncate">{currentOrg?.label}</p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden ml-auto text-white hover:text-gray-300 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2 custom-sidebar-scroll">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
                 ${isActive
                   ? 'bg-[#00047a] border-l-4 border-blue-400 font-semibold text-white'
                   : 'text-blue-100 hover:bg-[#00047a] border-l-4 border-transparent'
                 }`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Scrollbar styles */}
      <style>{`
        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #4a6cf7 #1e3a8a;
        }
        .custom-sidebar-scroll::-webkit-scrollbar        { width: 6px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track  { background: #1e3a8a; border-radius: 20px; margin: 4px 0; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb  { background: #4a6cf7; border-radius: 20px; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #60a5fa; }
      `}</style>
    </>
  );
}