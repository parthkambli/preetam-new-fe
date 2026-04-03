// pages/school/Fees/FeeTypes.jsx

import { useState } from 'react';

const FEE_TYPE_OPTS = ['School', 'Residency', 'DayCare'];

const initialFeeTypes = [
  { id: 1, description: 'Senior Citizen Happiness School (Age 55+)',    annual: 36000, monthly: 3600, weekly: 900,  daily: 180, type: 'School'    },
  { id: 2, description: 'Anand Nivas — Regular Room (Residency)',        annual: 36000, monthly: 3600, weekly: 900,  daily: 180, type: 'Residency' },
  { id: 3, description: 'Anand Nivas-Regular Room (AC)(Residency)',      annual: 48000, monthly: 4800, weekly: 1200, daily: 240, type: 'Residency' },
  { id: 4, description: 'Anand Nivas — Deluxe Room (Residency)',         annual: 60000, monthly: 6000, weekly: 1500, daily: 300, type: 'Residency' },
  { id: 5, description: 'Anand Nivas — Premium Room (Residency)',        annual: 72000, monthly: 7200, weekly: 1800, daily: 360, type: 'Residency' },
  { id: 6, description: 'Anand School (1st Year)  Breakfast, Lunch Dinner', annual: 60000, monthly: 6000, weekly: 1500, daily: 300, type: 'School' },
  { id: 7, description: 'Anand School (2nd Year) — Breakfast, Lunch Dinner', annual: 54000, monthly: 5400, weekly: 1350, daily: 270, type: 'School' },
  { id: 8, description: 'Anand Nivas — Day Care (Full Day Stay)',         annual: 30000, monthly: 3000, weekly: 750,  daily: 150, type: 'DayCare'  },
];

const emptyForm = { description: '', annual: '', monthly: '', weekly: '', daily: '', type: 'School' };

export default function FeeTypes() {
  const [feeTypes,   setFeeTypes]   = useState(initialFeeTypes);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAddClick = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({
      description: row.description,
      annual:      row.annual,
      monthly:     row.monthly,
      weekly:      row.weekly,
      daily:       row.daily,
      type:        row.type,
    });
    setShowForm(true);
  };

  const handleDelete = (id) =>
    setFeeTypes((prev) => prev.filter((f) => f.id !== id));

  const handleSave = () => {
    if (!form.description) return;
    if (editId) {
      setFeeTypes((prev) =>
        prev.map((f) =>
          f.id === editId
            ? { ...f, ...form, annual: Number(form.annual), monthly: Number(form.monthly), weekly: Number(form.weekly), daily: Number(form.daily) }
            : f
        )
      );
    } else {
      setFeeTypes((prev) => [
        ...prev,
        {
          id:          prev.length + 1,
          description: form.description,
          annual:      Number(form.annual),
          monthly:     Number(form.monthly),
          weekly:      Number(form.weekly),
          daily:       Number(form.daily),
          type:        form.type,
        },
      ]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-5">

      {/* Header row: title + Add Fee button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Fee Types</h2>
        <button
          onClick={handleAddClick}
          className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
        >
          Add Fee
        </button>
      </div>

      {/* Inline Add / Edit Form */}
      {showForm && (
        <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
          <h3 className="text-base font-semibold text-gray-800">
            {editId ? 'Edit Fee Types' : 'Add Fee Types'}
          </h3>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Description</label>
            <input
              type="text"
              placeholder="Senior Citizen Happiness School (Age 55+)"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Annual, Monthly, Weekly, Daily */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { field: 'annual',  label: 'Annual'  },
              { field: 'monthly', label: 'Monthly' },
              { field: 'weekly',  label: 'Weekly'  },
              { field: 'daily',   label: 'Daily'   },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">{label}</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
          </div>

          {/* Type */}
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {FEE_TYPE_OPTS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-6 py-2 rounded-md transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fee Types Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[750px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Sr', 'Description', 'Annual', 'Monthly', 'Weekly', 'Daily', 'Type', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeTypes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  No fee types found.
                </td>
              </tr>
            ) : (
              feeTypes.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[220px]">{row.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.annual.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.monthly.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.weekly.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.daily}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(row)}
                        className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="border border-red-300 text-red-500 text-xs font-medium px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}