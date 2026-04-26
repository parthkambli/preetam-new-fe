// pages/fitness/Fees/fee.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from "../../../src/services/apiClient";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PAYMENT_MODES = ['Cash', 'Bank Transfer'];
const STATUS_OPTS = ['All', 'Paid', 'Pending'];

export default function FitnessFeesPage() {
  // ── Stats ─────────────────────────────────────────────────
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAssigned: 0,
    totalCollected: 0,
  });

  // ── Transaction Report State ──────────────────────────────
  const [payments, setPayments]   = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [members, setMembers]     = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading]     = useState(true);

  // Filters
  const [filterMember, setFilterMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMode, setFilterMode]     = useState('');
  const [filterStaff, setFilterStaff]   = useState('');
  const [fromDate, setFromDate]         = useState('');
  const [toDate, setToDate]             = useState('');

  // ── Load Everything ───────────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [statsRes, paymentsRes, allotmentsRes, membersRes, staffRes] =
          await Promise.all([
            api.fitnessFees.getStats(),
            api.fitnessFees.getPayments(),
            api.fitnessFees.getAllotments(),
            api.staffPanel.getMembers(),
            api.staffPanel.getStaff(),
          ]);

        if (statsRes.data?.success) setStats(statsRes.data.data);

        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
        setAllotments(Array.isArray(allotmentsRes.data) ? allotmentsRes.data : []);
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
        setStaffList(
          Array.isArray(staffRes.data?.data?.staff)
            ? staffRes.data.data.staff
            : []
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ── Staff lookup ──────────────────────────────────────────
  const staffMap = {};
  staffList.forEach((s) => {
    staffMap[s._id] = s.fullName || s.name || 'N/A';
  });

  const getStaffName = (staffIdOrObj) => {
    if (!staffIdOrObj) return 'N/A';
    if (typeof staffIdOrObj === 'object')
      return staffIdOrObj.fullName || staffIdOrObj.name || 'N/A';
    return staffMap[staffIdOrObj] || 'N/A';
  };

  // ── Filtered Payments ─────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    const name = p.memberId?.name || p.memberId?.fullName || '';
    const matchesMember =
      !filterMember || name.toLowerCase().includes(filterMember.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || p.allotmentId?.status === filterStatus;

    const matchesMode =
      !filterMode || p.paymentMode?.toLowerCase().includes(filterMode.toLowerCase());

    const staffId = p.allotmentId?.responsibleStaff;
    const resolvedStaffId = typeof staffId === 'object' ? staffId?._id : staffId;
    const matchesStaff = !filterStaff || resolvedStaffId === filterStaff;

    const paymentDate = p.paymentDate ? new Date(p.paymentDate) : null;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);

    const matchesDateRange =
      (!from || (paymentDate && paymentDate >= from)) &&
      (!to || (paymentDate && paymentDate <= to));

    return (
      matchesMember &&
      matchesStatus &&
      matchesMode &&
      matchesStaff &&
      matchesDateRange
    );
  });

  const staffOptions = staffList.map((s) => ({
    value: s._id,
    label: s.fullName || s.name,
  }));

  // ── Export Handlers ───────────────────────────────────────
  const handleExportExcel = () => {
    if (!filteredPayments.length) return toast.error('No data to export');

    const data = filteredPayments.map((p) => ({
      Member: p.memberId?.name || p.memberId?.fullName || 'N/A',
      Description:
        p.description || p.allotmentId?.description || p.feeTypeId?.description || '-',
      Amount: p.amount,
      Status: p.allotmentId?.status || 'Pending',
      Date: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '',
      Staff: getStaffName(p.allotmentId?.responsibleStaff),
      Mode: p.paymentMode,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'Payment_Report.xlsx');
  };

  const handleExportPDF = () => {
    if (!filteredPayments.length) return toast.error('No data to export');

    const doc = new jsPDF();
    doc.text('Payment Report', 14, 15);
    if (fromDate || toDate)
      doc.text(`Date: ${fromDate || 'Start'} to ${toDate || 'End'}`, 14, 22);

    const rows = filteredPayments.map((p) => [
      p.memberId?.name || p.memberId?.fullName || 'N/A',
      p.description || p.allotmentId?.description || p.feeTypeId?.description || '-',
      `Rs. ${Number(p.amount).toLocaleString('en-IN')}`,
      p.allotmentId?.status || 'Pending',
      p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '',
      getStaffName(p.allotmentId?.responsibleStaff),
      p.paymentMode,
    ]);

    autoTable(doc, {
      head: [['Member', 'Description', 'Amount', 'Status', 'Date', 'Staff', 'Mode']],
      body: rows,
      startY: 30,
    });

    doc.save('Payment_Report.pdf');
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-5 font-sans">

      {/* Page Header */}
      <h1 className="text-xl font-semibold text-gray-800">
        Fitness Fees / Membership
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border-2 border-gray-300 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">{stats.totalMembers}</p>
          <p className="text-xs text-gray-500 mt-1">Total Members</p>
        </div>

        <div className="rounded-lg border-2 border-green-500 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">
            ₹ {Number(stats.totalAssigned).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Fee Assigned (₹)</p>
        </div>

        <div className="rounded-lg border-2 border-red-400 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">
            ₹ {Number(stats.totalCollected).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Collected (₹)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search By Member Name"
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
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
        <select
          value={filterStaff}
          onChange={(e) => setFilterStaff(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Staff</option>
          {staffOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
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
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          PDF
        </button>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {[
                'Member',
                'Description',
                'Amount Paid',
                'Status',
                'Payment Date',
                'Responsible Staff',
                'Payment Mode',
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No payment records found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`border-b hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {p.memberId?.name || p.memberId?.fullName || p.customerName || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {p.description ||
                      p.allotmentId?.description ||
                      p.feeTypeId?.description ||
                      '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
                        p.allotmentId?.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {p.allotmentId?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.paymentDate
                      ? new Date(p.paymentDate).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {getStaffName(p.allotmentId?.responsibleStaff)}
                  </td>
                  <td className="px-4 py-3">{p.paymentMode}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}