import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/apiClient';
import Select from 'react-select';

export default function EditAdmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [healthFiles, setHealthFiles] = useState([]);

  const [periods, setPeriods] = useState([]);
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(false);
  const [caregiverError, setCaregiverError] = useState(null);
  const [rawTimetable, setRawTimetable] = useState(null);
  const [rawServices, setRawServices] = useState(null);

const [timetableRows, setTimetableRows] = useState([
  { period: null, monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null }
]);

const [serviceRows, setServiceRows] = useState([
  { service: null, startDate: "", endDate: "", days: "" },
]);

  useEffect(() => {
    fetchAdmission();
    fetchPeriods();
    fetchActivities();
    fetchServices();
    fetchStaff();
  }, [id]);

  // Sync timetable rows after both admission + reference data loaded
  useEffect(() => {
    if (!rawTimetable || !rawTimetable.length || !periods.length || !activities.length) return;
    setTimetableRows(rawTimetable.map(row => ({
      period: periods.find(p => p.value === (row.periodId || row.period)) || null,
      monday: activities.find(a => a.value === (row.mondayActivityId || row.monday)) || null,
      tuesday: activities.find(a => a.value === (row.tuesdayActivityId || row.tuesday)) || null,
      wednesday: activities.find(a => a.value === (row.wednesdayActivityId || row.wednesday)) || null,
      thursday: activities.find(a => a.value === (row.thursdayActivityId || row.thursday)) || null,
      friday: activities.find(a => a.value === (row.fridayActivityId || row.friday)) || null,
      saturday: activities.find(a => a.value === (row.saturdayActivityId || row.saturday)) || null,
    })));
  }, [rawTimetable, periods, activities]);

  // Sync service rows after both admission + reference data loaded
  useEffect(() => {
    if (!rawServices || !rawServices.length || !services.length) return;
    setServiceRows(rawServices.map(s => ({
      service: services.find(svc => svc.value === (s.serviceId || s.service)) || null,
      startDate: s.startDate ? s.startDate.slice(0, 10) : '',
      endDate: s.endDate ? s.endDate.slice(0, 10) : '',
      days: s.days?.toString() || '',
    })));
  }, [rawServices, services]);

  const fetchPeriods = async () => {
    try {
      const res = await api.periods.getAll();
      setPeriods(
        (res.data.data || []).map((p) => ({
          value: p._id,
          label: `${p.name} (${p.startTime} - ${p.endTime})`,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch periods', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.activities.getAll();
      setActivities(
        (res.data.data || []).map((a) => ({
          value: a._id,
          label: a.name,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch activities', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.schoolServices.getAll();
      setServices(
        (res.data.data || [])
          .filter((s) => s.isActive)
          .map((s) => ({
            value: s._id,
            label: s.serviceName,
            oneDayFee: s.oneDayFee,
          }))
      );
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingCaregivers(true);
      setCaregiverError(null);
      const res = await api.fitnessStaff.getAll();
      const raw = res.data?.data?.staff || [];
      setStaffList(raw);
      const norm = (s) => s?.toLowerCase().replace(/[\s_-]/g, '');
      setCaregivers(
        raw.filter((s) => {
          const role = typeof s.role === 'string' ? s.role : s.role?.roleName;
          return norm(role) === 'caregiver' && (s.status?.toLowerCase() === 'active' || s.isActive === true);
        })
      );
    } catch (err) {
      setCaregiverError('Failed to load caregivers');
      console.error('Failed to fetch staff', err);
    } finally {
      setLoadingCaregivers(false);
    }
  };

  const fetchAdmission = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await api.schoolAdmission.getById(id);
      const data = response.data;

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
      };

      console.log('API response data:', data);
      console.log('timetable:', data?.timetable);
      console.log('services:', data?.services);

      setFormData({
        ...data,
        responsibleStaff: data.responsibleStaffId || '',
        dob: formatDate(data.dob),
        declarationDate: formatDate(data.declarationDate),
        registrationDate: formatDate(data.registrationDate),
        paymentDate: formatDate(data.paymentDate),
        nextDueDate: formatDate(data.nextDueDate)
      });
      setRawTimetable(data.timetable || []);
      setRawServices(data.services || []);
    } catch (err) {
      setError('Failed to load admission details');
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field, index) => {
    const newArr = [...formData[field]];
    newArr[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArr }));
  };

  const selectedPeriods = timetableRows.map((r) => r.period?.value).filter(Boolean);

  const addRow = () => setTimetableRows((prev) => [...prev, { period: null, monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null }]);

  const removeRow = (i) => setTimetableRows((prev) => prev.filter((_, idx) => idx !== i));

  const updateRow = (index, field, value) => {
    const updated = [...timetableRows];
    updated[index][field] = value;
    setTimetableRows(updated);
  };

  const addServiceRow = () => setServiceRows((prev) => [...prev, { service: null, startDate: '', endDate: '', days: '' }]);

  const removeServiceRow = (i) => setServiceRows((prev) => prev.filter((_, idx) => idx !== i));

  const updateServiceRow = (i, field, value) => {
    const updated = [...serviceRows];
    if (field === 'service') {
      updated[i] = { ...updated[i], service: value };
    } else {
      updated[i] = { ...updated[i], [field]: value ?? '' };
    }
    setServiceRows(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

formDataToSend.append('timetable', JSON.stringify(timetableRows.map(row => ({
  periodId: row.period?.value || null,
  mondayActivityId: row.monday?.value || null,
  tuesdayActivityId: row.tuesday?.value || null,
  wednesdayActivityId: row.wednesday?.value || null,
  thursdayActivityId: row.thursday?.value || null,
  fridayActivityId: row.friday?.value || null,
  saturdayActivityId: row.saturday?.value || null,
}))));
formDataToSend.append('services', JSON.stringify(serviceRows.filter(s => s.service).map(row => {
  const days = Number(row.days) || 0;
  const perDayFee = row.service?.oneDayFee || 0;
  let endDate = null;
  if (row.startDate && days > 0) {
    const ed = new Date(row.startDate);
    ed.setDate(ed.getDate() + days);
    endDate = ed.toISOString().slice(0, 10);
  }
  if (row.endDate) endDate = row.endDate;
  return {
    serviceId: row.service?.value,
    startDate: row.startDate || null,
    endDate,
    days,
    perDayFee,
    totalFee: perDayFee * days,
  };
})));

// Append all normal fields
Object.keys(formData).forEach(key => {
  const value = formData[key];

  if (key === 'enquiryId' && !value) return;
  if (key === 'photo' || key === 'medicalReports') return;
  if (key === 'timetable' || key === 'services') return;

if (Array.isArray(value)) {
  const cleaned = value.filter(v => v && v.trim() !== '');
  formDataToSend.append(key, JSON.stringify(cleaned));
} else {
  if (value !== null && value !== '') {
    formDataToSend.append(key, value);
  }
}
});

// Convert dates
if (formData.dob) formDataToSend.set('dob', new Date(formData.dob).toISOString());
if (formData.registrationDate) formDataToSend.set('registrationDate', new Date(formData.registrationDate).toISOString());
if (formData.paymentDate) formDataToSend.set('paymentDate', new Date(formData.paymentDate).toISOString());
if (formData.nextDueDate) formDataToSend.set('nextDueDate', new Date(formData.nextDueDate).toISOString());

// Append photo if selected
if (photoFile) {
  formDataToSend.append('photo', photoFile);
}

// Append health files
if (healthFiles.length > 0) {
  healthFiles.forEach(file => {
    formDataToSend.append('healthRecord', file);
  });
}

await api.schoolAdmission.update(id, formDataToSend);
      alert('Changes saved successfully!');
      navigate('/school/admission');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-gray-500 py-12">Loading...</div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-red-500 py-12">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Admission – {formData?.admissionId}
        </h1>
        <button
          onClick={() => navigate('/school/admission')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          disabled={loading}
        >
          Cancel & Back
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">

        {/* Section 1: Personal & Health */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Personal & Health Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                name="fullName"
                value={formData?.fullName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
              <input
                type="number"
                name="age"
                value={formData?.age || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData?.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData?.dob || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aadhaar Number</label>
              <input
                name="aadhaar"
                value={formData?.aadhaar || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData?.mobile || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
              <textarea
                name="fullAddress"
                value={formData?.fullAddress || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Physical Disability</label>
              <select
                name="physicalDisability"
                value={formData?.physicalDisability || 'No'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Illness</label>
              <input
                name="mainIllness"
                value={formData?.mainIllness || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
              <input
                name="bloodGroup"
                value={formData?.bloodGroup || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Name</label>
              <input name="doctorName" value={formData?.doctorName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Village</label>
              <input name="doctorVillage" value={formData?.doctorVillage || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Mobile</label>
              <input name="doctorMobile" value={formData?.doctorMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
          </div>
        </section>

        {/* Section 2: Education, Routine, Behaviour */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Education, Daily Routine & Interests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
              <input name="education" value={formData?.education || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education Place</label>
              <input name="educationPlace" value={formData?.educationPlace || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Service</label>
              <input name="yearsOfService" value={formData?.yearsOfService || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation Type</label>
              <select name="occupationType" value={formData?.occupationType || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Government</option>
                <option>Private</option>
                <option>Retired</option>
                <option>Self Employed</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-semibold">Daily Routine Times</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div>
                  <label className="block text-xs text-gray-600">Wake-up</label>
                  <input type="time" name="wakeUpTime" value={formData?.wakeUpTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Breakfast</label>
                  <input type="time" name="breakfastTime" value={formData?.breakfastTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Lunch</label>
                  <input type="time" name="lunchTime" value={formData?.lunchTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Dinner</label>
                  <input type="time" name="dinnerTime" value={formData?.dinnerTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Behaviour / Nature</label>
              <div className="flex flex-wrap gap-6">
                {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="behaviour"
                      value={opt}
                      checked={formData?.behaviour === opt}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#000359]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hobbies</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    value={formData?.hobbies?.[i] || ''}
                    onChange={(e) => handleArrayChange(e, 'hobbies', i)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                    placeholder={`Hobby ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Games</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    value={formData?.games?.[i] || ''}
                    onChange={(e) => handleArrayChange(e, 'games', i)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                    placeholder={`Game ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Guardian / Emergency Contact */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Guardian / Emergency Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Father Name</label>
              <input name="fatherName" value={formData?.fatherName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Father Mobile</label>
              <input name="fatherMobile" value={formData?.fatherMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mother Name</label>
              <input name="motherName" value={formData?.motherName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mother Mobile</label>
              <input name="motherMobile" value={formData?.motherMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Guardian Name</label>
              <input name="guardianName" value={formData?.guardianName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Guardian Mobile</label>
              <input name="guardianMobile" value={formData?.guardianMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Emergency Contact</label>
              <input name="primaryPhone" value={formData?.primaryPhone || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation (Primary)</label>
              <input name="primaryRelation" value={formData?.primaryRelation || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary Emergency Contact</label>
              <input name="secondaryPhone" value={formData?.secondaryPhone || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation (Secondary)</label>
              <input name="secondaryRelation" value={formData?.secondaryRelation || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
          </div>
        </section>

        {/* Section 4: Admission & Payment */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Admission & Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission ID</label>
              <input
                value={formData?.admissionId || ''}
                readOnly
                className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enquiry ID</label>
              <input value={formData?.enquiryId || ''} readOnly className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Date</label>
              <input
                type="date"
                name="registrationDate"
                value={formData?.registrationDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Login Mobile</label>
              <input name="loginMobile" value={formData?.loginMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Caregiver / Staff</label>
              <Select
                options={caregivers.map((c) => ({ value: c._id, label: c.fullName }))}
                placeholder="Select Caregiver"
                value={
                  formData?.assignedCaregiver
                    ? (() => { const m = caregivers.find(c => c._id === formData.assignedCaregiver); return m ? { value: m._id, label: m.fullName } : null; })()
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, assignedCaregiver: selected?.value || "" }))
                }
                isLoading={loadingCaregivers}
                isClearable
                classNamePrefix="react-select"
              />
              {caregiverError && <p className="text-xs text-red-500 mt-1">{caregiverError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsible Staff</label>
              <Select
                options={staffList.map((staff) => ({ value: staff._id, label: `${staff.fullName} (${staff.role})` }))}
                placeholder="Search Staff..."
                value={
                  formData?.responsibleStaff
                    ? (() => { const m = staffList.find(s => s._id === formData.responsibleStaff); return m ? { value: m._id, label: `${m.fullName} (${m.role})` } : null; })()
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, responsibleStaff: selected?.value || "" }))
                }
                classNamePrefix="react-select"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Plan</label>
              <select name="feePlan" value={formData?.feePlan || 'Monthly'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Daily</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Amount (₹)</label>
              <input
                type="number"
                name="feeAmount"
                value={formData?.feeAmount || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (₹)</label>
              <input
                type="number"
                name="discount"
                value={formData?.discount || '0'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Fee (₹)</label>
              <input
                type="number"
                name="totalFee"
                value={formData?.totalFee || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paid Amount (₹)</label>
              <input
                type="number"
                name="paidAmount"
                value={formData?.paidAmount || '0'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
              <select name="paymentStatus" value={formData?.paymentStatus || 'Pending'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Paid</option>
                <option>Pending</option>
                <option>Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Mode</label>
              <select name="paymentMode" value={formData?.paymentMode || 'Cash'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Due Date</label>
              <input
                type="date"
                name="nextDueDate"
                value={formData?.nextDueDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
              {formData?.photo && !photoFile && (
                <p className="text-xs text-gray-500 mt-1">Current: {formData.photo.split('/').pop()}</p>
              )}
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <div className="p-8">
  <h2 className="text-xl font-semibold mb-6 text-gray-800">
    Additional Services
  </h2>

  <div className="overflow-x-auto">
  <table className="w-full min-w-[800px] border-collapse">
    <thead>
      <tr className="bg-gray-50">
        <th className="border p-3 text-left">
          Service
        </th>

        <th className="border p-3 text-left">
          Start Date
        </th>

        <th className="border p-3 text-left">
          End Date
        </th>

        <th className="border p-3 text-left">
          Days
        </th>

        <th className="border p-3 text-left">
          Total Amount
        </th>

        <th className="border p-3 text-center">
          Action
        </th>
      </tr>
    </thead>

    <tbody>
      {serviceRows.map((row, index) => {
        const amount =
          (row.service?.oneDayFee || 0) *
          (Number(row.days) || 0);

        return (
          <tr key={index}>
            <td className="border p-2 min-w-[250px]">
              <Select
                value={row.service}
                options={services}
                placeholder="Select Service"
                onChange={(selected) =>
                  updateServiceRow(
                    index,
                    "service",
                    selected
                  )
                }
              />
            </td>

            <td className="border p-2">
              <input
                type="date"
                value={row.startDate}
                onChange={(e) =>
                  updateServiceRow(
                    index,
                    "startDate",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </td>

            <td className="border p-2">
              <input
                type="date"
                value={row.endDate}
                onChange={(e) =>
                  updateServiceRow(
                    index,
                    "endDate",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </td>

            <td className="border p-2">
              <input
                type="number"
                min="1"
                value={row.days}
                onChange={(e) =>
                  updateServiceRow(
                    index,
                    "days",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Days"
              />
            </td>

            <td className="border p-2 font-semibold">
              ₹{amount}
            </td>

            <td className="border p-2 text-center">
              <button
                type="button"
                onClick={() =>
                  removeServiceRow(index)
                }
                disabled={serviceRows.length === 1}
                className="px-3 py-1 bg-red-100 text-red-600 rounded"
              >
                Remove
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

<div className="mt-4">
  <button
    type="button"
    onClick={addServiceRow}
    className="px-4 py-2 bg-[#000359] text-white rounded-lg"
  >
    + Add Service
  </button>
</div>
</div>

{/* Section 5: Member Timetable */}
<section className="p-8">
  <h2 className="text-xl font-semibold mb-6 text-gray-800">
    Member Timetable
  </h2>

  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
    <p className="text-sm text-gray-600">
      Manage member timetable assignments.
    </p>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[1200px] border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-3">Period</th>
          <th className="border p-3">Monday</th>
          <th className="border p-3">Tuesday</th>
          <th className="border p-3">Wednesday</th>
          <th className="border p-3">Thursday</th>
          <th className="border p-3">Friday</th>
          <th className="border p-3">Saturday</th>
          <th className="border p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {timetableRows.map((row, index) => {
          const availablePeriods = periods.filter(
            (p) => !selectedPeriods.includes(p.value) || p.value === row.period?.value
          );
          return (
          <tr key={index}>
            <td className="border p-2">
              <Select
                value={row.period}
                options={availablePeriods}
                placeholder="Select Period"
                menuPosition="fixed"
                onChange={(v) => updateRow(index, "period", v)}
                classNamePrefix="react-select"
              />
            </td>

            {['monday','tuesday','wednesday','thursday','friday','saturday'].map((day) => (
              <td key={day} className="border p-2">
                <Select
                  options={activities}
                  value={row[day]}
                  placeholder="Activity"
                  menuPosition="fixed"
                  onChange={(v) => updateRow(index, day, v)}
                  isClearable
                  classNamePrefix="react-select"
                />
              </td>
            ))}

            <td className="border p-2 text-center">
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={timetableRows.length === 1}
                className="px-3 py-1 text-red-600 border border-red-200 rounded disabled:opacity-40"
              >
                Remove
              </button>
            </td>
          </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  <div className="mt-4">
    <button
      type="button"
      onClick={addRow}
      disabled={timetableRows.length >= periods.length}
      className="px-4 py-2 bg-[#000359] text-white rounded-lg disabled:opacity-50"
    >
      + Add Row
    </button>
  </div>
</section>


        <div className="p-8 flex justify-end gap-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/school/admission')}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50 flex items-center"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
