

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Select from 'react-select';
import { api } from '../../../services/apiClient';

export default function AddSchoolEnquiry() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    age: '',
    gender: 'Male',
    activity: '',
    source: 'Walk-in',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [activityOptions, setActivityOptions] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch activities for dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.activities.getAll();
        // Normalize: API may return array directly or nested under a key
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.schoolEnquiry.create(form);
      toast.success('Enquiry added successfully!');
      navigate('/school/enquiry');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add enquiry. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Allow only numeric input for contact
  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // strip non-digits
    if (value.length <= 10) {
      setForm({ ...form, contact: value });
    }
  };

  const fieldClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white";
  const rowClass   = "flex items-center gap-6 py-3";
  const labelClass = "text-sm font-medium text-gray-800 w-44 shrink-0 text-left";

  // react-select custom styles to match existing field style
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? '#000359' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(0,3,89,0.3)' : 'none',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      width: '224px',
      '&:hover': { borderColor: '#000359' }
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      backgroundColor: state.isSelected
        ? '#000359'
        : state.isFocused
        ? '#e0e7ff'
        : 'white',
      color: state.isSelected ? 'white' : '#1f2937'
    }),
    menu: (base) => ({ ...base, zIndex: 50 }),
    placeholder: (base) => ({ ...base, color: '#9ca3af' })
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-8">Add Enquiry</h1>

      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Full Name */}
        <div className={rowClass}>
          <label className={labelClass}>Full Name:</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={`${fieldClass} w-72`}
            required
          />
        </div>

        {/* Contact — digits only, max 10 */}
        <div className={rowClass}>
          <label className={labelClass}>Contact:</label>
          <input
            type="tel"
            inputMode="numeric"
            value={form.contact}
            onChange={handleContactChange}
            maxLength={10}
            placeholder="10-digit number"
            className={`${fieldClass} w-72`}
            required
          />
        </div>

        {/* Age */}
        <div className={rowClass}>
          <label className={labelClass}>Age:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
            className={`${fieldClass} w-28`}
          />
        </div>

        {/* Gender */}
        <div className={rowClass}>
          <label className={labelClass}>Gender:</label>
          <select
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
            className={`${fieldClass} w-36`}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Interested Activity — react-select with API data */}
        <div className={rowClass}>
          <label className={labelClass}>Interested Activity:</label>
          <Select
            options={activityOptions}
            isLoading={activitiesLoading}
            isClearable
            placeholder="Select activity..."
            styles={selectStyles}
            value={activityOptions.find(o => o.value === form.activity) || null}
            onChange={(selected) =>
              setForm({ ...form, activity: selected ? selected.value : '' })
            }
          />
        </div>

        {/* Source */}
        <div className={rowClass}>
          <label className={labelClass}>Source:</label>
          <select
            value={form.source}
            onChange={e => setForm({ ...form, source: e.target.value })}
            className={`${fieldClass} w-44`}
          >
            <option>Walk-in</option>
            <option>App</option>
            <option>Call</option>
            <option>Website</option>
            <option>Reference</option>
          </select>
        </div>

        {/* Enquiry Date */}
        <div className={rowClass}>
          <label className={labelClass}>Enquiry Date:</label>
          <input
            type="date"
            value={form.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className={`${fieldClass} w-44`}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#000359] text-white px-16 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00047a] transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}