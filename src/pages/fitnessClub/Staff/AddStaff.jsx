
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const emptyForm = {
  name: '',
  role: '',
  employmentType: 'Full Time',
  status: 'Active',
  gender: '',
  dob: '',
  joiningDate: '',
  mobile: '',
  email: '',
  password: '',
  salary: '',
  address: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyMobile: '',
};

// ── Sub-components ────────────────────────────────────────────────────────

function InputField({ label, name, value, onChange, type = 'text', required, placeholder }) {
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
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800
                   placeholder:text-gray-300 focus:outline-none focus:ring-2
                   focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all"
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
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359]
                   bg-white transition-all appearance-none"
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

export default function AddStaff() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [form,         setForm]         = useState(emptyForm);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted,    setSubmitted]    = useState(false);
  const [errors,       setErrors]       = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name       = 'Name is required';
    if (!form.role.trim())       e.role       = 'Role is required';
    if (!form.mobile.trim())     e.mobile     = 'Mobile is required';
    if (!form.joiningDate)       e.joiningDate = 'Joining date is required';
    if (!form.password.trim())   e.password   = 'Password is required';
    if (!form.gender)            e.gender     = 'Gender is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // In production: await api.post('/staff', { ...form, photo: photoPreview })
    console.log('New staff:', { ...form, photo: photoPreview });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(emptyForm);
      setPhotoPreview(null);
    }, 2500);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setPhotoPreview(null);
    setErrors({});
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-sm font-semibold text-gray-500 mb-5">
        Staff &gt; <span className="text-gray-800">Add Staff</span>
      </h1>

      {submitted && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Staff member added successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

          {/* Photo Upload */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#000359] transition-colors group shrink-0 overflow-hidden bg-gray-50"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[#000359] transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {photoPreview && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                  </svg>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <div>
              <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">Click to upload (optional)</p>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="mt-1 text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <SectionDivider title="Basic Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Full Name<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Suresh Patil"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                  ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Role<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text" name="role" value={form.role} onChange={handleChange}
                placeholder="e.g. Caregiver"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                  ${errors.role ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.role && <p className="text-xs text-red-500 mt-0.5">{errors.role}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Gender<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                name="gender" value={form.gender} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all appearance-none
                  ${errors.gender ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} type="date" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Joining Date<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                  ${errors.joiningDate ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.joiningDate && <p className="text-xs text-red-500 mt-0.5">{errors.joiningDate}</p>}
            </div>
            <SelectField
              label="Employment Type" name="employmentType" value={form.employmentType} onChange={handleChange}
              options={['Full Time', 'Part Time', 'Contract']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectField
              label="Status" name="status" value={form.status} onChange={handleChange}
              options={['Active', 'Inactive']}
            />
            <InputField label="Salary (₹)" name="salary" value={form.salary} onChange={handleChange} type="number" placeholder="e.g. 18000" />
          </div>

          {/* Login Credentials */}
          <SectionDivider title="Login Credentials" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Mobile Number<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="tel" name="mobile" value={form.mobile} onChange={handleChange}
                placeholder="Used as Login ID"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                  ${errors.mobile ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
            </div>

            <InputField label="Email ID" name="email" value={form.email} onChange={handleChange} type="email" placeholder="staff@school.com" />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text" name="password" value={form.password} onChange={handleChange}
                placeholder="e.g. EMP@1234"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                  ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
            </div>
          </div>

          {/* Address */}
          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Street, City, State, PIN"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] resize-none transition-all"
            />
          </div>

          {/* Emergency Contact */}
          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Contact Name"   name="emergencyName"     value={form.emergencyName}     onChange={handleChange} placeholder="e.g. Ramesh Patil" />
            <InputField label="Relation"       name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} placeholder="e.g. Brother" />
            <InputField label="Contact Mobile" name="emergencyMobile"   value={form.emergencyMobile}   onChange={handleChange} type="tel" placeholder="10-digit mobile" />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm"
            >
              Add Staff
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}