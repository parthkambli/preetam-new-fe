// pages/school/Staff/StaffDetail.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_PHOTO_SIZE_MB = 2;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// ─── Validation Helpers ───────────────────────────────────────────────────────

const validatePhoto = (file) => {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, or WebP images are allowed.';
  }
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return `Photo must be smaller than ${MAX_PHOTO_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
  }
  return null;
};

const validateEditForm = (form) => {
  const errors = {};

  if (!form.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!form.mobile?.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^\d{10}$/.test(form.mobile.trim())) {
    errors.mobile = 'Mobile must be exactly 10 digits.';
  }

  if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.role) {
    errors.role = 'Please select a role.';
  }

  if (!form.employmentType) {
    errors.employmentType = 'Please select an employment type.';
  }

  if (!form.joiningDate) {
    errors.joiningDate = 'Joining date is required.';
  }

  if (form.dob) {
    const dobDate = new Date(form.dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    if (dobDate > today) {
      errors.dob = 'Date of birth cannot be in the future.';
    } else if (age < 16) {
      errors.dob = 'Staff must be at least 16 years old.';
    }
  }

  if (form.password !== undefined && form.password !== '' && form.password?.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (form.salary !== '' && form.salary !== null && form.salary !== undefined) {
    const salaryNum = Number(form.salary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      errors.salary = 'Salary must be a positive number.';
    }
  }

  if (form.emergencyContactMobile?.trim() && !/^\d{10}$/.test(form.emergencyContactMobile.trim())) {
    errors.emergencyContactMobile = 'Emergency mobile must be exactly 10 digits.';
  }

  return errors;
};

// ─── Reusable Components ──────────────────────────────────────────────────────

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

function InputField({ label, name, value, onChange, type = 'text', required, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
          focus:outline-none focus:ring-2 bg-white transition-all
          ${error
            ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
          }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
          focus:outline-none focus:ring-2 bg-white transition-all appearance-none
          ${error
            ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
          }`}
      >
        <option value="">Select {label}</option>
        {options.map((o, index) => (
          <option key={index} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StaffDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [staff, setStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(location.state?.editMode === true);
  const [form, setForm] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  const [roleOptions, setRoleOptions] = useState([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState([]);

  // ── Fetch dropdown options ──────────────────────────────────────────────
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [rolesRes, empRes] = await Promise.all([
          api.staff.getRoles(),
          api.staff.getEmploymentTypes()
        ]);

        setRoleOptions((rolesRes.data?.data || rolesRes.data || []).map(item => ({
          value: item.name || item,
          label: item.name || item
        })));

        setEmploymentTypeOptions((empRes.data?.data || empRes.data || []).map(item => ({
          value: item.name || item,
          label: item.name || item
        })));
      } catch (err) {
        if (!err.response) {
          toast.error('Cannot connect to server. Dropdowns may not load.');
        } else {
          toast.warning('Failed to load dropdown options. Some fields may be empty.');
        }
      }
    };
    fetchOptions();
  }, []);

  // ── Fetch staff data ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await api.staff.getById(id);
        const data = res.data?.data || res.data;

        if (!data) {
          toast.error('Staff member not found.');
          navigate('/school/staff');
          return;
        }

        setStaff(data);
        setForm({
          ...data,
          role: data.role || '',
          employmentType: data.employmentType || '',
          fullAddress: data.fullAddress || data.address || '',
          emergencyContactName: data.emergencyContactName || data.emergencyName || '',
          emergencyContactRelation: data.emergencyContactRelation || data.emergencyRelation || '',
          emergencyContactMobile: data.emergencyContactMobile || data.emergencyMobile || '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : '',
        });

        const photoUrl = data.photo
          ? (data.photo.startsWith('http') ? data.photo : `http://localhost:3000${data.photo}`)
          : '';
        setPhotoPreview(photoUrl);

      } catch (err) {
        console.error('StaffDetail fetch error:', err);

        if (!err.response) {
          toast.error('Cannot connect to server. Please check your internet connection.');
        } else if (err.response.status === 404) {
          toast.error('Staff member not found. They may have been deleted.');
          navigate('/school/staff');
        } else if (err.response.status === 403) {
          toast.error('You do not have permission to view this staff member.');
          navigate('/school/staff');
        } else {
          toast.error(err.response?.data?.message || 'Failed to load staff details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const photoError = validatePhoto(file);
    if (photoError) {
      toast.error(photoError);
      e.target.value = ''; // reset so user can try again
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success('Photo selected. Save changes to update it.');
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate form
    const errors = validateEditForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFieldErrors({});

    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName.trim());
      formData.append('loginId', form.loginId || form.mobile);
      formData.append('role', form.role);
      formData.append('employmentType', form.employmentType);
      formData.append('mobile', form.mobile.trim());
      formData.append('email', form.email?.trim() || '');
      formData.append('gender', form.gender || '');
      formData.append('dob', form.dob || '');
      formData.append('joiningDate', form.joiningDate);
      formData.append('status', form.status || 'Active');
      formData.append('salary', form.salary || 0);
      formData.append('fullAddress', form.fullAddress?.trim() || '');
      formData.append('emergencyContactName', form.emergencyContactName?.trim() || '');
      formData.append('emergencyContactRelation', form.emergencyContactRelation?.trim() || '');
      formData.append('emergencyContactMobile', form.emergencyContactMobile?.trim() || '');
      if (form.password?.trim()) {
        formData.append('password', form.password.trim());
      }

      if (photoFile) formData.append('photo', photoFile);

      // Show a loading toast while saving
      const saveToastId = toast.loading('Saving changes...');

      await api.staff.update(id, formData);

      toast.dismiss(saveToastId);
      toast.success('Staff updated successfully!');

      setTimeout(() => {
        navigate('/school/staff');
      }, 1500);

    } catch (err) {
      console.error('StaffDetail update error:', err);
      handleApiError(err);
    }
  };

  /**
   * Central API error handler for update.
   */
  const handleApiError = (err) => {
    if (!err.response) {
      toast.error('Cannot reach the server. Please check your internet connection.');
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 400:
        if (data.errors?.length) {
          data.errors.forEach(msg => toast.error(msg));
        } else {
          toast.error(data.message || 'Invalid data. Please check your inputs.');
        }
        break;

      case 404:
        toast.error('This staff member no longer exists. They may have been deleted.');
        setTimeout(() => navigate('/school/staff'), 2000);
        break;

      case 409:
        toast.error(data.message || 'This mobile number or Login ID is already used by another staff member.');
        setFieldErrors(prev => ({
          ...prev,
          mobile: 'This mobile is already registered to another staff.'
        }));
        break;

      case 413:
        toast.error('The photo is too large. Please use an image smaller than 2MB.');
        break;

      case 403:
        toast.error('You do not have permission to edit this staff member.');
        break;

      case 500:
        toast.error('Server error. Please try again in a moment.');
        break;

      default:
        toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      ...staff,
      role: staff.role || '',
      employmentType: staff.employmentType || '',
      dob: staff.dob ? new Date(staff.dob).toISOString().split('T')[0] : '',
      joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : '',
    });
    setPhotoPreview(staff?.photo ? `http://localhost:3000${staff.photo}` : '');
    setPhotoFile(null);
    setFieldErrors({});
    if (fileRef.current) fileRef.current.value = '';
    setIsEditing(false);
    navigate(`/school/staff/view/${id}`, { replace: true, state: {} });
  };

  const enterEditMode = () => {
    setForm({
      ...staff,
      role: staff.role || '',
      employmentType: staff.employmentType || '',
      dob: staff.dob ? new Date(staff.dob).toISOString().split('T')[0] : '',
      joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : '',
    });
    setPhotoPreview(staff?.photo ? `http://localhost:3000${staff.photo}` : '');
    setPhotoFile(null);
    setFieldErrors({});
    setIsEditing(true);
    navigate(`/school/staff/view/${id}`, { replace: true, state: { editMode: true } });
  };

  const formatDisplay = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  // ── Loading / Not Found States ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-3 text-gray-500">
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading staff details...
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-3">Staff member not found.</p>
        <button
          onClick={() => navigate('/school/staff')}
          className="px-4 py-2 bg-[#000359] text-white text-sm rounded-lg"
        >
          Back to Staff List
        </button>
      </div>
    );
  }

  // ── VIEW MODE ────────────────────────────────────────────────────────────

  if (!isEditing) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-sm font-semibold text-gray-500 mb-5">Staff &gt; <span className="text-gray-800">View</span></h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={photoPreview || 'https://via.placeholder.com/80?text=No+Photo'}
                alt={staff.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=No+Photo'}
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${staff.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{staff.fullName}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{staff.role || '—'}</p>
              <span className={`inline-flex items-center gap-1 mt-2 px-3 py-0.5 text-xs font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                {staff.status}
              </span>
            </div>
          </div>

          <SectionDivider title="Login & Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Employee ID" value={staff.employeeId} />
            <Field label="Login ID" value={staff.loginId} />
            <Field label="Password" value={staff.password} />
          </div>

          <SectionDivider title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Mobile Number" value={staff.mobile} />
            <Field label="Email ID" value={staff.email} />
            <Field label="Gender" value={staff.gender} />
          </div>

          <SectionDivider title="Employment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Date of Birth" value={formatDisplay(staff.dob)} />
            <Field label="Joining Date" value={formatDisplay(staff.joiningDate)} />
            <Field label="Employment Type" value={staff.employmentType || '—'} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Status" value={staff.status} />
            <Field label="Salary" value={staff.salary ? `₹${Number(staff.salary).toLocaleString('en-IN')}` : '—'} />
            <Field label="Photo" value={staff.photo ? 'Uploaded' : 'No Photo'} />
          </div>

          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 min-h-[72px]">
              {staff.fullAddress || staff.address || '—'}
            </div>
          </div>

          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Contact Name" value={staff.emergencyContactName || staff.emergencyName} />
            <Field label="Relation" value={staff.emergencyContactRelation || staff.emergencyRelation} />
            <Field label="Contact Mobile" value={staff.emergencyContactMobile || staff.emergencyMobile} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={() => navigate('/school/staff')} className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium">
              Back
            </button>
            <button onClick={enterEditMode} className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] text-white rounded-lg transition-colors font-semibold shadow-sm">
              Edit Staff
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ────────────────────────────────────────────────────────────

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-sm font-semibold text-gray-500 mb-5">Staff &gt; <span className="text-gray-800">Edit</span></h1>

      {/* Error summary banner */}
      {errorCount > 0 && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="font-semibold">Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before saving:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {Object.values(fieldErrors).filter(Boolean).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

          {/* Photo Upload */}
          <div className="flex items-center gap-4 pb-2">
            <div className="relative shrink-0">
              <img
                src={photoPreview || 'https://via.placeholder.com/80?text=No+Photo'}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=No+Photo'}
              />
              <label className="absolute bottom-0 right-0 bg-[#000359] text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#000280] transition-colors shadow-md">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                </svg>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, or WebP · Max {MAX_PHOTO_SIZE_MB}MB</p>
              <p className="text-xs text-gray-400">Click the pencil icon to update</p>
            </div>
          </div>

          <SectionDivider title="Login & Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Employee ID is read-only — never let user change it */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee ID</label>
              <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 min-h-[40px] flex items-center cursor-not-allowed">
                {form.employeeId || '—'}
              </div>
              <p className="text-xs text-gray-400">Auto-assigned, cannot be changed</p>
            </div>
            <InputField label="Login ID" name="loginId" value={form.loginId} onChange={handleChange} error={fieldErrors.loginId} />
            <InputField label="Password" name="password" value={form.password} onChange={handleChange} error={fieldErrors.password} />
          </div>

          <SectionDivider title="Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} required error={fieldErrors.mobile} />
            <InputField label="Email ID" name="email" value={form.email} onChange={handleChange} type="email" error={fieldErrors.email} />
            <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} error={fieldErrors.gender} />
          </div>

          <SectionDivider title="Employment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} type="date" error={fieldErrors.dob} />
            <InputField label="Joining Date" name="joiningDate" value={form.joiningDate} onChange={handleChange} type="date" required error={fieldErrors.joiningDate} />
            <SelectField
              label="Employment Type"
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              options={employmentTypeOptions}
              error={fieldErrors.employmentType}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Inactive']} />
            <InputField label="Salary (₹)" name="salary" value={form.salary} onChange={handleChange} type="number" error={fieldErrors.salary} />
            <SelectField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              options={roleOptions}
              required
              error={fieldErrors.role}
            />
          </div>

          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <textarea
              name="fullAddress"
              value={form.fullAddress || ''}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] resize-none transition-all"
            />
          </div>

          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Contact Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
            <InputField label="Relation" name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} />
            <InputField label="Contact Mobile" name="emergencyContactMobile" value={form.emergencyContactMobile} onChange={handleChange} type="tel" error={fieldErrors.emergencyContactMobile} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={handleCancelEdit} className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] text-white rounded-lg transition-colors font-semibold shadow-sm">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}