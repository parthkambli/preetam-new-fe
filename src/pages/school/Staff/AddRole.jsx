// pages/school/Staff/AddRole.jsx
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function AddRole() {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldError, setFieldError] = useState('');  // inline field error

  // ── Client-side validation ───────────────────────────────────────────────
  const validateRoleName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return 'Role name is required.';
    if (trimmed.length < 2) return 'Role name must be at least 2 characters.';
    if (trimmed.length > 50) return 'Role name must not exceed 50 characters.';
    if (!/^[a-zA-Z0-9\s\-_()]+$/.test(trimmed)) {
      return 'Role name can only contain letters, numbers, spaces, hyphens, or brackets.';
    }
    return null;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setRoleName(e.target.value);
    // Clear inline error as user types
    if (fieldError) setFieldError('');
    if (success) setSuccess(false);
  };

  const handleSave = async () => {
    // 1. Validate before API call
    const validationError = validateRoleName(roleName);
    if (validationError) {
      setFieldError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setFieldError('');
    setSuccess(false);

    try {
      await api.staff.roles.create({ name: roleName.trim() });

      setSuccess(true);
      toast.success(`Role "${roleName.trim()}" added successfully!`);

      setTimeout(() => {
        setRoleName('');
        setSuccess(false);
      }, 1500);

    } catch (err) {
      console.error('AddRole error:', err);

      // Case 1: No internet / server completely unreachable
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your internet connection.');
        return;
      }

      const { status, data } = err.response;

      switch (status) {
        case 409:
          // Duplicate — this role name already exists
          setFieldError(`"${roleName.trim()}" already exists. Please use a different name.`);
          toast.error(`Role "${roleName.trim()}" already exists.`);
          break;

        case 400:
          // Backend validation failed
          if (data.errors?.length) {
            data.errors.forEach(msg => toast.error(msg));
            setFieldError(data.errors[0]);
          } else {
            const msg = data.message || 'Invalid role name.';
            setFieldError(msg);
            toast.error(msg);
          }
          break;

        case 401:
        case 403:
          toast.error('You do not have permission to add roles.');
          break;

        case 500:
          toast.error('Server error while saving. Please try again in a moment.');
          break;

        case 503:
          toast.error('Server is temporarily unavailable. Please try again later.');
          break;

        default:
          toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Allow saving by pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const handleCancel = () => {
    setRoleName('');
    setFieldError('');
    setSuccess(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add Role</h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 w-full max-w-lg">

        {/* Success message */}
        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Role added successfully!
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Caregiver"
            value={roleName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={51} // slightly above limit so validation message shows
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:border-transparent transition
              ${fieldError
                ? 'border-red-400 bg-red-50 focus:ring-red-300'
                : 'border-gray-300 focus:ring-[#000359]'
              }`}
          />

          {/* Character counter */}
          <div className="flex justify-between items-start mt-1">
            {fieldError
              ? (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldError}
                </p>
              )
              : <span />
            }
            <span className={`text-xs ml-auto ${roleName.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
              {roleName.length}/50
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-8 py-2 rounded-lg border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!roleName.trim() || loading}
            className="px-8 py-2 rounded-lg bg-[#000359] hover:bg-[#0a0f6b] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}







