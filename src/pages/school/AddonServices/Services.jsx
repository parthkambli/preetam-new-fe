import { useState, useEffect, useRef } from 'react';
import { format, addDays, isToday, isSameDay } from "date-fns";
import { X, Printer } from "lucide-react";
import { toast } from "sonner";

import { api } from '../../../services/apiClient';

const toDateStr = (d) => format(d, 'yyyy-MM-dd');
import ServiceManager from './ServiceManager';
import AddServices from './AddServices';
import BookService from './BookService';

export default function Services() {
  const [view, setView] = useState('dashboard');
  const [editService, setEditService] = useState(null);

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [serviceStats, setServiceStats] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0, totalBookings: 0, availableServices: 0, fullServices: 0,
  });

  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [modalBookings, setModalBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showServiceStudentModal, setShowServiceStudentModal] = useState(false);
  const [svcStudentServiceId, setSvcStudentServiceId] = useState("");
  const [svcStudentFromDate, setSvcStudentFromDate] = useState("");
  const [svcStudentToDate, setSvcStudentToDate] = useState("");
  const [svcStudentList, setSvcStudentList] = useState([]);
  const [svcStudentLoading, setSvcStudentLoading] = useState(false);

  // ── Fetch services ────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.schoolServices.getAll();
        console.log('Services API response:', res.data);
        setServices(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    console.log('services state:', services);
    console.log('services names:', services.map(s => s.serviceName));
  }, [services]);

  // ── Fetch all active bookings when services load ─────────────────
  useEffect(() => {
    if (!services.length) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.serviceBookings.getAll({ limit: 9999 });
        setBookings(res.data?.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [services.length]);

  // ── Compute per-service stats for selected date ──────────────────
  useEffect(() => {
    if (!services.length) { setServiceStats([]); return; }

    const selStr = toDateStr(selectedDate);

    const activeOnDate = bookings.filter(b => {
      if (b.status !== 'Active') return false;
      const startStr = toDateStr(new Date(b.startDate));
      const endStr = toDateStr(new Date(b.endDate));
      return startStr <= selStr && endStr >= selStr;
    });

    const perService = services.map(svc => {
      const sid = String(svc._id);
      const count = activeOnDate.filter(b => String(b.serviceId) === sid).length;
      return {
        serviceId: svc._id,
        serviceName: svc.serviceName,
        capacity: svc.capacity,
        activeCount: count,
        isFull: count >= svc.capacity,
      };
    });

    setServiceStats(perService);
    setStats({
      totalServices: services.length,
      totalBookings: activeOnDate.length,
      availableServices: perService.filter(s => !s.isFull).length,
      fullServices: perService.filter(s => s.isFull).length,
    });
  }, [bookings, selectedDate, services]);

  const handleServiceClick = (svc) => {
    const selStr = toDateStr(selectedDate);
    const active = bookings.filter(b => {
      if (b.status !== 'Active') return false;
      if (String(b.serviceId) !== String(svc.serviceId)) return false;
      const startStr = toDateStr(new Date(b.startDate));
      const endStr = toDateStr(new Date(b.endDate));
      return startStr <= selStr && endStr >= selStr;
    });
    setSelectedServiceName(svc.serviceName);
    setModalBookings(active);
    setShowModal(true);
  };

  const handleShowServiceStudents = async () => {
    if (!svcStudentServiceId || !svcStudentFromDate || !svcStudentToDate) {
      toast.error("Please select Service, From date, and To date");
      return;
    }
    setSvcStudentLoading(true);
    try {
      const res = await api.serviceBookings.getStudents({
        serviceId: svcStudentServiceId,
        fromDate: svcStudentFromDate,
        toDate: svcStudentToDate,
      });
      setSvcStudentList(res.data?.students || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load students");
      setSvcStudentList([]);
    } finally {
      setSvcStudentLoading(false);
    }
  };

  const handlePrintSvcStudents = () => {
    window.print();
  };

  const handleOpenServiceStudentModal = () => {
    setSvcStudentServiceId("");
    setSvcStudentFromDate("");
    setSvcStudentToDate("");
    setSvcStudentList([]);
    setShowServiceStudentModal(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {view === 'dashboard' && 'Services Dashboard'}
          {view === 'add'       && (editService ? 'Edit Service' : 'Add Service')}
          {view === 'manage'    && 'Manage Services'}
          {view === 'book'      && 'Book Service'}
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setView('book')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'book' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            Book Service
          </button>
          <button
            onClick={() => setView('manage')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'manage' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            Manage
          </button>
          <button
            onClick={() => { setEditService(null); setView('add'); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'add' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            + Add Service
          </button>
          <button
            onClick={handleOpenServiceStudentModal}
            className="bg-[#000359] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            View by Service
          </button>
        </div>
      </div>

      {/* ================= DASHBOARD ================= */}
      {view === 'dashboard' && (
        <>
          <DateStrip selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalServices}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Bookings on Date</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalBookings}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-3xl font-semibold text-emerald-600 mt-1">{stats.availableServices}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Full</p>
              <p className="text-3xl font-semibold text-red-600 mt-1">{stats.fullServices}</p>
            </div>
          </div>

          <ServiceSchedule
            serviceStats={serviceStats}
            selectedDate={selectedDate}
            loading={loading}
            onServiceClick={handleServiceClick}
          />
        </>
      )}

      {/* ================= MANAGE ================= */}
      {view === 'manage' && (
        <ServiceManager onEdit={(svc) => { setEditService(svc); setView('add'); }} />
      )}

      {/* ================= ADD / EDIT ================= */}
      {view === 'add' && (
        <AddServices
          editData={editService}
          onCancel={() => { setEditService(null); setView('manage'); }}
          onSaved={() => { setEditService(null); setView('dashboard'); }}
        />
      )}

      {/* ================= BOOK ================= */}
      {view === 'book' && <BookService />}

      {/* ================= SERVICE STUDENT MODAL ================= */}
      {showServiceStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowServiceStudentModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="no-print flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Students by Service & Date Range</h2>
              <button onClick={() => setShowServiceStudentModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className="no-print px-6 py-4 border-b shrink-0">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={svcStudentServiceId}
                    onChange={(e) => setSvcStudentServiceId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>{s.serviceName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={svcStudentFromDate}
                    onChange={(e) => setSvcStudentFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={svcStudentToDate}
                    onChange={(e) => setSvcStudentToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <button
                  onClick={handleShowServiceStudents}
                  disabled={svcStudentLoading}
                  className="bg-[#000359] hover:opacity-90 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  {svcStudentLoading ? "Loading..." : "Show"}
                </button>
              </div>
            </div>

            {/* Print heading */}
            <div className="print-only hidden p-6 pb-0">
              <h2 className="text-xl font-bold">
                Students — {services.find(s => s._id === svcStudentServiceId)?.serviceName || ''} ({svcStudentFromDate} to {svcStudentToDate})
              </h2>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {svcStudentLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : svcStudentList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No students found for this service in the selected date range.</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#000359] text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Admission ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Start Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {svcStudentList.map((s, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/30">
                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.admissionId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.studentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.startDate ? format(new Date(s.startDate), 'dd MMM yyyy') : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.endDate ? format(new Date(s.endDate), 'dd MMM yyyy') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="no-print flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
              <button
                onClick={handlePrintSvcStudents}
                disabled={svcStudentList.length === 0}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                <Printer size={16} /> Print
              </button>
              <button
                onClick={() => setShowServiceStudentModal(false)}
                className="bg-[#000359] hover:opacity-90 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{selectedServiceName}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bookings on {format(selectedDate, 'dd MMM yyyy')}
            </p>

            {modalBookings.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modalBookings.map((b) => (
                  <div key={b._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-gray-700">{b.studentName}</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(b.startDate), 'dd MMM')} - {format(new Date(b.endDate), 'dd MMM')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-3 bg-[#000359] text-white rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body * { visibility: hidden; }
          .fixed.inset-0.z-50, .fixed.inset-0.z-50 * { visibility: visible; }
          .fixed.inset-0.z-50 { position: absolute !important; left: 0; top: 0; background: white !important; }
          .fixed.inset-0.z-50 > div { box-shadow: none !important; max-width: 100% !important; max-height: none !important; margin: 0 !important; border-radius: 0 !important; }
          @page { size: landscape; margin: 15mm; }
        }
      `}</style>
    </div>
  );
}

// ====================== DATE STRIP ======================
const DateStrip = ({ selectedDate, setSelectedDate }) => {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const [anchorOffset, setAnchorOffset] = useState(0);

  const today = new Date();
  const days = Array.from({ length: 45 }, (_, i) => ({
    date: addDays(today, i - 14 + anchorOffset),
    isSelected: isSameDay(addDays(today, i - 14 + anchorOffset), selectedDate),
    isToday: isToday(addDays(today, i - 14 + anchorOffset)),
  }));

  const centerDate = days[22].date;

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedDate, anchorOffset]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm font-medium text-gray-700">{format(centerDate, 'MMMM yyyy')}</span>
        <div className="flex gap-2">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#000359]"
          />
          <button onClick={() => setAnchorOffset(o => o - 7)} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center">‹</button>
          <button onClick={() => { setSelectedDate(new Date()); setAnchorOffset(0); }} className="px-3 h-7 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">Today</button>
          <button onClick={() => setAnchorOffset(o => o + 7)} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center">›</button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto flex gap-1.5 px-3 pb-3 pt-1" style={{ scrollbarWidth: 'none' }}>
        {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
          <button
            key={i}
            ref={isSelected ? selectedRef : null}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center w-[54px] flex-shrink-0 py-2.5 rounded-xl border transition-all
              ${isSelected ? 'bg-blue-600 border-transparent' : todayFlag ? 'border-gray-300' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
          >
            <span className={`text-[11px] font-medium uppercase tracking-wide ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
              {format(date, 'EEE')}
            </span>
            <span className={`text-xl font-medium leading-snug ${isSelected ? 'text-white' : todayFlag ? 'text-blue-600' : 'text-gray-800'}`}>
              {format(date, 'd')}
            </span>
            <div className={`w-1 h-1 rounded-full mt-1 ${todayFlag && !isSelected ? 'bg-blue-500' : 'invisible'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

// ====================== SERVICE SCHEDULE ======================
const ServiceSchedule = ({ serviceStats, selectedDate, loading, onServiceClick }) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center text-gray-400">
        Loading bookings...
      </div>
    );
  }

  if (!serviceStats.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center text-gray-400">
        No services found
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Service Occupancy for {format(selectedDate, 'EEEE, dd MMMM yyyy')}
      </h2>

      <div className="space-y-2">
        {serviceStats.map((svc) => {
          const percentage = svc.capacity ? Math.min((svc.activeCount / svc.capacity) * 100, 100) : 0;
          return (
            <div
              key={svc.serviceId}
              onClick={() => onServiceClick(svc)}
              className="flex items-center justify-between px-5 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-gray-800">{svc.serviceName}</span>
                  <span className={`text-sm font-semibold px-3 py-0.5 rounded-xl ${
                    svc.isFull
                      ? 'bg-red-100 text-red-700'
                      : svc.activeCount === 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {svc.activeCount}/{svc.capacity}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${
                      svc.isFull ? 'bg-red-500' : svc.activeCount === 0 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
