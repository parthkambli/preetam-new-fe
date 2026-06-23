// pages/school/Profile/StudentProfile.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const user = {
  name:      'Admin User',
  role:      'System Administrator',
  email:     'admin@fitnessclub.com',
  mobile:    '9876543210',
  lastLogin: '22 Jan 2026, 10:15 AM',
};

export default function Profile() {
  const navigate              = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    // clear auth tokens / session here, then redirect to login
    navigate('/login');
  };

  return (
    <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

      {/* Page title */}
      <h1 className="text-xl font-bold text-gray-800 mb-6">Profile</h1>

      {/* Profile card */}
      <div
        className={`border border-gray-200 rounded-xl bg-white max-w-3xl transition-all duration-200 ${
          showModal ? 'opacity-60 pointer-events-none select-none' : ''
        }`}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-5 border-b border-gray-100">
          {/* Avatar circle */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-gray-500">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="divide-y divide-gray-100 px-6">
          <InfoRow label="Email"         value={user.email}     />
          <InfoRow label="Mobile Number" value={user.mobile}    />
          <InfoRow label="Last Login"    value={user.lastLogin} />
        </div>

        {/* Logout button */}
        <div className="px-6 py-5">
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowModal(false)}
          />

          {/* Modal box */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm px-6 py-7 flex flex-col items-center text-center z-10">
            <h2 className="text-lg font-bold text-[#1e3a8a] mb-2">Logout</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Are you sure you want to log out?
              <br />
              You can log in again anytime using your mobile
              <br />
              number and password.
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-lg mb-3 transition-all duration-200"
            >
              Logout
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-semibold py-2.5 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
    </div>
  );
}