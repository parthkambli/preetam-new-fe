import { useState, useEffect, useCallback } from "react";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ── Export helpers (browser-side via CDN) ─────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function exportToPDF(title, headers, rows) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.autoTable({
    startY: 22,
    head: [headers],
    body: rows,
    headStyles: { fillColor: [26, 42, 94], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 10 },
  });
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

async function exportToExcel(title, headers, rows) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
  const XLSX = window.XLSX;
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
  XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}.xlsx`);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Reports() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    totalAdmissions: 0,
    activeParticipants: 0,
    totalRevenue: 0,
    pendingFees: 0,
    todaysAttendance: 0,
  });
  const [appliedFilter, setAppliedFilter] = useState(null);

  const [admissionsData, setAdmissionsData] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [exporting, setExporting] = useState("");

  const isAdmissions = activeTab === "admissions";

  const formatIndian = (num) => {
    if (num === null || num === undefined) return "0";
    const n = Number(num);
    if (isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const [dashRes, admissionsRes, studentsRes] = await Promise.all([
        api.schoolReports.getDashboard(params),
        api.schoolAdmission.getAll(),
        api.students.getAll(),
      ]);

      const dash = dashRes.data || {};
      setStats({
        totalEnquiries: dash.totalEnquiries || 0,
        totalAdmissions: dash.totalAdmissions || 0,
        activeParticipants: dash.activeParticipants || 0,
        totalRevenue: dash.totalRevenue || 0,
        pendingFees: dash.pendingFees || 0,
        todaysAttendance: dash.todaysAttendance || 0,
      });
      setAppliedFilter(dash.appliedFilter || null);

      const admissions = admissionsRes.data?.data || admissionsRes.data || [];
      setAdmissionsData(admissions.map(a => ({
        name: a.fullName,
        date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
        status: a.status || "Admitted",
        admissionId: a.admissionId || '',
      })));

      const students = studentsRes.data || [];
      setParticipantsData(students.map(s => ({
        name: s.fullName,
        category: s.residency === 'Yes' || s.instituteType === 'Residency' ? "Resident" : "Day Care",
        status: s.status || "Active",
      })));

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const currentTitle = isAdmissions ? "Admissions Report" : "Participants Report";
  
  const currentHeaders = isAdmissions 
    ? ["Name", "Date", "Status"] 
    : ["Name", "Category", "Status"];

  const currentData = isAdmissions ? admissionsData : participantsData;

  const currentRows = currentData.map((row) => 
    isAdmissions 
      ? [row.name, row.date, row.status] 
      : [row.name, row.category, row.status]
  );

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      await exportToPDF(currentTitle, currentHeaders, currentRows);
      toast.success("PDF exported successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export PDF");
    } finally {
      setExporting("");
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      await exportToExcel(currentTitle, currentHeaders, currentRows);
      toast.success("Excel exported successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export Excel");
    } finally {
      setExporting("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        <div className="text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm"
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); }}
              className="text-xs text-gray-500 hover:text-gray-700 px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {appliedFilter && (appliedFilter.fromDate || appliedFilter.toDate) && (
        <p className="text-xs text-gray-500 -mt-4 mb-4">
          Filtered: {appliedFilter.fromDate || "…"} – {appliedFilter.toDate || "…"}
        </p>
      )}

      {/* ── Stats grid ── */}
      <div className="bg-gray-100 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Top 4 cards */}
          {[
            { label: "Total Enquiries", value: stats.totalEnquiries, prefix: "", format: false },
            { label: "Total Admissions", value: stats.totalAdmissions, prefix: "", format: false },
            { label: "Active Participants", value: stats.activeParticipants, prefix: "", format: false },
            { label: "Total Revenue", value: stats.totalRevenue, prefix: "₹ ", format: true },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {stat.prefix}{stat.format ? formatIndian(stat.value) : stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        {/* Bottom 2 wide cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            { label: "Pending Fees", value: stats.pendingFees, prefix: "₹ ", format: true },
            { label: "Today's Attendance", value: stats.todaysAttendance, prefix: "", format: false },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {stat.prefix}{stat.format ? formatIndian(stat.value) : stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Report tabs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Admissions card */}
        <button
          onClick={() => setActiveTab("admissions")}
          className={`text-left rounded-xl p-5 border-2 transition-all duration-150 bg-white shadow-sm ${
            isAdmissions ? "border-[#1a2a5e]" : "border-transparent"
          }`}
        >
          <h2 className="text-lg font-bold text-[#1a2a5e] mb-1">Admissions</h2>
          <p className="text-sm text-gray-500 mb-4">Total enquiries & confirmed admissions</p>
          <span className={`inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isAdmissions
              ? "bg-[#1a2a5e] text-white"
              : "bg-[#1a2a5e] text-white hover:bg-[#152147]"
          }`}>
            View Report
          </span>
        </button>

        {/* Participants card */}
        <button
          onClick={() => setActiveTab("participants")}
          className={`text-left rounded-xl p-5 border-2 transition-all duration-150 bg-white shadow-sm ${
            !isAdmissions ? "border-[#1a2a5e]" : "border-transparent"
          }`}
        >
          <h2 className="text-lg font-bold text-[#1a2a5e] mb-1">Participants</h2>
          <p className="text-sm text-gray-500 mb-4">Active and inactive participants</p>
          <span className={`inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            !isAdmissions
              ? "bg-[#1a2a5e] text-white"
              : "bg-[#1a2a5e] text-white hover:bg-[#152147]"
          }`}>
            View Report
          </span>
        </button>
      </div>

      {/* ── Report table ── */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-gray-800">{currentTitle}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                {currentHeaders.map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {isAdmissions ? (
                      <>
                        <td className="px-5 py-3 text-gray-800">{row.name}</td>
                        <td className="px-5 py-3 text-gray-600">{row.date}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            row.status === "Admitted" || row.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3 text-gray-800">{row.name}</td>
                        <td className="px-5 py-3 text-gray-600">{row.category}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            row.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Export buttons */}
        <div className="flex justify-end gap-3 px-5 py-4">
          <button
            onClick={handleExportPDF}
            disabled={exporting === "pdf"}
            className="flex items-center gap-2 bg-[#1a2a5e] hover:bg-[#152147] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {exporting === "pdf" ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting === "excel"}
            className="flex items-center gap-2 bg-[#1a2a5e] hover:bg-[#152147] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {exporting === "excel" ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            )}
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}