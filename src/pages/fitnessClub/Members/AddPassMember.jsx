import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";
import Select from "react-select";

const PLAN_OPTIONS = [
  { value: "Annual",  label: "Annual",  feeKey: "annual"  },
  { value: "halfYearly",    label: "halfYearly",    feeKey: "halfYearly"   },
  { value: "quarterly",    label: "quarterly",    feeKey: "quarterly"   },
  { value: "Monthly", label: "Monthly", feeKey: "monthly" },
  { value: "Weekly",  label: "Weekly",  feeKey: "weekly"  },
  { value: "Daily",   label: "Daily",   feeKey: "daily"   },
  { value: "Hourly",  label: "Hourly",  feeKey: "hourly"  },
];

const GENDERS       = ["Male", "Female", "Other"];
const PAYMENT_MODES = ["Cash", "Bank Transfer"];

// ─── File validation constants ────────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS  = [".jpg", ".jpeg", ".png", ".webp"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
// const computeEndDate = (startDate, plan) => {
//   if (!startDate || !plan) return "";
//   const d = new Date(startDate);
//   if (isNaN(d.getTime())) return "";
//   switch (plan) {
//     case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
//     case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
//     case "Weekly":  d.setDate(d.getDate() + 6);         break;
//     case "Daily":   break;
//     case "Hourly":  break;
//     default:        d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1);
//   }
//   return d.toISOString().split("T")[0];
// };

const computeEndDate = (startDate, plan) => {
  if (!startDate || !plan) return "";

  const d = new Date(startDate);
  if (isNaN(d.getTime())) return "";

  switch (plan) {
    case "Annual":
      d.setFullYear(d.getFullYear() + 1);
      d.setDate(d.getDate() - 1);
      break;

    case "halfYearly":
      d.setMonth(d.getMonth() + 6);
      d.setDate(d.getDate() - 1);
      break;

    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      d.setDate(d.getDate() - 1);
      break;

    case "Monthly":
      d.setMonth(d.getMonth() + 1);
      d.setDate(d.getDate() - 1);
      break;

    case "Weekly":
      d.setDate(d.getDate() + 6);
      break;

    case "Daily":
      break;

    case "Hourly":
      break;

    default:
      d.setMonth(d.getMonth() + 1);
      d.setDate(d.getDate() - 1);
  }

  return d.toISOString().split("T")[0];
};

const computeActivityStatus = (af) => {
  if (af.paymentStatus !== "Paid") return "Inactive";
  if (!af.startDate || !af.endDate) return "Inactive";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(af.startDate); start.setHours(0, 0, 0, 0);
  const end   = new Date(af.endDate);   end.setHours(23, 59, 59, 999);
  return today >= start && today <= end ? "Active" : "Inactive";
};

const todayString = () => new Date().toISOString().split("T")[0];

const formatDateForInput = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
//   return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
// };

const generatePassword = (name = "", mobile = "") => {
  const cleanName = name.trim().replace(/\s+/g, "");
  const namePart = cleanName.substring(0, 3) || "Mem";
  const mobilePart = mobile.slice(-4) || "1234";

  return `${namePart}@${mobilePart}`;
};

// ─── Client-side photo validation ────────────────────────────────────────────
const validatePhotoFile = (file) => {
  if (!file) return null;

  const ext = "." + file.name.split(".").pop().toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return "Only JPG, JPEG, PNG, and WEBP image files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum allowed size is 5 MB.`;
  }
  if (file.size === 0) {
    return "The selected file is empty. Please choose a valid image.";
  }
  return null; // ✅ valid
};

// ─── Map backend error codes → user-friendly messages ────────────────────────
const resolveApiError = (err) => {
  const status = err?.response?.status;
  const data   = err?.response?.data;
  const code   = data?.code;
  const msg    = data?.message;

  // Multer / upload errors
  if (code === "FILE_TOO_LARGE"  || status === 413) return "Photo is too large. Maximum size is 5 MB.";
  if (code === "INVALID_FILE_TYPE" || status === 415) return "Invalid file type. Only JPG, PNG, and WEBP images are allowed.";
  if (code === "TOO_MANY_FILES")   return "Only one photo can be uploaded at a time.";
  if (code === "UNEXPECTED_FIELD") return "Unexpected file field. Please refresh and try again.";
  if (code === "UPLOAD_UNEXPECTED_ERROR") return "File upload failed unexpectedly. Please try again.";

  // Business logic errors
  if (status === 409) return msg || "A member with this mobile number already exists.";
  if (status === 400) return msg || "Please check your form — some fields have invalid values.";
  if (status === 404) return "Member not found. It may have been deleted.";
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 500) return "A server error occurred. Please try again later.";

  // Network / unknown errors
  if (!err?.response) return "Network error — please check your internet connection.";
  return msg || err?.message || "Something went wrong. Please try again.";
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const emptyPassFee = {
  feeType:       null,
  plan:          "Monthly",
  planFee:       "",
  discount:      "",
  finalAmount:   "",
  paymentStatus: "Paid",
  paymentMode:   "",
  paymentDate:   todayString(),
  planNotes:     "",
  startDate:     "",
  endDate:       "",
  staff:         null,
};

const emptyForm = {
  name:            "",
  mobile:          "",
  email:           "",
  age:             "",
  gender:          "Male",
  address:         "",
  numberOfPersons: "",
  photo:           null,
  photoPreview:    null,
  membershipStatus:"Active",
  status:          "Active",
  startDate:       "",
  endDate:         "",
  staff:           "",
  userId:          "",
  password:        "",
  enquiryId:       null,
  activityFees:    [{ ...emptyPassFee }],
};

// ─── Field component ──────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange, isView }) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {options ? (
      <select
        name={name} value={form[name] || ""} onChange={onChange} disabled={readOnly || isView}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type} name={name} value={form[name] || ""} onChange={onChange}
        placeholder={placeholder} readOnly={readOnly || isView}
        maxLength={name === "mobile" ? 10 : undefined}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
      />
    )}
    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
  </div>
);

// ─── Membership Pass Fee Row ──────────────────────────────────────────────────
const PassFeeRow = ({
  entry, passFeeTypeOptions, staffOptions,
  loadingFeeTypes, loadingStaff, errors,
  onChange, onChangeBatch, isView,
}) => {
  const fee      = parseFloat(entry.planFee)  || 0;
  const disc     = parseFloat(entry.discount) || 0;
  const computed = fee > 0 ? Math.max(0, fee - disc) : "";

  const activityStatus = computeActivityStatus(entry);
  const handleField    = (e) => onChange(0, e.target.name, e.target.value);

  const handlePassChange = (selected) => {
    if (!selected) {
      onChangeBatch(0, { feeType: null, plan: "Monthly", planFee: "", finalAmount: "" });
      return;
    }
    const data = selected.data;
    let detectedPlan = "Monthly", detectedFee = "";
    if (data?.monthly > 0)     { detectedPlan = "Monthly"; detectedFee = String(data.monthly); }
    else if (data?.annual > 0) { detectedPlan = "Annual";  detectedFee = String(data.annual);  }
    else if (data?.weekly > 0) { detectedPlan = "Weekly";  detectedFee = String(data.weekly);  }
    else if (data?.daily > 0)  { detectedPlan = "Daily";   detectedFee = String(data.daily);   }
    else if (data?.hourly > 0) { detectedPlan = "Hourly";  detectedFee = String(data.hourly);  }

    const discNum = parseFloat(entry.discount) || 0;
    const feeNum  = parseFloat(detectedFee) || 0;
    const final   = feeNum > 0 ? String(Math.max(0, feeNum - discNum)) : "";
    const newEnd  = entry.startDate ? computeEndDate(entry.startDate, detectedPlan) : "";

    const patch = { feeType: selected, plan: detectedPlan, planFee: detectedFee, finalAmount: final };
    if (newEnd) patch.endDate = newEnd;
    onChangeBatch(0, patch);
  };

  const handlePlanChange = (e) => {
    const newPlan  = e.target.value;
    const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
    const autoFee  = entry.feeType?.data && planMeta ? (entry.feeType.data[planMeta.feeKey] ?? null) : null;
    const newEnd   = entry.startDate ? computeEndDate(entry.startDate, newPlan) : "";
    const patch    = { plan: newPlan };
    if (autoFee !== null) patch.planFee = autoFee !== "" ? String(autoFee) : "";
    if (newEnd)           patch.endDate = newEnd;
    onChangeBatch(0, patch);
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    const patch    = { startDate: newStart };
    if (newStart && entry.plan) {
      const newEnd = computeEndDate(newStart, entry.plan);
      if (newEnd) patch.endDate = newEnd;
    }
    onChangeBatch(0, patch);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-semibold text-[#1a2a5e] uppercase tracking-wide">Pass Details</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
          activityStatus === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
        }`}>{activityStatus}</span>
      </div>

      {/* Pass + Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Membership Pass<span className="text-red-400 ml-0.5">*</span></label>
          <Select isDisabled={isView}
            options={passFeeTypeOptions} value={entry.feeType} onChange={handlePassChange}
            placeholder={loadingFeeTypes ? "Loading…" : "Select membership pass"}
            isClearable isLoading={loadingFeeTypes} classNamePrefix="react-select"
          />
          {errors["activityFees_0_feeType"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_feeType"]}</p>}
          <p className="mt-0.5 text-[10px] text-gray-400">Auto-fills plan, fee &amp; end date</p>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Plan</label>
          <select disabled={isView} name="plan" value={entry.plan} onChange={handlePlanChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Fees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
          <input type="number" name="planFee" value={entry.planFee} onChange={handleField}
            placeholder="0" min="0" readOnly={isView}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_planFee"] ? "border-red-400" : "border-gray-300"}`}
          />
          {errors["activityFees_0_planFee"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_planFee"]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
          <input type="number" name="discount" value={entry.discount} onChange={handleField}
            placeholder="0" min="0" readOnly={isView}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_discount"] ? "border-red-400" : "border-gray-300"}`}
          />
          {errors["activityFees_0_discount"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_discount"]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
          <input type="text" value={computed !== "" ? computed : ""} readOnly placeholder="Auto calculated"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
          <select disabled={isView} name="paymentMode" value={entry.paymentMode || "Cash"} onChange={handleField}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${errors["activityFees_0_paymentMode"] ? "border-red-400" : "border-gray-300"}`}>
            <option value="">Select Mode</option>
            {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors["activityFees_0_paymentMode"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_paymentMode"]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
          <input type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
            min="1900-01-01" max={todayString()} readOnly={isView}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_paymentDate"] ? "border-red-400" : "border-gray-300"}`}
          />
          {errors["activityFees_0_paymentDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_paymentDate"]}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
          <input type="date" name="startDate" value={entry.startDate} onChange={handleStartDateChange}
            min="1900-01-01" max="9999-12-31" readOnly={isView}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_startDate"] ? "border-red-400" : "border-gray-300"}`}
          />
          {errors["activityFees_0_startDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_startDate"]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            End Date<span className="text-red-400 ml-0.5">*</span>
            <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-filled from plan)</span>
          </label>
          <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
            min={entry.startDate || "1900-01-01"} max="9999-12-31" readOnly={isView}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_endDate"] ? "border-red-400" : "border-gray-300"}`}
          />
          {errors["activityFees_0_endDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_endDate"]}</p>}
        </div>
      </div>

      {/* Status + Staff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Membership Status
            <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-computed)</span>
          </label>
          <div className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1.5 ${
            activityStatus === "Active" ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-100 border-gray-300 text-gray-500"
          }`}>
            <span className={`w-2 h-2 rounded-full ${activityStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
            {activityStatus}
          </div>
          <p className="mt-0.5 text-[10px] text-gray-400">Active when Paid &amp; within date range</p>

          {entry.paymentStatus === "Paid" && entry.startDate && new Date(entry.startDate) > new Date() && (
            <p className="mt-2 text-amber-600 text-xs flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Membership will become <span className="font-semibold ml-1">Active</span>&nbsp;on{" "}
              {new Date(entry.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
          <Select isDisabled={isView}
            options={staffOptions}
            value={staffOptions.find((opt) => opt.value === entry.staff) || null}
            onChange={(sel) => onChange(0, "staff", sel?.value || null)}
            placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
            isClearable isLoading={loadingStaff} classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Plan Notes */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
        <textarea disabled={isView} name="planNotes" value={entry.planNotes} onChange={handleField} rows={2}
          placeholder="Any additional notes for this pass…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
        />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddPassMember({ viewMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id }   = useParams();
  const isEdit   = Boolean(id) && !viewMode;
  const isView   = viewMode === true;
  const fileRef  = useRef();

  const [form, setForm]       = useState(emptyForm);
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(false);

  const [enquiryOptions, setEnquiryOptions]         = useState([]);
  const [selectedEnquiry, setSelectedEnquiry]       = useState(null);
  const [loadingEnquiries, setLoadingEnquiries]     = useState(false);
  const [staffOptions, setStaffOptions]             = useState([]);
  const [loadingStaff, setLoadingStaff]             = useState(false);
  const [feeTypes, setFeeTypes]                     = useState([]);
  const [passFeeTypeOptions, setPassFeeTypeOptions] = useState([]);
  const [loadingFeeTypes, setLoadingFeeTypes]       = useState(false);

  const passFee     = form.activityFees[0];
  const overallStatus = computeActivityStatus(passFee);

  // Load Enquiries (add only, not edit)
  useEffect(() => {
    if (isEdit) return;
    (async () => {
      try {
        setLoadingEnquiries(true);
        const res  = await api.fitnessEnquiry.getAll({ limit: 100 });
        const raw  = res?.data ?? res;
        const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
        setEnquiryOptions(list.map((e) => ({
          value: e._id,
          label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
          data:  e,
        })));
      } catch {
        toast.error("Could not load enquiries. Please refresh the page.");
      } finally {
        setLoadingEnquiries(false);
      }
    })();
  }, [isEdit]);

  // Load Staff
  useEffect(() => {
    (async () => {
      try {
        setLoadingStaff(true);
        const res = await api.fitnessStaff.getAll({ limit: 200 });
        const raw = res?.data?.data?.staff || res?.data?.staff || res?.data?.data || res?.data || [];
        setStaffOptions((Array.isArray(raw) ? raw : []).map((s) => ({
          value: s._id,
          label: s.fullName || s.name || "Unnamed Staff",
        })));
      } catch {
        toast.error("Could not load staff list. Please refresh the page.");
      } finally {
        setLoadingStaff(false);
      }
    })();
  }, []);

  // Load Fee Types — Membership Pass only
  useEffect(() => {
    (async () => {
      try {
        setLoadingFeeTypes(true);
        const res      = await api.fitnessFees.getTypes();
        const fullList = res?.data || [];
        setFeeTypes(fullList);
        const passOnly = fullList.filter((ft) => ft.type === "Membership Pass");
        if (passOnly.length === 0) {
          toast.warning("No membership pass types found. Please create one first.");
        }
        setPassFeeTypeOptions(passOnly.map((ft) => ({
          value: ft._id,
          label: ft.description,
          data:  ft,
        })));
      } catch {
        toast.error("Could not load fee types. Please refresh the page.");
      } finally {
        setLoadingFeeTypes(false);
      }
    })();
  }, []);

  // Prefill from Enquiry (navigation state)
  useEffect(() => {
    if (!isEdit && location.state?.enquiry) {
      const enq = location.state.enquiry;
      setForm((prev) => ({
        ...prev,
        enquiryId: enq._id,
        name:      enq.fullName || enq.name    || "",
        mobile:    enq.mobile   || enq.contact || "",
        email:     enq.email    || "",
        age:       enq.age      || "",
        gender:    enq.gender   || "Male",
        address:   enq.address  || "",
        staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
      }));
      setSelectedEnquiry({
        value: enq._id,
        label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
        data:  enq,
      });
    }
  }, [isEdit, location.state]);

  // Load member for Edit / View
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res    = await api.fitnessMember.getById(id);
        const member = res?.data ?? res;
        if (!member) return;

        let activityFees = [{ ...emptyPassFee }];
        if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
          const af     = member.activityFees[0];
          const ftId   = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
          const ftData = feeTypes.find((f) => f._id === ftId);
          activityFees = [{
            feeType:       ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
            plan:          af.plan          || "Monthly",
            planFee:       af.planFee       ?? "",
            discount:      af.discount      ?? "",
            finalAmount:   af.finalAmount   ?? "",
            paymentStatus: af.paymentStatus || "Pending",
            paymentMode:   af.paymentMode   || "",
            paymentDate:   formatDateForInput(af.paymentDate) || todayString(),
            planNotes:     af.planNotes     || "",
            startDate:     formatDateForInput(af.startDate),
            endDate:       formatDateForInput(af.endDate),
            staff:         typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
          }];
        }

        // setForm({
        //   ...emptyForm,
        //   ...member,
        //   numberOfPersons: member.numberOfPersons || "",
        //   startDate:    formatDateForInput(member.startDate),
        //   endDate:      formatDateForInput(member.endDate),
        //   photoPreview: member.photo || null,
        //   staff:        typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
        //   activityFees,
        // });

const getPhotoPreviewUrl = (member) => {
  const rawPhoto =
    member?.profilePhoto?.url ||
    member?.profilePhoto ||
    member?.photo ||
    member?.photoUrl ||
    member?.profileImage ||
    null;

  if (!rawPhoto) return null;

  // if already full URL
  if (
    typeof rawPhoto === "string" &&
    (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://"))
  ) {
    return rawPhoto;
  }

  // if backend sends only file path like uploads/member.jpg
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return `${BASE_URL}/${String(rawPhoto).replace(/^\/+/, "")}`;
};


setForm({
  ...emptyForm,
  ...member,
  numberOfPersons: member.numberOfPersons || "",
  startDate: formatDateForInput(member.startDate),
  endDate: formatDateForInput(member.endDate),

  photoPreview: member.photo
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${member.photo}`
    : null,

  staff:
    typeof member.staff === "object"
      ? member.staff?._id || ""
      : member.staff || "",

  activityFees,
});
      } catch (err) {
        const msg = resolveApiError(err);
        toast.error(`Failed to load member: ${msg}`);
      }
    })();
  }, [id, isEdit, feeTypes]);

  // Auto userId from mobile
useEffect(() => {
  if (form.mobile) {
    setForm((p) => ({ ...p, userId: form.mobile }));
  }
}, [form.mobile]);

  // Auto-generate password on add
  // useEffect(() => {
  //   if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
  // }, [isEdit]);

  useEffect(() => {
  if (!isEdit && form.mobile) {
    setForm((prev) => ({
      ...prev,
      password: generatePassword(prev.name, prev.mobile),
    }));
  }
}, [form.name, form.mobile, isEdit]);

  const prefillFromEnquiry = (enq) => {
    setForm((prev) => ({
      ...prev,
      enquiryId: enq._id,
      name:      enq.fullName || enq.name    || "",
      mobile:    enq.mobile   || enq.contact || "",
      email:     enq.email    || "",
      age:       enq.age      || "",
      gender:    enq.gender   || "Male",
      address:   enq.address  || "",
      staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
    }));
  };

  const handleEnquirySelect = (option) => {
    setSelectedEnquiry(option);
    if (option) { prefillFromEnquiry(option.data); toast.success("Enquiry details loaded!"); }
    else setForm((prev) => ({ ...prev, enquiryId: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "mobile")          v = value.replace(/\D/g, "").slice(0, 10);
    if (name === "age")             v = value.replace(/\D/g, "").slice(0, 3);
    if (name === "numberOfPersons") v = value.replace(/\D/g, "").slice(0, 4);
    setForm((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ── Photo handler with client-side validation ─────────────────────────────
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const photoError = validatePhotoFile(file);
    if (photoError) {
      toast.error(photoError);
      setErrors((p) => ({ ...p, photo: photoError }));
      e.target.value = ""; // reset input
      return;
    }

    // Clear any previous photo error
    setErrors((p) => ({ ...p, photo: "" }));

    const reader = new FileReader();
    reader.onload  = (ev) => setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
    reader.onerror = ()   => {
      toast.error("Could not read the selected file. Please try a different image.");
      setErrors((p) => ({ ...p, photo: "Could not read the file." }));
    };
    reader.readAsDataURL(file);
  };

  const handlePassFeeChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.activityFees];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "planFee" || field === "discount") {
        const f = parseFloat(field === "planFee"  ? value : updated[index].planFee)  || 0;
        const d = parseFloat(field === "discount" ? value : updated[index].discount) || 0;
        updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
      }
      return { ...prev, activityFees: updated };
    });
    const errKey = `activityFees_${index}_${field}`;
    if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
  };

  const handlePassFeeBatchChange = (index, patch) => {
    setForm((prev) => {
      const updated = [...prev.activityFees];
      updated[index] = { ...updated[index], ...patch };
      if ("planFee" in patch || "discount" in patch) {
        const f = parseFloat(updated[index].planFee)  || 0;
        const d = parseFloat(updated[index].discount) || 0;
        updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
      }
      return { ...prev, activityFees: updated };
    });
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    // Personal
    if (!form.name?.trim())    e.name   = "Full name is required.";
    if (!form.mobile?.trim())  e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.age !== "" && form.age !== undefined) {
      const n = Number(form.age);
      if (isNaN(n) || n < 1 || n > 120) e.age = "Age must be between 1 and 120.";
    }
   if (!isEdit && !form.password?.trim()) {
  e.password = "Password is required.";
}

    // Photo (re-check in case state is stale)
    if (form.photo instanceof File) {
      const photoErr = validatePhotoFile(form.photo);
      if (photoErr) e.photo = photoErr;
    }

    // Pass fee
    const af = form.activityFees[0];
    if (!af.feeType)   e["activityFees_0_feeType"]   = "Membership pass is required.";
    if (!af.startDate) e["activityFees_0_startDate"] = "Start date is required.";
    if (!af.endDate)   e["activityFees_0_endDate"]   = "End date is required.";

    if (af.startDate && af.endDate) {
      if (af.endDate < af.startDate) {
        e["activityFees_0_endDate"] = "End date cannot be before start date.";
      }
    }
    if (af.paymentDate && af.paymentDate > todayString()) {
      e["activityFees_0_paymentDate"] = "Payment date cannot be in the future.";
    }
    if (af.planFee !== "" && Number(af.planFee) < 0) {
      e["activityFees_0_planFee"] = "Plan fee cannot be negative.";
    }
    if (af.discount !== "" && Number(af.discount) < 0) {
      e["activityFees_0_discount"] = "Discount cannot be negative.";
    }
    if (
      af.planFee !== "" && af.discount !== "" &&
      Number(af.discount) > Number(af.planFee) &&
      Number(af.planFee) > 0
    ) {
      e["activityFees_0_discount"] = `Discount (₹${af.discount}) cannot exceed plan fee (₹${af.planFee}).`;
    }

    return e;
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the highlighted errors before saving.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const skip = new Set(["photo", "photoPreview", "enquiryId", "activityFees"]);

      Object.keys(form).forEach((key) => {
        if (skip.has(key)) return;
        let value = form[key];
        if (key === "staff") value = (value && value !== "" && value !== "-") ? value : "";
        if (value !== null && value !== undefined && value !== "") formData.append(key, value);
      });

      const passId = form.activityFees[0]?.feeType?.value;
      if (passId) formData.append("membershipPass", passId);

      if (form.enquiryId) formData.append("enquiryId", form.enquiryId);

      if (form.photo instanceof File) {
        formData.append("profilePhoto", form.photo);
      }

      const serialized = form.activityFees.map((af, index) => ({
        activity:         null,
        feeType:          af.feeType?.value || null,
        plan:             af.plan,
        planFee:          Number(af.planFee)     || 0,
        discount:         Number(af.discount)    || 0,
        finalAmount:      Number(af.finalAmount) || 0,
        paymentStatus:    af.paymentStatus       || "Pending",
        paymentMode:      af.paymentMode         || "",
        paymentDate:      af.paymentDate         || null,
        planNotes:        af.planNotes           || "",
        startDate:        af.startDate,
        endDate:          af.endDate,
        staff:            (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
        slot:             null,
        activityFeeIndex: index,
      }));

      formData.append("activityFees", JSON.stringify(serialized));

      if (isEdit) {
        await api.fitnessMember.update(id, formData);
        toast.success("Pass member updated successfully!");
      } else {
        await api.fitnessMember.create(formData);
        toast.success("Pass member added successfully!");
      }

      setSaved(true);
      setTimeout(() => navigate("/fitness/members"), 1500);

    } catch (err) {
      console.error("Save Error:", err?.response?.data || err);

      const friendlyMsg = resolveApiError(err);

      // If the error is photo-specific, also set it inline on the photo field
      const code = err?.response?.data?.code;
      if (code === "FILE_TOO_LARGE" || code === "INVALID_FILE_TYPE") {
        setErrors((p) => ({ ...p, photo: friendlyMsg }));
      }

      toast.error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800">Pass member {isEdit ? "updated" : "added"} successfully!</p>
          <p className="text-sm text-gray-500">Redirecting to members list…</p>
        </div>
      </div>
    );
  }

  const fieldProps = { form, errors, onChange: handleChange, isView };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isView ? "View Pass Member" : isEdit ? "Edit Pass Member" : "Add Pass Member"}
        </h1>
        <button onClick={() => navigate("/fitness/members")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Back to Members
        </button>
      </div>
        {isView && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col items-center">
            <h2 className="text-base font-bold text-[#1a2a5e] mb-3">
              Member QR Code
            </h2>

            {form.qrCode ? (
              <>
                <img
                  src={form.qrCode}
                  alt="QR Code"
                  className="w-40 h-40 border p-2 rounded-lg bg-white"
                />

                <a
                  href={form.qrCode}
                  download={`qr-${form.userId}.png`}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Download QR
                </a>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                QR not available
              </p>
            )}
          </div>
        )}

      {/* Enquiry selector (add only) */}
      {!isEdit && !isView && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an existing enquiry to auto-fill details
            </label>
            <Select
              options={enquiryOptions} onChange={handleEnquirySelect} value={selectedEnquiry}
              placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
              isClearable isLoading={loadingEnquiries}
              noOptionsMessage={() => "No pending enquiries found"}
              classNamePrefix="react-select"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

        {/* Personal Information */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
              <div
                onClick={() => { if (!isView) fileRef.current.click(); }}
                className={`w-28 h-28 border-2 border-dashed rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden ${
                  errors.photo ? "border-red-400" : "border-gray-300"
                }`}
              >
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-400 mt-1">Photo</p>
                  </div>
                )}
              </div>
              {/* Photo constraints hint */}
              <p className="mt-1 text-[10px] text-gray-400">JPG, PNG, WEBP · max 5 MB</p>
              {errors.photo && <p className="mt-0.5 text-xs text-red-500">{errors.photo}</p>}
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden" onChange={handlePhoto} />
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name"     name="name"   placeholder="Enter full name"  required {...fieldProps} />
              <Field label="Mobile Number" name="mobile" placeholder="10-digit number"  required {...fieldProps} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Email"  name="email"  type="email"  placeholder="email@example.com" {...fieldProps} />
            <Field label="Age"    name="age"    type="number" placeholder="Age"                {...fieldProps} />
            <Field label="Gender" name="gender" options={GENDERS}                              {...fieldProps} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                readOnly={isView} placeholder="Full address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Number of Persons</label>
              <input type="text" name="numberOfPersons" value={form.numberOfPersons}
                onChange={handleChange} readOnly={isView} placeholder="e.g. 2"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.numberOfPersons ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.numberOfPersons && <p className="mt-1 text-xs text-red-500">{errors.numberOfPersons}</p>}
            </div>
          </div>
        </div>

        {/* Membership Pass Details */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-base font-bold text-[#1a2a5e]">Membership Pass Details</h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              overallStatus === "Active"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${overallStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
              Overall: {overallStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Select a <span className="font-medium text-gray-700">Membership Pass</span> — the plan, fee &amp; end date auto-fill.
          </p>

          <PassFeeRow
            entry={passFee}
            passFeeTypeOptions={passFeeTypeOptions}
            staffOptions={staffOptions}
            loadingFeeTypes={loadingFeeTypes}
            loadingStaff={loadingStaff}
            errors={errors}
            onChange={handlePassFeeChange}
            onChangeBatch={handlePassFeeBatchChange}
            isView={isView}
          />

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Total Final Amount</span>
              <span className="font-bold text-[#1a2a5e] text-base">
                ₹{(parseFloat(passFee.finalAmount) || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Login Details */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />
           <div className="flex flex-col gap-1">
  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
    Password
    {!isEdit && <span className="text-red-500 ml-0.5">*</span>}
    {isEdit && (
      <span className="text-xs text-gray-400 ml-2 normal-case">
        (optional for edit)
      </span>
    )}
  </label>

  <input
    type="text"
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder={
      isEdit
        ? "Leave blank to keep current password"
        : "e.g. EMP@1234"
    }
    readOnly={isView}
    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all ${
      errors.password
        ? "border-red-400 bg-red-50"
        : "border-gray-300"
    }`}
  />

  {errors.password && (
    <p className="text-xs text-red-500 mt-0.5">
      {errors.password}
    </p>
  )}
</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button onClick={() => navigate("/fitness/members")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          {!isView && (
            <button onClick={handleSave} disabled={loading}
              className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2">
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Saving..." : isEdit ? "Update Pass Member" : "Save Pass Member"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}








// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { toast } from "sonner";
// import { api } from "../../../services/apiClient";
// import Select from "react-select";

// const PLAN_OPTIONS = [
//   { value: "Annual",  label: "Annual",  feeKey: "annual"  },
//   { value: "Monthly", label: "Monthly", feeKey: "monthly" },
//   { value: "Weekly",  label: "Weekly",  feeKey: "weekly"  },
//   { value: "Daily",   label: "Daily",   feeKey: "daily"   },
//   { value: "Hourly",  label: "Hourly",  feeKey: "hourly"  },
// ];

// const GENDERS          = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES    = ["Cash", "Bank Transfer"];

// const handleSubmit = async () => {
//   if (loading) return; // 🔥 prevent double submit

//   setLoading(true);

//   try {
//     const formData = new FormData();

//     Object.keys(form).forEach(key => {
//       if (key !== "activityFees") {
//         formData.append(key, form[key]);
//       }
//     });

//     const af = form.activityFees[0];

//     formData.append("activityFees", JSON.stringify([{
//       activity: null,
//       feeType: af.feeType?.value,
//       plan: af.plan,
//       planFee: Number(af.planFee),
//       discount: Number(af.discount) || 0,
//       finalAmount: Number(af.planFee) - Number(af.discount || 0),
//       paymentStatus: af.paymentStatus,
//       paymentMode: af.paymentMode,
//       paymentDate: af.paymentDate,
//       startDate: af.startDate,
//       endDate: af.endDate,
//       staff: af.staff || null,
//       planNotes: af.planNotes || ""
//     }]));

//     await api.fitnessMember.create(formData);

//     toast.success("Pass member added successfully");

//     navigate("/fitness/members");

//   } catch (err) {
//     toast.error(err?.response?.data?.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };


// const computeEndDate = (startDate, plan) => {
//   if (!startDate || !plan) return "";
//   const d = new Date(startDate);
//   if (isNaN(d.getTime())) return "";
//   switch (plan) {
//     case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
//     case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
//     case "Weekly":  d.setDate(d.getDate() + 6);          break;
//     case "Daily":   break;
//     case "Hourly":  break;
//     default:        d.setMonth(d.getMonth() + 1);        d.setDate(d.getDate() - 1);
//   }
//   return d.toISOString().split("T")[0];
// };

// const computeActivityStatus = (af) => {
//   if (af.paymentStatus !== "Paid") return "Inactive";
//   if (!af.startDate || !af.endDate) return "Inactive";
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const start = new Date(af.startDate); start.setHours(0, 0, 0, 0);
//   const end   = new Date(af.endDate);   end.setHours(23, 59, 59, 999);
//   return today >= start && today <= end ? "Active" : "Inactive";
// };

// const todayString = () => new Date().toISOString().split("T")[0];

// const emptyPassFee = {
//   feeType:       null,
//   plan:          "Monthly",
//   planFee:       "",
//   discount:      "",
//   finalAmount:   "",
//   paymentStatus: "Paid",
//   paymentMode:   "",
//   paymentDate:   todayString(),
//   planNotes:     "",
//   startDate:     "",
//   endDate:       "",
//   staff:         null,
// };

// const emptyForm = {
//   name:             "",
//   mobile:           "",
//   email:            "",
//   age:              "",
//   gender:           "Male",
//   address:          "",
//   numberOfPersons:  "",
//   photo:            null,
//   photoPreview:     null,
//   membershipStatus: "Active",
//   status:           "Active",
//   startDate:        "",
//   endDate:          "",
//   staff:            "",
//   userId:           "",
//   password:         "",
//   enquiryId:        null,
//   activityFees:     [{ ...emptyPassFee }],
// };

// const formatDateForInput = (v) => {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
// };

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
//   return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
// };

// const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange, isView }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {options ? (
//       <select
//         name={name} value={form[name] || ""} onChange={onChange} disabled={readOnly || isView}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((o) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     ) : (
//       <input
//         type={type} name={name} value={form[name] || ""} onChange={onChange}
//         placeholder={placeholder} readOnly={readOnly || isView}
//         maxLength={name === "mobile" ? 10 : undefined}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       />
//     )}
//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );

// // ── Membership Pass Fee Row ───────────────────────────────────────────────────
// const PassFeeRow = ({
//   entry,
//   passFeeTypeOptions,
//   staffOptions,
//   loadingFeeTypes,
//   loadingStaff,
//   errors,
//   onChange,
//   onChangeBatch,
//   isView
// }) => {
//   const fee      = parseFloat(entry.planFee)  || 0;
//   const disc     = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const isDisabled = isView;

//   const activityStatus = computeActivityStatus(entry);

//   const handleField = (e) => onChange(0, e.target.name, e.target.value);

//   const handlePassChange = (selected) => {
//     if (!selected) {
//       onChangeBatch(0, { feeType: null, plan: "Monthly", planFee: "", finalAmount: "" });
//       return;
//     }
//     const data = selected.data;
//     let detectedPlan = "Monthly";
//     let detectedFee  = "";
//     if (data?.monthly > 0) {
//       detectedPlan = "Monthly"; detectedFee = String(data.monthly);
//     } else if (data?.annual > 0) {
//       detectedPlan = "Annual";  detectedFee = String(data.annual);
//     } else if (data?.weekly > 0) {
//       detectedPlan = "Weekly";  detectedFee = String(data.weekly);
//     } else if (data?.daily > 0) {
//       detectedPlan = "Daily";   detectedFee = String(data.daily);
//     } else if (data?.hourly > 0) {
//       detectedPlan = "Hourly";  detectedFee = String(data.hourly);
//     }
//     const disc   = parseFloat(entry.discount) || 0;
//     const feeNum = parseFloat(detectedFee)    || 0;
//     const final  = feeNum > 0 ? String(Math.max(0, feeNum - disc)) : "";
//     const newEnd = entry.startDate ? computeEndDate(entry.startDate, detectedPlan) : "";

//     const patch = { feeType: selected, plan: detectedPlan, planFee: detectedFee, finalAmount: final };
//     if (newEnd) patch.endDate = newEnd;
//     onChangeBatch(0, patch);
//   };

//   const handlePlanChange = (e) => {
//     const newPlan  = e.target.value;
//     const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
//     const autoFee  = entry.feeType?.data && planMeta ? (entry.feeType.data[planMeta.feeKey] ?? null) : null;
//     const newEnd   = entry.startDate ? computeEndDate(entry.startDate, newPlan) : "";
//     const patch    = { plan: newPlan };
//     if (autoFee !== null) patch.planFee = autoFee !== "" ? String(autoFee) : "";
//     if (newEnd)           patch.endDate = newEnd;
//     onChangeBatch(0, patch);
//   };

//   const handleStartDateChange = (e) => {
//     const newStart = e.target.value;
//     const patch    = { startDate: newStart };
//     if (newStart && entry.plan) {
//       const newEnd = computeEndDate(newStart, entry.plan);
//       if (newEnd) patch.endDate = newEnd;
//     }
//     onChangeBatch(0, patch);
//   };

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {/* Header + status badge */}
//       <div className="flex items-center gap-3 mb-3">
//         <p className="text-xs font-semibold text-[#1a2a5e] uppercase tracking-wide">Pass Details</p>
//         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
//           activityStatus === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
//         }`}>
//           {activityStatus}
//         </span>
//       </div>

//       {/* Membership Pass + Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Membership Pass<span className="text-red-400 ml-0.5">*</span>
//           </label>
//           <Select isDisabled={isDisabled}
//             options={passFeeTypeOptions}
//             value={entry.feeType}
//             onChange={handlePassChange}
//             placeholder={loadingFeeTypes ? "Loading…" : "Select membership pass"}
//             isClearable
//             isLoading={loadingFeeTypes}
//             classNamePrefix="react-select"
//           />
//           {errors["activityFees_0_feeType"] && (
//             <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_feeType"]}</p>
//           )}
//           <p className="mt-0.5 text-[10px] text-gray-400">Auto-fills plan, fee &amp; end date</p>
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan</label>
//           <select disabled={isDisabled}
//             name="plan" value={entry.plan} onChange={handlePlanChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Fees */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
//           <input
//             type="number" name="planFee" value={entry.planFee} onChange={handleField}
//             placeholder="0" min="0"
//             readOnly={isDisabled}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
//           <input
//             type="number" name="discount" value={entry.discount} onChange={handleField}
//             placeholder="0" min="0"
//             readOnly={isDisabled}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
//           <input
//             type="text" value={computed !== "" ? computed : ""} readOnly placeholder="Auto calculated"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Payment */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//           <select disabled={isDisabled}
//             name="paymentMode" value={entry.paymentMode} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             <option value="">Select Mode</option>
//             {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//           <input
//             type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
//             min="1900-01-01" max={todayString()}
//             readOnly={isDisabled}
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_paymentDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//         </div>
//       </div>

//       {/* Dates */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Start Date<span className="text-red-400 ml-0.5">*</span>
//           </label>
//           <input
//             type="date" name="startDate" value={entry.startDate} onChange={handleStartDateChange}
//             min="1900-01-01" max="9999-12-31"
//             readOnly={isDisabled}
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_startDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//           {errors["activityFees_0_startDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_startDate"]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             End Date<span className="text-red-400 ml-0.5">*</span>
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-filled from plan)</span>
//           </label>
//           <input
//             type="date" name="endDate" value={entry.endDate} onChange={handleField}
//             min={entry.startDate || "1900-01-01"} max="9999-12-31"
//             readOnly={isDisabled}
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_endDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//           {errors["activityFees_0_endDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_endDate"]}</p>}
//         </div>
//       </div>

//       {/* Membership Status + Staff */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Membership Status
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-computed)</span>
//           </label>
//           <div className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1.5 ${
//             activityStatus === "Active"
//               ? "bg-green-50 border-green-300 text-green-700"
//               : "bg-gray-100 border-gray-300 text-gray-500"
//           }`}>
//             <span className={`w-2 h-2 rounded-full ${activityStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//             {activityStatus}
//           </div>
//           <p className="mt-0.5 text-[10px] text-gray-400">Active when Paid &amp; within date range</p>

//           {entry.paymentStatus === "Paid" &&
//            entry.startDate &&
//            new Date(entry.startDate) > new Date() && (
//             <p className="mt-2 text-amber-600 text-xs flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
//               <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
//               Membership will become <span className="font-semibold ml-1">Active</span>&nbsp;on{" "}
//               {new Date(entry.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
//           <Select isDisabled={isDisabled}
//             options={staffOptions}
//             value={staffOptions.find((opt) => opt.value === entry.staff) || null}
//             onChange={(sel) => onChange(0, "staff", sel?.value || null)}
//             placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
//             isClearable
//             isLoading={loadingStaff}
//             classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {/* Plan Notes */}
//       <div>
//         <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//         <textarea
//         disabled={isDisabled}
//           name="planNotes" value={entry.planNotes} onChange={handleField} rows={2}
//           placeholder="Any additional notes for this pass…"
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AddPassMember({ viewMode = false }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id }   = useParams();
//   const isEdit = Boolean(id) && !viewMode;
// const isView = viewMode === true;
//   const fileRef  = useRef();

//   const [form, setForm]       = useState(emptyForm);
//   const [errors, setErrors]   = useState({});
//   const [saved, setSaved]     = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [enquiryOptions, setEnquiryOptions]     = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry]   = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);

//   const [staffOptions, setStaffOptions]         = useState([]);
//   const [loadingStaff, setLoadingStaff]         = useState(false);

//   const [feeTypes, setFeeTypes]                 = useState([]);
//   const [passFeeTypeOptions, setPassFeeTypeOptions] = useState([]);
//   const [loadingFeeTypes, setLoadingFeeTypes]   = useState(false);

//   const passFee            = form.activityFees[0];
//   const overallStatus      = computeActivityStatus(passFee);

//   // Load Enquiries
//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoadingEnquiries(true);
//         const res  = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw  = res?.data ?? res;
//         const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
//         setEnquiryOptions(list.map((e) => ({
//           value: e._id,
//           label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
//           data:  e,
//         })));
//       } catch {
//         toast.error("Could not load enquiries.");
//       } finally {
//         setLoadingEnquiries(false);
//       }
//     })();
//   }, [id]);

//   // Load Staff
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingStaff(true);
//         const res = await api.fitnessStaff.getAll({ limit: 200 });
//         const raw = res?.data?.data?.staff || res?.data?.staff || res?.data?.data || res?.data || [];
//         setStaffOptions((Array.isArray(raw) ? raw : []).map((s) => ({
//           value: s._id,
//           label: s.fullName || s.name || "Unnamed Staff",
//         })));
//       } catch {
//         toast.error("Could not load staff list.");
//       } finally {
//         setLoadingStaff(false);
//       }
//     })();
//   }, []);

//   // Load Fee Types — filter to Membership Pass only
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingFeeTypes(true);
//         const res      = await api.fitnessFees.getTypes();
//         const fullList = res?.data || [];
//         setFeeTypes(fullList);
//         const passOnly = fullList.filter((ft) => ft.type === "Membership Pass");
//         setPassFeeTypeOptions(passOnly.map((ft) => ({
//           value: ft._id,
//           label: ft.description,
//           data:  ft,
//         })));
//       } catch {
//         toast.error("Could not load fee types.");
//       } finally {
//         setLoadingFeeTypes(false);
//       }
//     })();
//   }, []);

//   // Prefill from Enquiry (via navigation state)
//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enq = location.state.enquiry;
//       setForm((prev) => ({
//         ...prev,
//         enquiryId: enq._id,
//         name:      enq.fullName || enq.name   || "",
//         mobile:    enq.mobile   || enq.contact || "",
//         email:     enq.email    || "",
//         age:       enq.age      || "",
//         gender:    enq.gender   || "Male",
//         address:   enq.address  || "",
//         staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//       }));
//       setSelectedEnquiry({
//         value: enq._id,
//         label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
//         data:  enq,
//       });
//     }
//   }, [isEdit, location.state]);

//   // Load Member for Edit
//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         const res    = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) return;

//         let activityFees = [{ ...emptyPassFee }];
//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           const af   = member.activityFees[0];
//           const ftId = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
//           const ftData = feeTypes.find((f) => f._id === ftId);
//           activityFees = [{
//             feeType:       ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
//             plan:          af.plan          || "Monthly",
//             planFee:       af.planFee       ?? "",
//             discount:      af.discount      ?? "",
//             finalAmount:   af.finalAmount   ?? "",
//             paymentStatus: af.paymentStatus || "Pending",
//             paymentMode:   af.paymentMode   || "",
//             paymentDate:   formatDateForInput(af.paymentDate) || todayString(),
//             planNotes:     af.planNotes     || "",
//             startDate:     formatDateForInput(af.startDate),
//             endDate:       formatDateForInput(af.endDate),
//             staff:         typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
//           }];
//         }

//         setForm({
//           ...emptyForm,
//           ...member,
//           numberOfPersons: member.numberOfPersons || "",
//           startDate:    formatDateForInput(member.startDate),
//           endDate:      formatDateForInput(member.endDate),
//           photoPreview: member.photo || null,
//           staff:        typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
//           activityFees,
//         });
//       } catch {
//         toast.error("Failed to load member details.");
//       }
//     })();
//   }, [id, isEdit, feeTypes]);

//   // Auto userId
//   useEffect(() => {
//     if (!isEdit && form.mobile) setForm((p) => ({ ...p, userId: form.mobile }));
//   }, [form.mobile, isEdit]);

//   // Auto password
//   useEffect(() => {
//     if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
//   }, [isEdit]);

//   const prefillFromEnquiry = (enq) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enq._id,
//       name:      enq.fullName || enq.name    || "",
//       mobile:    enq.mobile   || enq.contact || "",
//       email:     enq.email    || "",
//       age:       enq.age      || "",
//       gender:    enq.gender   || "Male",
//       address:   enq.address  || "",
//       staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) { prefillFromEnquiry(option.data); toast.success("Enquiry details loaded!"); }
//     else setForm((prev) => ({ ...prev, enquiryId: null }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile")          v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age")             v = value.replace(/\D/g, "").slice(0, 3);
//     if (name === "numberOfPersons") v = value.replace(/\D/g, "").slice(0, 4);
//     setForm((p) => ({ ...p, [name]: v }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
//     reader.readAsDataURL(file);
//   };

//   const handlePassFeeChange = (index, field, value) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], [field]: value };
//       if (field === "planFee" || field === "discount") {
//         const f = parseFloat(field === "planFee"   ? value : updated[index].planFee)  || 0;
//         const d = parseFloat(field === "discount"  ? value : updated[index].discount) || 0;
//         updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
//       }
//       return { ...prev, activityFees: updated };
//     });
//     const errKey = `activityFees_${index}_${field}`;
//     if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
//   };

//   const handlePassFeeBatchChange = (index, patch) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], ...patch };
//       if ("planFee" in patch || "discount" in patch) {
//         const f = parseFloat(updated[index].planFee)  || 0;
//         const d = parseFloat(updated[index].discount) || 0;
//         updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
//       }
//       return { ...prev, activityFees: updated };
//     });
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())   e.name   = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.password?.trim()) e.password = "Password is required.";

//     const af = form.activityFees[0];
//     if (!af.feeType)    e["activityFees_0_feeType"]    = "Membership pass is required.";
//     if (!af.startDate)  e["activityFees_0_startDate"]  = "Start date is required.";
//     if (!af.endDate)    e["activityFees_0_endDate"]    = "End date is required.";
//     if (af.startDate && af.endDate && af.endDate < af.startDate) {
//       e["activityFees_0_endDate"] = "End date cannot be before start date.";
//     }
//     return e;
//   };

//   const handleSave = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       toast.error("Please fix the highlighted errors before saving.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       const skip = new Set(["photo", "photoPreview", "enquiryId", "activityFees"]);

//       Object.keys(form).forEach((key) => {
//         if (skip.has(key)) return;
//         let value = form[key];
//         if (key === "staff") value = (value && value !== "" && value !== "-") ? value : "";
//         if (value !== null && value !== undefined && value !== "") formData.append(key, value);
//       });

//       // Append membershipPass from activityFees[0].feeType
// const passId = form.activityFees[0]?.feeType?.value;
// if (passId) {
//   formData.append("membershipPass", passId);
// }

//       if (form.enquiryId)          formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) {
//         formData.append('profilePhoto', form.photo);
//       }

//       const serialized = form.activityFees.map((af, index) => ({
//         activity:         null,
//         feeType:          af.feeType?.value || null,
//         plan:             af.plan,
//         planFee:          Number(af.planFee)      || 0,
//         discount:         Number(af.discount)     || 0,
//         finalAmount:      Number(af.finalAmount)  || 0,
//         paymentStatus:    af.paymentStatus        || "Pending",
//         paymentMode:      af.paymentMode          || "",
//         paymentDate:      af.paymentDate          || null,
//         planNotes:        af.planNotes            || "",
//         startDate:        af.startDate,
//         endDate:          af.endDate,
//         staff:            (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
//         slot:             null,
//         activityFeeIndex: index,
//       }));

//       formData.append("activityFees", JSON.stringify(serialized));

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Pass member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Pass member added successfully!");
//       }

//       setSaved(true);
//       setTimeout(() => navigate("/fitness/members"), 1500);
//     } catch (err) {
//       console.error("Save Error:", err?.response?.data || err);
//       toast.error(err?.response?.data?.message || err?.message || "Failed to save member.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (saved) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">Pass member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange, isView };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//   {isView ? "View Pass Member" : isEdit ? "Edit Pass Member" : "Add Pass Member"}
// </h1>
//         <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           Back to Members
//         </button>
//       </div>

//       {!isEdit && !isView && (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
//           <div className="max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Choose an existing enquiry to auto-fill details</label>
//             <Select 
//               options={enquiryOptions}
//               onChange={handleEnquirySelect}
//               value={selectedEnquiry}
//               placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
//               isClearable
//               isLoading={loadingEnquiries}
//               noOptionsMessage={() => "No pending enquiries found"}
//               classNamePrefix="react-select"
//             />
//           </div>
//           <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
//         </div>
//       )}

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

//         {/* Personal Information */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
//               <div
//                 onClick={() => {
//   if (!isView) fileRef.current.click();
// }}
//                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
//               >
//                 {form.photoPreview ? (
//                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-center">
//                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mt-1">Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
//             </div>
//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Field label="Full Name"     name="name"   placeholder="Enter full name"    required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number"    required {...fieldProps} />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email"  name="email"  type="email"   placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age"    name="age"    type="number"  placeholder="Age"                {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS}                               {...fieldProps} />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Address</label>
//               <input
//                 type="text" name="address" readOnly={isView} value={form.address} onChange={handleChange}
                
//                 placeholder="Full address"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Number of Persons</label>
//               <input
//                 type="text"
//                 readOnly={isView} name="numberOfPersons" value={form.numberOfPersons} onChange={handleChange}
//                 placeholder="e.g. 2"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.numberOfPersons ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.numberOfPersons && <p className="mt-1 text-xs text-red-500">{errors.numberOfPersons}</p>}
//             </div>
//           </div>
//         </div>

//         {/* Membership Pass Details */}
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <h2 className="text-base font-bold text-[#1a2a5e]">Membership Pass Details</h2>
//             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
//               overallStatus === "Active"
//                 ? "bg-green-50 border-green-300 text-green-700"
//                 : "bg-gray-100 border-gray-300 text-gray-500"
//             }`}>
//               <span className={`w-1.5 h-1.5 rounded-full ${overallStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//               Overall: {overallStatus}
//             </span>
//           </div>
//           <p className="text-xs text-gray-500 mb-4">
//             Select a <span className="font-medium text-gray-700">Membership Pass</span> — the plan, fee &amp; end date auto-fill.
//           </p>

//           <PassFeeRow
//             entry={passFee}
//             passFeeTypeOptions={passFeeTypeOptions}
//             staffOptions={staffOptions}
//             loadingFeeTypes={loadingFeeTypes}
//             loadingStaff={loadingStaff}
//             errors={errors}
//             onChange={handlePassFeeChange}
//             onChangeBatch={handlePassFeeBatchChange}
//             isView={isView}
//           />

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <div className="flex items-center justify-between text-sm">
//               <span className="font-semibold text-gray-700">Total Final Amount</span>
//               <span className="font-bold text-[#1a2a5e] text-base">
//                 ₹{(parseFloat(passFee.finalAmount) || 0).toLocaleString("en-IN")}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Login Details */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Password<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <input
//                 type="text" name="password" value={form.password} onChange={handleChange}
//                 placeholder="e.g. EMP@1234"
//                 readOnly={isView}
//                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
//               />
//               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <button onClick={() => navigate("/fitness/members")} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
//             Cancel
//           </button>
//           {!isView && ( <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
//           >
//             {loading && (
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//               </svg>
//             )}
//             {loading ? "Saving..." : isEdit ? "Update Pass Member" : "Save Pass Member"}
//           </button>)}
//         </div>
//       </div>
//     </div>
//   );
// }








// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { toast } from "sonner";
// import { api } from "../../../services/apiClient";
// import Select from "react-select";

// const PLAN_OPTIONS = [
//   { value: "Annual",  label: "Annual",  feeKey: "annual"  },
//   { value: "Monthly", label: "Monthly", feeKey: "monthly" },
//   { value: "Weekly",  label: "Weekly",  feeKey: "weekly"  },
//   { value: "Daily",   label: "Daily",   feeKey: "daily"   },
//   { value: "Hourly",  label: "Hourly",  feeKey: "hourly"  },
// ];

// const GENDERS          = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES    = ["Cash", "Bank Transfer"];

// const handleSubmit = async () => {
//   if (loading) return; // 🔥 prevent double submit

//   setLoading(true);

//   try {
//     const formData = new FormData();

//     Object.keys(form).forEach(key => {
//       if (key !== "activityFees") {
//         formData.append(key, form[key]);
//       }
//     });

//     const af = form.activityFees[0];

//     formData.append("activityFees", JSON.stringify([{
//       activity: null,
//       feeType: af.feeType?.value,
//       plan: af.plan,
//       planFee: Number(af.planFee),
//       discount: Number(af.discount) || 0,
//       finalAmount: Number(af.planFee) - Number(af.discount || 0),
//       paymentStatus: af.paymentStatus,
//       paymentMode: af.paymentMode,
//       paymentDate: af.paymentDate,
//       startDate: af.startDate,
//       endDate: af.endDate,
//       staff: af.staff || null,
//       planNotes: af.planNotes || ""
//     }]));

//     await api.fitnessMember.create(formData);

//     toast.success("Pass member added successfully");

//     navigate("/fitness/members");

//   } catch (err) {
//     toast.error(err?.response?.data?.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };


// const computeEndDate = (startDate, plan) => {
//   if (!startDate || !plan) return "";
//   const d = new Date(startDate);
//   if (isNaN(d.getTime())) return "";
//   switch (plan) {
//     case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
//     case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
//     case "Weekly":  d.setDate(d.getDate() + 6);          break;
//     case "Daily":   break;
//     case "Hourly":  break;
//     default:        d.setMonth(d.getMonth() + 1);        d.setDate(d.getDate() - 1);
//   }
//   return d.toISOString().split("T")[0];
// };

// const computeActivityStatus = (af) => {
//   if (af.paymentStatus !== "Paid") return "Inactive";
//   if (!af.startDate || !af.endDate) return "Inactive";
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const start = new Date(af.startDate); start.setHours(0, 0, 0, 0);
//   const end   = new Date(af.endDate);   end.setHours(23, 59, 59, 999);
//   return today >= start && today <= end ? "Active" : "Inactive";
// };

// const todayString = () => new Date().toISOString().split("T")[0];

// const emptyPassFee = {
//   feeType:       null,
//   plan:          "Monthly",
//   planFee:       "",
//   discount:      "",
//   finalAmount:   "",
//   paymentStatus: "Paid",
//   paymentMode:   "",
//   paymentDate:   todayString(),
//   planNotes:     "",
//   startDate:     "",
//   endDate:       "",
//   staff:         null,
// };

// const emptyForm = {
//   name:             "",
//   mobile:           "",
//   email:            "",
//   age:              "",
//   gender:           "Male",
//   address:          "",
//   numberOfPersons:  "",
//   photo:            null,
//   photoPreview:     null,
//   membershipStatus: "Active",
//   status:           "Active",
//   startDate:        "",
//   endDate:          "",
//   staff:            "",
//   userId:           "",
//   password:         "",
//   enquiryId:        null,
//   activityFees:     [{ ...emptyPassFee }],
// };

// const formatDateForInput = (v) => {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
// };

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
//   return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
// };

// const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange, isView }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {options ? (
//       <select
//         name={name} value={form[name] || ""} onChange={onChange} disabled={readOnly || isView}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((o) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     ) : (
//       <input
//         type={type} name={name} value={form[name] || ""} onChange={onChange}
//         placeholder={placeholder} readOnly={readOnly || isView}
//         maxLength={name === "mobile" ? 10 : undefined}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       />
//     )}
//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );

// // ── Membership Pass Fee Row ───────────────────────────────────────────────────
// const PassFeeRow = ({
//   entry,
//   passFeeTypeOptions,
//   staffOptions,
//   loadingFeeTypes,
//   loadingStaff,
//   errors,
//   onChange,
//   onChangeBatch,
//   isView
// }) => {
//   const fee      = parseFloat(entry.planFee)  || 0;
//   const disc     = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const isDisabled = isView;

//   const activityStatus = computeActivityStatus(entry);

//   const handleField = (e) => onChange(0, e.target.name, e.target.value);

//   const handlePassChange = (selected) => {
//     if (!selected) {
//       onChangeBatch(0, { feeType: null, plan: "Monthly", planFee: "", finalAmount: "" });
//       return;
//     }
//     const data = selected.data;
//     let detectedPlan = "Monthly";
//     let detectedFee  = "";
//     if (data?.monthly > 0) {
//       detectedPlan = "Monthly"; detectedFee = String(data.monthly);
//     } else if (data?.annual > 0) {
//       detectedPlan = "Annual";  detectedFee = String(data.annual);
//     } else if (data?.weekly > 0) {
//       detectedPlan = "Weekly";  detectedFee = String(data.weekly);
//     } else if (data?.daily > 0) {
//       detectedPlan = "Daily";   detectedFee = String(data.daily);
//     } else if (data?.hourly > 0) {
//       detectedPlan = "Hourly";  detectedFee = String(data.hourly);
//     }
//     const disc   = parseFloat(entry.discount) || 0;
//     const feeNum = parseFloat(detectedFee)    || 0;
//     const final  = feeNum > 0 ? String(Math.max(0, feeNum - disc)) : "";
//     const newEnd = entry.startDate ? computeEndDate(entry.startDate, detectedPlan) : "";

//     const patch = { feeType: selected, plan: detectedPlan, planFee: detectedFee, finalAmount: final };
//     if (newEnd) patch.endDate = newEnd;
//     onChangeBatch(0, patch);
//   };

//   const handlePlanChange = (e) => {
//     const newPlan  = e.target.value;
//     const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
//     const autoFee  = entry.feeType?.data && planMeta ? (entry.feeType.data[planMeta.feeKey] ?? null) : null;
//     const newEnd   = entry.startDate ? computeEndDate(entry.startDate, newPlan) : "";
//     const patch    = { plan: newPlan };
//     if (autoFee !== null) patch.planFee = autoFee !== "" ? String(autoFee) : "";
//     if (newEnd)           patch.endDate = newEnd;
//     onChangeBatch(0, patch);
//   };

//   const handleStartDateChange = (e) => {
//     const newStart = e.target.value;
//     const patch    = { startDate: newStart };
//     if (newStart && entry.plan) {
//       const newEnd = computeEndDate(newStart, entry.plan);
//       if (newEnd) patch.endDate = newEnd;
//     }
//     onChangeBatch(0, patch);
//   };

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {/* Header + status badge */}
//       <div className="flex items-center gap-3 mb-3">
//         <p className="text-xs font-semibold text-[#1a2a5e] uppercase tracking-wide">Pass Details</p>
//         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
//           activityStatus === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
//         }`}>
//           {activityStatus}
//         </span>
//       </div>

//       {/* Membership Pass + Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Membership Pass<span className="text-red-400 ml-0.5">*</span>
//           </label>
//           <Select isDisabled={isDisabled}
//             options={passFeeTypeOptions}
//             value={entry.feeType}
//             onChange={handlePassChange}
//             placeholder={loadingFeeTypes ? "Loading…" : "Select membership pass"}
//             isClearable
//             isLoading={loadingFeeTypes}
//             classNamePrefix="react-select"
//           />
//           {errors["activityFees_0_feeType"] && (
//             <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_feeType"]}</p>
//           )}
//           <p className="mt-0.5 text-[10px] text-gray-400">Auto-fills plan, fee &amp; end date</p>
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan</label>
//           <select isDisabled={isDisabled}
//             name="plan" value={entry.plan} onChange={handlePlanChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Fees */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
//           <input
//             type="number" name="planFee" value={entry.planFee} onChange={handleField}
//             placeholder="0" min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
//           <input
//             type="number" name="discount" value={entry.discount} onChange={handleField}
//             placeholder="0" min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
//           <input
//             type="text" value={computed !== "" ? computed : ""} readOnly placeholder="Auto calculated"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Payment */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//           <select isDisabled={isDisabled}
//             name="paymentMode" value={entry.paymentMode} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             <option value="">Select Mode</option>
//             {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//           <input
//             type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
//             min="1900-01-01" max={todayString()}
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_paymentDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//         </div>
//       </div>

//       {/* Dates */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Start Date<span className="text-red-400 ml-0.5">*</span>
//           </label>
//           <input
//             type="date" name="startDate" value={entry.startDate} onChange={handleStartDateChange}
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_startDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//           {errors["activityFees_0_startDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_startDate"]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             End Date<span className="text-red-400 ml-0.5">*</span>
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-filled from plan)</span>
//           </label>
//           <input
//             type="date" name="endDate" value={entry.endDate} onChange={handleField}
//             min={entry.startDate || "1900-01-01"} max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors["activityFees_0_endDate"] ? "border-red-400" : "border-gray-300"}`}
//           />
//           {errors["activityFees_0_endDate"] && <p className="mt-1 text-xs text-red-500">{errors["activityFees_0_endDate"]}</p>}
//         </div>
//       </div>

//       {/* Membership Status + Staff */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Membership Status
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-computed)</span>
//           </label>
//           <div className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1.5 ${
//             activityStatus === "Active"
//               ? "bg-green-50 border-green-300 text-green-700"
//               : "bg-gray-100 border-gray-300 text-gray-500"
//           }`}>
//             <span className={`w-2 h-2 rounded-full ${activityStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//             {activityStatus}
//           </div>
//           <p className="mt-0.5 text-[10px] text-gray-400">Active when Paid &amp; within date range</p>

//           {entry.paymentStatus === "Paid" &&
//            entry.startDate &&
//            new Date(entry.startDate) > new Date() && (
//             <p className="mt-2 text-amber-600 text-xs flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
//               <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
//               Membership will become <span className="font-semibold ml-1">Active</span>&nbsp;on{" "}
//               {new Date(entry.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
//           <Select isDisabled={isDisabled}
//             options={staffOptions}
//             value={staffOptions.find((opt) => opt.value === entry.staff) || null}
//             onChange={(sel) => onChange(0, "staff", sel?.value || null)}
//             placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
//             isClearable
//             isLoading={loadingStaff}
//             classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {/* Plan Notes */}
//       <div>
//         <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//         <textarea
//         disabled={isDisabled}
//           name="planNotes" value={entry.planNotes} onChange={handleField} rows={2}
//           placeholder="Any additional notes for this pass…"
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AddPassMember({ viewMode = false }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id }   = useParams();
//   const isEdit = Boolean(id) && !viewMode;
// const isView = viewMode === true;
//   const fileRef  = useRef();

//   const [form, setForm]       = useState(emptyForm);
//   const [errors, setErrors]   = useState({});
//   const [saved, setSaved]     = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [enquiryOptions, setEnquiryOptions]     = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry]   = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);

//   const [staffOptions, setStaffOptions]         = useState([]);
//   const [loadingStaff, setLoadingStaff]         = useState(false);

//   const [feeTypes, setFeeTypes]                 = useState([]);
//   const [passFeeTypeOptions, setPassFeeTypeOptions] = useState([]);
//   const [loadingFeeTypes, setLoadingFeeTypes]   = useState(false);

//   const passFee            = form.activityFees[0];
//   const overallStatus      = computeActivityStatus(passFee);

//   // Load Enquiries
//   useEffect(() => {
//     if (isEdit) return;
//     (async () => {
//       try {
//         setLoadingEnquiries(true);
//         const res  = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw  = res?.data ?? res;
//         const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
//         setEnquiryOptions(list.map((e) => ({
//           value: e._id,
//           label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
//           data:  e,
//         })));
//       } catch {
//         toast.error("Could not load enquiries.");
//       } finally {
//         setLoadingEnquiries(false);
//       }
//     })();
//   }, [isEdit]);

//   // Load Staff
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingStaff(true);
//         const res = await api.fitnessStaff.getAll({ limit: 200 });
//         const raw = res?.data?.data?.staff || res?.data?.staff || res?.data?.data || res?.data || [];
//         setStaffOptions((Array.isArray(raw) ? raw : []).map((s) => ({
//           value: s._id,
//           label: s.fullName || s.name || "Unnamed Staff",
//         })));
//       } catch {
//         toast.error("Could not load staff list.");
//       } finally {
//         setLoadingStaff(false);
//       }
//     })();
//   }, []);

//   // Load Fee Types — filter to Membership Pass only
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingFeeTypes(true);
//         const res      = await api.fitnessFees.getTypes();
//         const fullList = res?.data || [];
//         setFeeTypes(fullList);
//         const passOnly = fullList.filter((ft) => ft.type === "Membership Pass");
//         setPassFeeTypeOptions(passOnly.map((ft) => ({
//           value: ft._id,
//           label: ft.description,
//           data:  ft,
//         })));
//       } catch {
//         toast.error("Could not load fee types.");
//       } finally {
//         setLoadingFeeTypes(false);
//       }
//     })();
//   }, []);

//   // Prefill from Enquiry (via navigation state)
//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enq = location.state.enquiry;
//       setForm((prev) => ({
//         ...prev,
//         enquiryId: enq._id,
//         name:      enq.fullName || enq.name   || "",
//         mobile:    enq.mobile   || enq.contact || "",
//         email:     enq.email    || "",
//         age:       enq.age      || "",
//         gender:    enq.gender   || "Male",
//         address:   enq.address  || "",
//         staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//       }));
//       setSelectedEnquiry({
//         value: enq._id,
//         label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
//         data:  enq,
//       });
//     }
//   }, [isEdit, location.state]);

//   // Load Member for Edit
//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       try {
//         const res    = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) return;

//         let activityFees = [{ ...emptyPassFee }];
//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           const af   = member.activityFees[0];
//           const ftId = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
//           const ftData = feeTypes.find((f) => f._id === ftId);
//           activityFees = [{
//             feeType:       ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
//             plan:          af.plan          || "Monthly",
//             planFee:       af.planFee       ?? "",
//             discount:      af.discount      ?? "",
//             finalAmount:   af.finalAmount   ?? "",
//             paymentStatus: af.paymentStatus || "Pending",
//             paymentMode:   af.paymentMode   || "",
//             paymentDate:   formatDateForInput(af.paymentDate) || todayString(),
//             planNotes:     af.planNotes     || "",
//             startDate:     formatDateForInput(af.startDate),
//             endDate:       formatDateForInput(af.endDate),
//             staff:         typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
//           }];
//         }

//         setForm({
//           ...emptyForm,
//           ...member,
//           numberOfPersons: member.numberOfPersons || "",
//           startDate:    formatDateForInput(member.startDate),
//           endDate:      formatDateForInput(member.endDate),
//           photoPreview: member.photo || null,
//           staff:        typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
//           activityFees,
//         });
//       } catch {
//         toast.error("Failed to load member details.");
//       }
//     })();
//   }, [id, isEdit, feeTypes]);

//   // Auto userId
//   useEffect(() => {
//     if (!isEdit && form.mobile) setForm((p) => ({ ...p, userId: form.mobile }));
//   }, [form.mobile, isEdit]);

//   // Auto password
//   useEffect(() => {
//     if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
//   }, [isEdit]);

//   const prefillFromEnquiry = (enq) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enq._id,
//       name:      enq.fullName || enq.name    || "",
//       mobile:    enq.mobile   || enq.contact || "",
//       email:     enq.email    || "",
//       age:       enq.age      || "",
//       gender:    enq.gender   || "Male",
//       address:   enq.address  || "",
//       staff:     typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) { prefillFromEnquiry(option.data); toast.success("Enquiry details loaded!"); }
//     else setForm((prev) => ({ ...prev, enquiryId: null }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile")          v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age")             v = value.replace(/\D/g, "").slice(0, 3);
//     if (name === "numberOfPersons") v = value.replace(/\D/g, "").slice(0, 4);
//     setForm((p) => ({ ...p, [name]: v }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
//     reader.readAsDataURL(file);
//   };

//   const handlePassFeeChange = (index, field, value) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], [field]: value };
//       if (field === "planFee" || field === "discount") {
//         const f = parseFloat(field === "planFee"   ? value : updated[index].planFee)  || 0;
//         const d = parseFloat(field === "discount"  ? value : updated[index].discount) || 0;
//         updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
//       }
//       return { ...prev, activityFees: updated };
//     });
//     const errKey = `activityFees_${index}_${field}`;
//     if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
//   };

//   const handlePassFeeBatchChange = (index, patch) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], ...patch };
//       if ("planFee" in patch || "discount" in patch) {
//         const f = parseFloat(updated[index].planFee)  || 0;
//         const d = parseFloat(updated[index].discount) || 0;
//         updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
//       }
//       return { ...prev, activityFees: updated };
//     });
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())   e.name   = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.password?.trim()) e.password = "Password is required.";

//     const af = form.activityFees[0];
//     if (!af.feeType)    e["activityFees_0_feeType"]    = "Membership pass is required.";
//     if (!af.startDate)  e["activityFees_0_startDate"]  = "Start date is required.";
//     if (!af.endDate)    e["activityFees_0_endDate"]    = "End date is required.";
//     if (af.startDate && af.endDate && af.endDate < af.startDate) {
//       e["activityFees_0_endDate"] = "End date cannot be before start date.";
//     }
//     return e;
//   };

//   const handleSave = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       toast.error("Please fix the highlighted errors before saving.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       const skip = new Set(["photo", "photoPreview", "enquiryId", "activityFees"]);

//       Object.keys(form).forEach((key) => {
//         if (skip.has(key)) return;
//         let value = form[key];
//         if (key === "staff") value = (value && value !== "" && value !== "-") ? value : "";
//         if (value !== null && value !== undefined && value !== "") formData.append(key, value);
//       });

//       // Append membershipPass from activityFees[0].feeType
// const passId = form.activityFees[0]?.feeType?.value;
// if (passId) {
//   formData.append("membershipPass", passId);
// }

//       if (form.enquiryId)          formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       const serialized = form.activityFees.map((af, index) => ({
//         activity:         null,
//         feeType:          af.feeType?.value || null,
//         plan:             af.plan,
//         planFee:          Number(af.planFee)      || 0,
//         discount:         Number(af.discount)     || 0,
//         finalAmount:      Number(af.finalAmount)  || 0,
//         paymentStatus:    af.paymentStatus        || "Pending",
//         paymentMode:      af.paymentMode          || "",
//         paymentDate:      af.paymentDate          || null,
//         planNotes:        af.planNotes            || "",
//         startDate:        af.startDate,
//         endDate:          af.endDate,
//         staff:            (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
//         slot:             null,
//         activityFeeIndex: index,
//       }));

//       formData.append("activityFees", JSON.stringify(serialized));

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Pass member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Pass member added successfully!");
//       }

//       setSaved(true);
//       setTimeout(() => navigate("/fitness/members"), 1500);
//     } catch (err) {
//       console.error("Save Error:", err?.response?.data || err);
//       toast.error(err?.response?.data?.message || err?.message || "Failed to save member.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (saved) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">Pass member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange, isView };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//   {isView ? "View Pass Member" : isEdit ? "Edit Pass Member" : "Add Pass Member"}
// </h1>
//         <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           Back to Members
//         </button>
//       </div>

//       {!isEdit && !isView(
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
//           <div className="max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Choose an existing enquiry to auto-fill details</label>
//             <Select isDisabled={isDisabled}
//               options={enquiryOptions}
//               onChange={handleEnquirySelect}
//               value={selectedEnquiry}
//               placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
//               isClearable
//               isLoading={loadingEnquiries}
//               noOptionsMessage={() => "No pending enquiries found"}
//               classNamePrefix="react-select"
//             />
//           </div>
//           <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
//         </div>
//       )}

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

//         {/* Personal Information */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
//               <div
//                 onClick={() => {
//   if (!isView) fileRef.current.click();
// }}
//                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
//               >
//                 {form.photoPreview ? (
//                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-center">
//                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mt-1">Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
//             </div>
//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Field label="Full Name"     name="name"   placeholder="Enter full name"    required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number"    required {...fieldProps} />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email"  name="email"  type="email"   placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age"    name="age"    type="number"  placeholder="Age"                {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS}                               {...fieldProps} />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Address</label>
//               <input
//                 type="text" name="address" readOnly={isView} value={form.address} onChange={handleChange}
                
//                 placeholder="Full address"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Number of Persons</label>
//               <input
//                 type="text"
//                 readOnly={isView} name="numberOfPersons" value={form.numberOfPersons} onChange={handleChange}
//                 placeholder="e.g. 2"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.numberOfPersons ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.numberOfPersons && <p className="mt-1 text-xs text-red-500">{errors.numberOfPersons}</p>}
//             </div>
//           </div>
//         </div>

//         {/* Membership Pass Details */}
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <h2 className="text-base font-bold text-[#1a2a5e]">Membership Pass Details</h2>
//             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
//               overallStatus === "Active"
//                 ? "bg-green-50 border-green-300 text-green-700"
//                 : "bg-gray-100 border-gray-300 text-gray-500"
//             }`}>
//               <span className={`w-1.5 h-1.5 rounded-full ${overallStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//               Overall: {overallStatus}
//             </span>
//           </div>
//           <p className="text-xs text-gray-500 mb-4">
//             Select a <span className="font-medium text-gray-700">Membership Pass</span> — the plan, fee &amp; end date auto-fill.
//           </p>

//           <PassFeeRow
//             entry={passFee}
//             passFeeTypeOptions={passFeeTypeOptions}
//             staffOptions={staffOptions}
//             loadingFeeTypes={loadingFeeTypes}
//             loadingStaff={loadingStaff}
//             errors={errors}
//             onChange={handlePassFeeChange}
//             onChangeBatch={handlePassFeeBatchChange}
//             isView={isView}
//           />

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <div className="flex items-center justify-between text-sm">
//               <span className="font-semibold text-gray-700">Total Final Amount</span>
//               <span className="font-bold text-[#1a2a5e] text-base">
//                 ₹{(parseFloat(passFee.finalAmount) || 0).toLocaleString("en-IN")}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Login Details */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Password<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <input
//                 type="text" name="password" value={form.password} onChange={handleChange}
//                 placeholder="e.g. EMP@1234"
//                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
//               />
//               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <button onClick={() => navigate("/fitness/members")} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
//             Cancel
//           </button>
//           {!isView && ( <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
//           >
//             {loading && (
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//               </svg>
//             )}
//             {loading ? "Saving..." : isEdit ? "Update Pass Member" : "Save Pass Member"}
//           </button>)}
//         </div>
//       </div>
//     </div>
//   );
// }