



// import { useNavigate } from 'react-router-dom';
// import { useOrg } from '../../context/OrgContext';

// export default function Navbar({ onMenuClick }) {
//   const { currentOrg, switchOrg, availableOrgs, user } = useOrg();
//   const navigate = useNavigate();

//   const handleOrgChange = (e) => {
//     switchOrg(e.target.value);
//     navigate(`/${e.target.value}/dashboard`);
//   };

//   return (
//     <nav className="bg-[#000359] text-gray-800 px-4 py-3 flex justify-between items-center shadow-sm border-b border-gray-200 mx-2 mt-2 rounded-xl">
//       {/* Left: hamburger (mobile) + back arrow + org dropdown */}
//       <div className="flex items-center gap-3">
//         {/* Mobile hamburger */}
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Back arrow */}
//         <button
//           onClick={() => navigate(-1)}
//           className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 bg-white transition"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         {/* Org switcher pill */}
//         {availableOrgs.length > 0 && (
//           <div className="relative">
//             <select
//               value={currentOrg?.id || ''}
//               onChange={handleOrgChange}
//               className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:bg-gray-50 transition shadow-sm"
//             >
//               {availableOrgs.map(org => (
//                 <option key={org.id} value={org.id}>
//                   {org.name}
//                 </option>
//               ))}
//             </select>
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</span>
//           </div>
//         )}
//       </div>

//       {/* Right: avatar + name */}
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
//           <span className="text-gray-600 font-bold text-base">
//             {user?.fullName?.charAt(0) || 'A'}
//           </span>
//         </div>
//         <div className="hidden md:block text-right">
//           <p className="font-semibold text-sm text-white leading-tight">{user?.fullName || 'Admin'}</p>
//           <p className="text-xs text-white leading-tight">{user?.userId || ''}</p>
//         </div>
//       </div>
//     </nav>
//   );
// }





import { useNavigate } from 'react-router-dom';
import { useOrg } from '../../context/OrgContext';

export default function Navbar({ onMenuClick }) {
  const { currentOrg, switchOrg, availableOrgs, user } = useOrg();
  const navigate = useNavigate();

  const handleOrgChange = (e) => {
    switchOrg(e.target.value);
    navigate(`/${e.target.value}/dashboard`);
  };

  return (
    <nav className="bg-[#000359] text-gray-800 px-4 py-3 flex justify-between items-center shadow-sm border-b border-gray-200 mx-2 mt-2 rounded-xl">
      {/* Left: hamburger (mobile) + back arrow + org dropdown */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Back arrow */}
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 bg-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Org switcher pill */}
        {availableOrgs.length > 0 && (
          <div className="relative">
            <select
              value={currentOrg?.id || ''}
              onChange={handleOrgChange}
              className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:bg-gray-50 transition shadow-sm"
            >
              {availableOrgs.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</span>
          </div>
        )}
      </div>

      {/* Right: avatar + name */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/profile')}
        title="View Profile"
      >
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 group-hover:ring-2 group-hover:ring-white/50 transition-all duration-200">
          <span className="text-gray-600 font-bold text-base">
            {user?.fullName?.charAt(0) || 'A'}
          </span>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-semibold text-sm text-white leading-tight group-hover:underline underline-offset-2 transition-all">
            {user?.fullName || 'Admin'}
          </p>
          <p className="text-xs text-white leading-tight">{user?.userId || ''}</p>
        </div>
      </div>
    </nav>
  );
}