import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];
const STATUS_OPTS = ['All', 'Paid', 'Unpaid'];

export default function AddPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterParticipant, setFilterParticipant] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMode, setFilterMode] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const res = await api.fees.getPayments();
        setPayments(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const filteredPayments = payments.filter((row) => {
    const participantName =
      row.studentId?.fullName ||
      row.studentId?.name ||
      row.participant ||
      row.studentName ||
      'Unknown';

    const matchParticipant =
      !filterParticipant ||
      participantName.toLowerCase().includes(filterParticipant.toLowerCase());

    const matchType = !filterType || row.feePlan === filterType;
    const matchStatus = filterStatus === 'All' || row.status === filterStatus;
    const matchMode = !filterMode || row.paymentMode === filterMode;
    const matchMonth = !filterMonth || (row.paymentDate || '').startsWith(filterMonth);

    return matchParticipant && matchType && matchStatus && matchMode && matchMonth;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter Participant"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="Annual">Annual</option>
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          {STATUS_OPTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Modes</option>
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Participant', 'Fee Description', 'Type', 'Amount', 'Status', 'Payment Date', 'Payment Mode', 'Staff'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">Loading payments...</td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-400">No payment records found</td>
              </tr>
            ) : (
              filteredPayments.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {row.studentId?.fullName || row.studentId?.name || row.participant || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {row.description || row.feeTypeId?.description || '-'}
                  </td>
                  <td className="px-4 py-3">{row.feePlan}</td>
                  <td className="px-4 py-3 font-medium">
                    ₹{Number(row.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
                        row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {row.status || 'Paid'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.paymentDate ? new Date(row.paymentDate).toLocaleDateString('en-IN') : '-'}
                  </td>
                  <td className="px-4 py-3">{row.paymentMode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.responsibleStaff?.fullName || row.responsibleStaff?.name || '-'}
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
