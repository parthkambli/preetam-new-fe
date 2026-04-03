import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/apiClient';

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    searchName: '',
    searchMobile: '',
    feePlan: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.searchName) params.searchName = filters.searchName;
      if (filters.searchMobile) params.searchMobile = filters.searchMobile;
      if (filters.feePlan !== 'all') params.feePlan = filters.feePlan;
      if (filters.status !== 'all') params.status = filters.status;

      const response = await api.students.getAll(params);
      setStudents(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load students list');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('active'))   return 'bg-green-100 text-green-800';
    if (s.includes('inactive')) return 'bg-red-100 text-red-800';
    if (s.includes('pending'))  return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleView = (id) => {
    navigate(`/school/participants/view/${id}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Students / Participants
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Name"
          className="border rounded-lg px-4 py-2.5 flex-1 min-w-[200px]"
          value={filters.searchName}
          onChange={(e) => handleFilterChange('searchName', e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          className="border rounded-lg px-4 py-2.5 flex-1 min-w-[180px]"
          value={filters.searchMobile}
          onChange={(e) => handleFilterChange('searchMobile', e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2.5 min-w-[160px]"
          value={filters.feePlan}
          onChange={(e) => handleFilterChange('feePlan', e.target.value)}
        >
          <option value="all">All Fee Plans</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2.5 min-w-[140px]"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="bg-[#000359] text-white">
              <tr>
                <th className="p-4">Admission ID</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Fee Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-[#000359]">{s.admissionIdStr || '—'}</td>
                    <td className="p-4 font-medium">{s.studentId || '—'}</td>
                    <td className="p-4">{s.fullName || '—'}</td>
                    <td className="p-4">{s.age || '—'}</td>
                    <td className="p-4">{s.gender || '—'}</td>
                    <td className="p-4">{s.mobile || '—'}</td>
                    <td className="p-4 capitalize">{s.feePlan || '—'}</td>
                    <td className="p-4 font-medium">
                      {formatCurrency(s.amount)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(s.status)}`}>
                        {s.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleView(s._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}