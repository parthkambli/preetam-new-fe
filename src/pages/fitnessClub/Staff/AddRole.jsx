

import { useState } from 'react';

export default function AddRole() {
  const [roleName, setRoleName] = useState('');

  const handleSave = () => {
    if (!roleName.trim()) return;
    // TODO: API call
    console.log('Saving role:', roleName);
    setRoleName('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add Role</h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 w-full max-w-lg">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Role Name
          </label>
          <input
            type="text"
            placeholder="e.g. Caregiver"
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
          />
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setRoleName('')}
            className="px-8 py-2 rounded-lg border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!roleName.trim()}
            className="px-8 py-2 rounded-lg bg-[#000359] hover:bg-[#0a0f6b] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}