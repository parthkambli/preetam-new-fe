import { useState, useEffect } from "react";
import { api } from "../../../services/apiClient";

// ── Static data ────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Enquiries", value: "248", prefix: "" },
  { label: "Total Admissions", value: "172", prefix: "" },
  { label: "Active Participants", value: "154", prefix: "" },
  { label: "Total Revenue", value: "6,45,000", prefix: "₹ " },
  { label: "Pending Fees", value: "78,000", prefix: "₹ ", wide: true },
  { label: "Today's Attendance", value: "118", prefix: "", wide: true },
];

const ADMISSIONS_DATA = [
  { name: "Ramesh Patil", date: "2026-01-10", status: "Admitted" },
  { name: "Savitaben Patel", date: "2026-01-08", status: "Pending" },
  { name: "Suresh Mehta", date: "2026-01-05", status: "Admitted" },
  { name: "Kavita Shah", date: "2025-12-20", status: "Pending" },
];

const PARTICIPANTS_DATA = [
  { name: "Anil Sharma", category: "Resident", status: "Active" },
  { name: "Meena Joshi", category: "Day Care", status: "Inactive" },
  { name: "Prakash Nair", category: "Resident", status: "Active" },
  { name: "Sunita Desai", category: "Day Care", status: "Active" },
];

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
  const [activeTab, setActiveTab] = useState("admissions"); // 'admissions' | 'participants'
  const [reportDate] = useState("Jan 10, 2024");
  const [exporting, setExporting] = useState("");
  const [admissionsData, setAdmissionsData] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);


const [stats, setStats] = useState({
  totalEnquiries: 0,
  totalAdmissions: 0,
  activeParticipants: 0,
  totalRevenue: 0,
  pendingFees: 0,
});
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");


const fetchSummary = async (from = "", to = "") => {
  try {
    const params = {};
    if (from) params.fromDate = from;
    if (to) params.toDate = to;
    const res = await api.reports.getSummary(params);
    setStats(res.data);
  } catch (err) {
    console.error("Summary error:", err);
  }
};

  const isAdmissions = activeTab === "admissions";

  const admissionsHeaders = ["Name", "Date", "Status"];
  const admissionsRows = ADMISSIONS_DATA.map((r) => [r.name, r.date, r.status]);

  const participantsHeaders = ["Name", "Category", "Status"];
  const participantsRows = PARTICIPANTS_DATA.map((r) => [r.name, r.category, r.status]);

  const currentTitle = isAdmissions ? "Admissions Report" : "Participants Report";
  const currentHeaders = isAdmissions ? admissionsHeaders : participantsHeaders;
  const currentRows = isAdmissions ? admissionsRows : participantsRows;
  const currentData = isAdmissions ? (admissionsData || []) : (participantsData || []);  


  useEffect(() => {
  fetchAdmissions();
  fetchParticipants();
  fetchSummary();    // 👈 ADD THIS
}, []);

const fetchAdmissions = async () => {
  try {
    const res = await api.fitnessEnquiry.getAll();

    console.log("API DATA:", res.data); // IMPORTANT DEBUG

    setAdmissionsData(res.data); // adjust if needed
  } catch (err) {
    console.error("Error:", err);
  }
};


const fetchParticipants = async () => {
  try {
    const res = await api.fitnessMember.getAll();

    console.log("Participants API:", res.data);

    setParticipantsData(res.data); // important
  } catch (err) {
    console.error(err);
  }
};



  const handleExportPDF = async () => {
    setExporting("pdf");
    try { await exportToPDF(currentTitle, currentHeaders, currentRows); }
    catch (e) { console.error(e); }
    finally { setExporting(""); }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try { await exportToExcel(currentTitle, currentHeaders, currentRows); }
    catch (e) { console.error(e); }
    finally { setExporting(""); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ── Header ── */}
      {/* ── Header ── */}
<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
  <h1 className="text-2xl font-bold text-gray-800">Reports</h1>

  {/* Date range filter */}
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm">
      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
        placeholder="From"
      />
    </div>

    <span className="text-gray-400 text-sm font-medium">to</span>

    <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm">
      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <input
  type="date"
  value={toDate}
  min={fromDate}   // 👈 THIS is the key fix
  onChange={(e) => setToDate(e.target.value)}
  className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
  placeholder="To"
/>
    </div>

    <button
      onClick={() => fetchSummary(fromDate, toDate)}
      disabled={!fromDate || !toDate}
      className="bg-[#1a2a5e] hover:bg-[#152147] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-sm"
    >
      Apply
    </button>

    {(fromDate || toDate) && (
      <button
        onClick={() => {
          setFromDate("");
          setToDate("");
          fetchSummary(); // reload all data
        }}
        className="text-sm text-gray-500 hover:text-red-500 border border-gray-300 bg-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
      >
        Clear
      </button>
    )}
  </div>
</div>

      {/* ── Stats grid ── */}
      <div className="bg-gray-100 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Top 4 cards */}
          {/* {STATS.filter((s) => !s.wide).map((stat) => ( */}

          {[
  { label: "Total Enquiries", value: stats.totalEnquiries },
  { label: "Total Members", value: stats.totalAdmissions },
  { label: "Active Participants", value: stats.activeParticipants },
  { label: "Total Revenue", value: stats.totalRevenue, prefix: "₹ " },
].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {/* {stat.prefix}{stat.value} */}
                {stat.prefix || ""}{stat.value?.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        {/* Bottom 2 wide cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {/* {STATS.filter((s) => s.wide).map((stat) => ( */}
          {[
  // { label: "Pending Fees", value: stats.pendingFees, prefix: "₹ " },
  { label: "Today's Attendance", value: "118" }, // keep static for now
].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {stat.prefix}{stat.value}
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
          onClick={() => {
  setActiveTab("admissions");
  fetchAdmissions();
}}
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
          onClick={() => {
  setActiveTab("participants");
  fetchParticipants();
}}
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
              {(currentData || []).map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {isAdmissions ? (
                    <>
                      <td className="px-5 py-3 text-gray-800">{row.fullName}</td>
                      {/* <td className="px-5 py-3 text-gray-600">{row.date}</td> */}
                      <td className="px-5 py-3 text-gray-600">
  {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          row.status === "Admitted"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 text-gray-800">{row.name || row.fullName || "-"}</td>
                      <td className="px-5 py-3 text-gray-600">{row.category ||"-"}</td>
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
              ))}
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