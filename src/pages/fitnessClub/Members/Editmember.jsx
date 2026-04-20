// EditMember.jsx — mirrors AddMember's multi-activity structure exactly
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";
import Select from "react-select";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace(/\/api$/, '');

// ── Constants ─────────────────────────────────────────────────────────────────
const PLAN_OPTIONS = [
  { value: "Annual",  label: "Annual",  feeKey: "annual"  },
  { value: "Monthly", label: "Monthly", feeKey: "monthly" },
  { value: "Weekly",  label: "Weekly",  feeKey: "weekly"  },
  { value: "Daily",   label: "Daily",   feeKey: "daily"   },
  { value: "Hourly",  label: "Hourly",  feeKey: "hourly"  },
];

const GENDERS          = ["Male", "Female", "Other"];
const PAYMENT_STATUSES = ["Paid", "Pending"];
const PAYMENT_MODES    = ["Cash", "Bank Transfer"];


const validatePhoto = (file) => {
  if (!file) return null;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG, PNG, WEBP allowed";
  }

  if (file.size > maxSize) {
    return "File size must be less than 5MB";
  }

  return null;
};



// ── Helpers ───────────────────────────────────────────────────────────────────
const computeEndDate = (startDate, plan) => {
  if (!startDate || !plan) return "";
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return "";
  switch (plan) {
    case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
    case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
    case "Weekly":  d.setDate(d.getDate() + 6); break;
    case "Daily":   break;
    case "Hourly":  break;
    default:        d.setMonth(d.getMonth() + 1); d.setDate(d.getDate() - 1);
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

const emptyActivityFee = {
  activity:      null,
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
  slot:          null,
};

const emptyForm = {
  name:         "",
  mobile:       "",
  email:        "",
  age:          "",
  gender:       "Male",
  address:      "",
  photo:        null,
  photoPreview: null,
  userId:       "",
  password:     "",
  activityFees: [{ ...emptyActivityFee }],
};

// ── Generic Field ─────────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange }) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {options ? (
      <select
        name={name} value={form[name] || ""} onChange={onChange} disabled={readOnly}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type} name={name} value={form[name] || ""} onChange={onChange}
        placeholder={placeholder} readOnly={readOnly}
        maxLength={name === "mobile" ? 10 : undefined}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
      />
    )}
    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
  </div>
);

// ── Activity Fee Row ──────────────────────────────────────────────────────────
const ActivityFeeRow = ({
  index, entry,
  activityOptions, feeTypeOptions, staffOptions,
  loadingActivities, loadingFeeTypes, loadingStaff,
  errors, onChange, onChangeBatch, onRemove, canRemove,
  onSlotFetch,
}) => {
  const fee      = parseFloat(entry.planFee)  || 0;
  const disc     = parseFloat(entry.discount) || 0;
  const computed = fee > 0 ? Math.max(0, fee - disc) : "";

  const activityStatus = computeActivityStatus(entry);

  const handleField = (e) => onChange(index, e.target.name, e.target.value);

  const handleFeeTypeChange = (selected) => {
    const planMeta = PLAN_OPTIONS.find((p) => p.value === entry.plan);
    const autoFee  = selected?.data && planMeta ? (selected.data[planMeta.feeKey] ?? "") : "";
    onChangeBatch(index, {
      feeType: selected,
      planFee: autoFee !== "" ? String(autoFee) : "",
    });
  };

  const handlePlanChange = (e) => {
    const newPlan  = e.target.value;
    const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
    const autoFee  = entry.feeType?.data && planMeta ? (entry.feeType.data[planMeta.feeKey] ?? "") : null;
    const newEnd   = entry.startDate ? computeEndDate(entry.startDate, newPlan) : "";
    const patch    = { plan: newPlan };
    if (autoFee !== null) patch.planFee = autoFee !== "" ? String(autoFee) : "";
    if (newEnd)           patch.endDate = newEnd;
    onChangeBatch(index, patch);
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    const patch = { startDate: newStart };
    if (newStart && entry.plan) {
      const newEnd = computeEndDate(newStart, entry.plan);
      if (newEnd) patch.endDate = newEnd;
    }
    onChangeBatch(index, patch);
  };

  useEffect(() => {
    if (entry.activity?.value && entry.startDate && entry.endDate) {
      onSlotFetch(index, entry.activity.value, entry.startDate, entry.endDate);
    }
  }, [entry.activity?.value, entry.startDate, entry.endDate]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
      {canRemove && (
        <button
          type="button" onClick={() => onRemove(index)}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
          title="Remove activity"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-semibold text-[#1a2a5e] uppercase tracking-wide">Activity {index + 1}</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${activityStatus === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
          {activityStatus}
        </span>
      </div>

      {/* Row 1: Activity / Fee Type / Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Activity<span className="text-red-400 ml-0.5">*</span></label>
          <Select
            options={activityOptions} value={entry.activity}
            onChange={(sel) => onChange(index, "activity", sel)}
            placeholder={loadingActivities ? "Loading…" : "Select activity"}
            isClearable isLoading={loadingActivities} classNamePrefix="react-select"
          />
          {errors[`activityFees_${index}_activity`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
          <Select
            options={feeTypeOptions} value={entry.feeType}
            onChange={handleFeeTypeChange}
            placeholder={loadingFeeTypes ? "Loading…" : "Select fee type"}
            isClearable isLoading={loadingFeeTypes} classNamePrefix="react-select"
          />
          <p className="mt-0.5 text-[10px] text-gray-400">Auto-fills fee amount from plan</p>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Plan</label>
          <select name="plan" value={entry.plan} onChange={handlePlanChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Fees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
          <input type="number" name="planFee" value={entry.planFee} onChange={handleField} placeholder="0" min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
          <input type="number" name="discount" value={entry.discount} onChange={handleField} placeholder="0" min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
          <input type="text" value={computed !== "" ? computed : ""} readOnly placeholder="Auto calculated"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none" />
        </div>
      </div>

      {/* Row 3: Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
          <select name="paymentStatus" value={entry.paymentStatus} onChange={handleField}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            <option value="">Select Status</option>
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div> */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
          <select name="paymentMode" value={entry.paymentMode || "Cash"} onChange={handleField}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            <option value="">Select Mode</option>
            {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
          <input type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
            min="1900-01-01" max={todayString()}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`} />
        </div>
      </div>

      {/* Row 4: Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
          <input type="date" name="startDate" value={entry.startDate} onChange={handleStartDateChange}
            min="1900-01-01" max="9999-12-31"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_startDate`] ? "border-red-400" : "border-gray-300"}`} />
          {errors[`activityFees_${index}_startDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_startDate`]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            End Date<span className="text-red-400 ml-0.5">*</span>
            <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-filled from plan)</span>
          </label>
          <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
            min={entry.startDate || "1900-01-01"} max="9999-12-31"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_endDate`] ? "border-red-400" : "border-gray-300"}`} />
          {errors[`activityFees_${index}_endDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_endDate`]}</p>}
        </div>
      </div>

      {/* Slot — all slots shown */}
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Available Slot</label>
        <Select
          options={entry.availableSlots || []} value={entry.slot}
          onChange={(sel) => onChange(index, "slot", sel)}
          placeholder="Select time slot" isClearable
          isOptionDisabled={(opt) => opt.disabled}
          classNamePrefix="react-select"
        />
      </div>

      {/* Membership Status + Staff */}
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
              Membership will become <span className="font-semibold">Active</span> on{" "}
              {new Date(entry.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
          <Select
            options={staffOptions}
            value={staffOptions.find((opt) => opt.value === entry.staff) || null}
            onChange={(sel) => onChange(index, "staff", sel?.value || null)}
            placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
            isClearable isLoading={loadingStaff} classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
        <textarea name="planNotes" value={entry.planNotes} onChange={handleField} rows={2}
          placeholder="Any additional notes for this activity…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditMember() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const fileRef   = useRef();

  const [form, setForm]         = useState(emptyForm);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [staffOptions, setStaffOptions]           = useState([]);
  const [loadingStaff, setLoadingStaff]           = useState(false);
  const [activityOptions, setActivityOptions]     = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [feeTypes, setFeeTypes]                   = useState([]);
  const [feeTypeOptions, setFeeTypeOptions]       = useState([]);
  const [loadingFeeTypes, setLoadingFeeTypes]     = useState(false);
  const [availableSlots, setAvailableSlots]       = useState({});

  const overallMembershipStatus = form.activityFees.some(
    (af) => computeActivityStatus(af) === "Active"
  ) ? "Active" : "Inactive";

const validatePhoto = (file) => {
  if (!file) return null;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG, PNG, WEBP allowed";
  }

  if (file.size > maxSize) {
    return "File size must be less than 5MB";
  }

  return null;
};



  // ── Load dropdowns ────────────────────────────────────────────────────────
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
      } catch { toast.error("Could not load staff list."); }
      finally { setLoadingStaff(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingActivities(true);
        const res = await api.fitnessActivities.getAll();
        const raw = res?.data?.data || res?.data || res || [];
        setActivityOptions((Array.isArray(raw) ? raw : []).map((a) => ({
          value: a._id,
          label: a.name || a.activityName || "Unnamed Activity",
        })));
      } catch { toast.error("Could not load activities."); }
      finally { setLoadingActivities(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingFeeTypes(true);
        const res = await api.fitnessFees.getTypes();
        const fullList = res?.data || [];
        setFeeTypes(fullList);
        setFeeTypeOptions(fullList
          .filter((ft) => ft.type !== "Membership Pass")
          .map((ft) => ({
          value: ft._id,
          label: ft.description,
          data: ft,
        })));
      } catch { toast.error("Could not load fee types."); }
      finally { setLoadingFeeTypes(false); }
    })();
  }, []);

  // ── Load member (waits for feeTypes to be ready) ──────────────────────────
  useEffect(() => {
    if (!id || loadingFeeTypes) return;
    (async () => {
      setLoading(true);
      try {
        const res    = await api.fitnessMember.getById(id);
        const member = res?.data ?? res;
        if (!member) { setNotFound(true); return; }

        let activityFees = [{ ...emptyActivityFee }];

        if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
          activityFees = member.activityFees.map((af) => {
            const ftId   = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
            const ftData = feeTypes.find((f) => f._id === ftId);

            const actId    = typeof af.activity === "object" ? af.activity?._id : af.activity;
            const actLabel = typeof af.activity === "object"
              ? (af.activity?.name || af.activity?.activityName || "")
              : "";

            return {
              _id:           af._id,
              allotmentId:   af.allotmentId || null,
              activity:      actId ? { value: actId, label: actLabel } : null,
              feeType:       ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
              plan:          af.plan || "Monthly",
              planFee:       af.planFee  ?? "",
              discount:      af.discount ?? "",
              finalAmount:   af.finalAmount ?? "",
              paymentStatus: af.paymentStatus || "Pending",
              paymentMode:   af.paymentMode || "",
              paymentDate:   formatDateForInput(af.paymentDate) || todayString(),
              planNotes:     af.planNotes || "",
              startDate:     formatDateForInput(af.startDate),
              endDate:       formatDateForInput(af.endDate),
              staff:         typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
              slot:          af.slot ? { value: af.slot, label: af.slot } : null,
            };
          });
        }

        setForm({
          ...emptyForm,
          name:         member.name         || "",
          mobile:       member.mobile       || "",
          email:        member.email        || "",
          age:          member.age          || "",
          gender:       member.gender       || "Male",
          address:      member.address      || "",
          // photoPreview: member.photo        || null,
          photoPreview: member.photo ? `${BASE_URL}${member.photo}` : null,
          photo:        null,
          userId:       member.userId       || member.mobile || "",
          password:     "",
          activityFees,
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load member details.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, loadingFeeTypes, feeTypes]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
    if (name === "age")    v = value.replace(/\D/g, "").slice(0, 3);
    setForm((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // All slots shown — no membersOnly filter
  const fetchAvailableSlots = async (index, activityId, startDate, endDate) => {
    if (!activityId || !startDate || !endDate) return;
    try {
      const res = await api.fitnessActivities.availability({ activityId, startDate, endDate });
      const availabilityData = res.data?.data || res.data || [];

      const slots = availabilityData.map((s) => ({
        value:    s.slotId,
        label:    `${s.startTime} - ${s.endTime} (${s.fullyAvailableDays}/${s.totalDays} days - ${s.availabilityPercentage}%)`,
        disabled: s.fullyAvailableDays === 0,
      }));

      setAvailableSlots((prev) => ({ ...prev, [index]: slots }));
      setForm((prev) => {
        const current = prev.activityFees[index];
        if (!current.slot && slots.length > 0) {
          const first = slots.find((s) => !s.disabled);
          if (first) {
            const updated = [...prev.activityFees];
            updated[index] = { ...updated[index], slot: first };
            return { ...prev, activityFees: updated };
          }
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to fetch slot availability", err);
      toast.error("Could not load available slots for the selected date range");
    }
  };

  const handleActivityFeeChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.activityFees];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "planFee" || field === "discount") {
        const f = parseFloat(field === "planFee" ? value : updated[index].planFee) || 0;
        const d = parseFloat(field === "discount" ? value : updated[index].discount) || 0;
        updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
      }
      return { ...prev, activityFees: updated };
    });
    const errKey = `activityFees_${index}_${field}`;
    if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
  };

  const handleActivityFeeBatchChange = (index, patch) => {
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

  const addActivityFee = () =>
    setForm((prev) => ({ ...prev, activityFees: [...prev.activityFees, { ...emptyActivityFee }] }));

  const removeActivityFee = (index) => {
    setForm((prev) => ({ ...prev, activityFees: prev.activityFees.filter((_, i) => i !== index) }));
    setAvailableSlots((prev) => { const u = { ...prev }; delete u[index]; return u; });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";

    form.activityFees.forEach((af, i) => {
      if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
      if (!af.startDate) e[`activityFees_${i}_startDate`] = "Start date is required.";
      if (!af.endDate)   e[`activityFees_${i}_endDate`]   = "End date is required.";
      if (af.startDate && af.endDate && af.endDate < af.startDate)
        e[`activityFees_${i}_endDate`] = "End date cannot be before start date.";
    });
    return e;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (errors.photo) {
  toast.error("Fix photo error before saving");
  return;
}
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the highlighted errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      const skip     = new Set(["photo", "photoPreview", "activityFees"]);

      Object.keys(form).forEach((key) => {
        if (skip.has(key)) return;
        let value = form[key];
        if (value !== null && value !== undefined && value !== "")
          formData.append(key, value);
      });

      if (form.photo instanceof File) {
        formData.append('profilePhoto', form.photo);
      }

      const serialized = form.activityFees.map((af, index) => ({
        _id:           af._id        || undefined,
        allotmentId:   af.allotmentId || undefined,
        activity:      af.activity?.value || null,
        feeType:       af.feeType?.value  || null,
        plan:          af.plan,
        planFee:       Number(af.planFee)      || 0,
        discount:      Number(af.discount)     || 0,
        finalAmount:   Number(af.finalAmount)  || 0,
        paymentStatus: af.paymentStatus || "Pending",
        paymentMode:   af.paymentMode  || "",
        paymentDate:   af.paymentDate  || null,
        planNotes:     af.planNotes    || "",
        startDate:     af.startDate,
        endDate:       af.endDate,
        staff:         (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
        slot:          af.slot?.value  || null,
        activityFeeIndex: index,
      }));

      formData.append("activityFees", JSON.stringify(serialized));

      await api.fitnessMember.update(id, formData);
      toast.success("Member updated successfully!");
      setTimeout(() => navigate("/fitness/members"), 1200);
    } catch (err) {
  console.error("Update Error:", err?.response?.data || err);

  const msg =
    err?.response?.data?.message ||
    err?.message ||
    "Failed to update member.";

  const code = err?.response?.data?.code;

  // ✅ FILE ERRORS (most important for your case)
  if (code === "FILE_TOO_LARGE" || code === "INVALID_FILE_TYPE") {
    setErrors((prev) => ({ ...prev, photo: msg }));

    if (fileRef.current) {
      fileRef.current.value = null; // reset file input
    }

    return;
  }

  // ✅ COMMON FIELD ERRORS (basic mapping)
  if (msg.toLowerCase().includes("mobile")) {
    setErrors((prev) => ({ ...prev, mobile: msg }));
    return;
  }

  if (msg.toLowerCase().includes("name")) {
    setErrors((prev) => ({ ...prev, name: msg }));
    return;
  }

  // ✅ FALLBACK
  toast.error(msg);
} finally {
      setSaving(false);
    }
  };

  // ── Loading / not-found states ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading member details…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Member not found.</p>
          <button onClick={() => navigate("/fitness/members")} className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm">
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
        <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Back to Members
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

        {/* Personal Information */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
              <div onClick={() => fileRef.current.click()}
                className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden">
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-400 mt-1">Photo</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
  const file = e.target.files[0];

  const error = validatePhoto(file);
  if (error) {
    setErrors((prev) => ({ ...prev, photo: error }));
    e.target.value = null;
    return;
  }

  setErrors((prev) => ({ ...prev, photo: null }));

  setForm((prev) => ({
    ...prev,
    photo: file,
    photoPreview: URL.createObjectURL(file),
  }));
}} />
{errors.photo && (
  <p className="mt-1 text-xs text-red-500">{errors.photo}</p>
)}
              {form.photoPreview && (
                <button onClick={() => setForm((p) => ({ ...p, photo: null, photoPreview: null }))}
                  className="mt-1 text-xs text-red-500 hover:text-red-600">Remove Photo</button>
              )}
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name"     name="name"   placeholder="Enter full name" required {...fieldProps} />
              <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Email"  name="email"  type="email" placeholder="email@example.com" {...fieldProps} />
            <Field label="Age"    name="age"    type="number" placeholder="Age"              {...fieldProps} />
            <Field label="Gender" name="gender" options={GENDERS}                            {...fieldProps} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Full address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
          </div>
        </div>

        {/* Activities & Fee Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                overallMembershipStatus === "Active"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${overallMembershipStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                Overall: {overallMembershipStatus}
              </span>
            </div>
            <button type="button" onClick={addActivityFee}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Activity
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Select a <span className="font-medium text-gray-700">Fee Type</span> and <span className="font-medium text-gray-700">Plan</span> — the fee amount and end date auto-fill.
          </p>

          <div className="space-y-4">
            {form.activityFees.map((entry, index) => (
              <ActivityFeeRow
                key={entry._id || index}
                index={index}
                entry={{ ...entry, availableSlots: availableSlots[index] }}
                activityOptions={activityOptions}
                feeTypeOptions={feeTypeOptions}
                staffOptions={staffOptions}
                loadingActivities={loadingActivities}
                loadingFeeTypes={loadingFeeTypes}
                loadingStaff={loadingStaff}
                errors={errors}
                onChange={handleActivityFeeChange}
                onChangeBatch={handleActivityFeeBatchChange}
                onRemove={removeActivityFee}
                canRemove={form.activityFees.length > 1}
                onSlotFetch={fetchAvailableSlots}
              />
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">
                Total Final Amount{form.activityFees.length > 1 ? ` (${form.activityFees.length} activities)` : ""}
              </span>
              <span className="font-bold text-[#1a2a5e] text-base">
                ₹{form.activityFees.reduce((sum, af) => sum + (parseFloat(af.finalAmount) || 0), 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Login Details */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User ID (Mobile)" name="userId" readOnly {...fieldProps} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
              <input
                type="text" name="password" value={form.password} onChange={handleChange}
                placeholder="Leave blank to keep current"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button onClick={() => navigate("/fitness/members")} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2">
            {saving && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {saving ? "Updating..." : "Update Member"}
          </button>
        </div>
      </div>
    </div>
  );
}













// _________________ DO NOT Delete ___________
// ____________Members Only Check box ______________



// // EditMember.jsx — mirrors AddMember's multi-activity structure exactly
// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { api } from "../../../services/apiClient";
// import Select from "react-select";

// // ── Constants (identical to AddMember) ───────────────────────────────────────
// const PLAN_OPTIONS = [
//   { value: "Annual",  label: "Annual",  feeKey: "annual"  },
//   { value: "Monthly", label: "Monthly", feeKey: "monthly" },
//   { value: "Weekly",  label: "Weekly",  feeKey: "weekly"  },
//   { value: "Daily",   label: "Daily",   feeKey: "daily"   },
//   { value: "Hourly",  label: "Hourly",  feeKey: "hourly"  },
// ];

// const GENDERS          = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES    = ["Cash", "Cheque", "Online", "UPI"];

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const computeEndDate = (startDate, plan) => {
//   if (!startDate || !plan) return "";
//   const d = new Date(startDate);
//   if (isNaN(d.getTime())) return "";
//   switch (plan) {
//     case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
//     case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
//     case "Weekly":  d.setDate(d.getDate() + 6); break;
//     case "Daily":   break;
//     case "Hourly":  break;
//     default:        d.setMonth(d.getMonth() + 1); d.setDate(d.getDate() - 1);
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

// const formatDateForInput = (v) => {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
// };

// const emptyActivityFee = {
//   activity:      null,
//   feeType:       null,
//   plan:          "Monthly",
//   planFee:       "",
//   discount:      "",
//   finalAmount:   "",
//   paymentStatus: "Pending",
//   paymentMode:   "",
//   paymentDate:   todayString(),
//   planNotes:     "",
//   startDate:     "",
//   endDate:       "",
//   slot:          null,
// };

// const emptyForm = {
//   name:     "",
//   mobile:   "",
//   email:    "",
//   age:      "",
//   gender:   "Male",
//   address:  "",
//   photo:    null,
//   photoPreview: null,
//   userId:   "",
//   password: "",
//   activityFees: [{ ...emptyActivityFee }],
// };

// // ── Generic Field ─────────────────────────────────────────────────────────────
// const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {options ? (
//       <select
//         name={name} value={form[name] || ""} onChange={onChange} disabled={readOnly}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((o) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     ) : (
//       <input
//         type={type} name={name} value={form[name] || ""} onChange={onChange}
//         placeholder={placeholder} readOnly={readOnly}
//         maxLength={name === "mobile" ? 10 : undefined}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       />
//     )}
//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );

// // ── Activity Fee Row ──────────────────────────────────────────────────────────
// const ActivityFeeRow = ({
//   index, entry,
//   activityOptions, feeTypeOptions, staffOptions,
//   loadingActivities, loadingFeeTypes, loadingStaff,
//   errors, onChange, onChangeBatch, onRemove, canRemove,
//   onSlotFetch,
// }) => {
//   const fee      = parseFloat(entry.planFee)  || 0;
//   const disc     = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const activityStatus = computeActivityStatus(entry);

//   const handleField = (e) => onChange(index, e.target.name, e.target.value);

//   const handleFeeTypeChange = (selected) => {
//     const planMeta = PLAN_OPTIONS.find((p) => p.value === entry.plan);
//     const autoFee  = selected?.data && planMeta ? (selected.data[planMeta.feeKey] ?? "") : "";
//     onChangeBatch(index, {
//       feeType: selected,
//       planFee: autoFee !== "" ? String(autoFee) : "",
//     });
//   };

//   const handlePlanChange = (e) => {
//     const newPlan  = e.target.value;
//     const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
//     const autoFee  = entry.feeType?.data && planMeta ? (entry.feeType.data[planMeta.feeKey] ?? "") : null;
//     const newEnd   = entry.startDate ? computeEndDate(entry.startDate, newPlan) : "";
//     const patch    = { plan: newPlan };
//     if (autoFee !== null) patch.planFee = autoFee !== "" ? String(autoFee) : "";
//     if (newEnd)           patch.endDate = newEnd;
//     onChangeBatch(index, patch);
//   };

//   const handleStartDateChange = (e) => {
//     const newStart = e.target.value;
//     const patch = { startDate: newStart };
//     if (newStart && entry.plan) {
//       const newEnd = computeEndDate(newStart, entry.plan);
//       if (newEnd) patch.endDate = newEnd;
//     }
//     onChangeBatch(index, patch);
//   };

//   useEffect(() => {
//     if (entry.activity?.value && entry.startDate && entry.endDate) {
//       onSlotFetch(index, entry.activity.value, entry.startDate, entry.endDate);
//     }
//   }, [entry.activity?.value, entry.startDate, entry.endDate]);

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {canRemove && (
//         <button
//           type="button" onClick={() => onRemove(index)}
//           className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
//           title="Remove activity"
//         >
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}

//       <div className="flex items-center gap-3 mb-3">
//         <p className="text-xs font-semibold text-[#1a2a5e] uppercase tracking-wide">Activity {index + 1}</p>
//         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${activityStatus === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
//           {activityStatus}
//         </span>
//       </div>

//       {/* Row 1: Activity / Fee Type / Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Activity<span className="text-red-400 ml-0.5">*</span></label>
//           <Select
//             options={activityOptions} value={entry.activity}
//             onChange={(sel) => onChange(index, "activity", sel)}
//             placeholder={loadingActivities ? "Loading…" : "Select activity"}
//             isClearable isLoading={loadingActivities} classNamePrefix="react-select"
//           />
//           {errors[`activityFees_${index}_activity`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
//           <Select
//             options={feeTypeOptions} value={entry.feeType}
//             onChange={handleFeeTypeChange}
//             placeholder={loadingFeeTypes ? "Loading…" : "Select fee type"}
//             isClearable isLoading={loadingFeeTypes} classNamePrefix="react-select"
//           />
//           <p className="mt-0.5 text-[10px] text-gray-400">Auto-fills fee amount from plan</p>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan</label>
//           <select name="plan" value={entry.plan} onChange={handlePlanChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
//             {PLAN_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Row 2: Fees */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
//           <input type="number" name="planFee" value={entry.planFee} onChange={handleField} placeholder="0" min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
//           <input type="number" name="discount" value={entry.discount} onChange={handleField} placeholder="0" min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
//           <input type="text" value={computed !== "" ? computed : ""} readOnly placeholder="Auto calculated"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none" />
//         </div>
//       </div>

//       {/* Row 3: Payment */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
//           <select name="paymentStatus" value={entry.paymentStatus} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
//             <option value="">Select Status</option>
//             {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//           <select name="paymentMode" value={entry.paymentMode} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
//             <option value="">Select Mode</option>
//             {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//           <input type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
//             min="1900-01-01" max={todayString()}
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`} />
//         </div>
//       </div>

//       {/* Row 4: Dates */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
//           <input type="date" name="startDate" value={entry.startDate} onChange={handleStartDateChange}
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_startDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_startDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_startDate`]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             End Date<span className="text-red-400 ml-0.5">*</span>
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-filled from plan)</span>
//           </label>
//           <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
//             min={entry.startDate || "1900-01-01"} max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_endDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_endDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_endDate`]}</p>}
//         </div>
//       </div>

//       {/* Slot */}
//       <div className="mb-4">
//         <label className="block text-xs text-gray-600 mb-1">Available Slot</label>
//         <Select
//           options={entry.availableSlots || []} value={entry.slot}
//           onChange={(sel) => onChange(index, "slot", sel)}
//           placeholder="Select time slot" isClearable
//           isOptionDisabled={(opt) => opt.disabled}
//           classNamePrefix="react-select"
//         />
//       </div>

//       {/* Membership Status + Staff */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Membership Status
//             <span className="ml-1 text-[10px] text-gray-400 font-normal">(auto-computed)</span>
//           </label>
//           <div className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1.5 ${
//             activityStatus === "Active" ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-100 border-gray-300 text-gray-500"
//           }`}>
//             <span className={`w-2 h-2 rounded-full ${activityStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//             {activityStatus}
//           </div>
//           <p className="mt-0.5 text-[10px] text-gray-400">Active when Paid &amp; within date range</p>
//           {entry.paymentStatus === "Paid" && entry.startDate && new Date(entry.startDate) > new Date() && (
//             <p className="mt-2 text-amber-600 text-xs flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
//               <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
//               Membership will become <span className="font-semibold">Active</span> on{" "}
//               {new Date(entry.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//             </p>
//           )}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
//           <Select
//             options={staffOptions}
//             value={staffOptions.find((opt) => opt.value === entry.staff) || null}
//             onChange={(sel) => onChange(index, "staff", sel?.value || null)}
//             placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
//             isClearable isLoading={loadingStaff} classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {/* Notes */}
//       <div>
//         <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//         <textarea name="planNotes" value={entry.planNotes} onChange={handleField} rows={2}
//           placeholder="Any additional notes for this activity…"
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function EditMember() {
//   const navigate  = useNavigate();
//   const { id }    = useParams();
//   const fileRef   = useRef();

//   const [form, setForm]         = useState(emptyForm);
//   const [errors, setErrors]     = useState({});
//   const [loading, setLoading]   = useState(true);
//   const [saving, setSaving]     = useState(false);
//   const [notFound, setNotFound] = useState(false);

//   const [staffOptions, setStaffOptions]           = useState([]);
//   const [loadingStaff, setLoadingStaff]           = useState(false);
//   const [activityOptions, setActivityOptions]     = useState([]);
//   const [loadingActivities, setLoadingActivities] = useState(false);
//   const [feeTypes, setFeeTypes]                   = useState([]);
//   const [feeTypeOptions, setFeeTypeOptions]       = useState([]);
//   const [loadingFeeTypes, setLoadingFeeTypes]     = useState(false);
//   const [availableSlots, setAvailableSlots]       = useState({});

//   const overallMembershipStatus = form.activityFees.some(
//     (af) => computeActivityStatus(af) === "Active"
//   ) ? "Active" : "Inactive";

//   // ── Load dropdowns ────────────────────────────────────────────────────────
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
//       } catch { toast.error("Could not load staff list."); }
//       finally { setLoadingStaff(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingActivities(true);
//         const res = await api.fitnessActivities.getAll();
//         const raw = res?.data?.data || res?.data || res || [];
//         setActivityOptions((Array.isArray(raw) ? raw : []).map((a) => ({
//           value: a._id,
//           label: a.name || a.activityName || "Unnamed Activity",
//         })));
//       } catch { toast.error("Could not load activities."); }
//       finally { setLoadingActivities(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingFeeTypes(true);
//         const res = await api.fitnessFees.getTypes();
//         const fullList = res?.data || [];
//         setFeeTypes(fullList);
//         setFeeTypeOptions(fullList.map((ft) => ({
//           value: ft._id,
//           label: ft.description,
//           data: ft,
//         })));
//       } catch { toast.error("Could not load fee types."); }
//       finally { setLoadingFeeTypes(false); }
//     })();
//   }, []);

//   // ── Load member (waits for feeTypes to be ready) ──────────────────────────
//   useEffect(() => {
//     if (!id || loadingFeeTypes) return;           // wait until fee types loaded
//     (async () => {
//       setLoading(true);
//       try {
//         const res    = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) { setNotFound(true); return; }

//         let activityFees = [{ ...emptyActivityFee }];

//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           activityFees = member.activityFees.map((af) => {
//             // feeType may be populated object or bare ID string
//             const ftId   = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
//             const ftData = feeTypes.find((f) => f._id === ftId);

//             // activity may be populated object or bare ID string
//             const actId    = typeof af.activity === "object" ? af.activity?._id : af.activity;
//             const actLabel = typeof af.activity === "object"
//               ? (af.activity?.name || af.activity?.activityName || "")
//               : "";

//             return {
//               _id:           af._id,
//               allotmentId:   af.allotmentId || null,
//               activity:      actId ? { value: actId, label: actLabel } : null,
//               feeType:       ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
//               plan:          af.plan || "Monthly",
//               planFee:       af.planFee  ?? "",
//               discount:      af.discount ?? "",
//               finalAmount:   af.finalAmount ?? "",
//               paymentStatus: af.paymentStatus || "Pending",
//               paymentMode:   af.paymentMode || "",
//               paymentDate:   formatDateForInput(af.paymentDate) || todayString(),
//               planNotes:     af.planNotes || "",
//               startDate:     formatDateForInput(af.startDate),
//               endDate:       formatDateForInput(af.endDate),
//               staff:         typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
//               slot:          af.slot ? { value: af.slot, label: af.slot } : null,
//             };
//           });
//         }

//         setForm({
//           ...emptyForm,
//           name:         member.name         || "",
//           mobile:       member.mobile       || "",
//           email:        member.email        || "",
//           age:          member.age          || "",
//           gender:       member.gender       || "Male",
//           address:      member.address      || "",
//           photoPreview: member.photo        || null,
//           photo:        null,
//           userId:       member.userId       || member.mobile || "",
//           password:     "",
//           activityFees,
//         });
//       } catch (err) {
//         console.error(err);
//         toast.error(err?.response?.data?.message || "Failed to load member details.");
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, loadingFeeTypes, feeTypes]);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age")    v = value.replace(/\D/g, "").slice(0, 3);
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

//   const fetchAvailableSlots = async (index, activityId, startDate, endDate) => {
//     if (!activityId || !startDate || !endDate) return;
//     try {
//       const res = await api.fitnessActivities.availability({ activityId, startDate, endDate });
//       const availabilityData = res.data?.data || res.data || [];
//       const slots = availabilityData
//         .filter((s) => s.membersOnly === true)
//         .map((s) => ({
//           value:    s.slotId,
//           label:    `${s.startTime} - ${s.endTime} (${s.fullyAvailableDays}/${s.totalDays} days - ${s.availabilityPercentage}%)`,
//           disabled: s.fullyAvailableDays === 0,
//         }));
//       setAvailableSlots((prev) => ({ ...prev, [index]: slots }));
//       setForm((prev) => {
//         const current = prev.activityFees[index];
//         if (!current.slot && slots.length > 0) {
//           const first = slots.find((s) => !s.disabled);
//           if (first) {
//             const updated = [...prev.activityFees];
//             updated[index] = { ...updated[index], slot: first };
//             return { ...prev, activityFees: updated };
//           }
//         }
//         return prev;
//       });
//     } catch (err) {
//       console.error("Failed to fetch slot availability", err);
//       toast.error("Could not load available slots for the selected date range");
//     }
//   };

//   const handleActivityFeeChange = (index, field, value) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], [field]: value };
//       if (field === "planFee" || field === "discount") {
//         const f = parseFloat(field === "planFee" ? value : updated[index].planFee) || 0;
//         const d = parseFloat(field === "discount" ? value : updated[index].discount) || 0;
//         updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
//       }
//       return { ...prev, activityFees: updated };
//     });
//     const errKey = `activityFees_${index}_${field}`;
//     if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
//   };

//   const handleActivityFeeBatchChange = (index, patch) => {
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

//   const addActivityFee = () =>
//     setForm((prev) => ({ ...prev, activityFees: [...prev.activityFees, { ...emptyActivityFee }] }));

//   const removeActivityFee = (index) => {
//     setForm((prev) => ({ ...prev, activityFees: prev.activityFees.filter((_, i) => i !== index) }));
//     setAvailableSlots((prev) => { const u = { ...prev }; delete u[index]; return u; });
//   };

//   // ── Validation ────────────────────────────────────────────────────────────
//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";

//     form.activityFees.forEach((af, i) => {
//       if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
//       if (!af.startDate) e[`activityFees_${i}_startDate`] = "Start date is required.";
//       if (!af.endDate)   e[`activityFees_${i}_endDate`]   = "End date is required.";
//       if (af.startDate && af.endDate && af.endDate < af.startDate)
//         e[`activityFees_${i}_endDate`] = "End date cannot be before start date.";
//     });
//     return e;
//   };

//   // ── Save ──────────────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       toast.error("Please fix the highlighted errors before saving.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       const skip     = new Set(["photo", "photoPreview", "activityFees"]);

//       Object.keys(form).forEach((key) => {
//         if (skip.has(key)) return;
//         let value = form[key];
//         if (value !== null && value !== undefined && value !== "")
//           formData.append(key, value);
//       });

//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       const serialized = form.activityFees.map((af, index) => ({
//         _id:           af._id        || undefined,
//         allotmentId:   af.allotmentId || undefined,
//         activity:      af.activity?.value || null,
//         feeType:       af.feeType?.value  || null,
//         plan:          af.plan,
//         planFee:       Number(af.planFee)      || 0,
//         discount:      Number(af.discount)     || 0,
//         finalAmount:   Number(af.finalAmount)  || 0,
//         paymentStatus: af.paymentStatus || "Pending",
//         paymentMode:   af.paymentMode  || "",
//         paymentDate:   af.paymentDate  || null,
//         planNotes:     af.planNotes    || "",
//         startDate:     af.startDate,
//         endDate:       af.endDate,
//         staff:         (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
//         slot:          af.slot?.value  || null,
//         activityFeeIndex: index,
//       }));

//       formData.append("activityFees", JSON.stringify(serialized));

//       await api.fitnessMember.update(id, formData);
//       toast.success("Member updated successfully!");
//       setTimeout(() => navigate("/fitness/members"), 1200);
//     } catch (err) {
//       console.error("Update Error:", err?.response?.data || err);
//       toast.error(err?.response?.data?.message || err?.message || "Failed to update member.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Loading / not-found states ────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-gray-400">
//           <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//           </svg>
//           <p className="text-sm">Loading member details…</p>
//         </div>
//       </div>
//     );
//   }

//   if (notFound) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 mb-4">Member not found.</p>
//           <button onClick={() => navigate("/fitness/members")} className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm">
//             Back to Members
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
//         <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           Back to Members
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

//         {/* Personal Information */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
//               <div onClick={() => fileRef.current.click()}
//                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden">
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
//               {form.photoPreview && (
//                 <button onClick={() => setForm((p) => ({ ...p, photo: null, photoPreview: null }))}
//                   className="mt-1 text-xs text-red-500 hover:text-red-600">Remove Photo</button>
//               )}
//             </div>
//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Field label="Full Name"      name="name"   placeholder="Enter full name"   required {...fieldProps} />
//               <Field label="Mobile Number"  name="mobile" placeholder="10-digit number"   required {...fieldProps} />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email"  name="email"  type="email" placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age"    name="age"    type="number" placeholder="Age"              {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS}                            {...fieldProps} />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Address</label>
//             <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Full address"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]" />
//           </div>
//         </div>

//         {/* Activities & Fee Details */}
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-3">
//               <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
//               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
//                 overallMembershipStatus === "Active"
//                   ? "bg-green-50 border-green-300 text-green-700"
//                   : "bg-gray-100 border-gray-300 text-gray-500"
//               }`}>
//                 <span className={`w-1.5 h-1.5 rounded-full ${overallMembershipStatus === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
//                 Overall: {overallMembershipStatus}
//               </span>
//             </div>
//             <button type="button" onClick={addActivityFee}
//               className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Activity
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mb-4">
//             Select a <span className="font-medium text-gray-700">Fee Type</span> and <span className="font-medium text-gray-700">Plan</span> — the fee amount and end date auto-fill.
//           </p>

//           <div className="space-y-4">
//             {form.activityFees.map((entry, index) => (
//               <ActivityFeeRow
//                 key={entry._id || index}
//                 index={index}
//                 entry={{ ...entry, availableSlots: availableSlots[index] }}
//                 activityOptions={activityOptions}
//                 feeTypeOptions={feeTypeOptions}
//                 staffOptions={staffOptions}
//                 loadingActivities={loadingActivities}
//                 loadingFeeTypes={loadingFeeTypes}
//                 loadingStaff={loadingStaff}
//                 errors={errors}
//                 onChange={handleActivityFeeChange}
//                 onChangeBatch={handleActivityFeeBatchChange}
//                 onRemove={removeActivityFee}
//                 canRemove={form.activityFees.length > 1}
//                 onSlotFetch={fetchAvailableSlots}
//               />
//             ))}
//           </div>

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <div className="flex items-center justify-between text-sm">
//               <span className="font-semibold text-gray-700">
//                 Total Final Amount{form.activityFees.length > 1 ? ` (${form.activityFees.length} activities)` : ""}
//               </span>
//               <span className="font-bold text-[#1a2a5e] text-base">
//                 ₹{form.activityFees.reduce((sum, af) => sum + (parseFloat(af.finalAmount) || 0), 0).toLocaleString("en-IN")}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Login Details */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID (Mobile)" name="userId" readOnly {...fieldProps} />
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
//               <input
//                 type="text" name="password" value={form.password} onChange={handleChange}
//                 placeholder="Leave blank to keep current"
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
//           <button onClick={handleSave} disabled={saving}
//             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2">
//             {saving && (
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//               </svg>
//             )}
//             {saving ? "Updating..." : "Update Member"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }