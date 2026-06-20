import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { api } from '../../../services/apiClient';

export default function AddSchoolEnquiry() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    age: '',
    gender: 'Male',
    activity: '',
    source: 'Walk-in',
    date: new Date().toISOString().split('T')[0],
    responsibleStaff: '',
  });
  const [selectedResponsibleStaff, setSelectedResponsibleStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activityOptions, setActivityOptions] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch activities for dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.activities.getAll();
        const raw = Array.isArray(res.data?.data) ? res.data.data : [];

        const options = raw
          .filter(Boolean)
          .map((act) => ({ value: act.name, label: act.name }));

        setActivityOptions(options);
      } catch (err) {
        toast.error('Failed to load activities.');
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const loadStaffOptions = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', page: 1, limit: 10 });
      const list = res.data?.data?.staff || [];
      return list.map((s) => ({
        value: s._id,
        label: `${s.fullName} (${s.role})`,
        data: s,
      }));
    } catch { return []; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.schoolEnquiry.create(form);
      toast.success('Enquiry added successfully!');
      navigate('/school/enquiry');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add enquiry. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setForm({ ...form, contact: value });
    }
  };

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const sourceOptions = [
    { label: 'Walk-in', value: 'Walk-in' },
    { label: 'App', value: 'App' },
    { label: 'Call', value: 'Call' },
    { label: 'Website', value: 'Website' },
    { label: 'Reference', value: 'Reference' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add Enquiry</h1>
        <button
          onClick={() => navigate('/school/enquiry')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
        <div className="border border-blue-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Contact</label>
              <input
                type="tel"
                inputMode="numeric"
                value={form.contact}
                onChange={handleContactChange}
                maxLength={10}
                placeholder="10-digit number"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Age</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Gender</label>
              <Select
                options={genderOptions}
                value={genderOptions.find((opt) => opt.value === form.gender) || null}
                onChange={(selected) =>
                  setForm({ ...form, gender: selected?.value || '' })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Interested Activity</label>
              <Select
                options={activityOptions}
                isLoading={activitiesLoading}
                isClearable
                placeholder="Select activity..."
                value={activityOptions.find(o => o.value === form.activity) || null}
                onChange={(selected) =>
                  setForm({ ...form, activity: selected ? selected.value : '' })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Responsible Staff</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadStaffOptions}
                value={selectedResponsibleStaff}
                onChange={(selected) => {
                  setSelectedResponsibleStaff(selected);
                  setForm({ ...form, responsibleStaff: selected?.value || '' });
                }}
                placeholder="Search staff..."
                isClearable
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Source</label>
              <Select
                options={sourceOptions}
                value={{ label: form.source, value: form.source }}
                onChange={(selected) =>
                  setForm({ ...form, source: selected?.value || 'Walk-in' })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Enquiry Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/school/enquiry')}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
}
