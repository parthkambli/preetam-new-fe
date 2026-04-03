// pages/school/Fees/AllotFees.jsx

import { useState } from 'react';

const FEE_ITEMS = [
  'Senior Citizen Happiness School (Age 55+)',
  'Anand Nivas — Regular Room (Residency)',
  'Anand Nivas-Regular Room (AC)(Residency)',
  'Anand Nivas — Deluxe Room (Residency)',
  'Anand Nivas — Premium Room (Residency)',
];

const TYPES         = ['Annual', 'Monthly', 'Weekly', 'Daily'];
const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

const initialAllotments = [
  { id: 1, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  { id: 2, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  { id: 3, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  { id: 4, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
];

export default function AllotFees() {
  const [allotments, setAllotments] = useState(initialAllotments);

  const [form, setForm] = useState({
    participant:  '',
    feeItem:      FEE_ITEMS[0],
    amount:       '',
    type:         'Annual',
    paymentMode:  'Cash',
    dueDate:      '',
  });

  // Filters
  const [filterParticipant, setFilterParticipant] = useState('Raj Sharma');
  const [filterType,        setFilterType]        = useState('Daily');

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.participant || !form.amount) return;
    setAllotments((prev) => [
      ...prev,
      {
        id:          prev.length + 1,
        participant: form.participant,
        description: form.feeItem,
        type:        form.type,
        amount:      Number(form.amount),
        dueDate:     form.dueDate || '-',
      },
    ]);
    setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', dueDate: '' });
  };

  const handleCancel = () =>
    setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', dueDate: '' });

  return (
    <div className="space-y-5">

      {/* Allot Fees Form */}
      <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
        {/* Row 1: Participant, Fee Item, Amount, Type, Payment Mode, Due Date */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
            <input
              type="text"
              placeholder="Select Participant"
              value={form.participant}
              onChange={(e) => handleChange('participant', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
            <select
              value={form.feeItem}
              onChange={(e) => handleChange('feeItem', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {FEE_ITEMS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
            <input
              type="number"
              placeholder="₹ Amount"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end gap-3">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
          placeholder="Participant"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[130px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Allotments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Participants', 'Description', 'Type', 'Amount', 'Due Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allotments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  No allotment records found.
                </td>
              </tr>
            ) : (
              allotments.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.participant}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.dueDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}