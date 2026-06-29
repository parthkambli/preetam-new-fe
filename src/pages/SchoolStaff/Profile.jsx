import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiClient';

export default function Profile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.schoolStaffPanel.getProfile()
      .then(res => {
        setProfile(res.data?.data || null);
      })
      .catch(err => {
        console.error('Failed to load profile:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400 text-sm">Loading profile...</div>
    );
  }

  const p = profile || {};
  const initials = (p.name || '?').charAt(0).toUpperCase();

  return (
    <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

      <h1 className="text-xl font-bold text-gray-800 mb-6">Profile</h1>

      <div
        className={`border border-gray-200 rounded-xl bg-white max-w-3xl transition-all duration-200 ${
          showModal ? 'opacity-60 pointer-events-none select-none' : ''
        }`}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-5 border-b border-gray-100">
          {p.profileImage ? (
            <img
              src={p.profileImage}
              alt={p.name}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-gray-500">{initials}</span>
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-gray-900 leading-tight">{p.name || 'Staff'}</p>
            <p className="text-sm text-gray-500">{p.role || 'School Staff'}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="divide-y divide-gray-100 px-6">
          <InfoRow label="Email" value={p.email || '-'} />
          <InfoRow label="Mobile Number" value={p.mobile || '-'} />
          <InfoRow
            label="Assigned Activities"
            value={
              p.assignedActivities?.length
                ? p.assignedActivities.join(', ')
                : 'None'
            }
          />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowModal(false)}
          />
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