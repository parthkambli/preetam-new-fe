import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { api } from '../../../services/apiClient';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

function formatDate(d) {
  if (!d) return '-';
  const date = typeof d === 'string' ? parseISO(d) : new Date(d);
  return isNaN(date.getTime()) ? '-' : format(date, 'dd MMM yyyy');
}

export default function BookService() {
  // ── Reference data ─────────────────────────────────────────────
  const [services, setServices] = useState([]);

  // ── Form state ──────────────────────────────────────────────────
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [paidAmount, setPaidAmount] = useState('0');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // ── Seat availability ──────────────────────────────────────────
  const [availableSeats, setAvailableSeats] = useState(null);
  const [seatsLoading, setSeatsLoading] = useState(false);

  // ── Booking table state (server-side pagination) ──────────────
  const [bookings, setBookings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loadingTable, setLoadingTable] = useState(false);
  const [filterService, setFilterService] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // ── Date modal state ──────────────────────────────────────────
  const [datesModal, setDatesModal] = useState(null);

  // ── Computed ────────────────────────────────────────────────────
  const selectedServiceObj = services.find(s => s._id === selectedService?.value);
  const totalFee = selectedServiceObj && Number(duration) > 0
    ? selectedServiceObj.oneDayFee * Number(duration)
    : 0;

  // ── Compute end date for availability check ────────────────────
  const endDateStr = useMemo(() => {
    if (!startDate || !duration || Number(duration) <= 0) return null;
    const s = new Date(startDate);
    s.setDate(s.getDate() + Number(duration));
    return s.toISOString().split('T')[0];
  }, [startDate, duration]);

  // ── Fetch services ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await api.schoolStaffPanel.getServices();
        setServices(res.data?.data || []);
      } catch {
        toast.error('Failed to load services');
      }
    })();
  }, []);

  const serviceOptions = useMemo(() => services.map(s => ({
    value: s._id,
    label: `${s.serviceName} (₹${s.oneDayFee}/day)`,
    data: s,
  })), [services]);

  // ── Fetch bookings from server ──────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoadingTable(true);
    try {
      const params = { page, limit };
      if (filterService) params.serviceId = filterService;
      if (filterDateFrom) params.dateFrom = filterDateFrom;
      if (filterDateTo) params.dateTo = filterDateTo;

      const res = await api.schoolStaffPanel.getServiceBookings(params);
      const data = res.data;
      setBookings(data.bookings || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoadingTable(false);
    }
  }, [page, limit, filterService, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ── Fetch available seats ──────────────────────────────────────
  useEffect(() => {
    if (!selectedService?.value || !startDate || !endDateStr) {
      setAvailableSeats(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setSeatsLoading(true);
      try {
        const res = await api.schoolStaffPanel.getAvailableSeats(selectedService.value, {
          startDate,
          endDate: endDateStr,
        });
        if (!cancelled) setAvailableSeats(res.data);
      } catch {
        if (!cancelled) setAvailableSeats(null);
      } finally {
        if (!cancelled) setSeatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedService?.value, startDate, endDateStr]);

  // ── Load students (async) ───────────────────────────────────────
  const loadStudents = async (inputValue) => {
    try {
      const res = await api.schoolStaffPanel.getStudents({ searchName: inputValue || '' });
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      return list.map(s => ({
        value: s.admissionId?._id || s.admissionId,
        label: `${s.fullName} (${s.studentId || 'N/A'})`,
        data: s,
      }));
    } catch {
      return [];
    }
  };

  // ── Load staff (async) ──────────────────────────────────────────
  const loadStaff = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', page: 1, limit: 5 });
      const staffList = res.data?.data?.staff || res.data?.staff || res.data || [];
      return (Array.isArray(staffList) ? staffList : []).map(s => ({
        value: s._id,
        label: `${s.fullName || s.name} (${s.role || 'Staff'})`,
        data: s,
      }));
    } catch {
      return [];
    }
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedStudent) { toast.error('Please select a student'); return; }
    if (!selectedService) { toast.error('Please select a service'); return; }
    if (!startDate) { toast.error('Please select a start date'); return; }
    if (!duration || Number(duration) <= 0) { toast.error('Please enter a valid duration'); return; }

    const numPaid = Math.max(0, Number(paidAmount) || 0);

    const payload = {
      admissionId: selectedStudent.value,
      serviceId: selectedService.value,
      startDate,
      duration: Number(duration),
      paidAmount: numPaid,
      paymentMode: numPaid > 0 ? paymentMode : undefined,
      paymentDate: numPaid > 0 ? paymentDate : undefined,
      responsibleStaff: selectedStaff?.value || undefined,
    };

    try {
      await api.schoolStaffPanel.createServiceBooking(payload);
      toast.success('Service booked successfully');
      fetchBookings();

      setSelectedStudent(null);
      setSelectedService(null);
      setStartDate('');
      setDuration('');
      setPaidAmount('0');
      setPaymentMode('Cash');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setSelectedStaff(null);
      setAvailableSeats(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to book service');
    }
  };

  // ── Cancel ──────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    try {
      await api.schoolStaffPanel.cancelServiceBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filterServiceOptions = useMemo(() => services.map(s => ({ value: s._id, label: s.serviceName })), [services]);

  return (
    <div className="space-y-6">
      {/* ───── BOOK SERVICE FORM ───── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Book Service</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Student (async) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Student *</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadStudents}
              value={selectedStudent}
              onChange={(v) => { setSelectedStudent(v); }}
              placeholder="Search student..."
              isClearable
              classNamePrefix="react-select"
            />
          </div>

          {/* Service (sync) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Service *</label>
            <Select
              options={serviceOptions}
              value={selectedService}
              onChange={(v) => { setSelectedService(v); setPaidAmount('0'); setAvailableSeats(null); }}
              placeholder="Select service"
              isClearable
              classNamePrefix="react-select"
            />
            {selectedServiceObj && startDate && endDateStr && (
              <p className="text-xs mt-1">
                {seatsLoading ? (
                  <span className="text-gray-400">Checking availability...</span>
                ) : availableSeats ? (
                  availableSeats.availableSeats > 0 ? (
                    <span className="text-green-600">{availableSeats.availableSeats} seat{availableSeats.availableSeats !== 1 ? 's' : ''} available ({availableSeats.bookedCount} booked)</span>
                  ) : (
                    <span className="text-red-600">Fully booked for these dates</span>
                  )
                ) : (
                  <span className="text-gray-400">Select dates to check availability</span>
                )}
              </p>
            )}
          </div>

          {/* Start date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Start Date *</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]" />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Duration (days) *</label>
            <input type="number" min="1" placeholder="e.g. 30" value={duration}
              onChange={e => { setDuration(e.target.value); setPaidAmount('0'); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]" />
          </div>

          {/* Total fee (read-only) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Total Fee (₹)</label>
            <div className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700">
              {totalFee > 0 ? `₹${totalFee.toLocaleString('en-IN')}` : '—'}
            </div>
          </div>

          {/* Paid amount */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Paying Now (₹)</label>
            <input type="number" min="0" value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]" />
            <p className="text-xs text-gray-400 mt-0.5">Set 0 to bill later</p>
          </div>

          {/* Payment mode (shown only if paidAmount > 0) */}
          {Number(paidAmount) > 0 && (
            <>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Payment Mode</label>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Payment Date</label>
                <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]" />
              </div>
            </>
          )}

          {/* Responsible staff (async) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Responsible Staff</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadStaff}
              value={selectedStaff}
              onChange={setSelectedStaff}
              placeholder="Search staff..."
              isClearable
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <button onClick={handleBook}
          className="w-full sm:w-auto mt-6 bg-[#000359] hover:bg-[#000280] active:scale-[0.985] transition-all text-white font-semibold px-8 py-3.5 rounded-xl">
          Confirm Booking
        </button>
      </div>

      {/* ───── BOOKING TABLE ───── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Booking History</h2>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="w-72">
            <Select
              options={filterServiceOptions}
              value={filterServiceOptions.find(a => a.value === filterService) || null}
              onChange={(v) => { setFilterService(v?.value || ''); setPage(1); }}
              placeholder="Filter by service"
              isClearable
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={filterDateFrom}
              onChange={e => { setFilterDateFrom(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            <span className="text-sm text-gray-500">to</span>
            <input type="date" value={filterDateTo}
              onChange={e => { setFilterDateTo(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
          </div>
          {(filterService || filterDateFrom || filterDateTo) && (
            <button onClick={() => { setFilterService(''); setFilterDateFrom(''); setFilterDateTo(''); setPage(1); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Clear Filters
            </button>
          )}
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#000359' }}>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Student</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Service</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Date Range</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Duration</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Total Fee</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Paid</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Staff</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Dates</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingTable ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400 text-sm">Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400 text-sm">No bookings found</td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b._id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{b.studentName}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.serviceName || '-'}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.duration} day{b.duration !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">₹{b.totalFee?.toLocaleString?.('en-IN') || b.totalFee}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {b.paidAmount > 0 ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
                          ₹{b.paidAmount.toLocaleString?.('en-IN') || b.paidAmount}
                        </span>
                      ) : b.isFromAdmission ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700">Covered in Admission</span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-700">Bill Later</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.staffName || '-'}</td>
                    <td className="px-5 py-4">
                      {b.dates?.length > 0 ? (
                        <button onClick={() => setDatesModal(b)}
                          className="px-3 py-1 text-xs font-medium bg-[#000359] text-white rounded-lg hover:bg-[#000280]">
                          View ({b.dates.length})
                        </button>
                      ) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      {b.status === 'Active' && (
                        <button onClick={() => handleCancel(b._id)}
                          className="px-4 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          Cancel
                        </button>
                      )}
                      {b.status === 'Cancelled' && (
                        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-200 text-gray-600">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (server-driven) */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm">
              {ITEMS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <span>{totalCount === 0 ? '0' : `${(page - 1) * limit + 1}–${Math.min(page * limit, totalCount)}`} of {totalCount}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40">‹</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>

      {/* ───── DATES MODAL ───── */}
      {datesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDatesModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Dates — {datesModal.serviceName} ({datesModal.studentName})
              </h3>
              <button onClick={() => setDatesModal(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {(datesModal.dates || []).map((d, i) => (
                  <div key={i}
                    className="px-3 py-2 text-xs text-center bg-gray-50 rounded-lg border border-gray-100">
                    {formatDate(d)}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 text-right">
              <button onClick={() => setDatesModal(null)}
                className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
