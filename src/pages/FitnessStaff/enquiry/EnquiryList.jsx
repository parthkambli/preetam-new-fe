








import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/apiClient';
import Pagination from "../../../components/Pagination";

export default function FitnessEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activityLoading, setActivityLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: '',
    activity: '',
    fromDate: '',
    toDate: ''
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [remark, setRemark] = useState('');
  const [newStatus, setNewStatus] = useState('New');
  const [nextVisit, setNextVisit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      setActivityLoading(true);
      try {
        const res = await api.fitnessActivities.getAll();
        setActivities(res.data?.data || res.data?.activities || res.data || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
        setActivities([]);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // ✅ Only fetch when NON-date filters change
  // useEffect(() => {
  //   fetchEnquiries();
  // }, [filters.status, filters.source, filters.search, filters.activity]);

  useEffect(() => {
  fetchEnquiries();
}, [
  filters.status,
  filters.source,
  filters.search,
  filters.activity,
  page,
  limit
]);

useEffect(() => {
  setPage(1);
}, [
  filters.status,
  filters.source,
  filters.search,
  filters.activity,
  filters.fromDate,
  filters.toDate,
  limit
]);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
  page,
  limit
};

      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.search) params.search = filters.search;
      if (filters.activity) params.interestedActivity = filters.activity;

      // ❌ Removed date params

      const response = await api.fitnessEnquiry.getAll(params);
      setEnquiries(response.data?.data || response.data || []);

      setEnquiries(response.data?.data || []);

setTotalPages(
  response.data?.pagination?.totalPages || 1
);

setTotalCount(
  response.data?.pagination?.totalRecords || 0
);
    } catch (err) {
      setError('Failed to load enquiries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActivityName = (activity) => {
    if (!activity) return '-';
    if (typeof activity === 'object') {
      return activity.name || activity.activityName || '-';
    }
    return activity;
  };

  // ✅ FRONTEND DATE FILTER (only addition)
  const filteredEnquiries = enquiries.filter((enq) => {
    if (!enq.enquiryDate) return true;

    const enquiryDate = new Date(enq.enquiryDate);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    if (from && enquiryDate < from) return false;
    if (to && enquiryDate > to) return false;

    return true;
  });

  const handleAddRemark = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setRemark(enquiry.remark || '');
    setNewStatus(enquiry.status);
    setNextVisit(enquiry.nextVisit ? enquiry.nextVisit.split('T')[0] : '');
  };

  const submitRemark = async () => {
    if (!remark.trim()) {
      alert('Please enter a remark');
      return;
    }

    setSubmitting(true);
    try {
      await api.followups.create({
        enquiryType: 'fitness',
        enquiryId: selectedEnquiry._id,
        personName: selectedEnquiry.fullName,
        mobile: selectedEnquiry.mobile,
        activity: getActivityName(selectedEnquiry.interestedActivity),
        newStatus,
        remark,
        nextVisit: nextVisit || null
      });

      alert('Follow-up added successfully!');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Enquiry</h1>
        <Link
          to="/fitness-staff/enquiry/add"
          className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition"
        >
          Add Enquiry
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Name / Mobile"
          className="border rounded px-4 py-2.5 flex-1 min-w-[220px]"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <select
          className="border rounded px-4 py-2.5 min-w-[180px]"
          value={filters.activity}
          onChange={(e) => handleFilterChange('activity', e.target.value)}
          disabled={activityLoading}
        >
          <option value="">All Activities</option>
          {activities.map((act) => (
            <option key={act._id} value={act._id}>
              {act.name || act.activityName || 'Unnamed'}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-4 py-2.5 min-w-[160px]"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Status</option>
          <option value="New">New</option>
          <option value="Follow Up">Follow-up</option>
          <option value="Converted">Converted</option>
          <option value="Admitted">Admitted</option>
        </select>

        <select
          className="border rounded px-4 py-2.5 min-w-[160px]"
          value={filters.source}
          onChange={(e) => handleFilterChange('source', e.target.value)}
        >
          <option value="">Source</option>
          <option value="Walk-in">Walk-in</option>
          <option value="App">App</option>
          <option value="Call">Call</option>
          <option value="Website">Website</option>
          <option value="Reference">Reference</option>
        </select>

        <input
          type="date"
          className="border rounded px-4 py-2.5"
          value={filters.fromDate}
          onChange={(e) => handleFilterChange('fromDate', e.target.value)}
        />

        <input
          type="date"
          className="border rounded px-4 py-2.5"
          value={filters.toDate}
          onChange={(e) => handleFilterChange('toDate', e.target.value)}
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          Loading enquiries...
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-red-500">
          {error}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No enquiries found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-[#000359] text-white">
                <tr>
                  <th className="p-4 text-left">Enquiry ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Activity</th>
                  <th className="p-4 text-left">Source</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Enquiry Date</th>
                  <th className="p-4 text-left">Follow-up Remark</th>
                  <th className="p-4 text-left">Responsible Staff</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enq) => (
                  <tr key={enq._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{enq.enquiryId || '-'}</td>
                    <td className="p-4 font-medium">{enq.fullName}</td>
                    <td className="p-4">{enq.mobile}</td>
                    <td className="p-4">{getActivityName(enq.interestedActivity)}</td>
                    <td className="p-4">{enq.source}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {enq.enquiryDate ? new Date(enq.enquiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4 text-gray-600">{enq.remark || '-'}</td>
                    <td className="p-4">
  <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 font-medium">
    {enq.responsibleStaff || '-'}
  </span>
</td>
                    <td className="p-4">
                      {enq.status !== 'Admitted' && (
                        <button
                          onClick={() => handleAddRemark(enq)}
                          className="text-[#000359] hover:underline font-medium"
                        >
                          Add Remark
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add Follow-up Remark</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Person:{' '}
                  <span className="font-medium text-gray-800">
                    {selectedEnquiry.fullName}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Mobile:{' '}
                  <span className="font-medium text-gray-800">
                    {selectedEnquiry.mobile}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg"
                >
                  <option value="New">New</option>
                  <option value="Follow Up">Follow-up</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enter Follow UP / Remark:
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg"
                  placeholder="Write remark here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Next Visit Date (Optional):
                </label>
                <input
                  type="date"
                  value={nextVisit}
                  onChange={(e) => setNextVisit(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={submitRemark}
                className="px-8 py-2.5 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
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
