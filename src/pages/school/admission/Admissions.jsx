import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/apiClient';

export default function SchoolAdmission() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    admissionId: '',
    name: '',
    mobile: '',
    feePlan: '',
    status: ''
  });

  useEffect(() => {
    fetchAdmissions();
  }, [filters]);

  const fetchAdmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.admissionId) params.admissionId = filters.admissionId;
      if (filters.name) params.name = filters.name;
      if (filters.mobile) params.mobile = filters.mobile;
      if (filters.feePlan) params.feePlan = filters.feePlan;
      if (filters.status) params.status = filters.status;
      
      const response = await api.schoolAdmission.getAll(params);
      setAdmissions(response.data);
    } catch (err) {
      setError('Failed to load admissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admission</h1>
        <Link
          to="/school/admission/add"
          className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition"
        >
          Add Admission
        </Link>
      </div>

      {/* Filters */}
      <div className=" bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Admission ID"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.admissionId}
          onChange={(e) => handleFilterChange('admissionId', e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.mobile}
          onChange={(e) => handleFilterChange('mobile', e.target.value)}
        />
        <select 
          className="border rounded px-4 py-2"
          value={filters.feePlan}
          onChange={(e) => handleFilterChange('feePlan', e.target.value)}
        >
          <option value="">Fee Plan</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Annual</option>
        
        </select>
        <select 
          className="border rounded px-4 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-red-500">{error}</div>
      ) : admissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No admissions found</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-[#000359] text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Admission ID</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Age</th>
                  <th className="p-4 text-left font-semibold">Mobile</th>
                  <th className="p-4 text-left font-semibold">Fee Plan</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm) => (
                  <tr key={adm._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{adm.admissionId}</td>
                    <td className="p-4 font-medium">{adm.fullName}</td>
                    <td className="p-4">{adm.age}</td>
                    <td className="p-4">{adm.mobile}</td>
                    <td className="p-4">{adm.feePlan}</td>
                    <td className="p-4">₹{adm.amount?.toLocaleString('en-IN') || '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        adm.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <Link 
                        to={`/school/admission/view/${adm._id}`} 
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/school/admission/edit/${adm._id}`} 
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
