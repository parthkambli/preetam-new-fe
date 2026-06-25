import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);
import * as XLSX from 'xlsx';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';
import Pagination from '../../../components/Pagination';

const PAYMENT_MODES = ['Cash', 'Bank Transfer'];

export default function AddPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filterParticipant, setFilterParticipant] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exporting, setExporting] = useState(false);

  // ── Build filter params (shared between table load + export) ──
  const buildFilterParams = (extra = {}) => {
    const params = {
      participant: filterParticipant || undefined,
      mode: filterMode || undefined,
      staff: selectedStaff?.value || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      ...extra,
    };
    Object.keys(params).forEach((k) => { if (params[k] === undefined) delete params[k]; });
    return params;
  };

  const loadStaffOptions = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', page: 1, limit: 10 });
      const list = res.data?.data?.staff || [];
      return list.map((s) => ({
        value: s._id,
        label: `${s.fullName} (${s.role || 'Staff'})`,
        data: s,
      }));
    } catch {
      return [];
    }
  };

  const loadPayments = async () => {
    setLoading(true);
    try {
      const params = buildFilterParams({ page, limit });

      const res = await api.fees.getPayments(params);
      const data = res.data?.data || res.data || [];
      const pagination = res.data?.pagination || {};

      setPayments(Array.isArray(data) ? data : []);
      setTotalCount(pagination.totalRecords || 0);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // ── Export helpers ────────────────────────────────────────────────
  const fetchExportData = async () => {
    const params = buildFilterParams({ page: 1, limit: 999999 });
    const res = await api.fees.getPayments(params);
    return res.data?.data || res.data || [];
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const all = await fetchExportData();
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.setFontSize(16);
      doc.text('Payments Report', 14, 18);

      const rows = all.map((r) => [
        r.studentId?.fullName || r.studentId?.name || r.participant || 'N/A',
        r.description || r.feeTypeId?.description || '-',
        r.feePlan || '-',
        `Rs. ${Number(r.amount).toLocaleString('en-IN')}`,
        r.allotmentId?.status || 'Paid',
        r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-IN') : '-',
        r.paymentMode || '-',
        r.responsibleStaff?.fullName || r.responsibleStaff?.name || '-',
      ]);

      doc.autoTable({
        head: [['Participant', 'Fee Description', 'Type', 'Amount', 'Status', 'Payment Date', 'Payment Mode', 'Staff']],
        body: rows,
        startY: 25,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [30, 58, 138] },
      });

      doc.save(`payments-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF export failed');
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const all = await fetchExportData();
      const data = all.map((r) => ({
        Participant: r.studentId?.fullName || r.studentId?.name || r.participant || 'N/A',
        'Fee Description': r.description || r.feeTypeId?.description || '-',
        Type: r.feePlan || '-',
        Amount: Number(r.amount) || 0,
        Status: r.allotmentId?.status || 'Paid',
        'Payment Date': r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-IN') : '-',
        'Payment Mode': r.paymentMode || '-',
        Staff: r.responsibleStaff?.fullName || r.responsibleStaff?.name || '-',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const cols = (Object.keys(data[0] || {}).map((k) => ({
        wch: Math.max(k.length, ...data.map((d) => String(d[k]).length)) + 2,
      })));
      ws['!cols'] = cols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Payments');
      XLSX.writeFile(wb, `payments-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } catch {
      toast.error('Excel export failed');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, limit]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      loadPayments();
    }
  }, [filterParticipant, filterMode, selectedStaff, fromDate, toDate]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by Student Name"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
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
        <div className="min-w-[220px]">
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadStaffOptions}
            value={selectedStaff}
            onChange={setSelectedStaff}
            placeholder="Search Staff..."
            isClearable
            classNamePrefix="react-select"
            className="text-sm"
          />
        </div>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        />
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
        >
          PDF
        </button>
        <button
          onClick={exportExcel}
          disabled={exporting}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
        >
          Excel
        </button>
      </div>

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
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-400">No payment records found</td>
              </tr>
            ) : (
              payments.map((row, idx) => (
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
                        row.allotmentId?.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {row.allotmentId?.status || 'Paid'}
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

      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}
