
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// ── Shared base record (fallback / template) ──────────────────────────────
const baseStaff = {
  employeeId: 'EMP-00123',
  name: 'Suresh Patil',
  role: 'Caregiver',
  status: 'Active',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  loginId: '9876543210',
  password: 'EMP@1234',
  mobile: '9876543210',
  email: 'suresh@school.com',
  gender: 'Male',
  dob: '1985-04-12',
  joiningDate: '2024-03-15',
  employmentType: 'Full Time',
  salary: '18000',
  photo_status: 'Uploaded',
  address: 'Pune, Maharashtra',
  emergencyName: 'Ramesh Patil',
  emergencyRelation: 'Brother',
  emergencyMobile: '9123456789',
};

// Simulated staff DB keyed by id — replace with real API calls
const staffDB = {
  '1': { ...baseStaff, _id: '1', employeeId: 'EMP-00123', name: 'Suresh Patil', role: 'Caregiver', status: 'Active',   photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  '2': { ...baseStaff, _id: '2', employeeId: 'EMP-00124', name: 'Anita Desai',  role: 'Nurse',     status: 'Active',   photo: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'anita@school.com',  loginId: '9123456789', mobile: '9123456789' },
  '3': { ...baseStaff, _id: '3', employeeId: 'EMP-00125', name: 'Rohit Sharma', role: 'Trainer',   status: 'Inactive', photo: 'https://randomuser.me/api/portraits/men/65.jpg',  email: 'rohit@school.com',  loginId: '9988776655', mobile: '9988776655' },
  '4': { ...baseStaff, _id: '4', employeeId: 'EMP-00126', name: 'Meena Joshi',  role: 'Teacher',   status: 'Active',   photo: 'https://randomuser.me/api/portraits/women/68.jpg', email: 'meena@school.com', loginId: '9012345678', mobile: '9012345678' },
};

// ── Sub-components ────────────────────────────────────────────────────────

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 min-h-[40px] flex items-center">
        {value || '—'}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all appearance-none"
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function StaffDetail() {
  const { id }   = useParams();                          // /school/staff/view/:id
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve record — swap with API fetch in production
  const initialData = staffDB[id] ?? baseStaff;

  const [staff,        setStaff]        = useState(initialData);
  const [isEditing,    setIsEditing]    = useState(location.state?.editMode === true);
  const [form,         setForm]         = useState(initialData);
  const [photoPreview, setPhotoPreview] = useState(initialData.photo);
  const [saved,        setSaved]        = useState(false);

  // Re-sync when navigating between different staff records
  useEffect(() => {
    const data = staffDB[id] ?? baseStaff;
    setStaff(data);
    setForm(data);
    setPhotoPreview(data.photo);
    setIsEditing(location.state?.editMode === true);
    setSaved(false);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setForm(prev => ({ ...prev, photo: url, photo_status: 'Uploaded' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = { ...form, photo: photoPreview };
    staffDB[id] = updated; // persist in local "DB"; replace with API call in production
    setStaff(updated);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Clear editMode from history so a back-navigation doesn't re-open edit mode
    navigate(`/school/staff/view/${id}`, { replace: true, state: {} });
  };

  const handleCancelEdit = () => {
    setForm(staff);
    setPhotoPreview(staff.photo);
    setIsEditing(false);
    navigate(`/school/staff/view/${id}`, { replace: true, state: {} });
  };

  const enterEditMode = () => {
    setForm(staff);
    setPhotoPreview(staff.photo);
    setIsEditing(true);
    navigate(`/school/staff/view/${id}`, { replace: true, state: { editMode: true } });
  };

  const formatDisplay = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-GB');
  };

  // ── VIEW MODE ────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-sm font-semibold text-gray-500 mb-5">
          Staff &gt; <span className="text-gray-800">View</span>
        </h1>

        {saved && (
          <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Staff details updated successfully.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={staff.photo}
                alt={staff.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${staff.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{staff.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{staff.role}</p>
              <span className={`inline-flex items-center gap-1 mt-2 px-3 py-0.5 text-xs font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                {staff.status}
              </span>
            </div>
          </div>

          <SectionDivider title="Login & Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Employee ID" value={staff.employeeId} />
            <Field label="Login ID"    value={staff.loginId} />
            <Field label="Password"    value={staff.password} />
          </div>

          <SectionDivider title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Mobile Number" value={staff.mobile} />
            <Field label="Email ID"      value={staff.email} />
            <Field label="Gender"        value={staff.gender} />
          </div>

          <SectionDivider title="Employment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Date of Birth"   value={formatDisplay(staff.dob)} />
            <Field label="Joining Date"    value={formatDisplay(staff.joiningDate)} />
            <Field label="Employment Type" value={staff.employmentType} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Status" value={staff.status} />
            <Field label="Salary" value={staff.salary ? `₹${Number(staff.salary).toLocaleString('en-IN')}` : '—'} />
            <Field label="Photo"  value={staff.photo_status} />
          </div>

          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 min-h-[72px]">
              {staff.address}
            </div>
          </div>

          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Contact Name"   value={staff.emergencyName} />
            <Field label="Relation"       value={staff.emergencyRelation} />
            <Field label="Contact Mobile" value={staff.emergencyMobile} />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => navigate('/school/staff')}
              className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={enterEditMode}
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm"
            >
              Edit Staff
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-sm font-semibold text-gray-500 mb-5">
        Staff &gt; <span className="text-gray-800">Edit</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

          {/* Photo Upload */}
          <div className="flex items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 bg-[#000359] text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#000280] transition-colors shadow-md">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">Click the pencil icon to update</p>
            </div>
          </div>

          <SectionDivider title="Login & Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} required />
            <InputField label="Login ID"    name="loginId"    value={form.loginId}    onChange={handleChange} required />
            <InputField label="Password"    name="password"   value={form.password}   onChange={handleChange} required />
          </div>

          <SectionDivider title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} required />
            <InputField label="Email ID"      name="email"  value={form.email}  onChange={handleChange} type="email" />
            <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
          </div>

          <SectionDivider title="Employment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Date of Birth" name="dob"         value={form.dob}         onChange={handleChange} type="date" />
            <InputField label="Joining Date"  name="joiningDate" value={form.joiningDate} onChange={handleChange} type="date" required />
            <SelectField label="Employment Type" name="employmentType" value={form.employmentType} onChange={handleChange}
              options={['Full Time', 'Part Time', 'Contract']} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Inactive']} />
            <InputField label="Salary (₹)" name="salary" value={form.salary} onChange={handleChange} type="number" />
            <InputField label="Role"       name="role"   value={form.role}   onChange={handleChange} required />
          </div>

          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] resize-none transition-all"
            />
          </div>

          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Contact Name"   name="emergencyName"     value={form.emergencyName}     onChange={handleChange} />
            <InputField label="Relation"       name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} />
            <InputField label="Contact Mobile" name="emergencyMobile"   value={form.emergencyMobile}   onChange={handleChange} />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}