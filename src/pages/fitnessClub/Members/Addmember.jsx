import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";
import Select from "react-select";

// Plan keys must match AllotFees fieldMap exactly
const PLAN_OPTIONS = [
  { value: "Annual",    label: "Annual",    feeKey: "annual"   },
  { value: "Monthly",   label: "Monthly",   feeKey: "monthly"  },
  { value: "Weekly",    label: "Weekly",    feeKey: "weekly"   },
  { value: "Daily",     label: "Daily",     feeKey: "daily"    },
  { value: "Hourly",    label: "Hourly",    feeKey: "hourly"   },
];

const GENDERS          = ["Male", "Female", "Other"];
const PAYMENT_STATUSES = ["Paid", "Pending"];
const PAYMENT_MODES    = ["Cash", "Cheque", "Online", "UPI"];

const emptyActivityFee = {
  activity:         null,
  feeType:          null,
  plan:             "Monthly",
  planFee:          "",
  discount:         "",
  finalAmount:      "",
  paymentStatus:    "Pending",
  paymentMode:      "",
  paymentDate:      "",
  planNotes:        "",
  startDate:        "",
  endDate:          "",
  membershipStatus: "Active",
  staff:            "",
  slot:             null,
};

const emptyForm = {
  name:             "",
  mobile:           "",
  email:            "",
  age:              "",
  gender:           "Male",
  address:          "",
  photo:            null,
  photoPreview:     null,
  membershipStatus: "Active",
  status:           "Active",
  startDate:        "",
  endDate:          "",
  staff:            "",
  userId:           "",
  password:         "",
  enquiryId:        null,
  activityFees:     [{ ...emptyActivityFee }],
};

const formatDateForInput = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// ── Generic Field Component ───────────────────────────────────────────────
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

// ── Per Activity Row ──────────────────────────────────────────────────────
const ActivityFeeRow = ({
  index, entry,
  activityOptions, feeTypeOptions, staffOptions,
  loadingActivities, loadingFeeTypes, loadingStaff,
  errors, onChange, onRemove, canRemove,
  onSlotFetch,
}) => {
  const fee      = parseFloat(entry.planFee)  || 0;
  const disc     = parseFloat(entry.discount) || 0;
  const computed = fee > 0 ? Math.max(0, fee - disc) : "";

  const handleField = (e) => onChange(index, e.target.name, e.target.value);

  const handleFeeTypeChange = (selected) => {
    onChange(index, "feeType", selected);
    if (selected?.data) {
      const planMeta = PLAN_OPTIONS.find((p) => p.value === entry.plan);
      const autoFee  = planMeta ? (selected.data[planMeta.feeKey] ?? "") : "";
      onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
    } else {
      onChange(index, "planFee", "");
    }
  };

  const handlePlanChange = (e) => {
    const newPlan = e.target.value;
    onChange(index, "plan", newPlan);
    if (entry.feeType?.data) {
      const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
      const autoFee  = planMeta ? (entry.feeType.data[planMeta.feeKey] ?? "") : "";
      onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
    }
  };

  // Trigger slot fetch when activity, startDate, or endDate changes
  useEffect(() => {
    if (entry.activity?.value && entry.startDate && entry.endDate) {
      onSlotFetch(index, entry.activity.value, entry.startDate, entry.endDate);
    }
  }, [entry.activity?.value, entry.startDate, entry.endDate]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
          title="Remove activity"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <p className="text-xs font-semibold text-[#1a2a5e] mb-3 uppercase tracking-wide">
        Activity {index + 1}
      </p>

      {/* Activity, Fee Type, Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Activity<span className="text-red-400 ml-0.5">*</span></label>
          <Select
            options={activityOptions}
            value={entry.activity}
            onChange={(sel) => onChange(index, "activity", sel)}
            placeholder={loadingActivities ? "Loading…" : "Select activity"}
            isClearable isLoading={loadingActivities}
            classNamePrefix="react-select"
          />
          {errors[`activityFees_${index}_activity`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>}
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
          <Select
            options={feeTypeOptions}
            value={entry.feeType}
            onChange={handleFeeTypeChange}
            placeholder={loadingFeeTypes ? "Loading…" : "Select fee type"}
            isClearable isLoading={loadingFeeTypes}
            classNamePrefix="react-select"
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

      {/* Plan Fee, Discount, Final Amount */}
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

      {/* Payment Status, Mode, Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
          <select name="paymentStatus" value={entry.paymentStatus} onChange={handleField}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            <option value="">Select Status</option>
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
          <select name="paymentMode" value={entry.paymentMode} onChange={handleField}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            <option value="">Select Mode</option>
            {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
          <input type="date" name="paymentDate" value={entry.paymentDate} onChange={handleField}
            min="1900-01-01" max="9999-12-31"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`} />
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
          <input type="date" name="startDate" value={entry.startDate} onChange={handleField}
            min="1900-01-01" max="9999-12-31"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_startDate`] ? "border-red-400" : "border-gray-300"}`} />
          {errors[`activityFees_${index}_startDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_startDate`]}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End Date<span className="text-red-400 ml-0.5">*</span></label>
          <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
            min={entry.startDate || "1900-01-01"} max="9999-12-31"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_endDate`] ? "border-red-400" : "border-gray-300"}`} />
          {errors[`activityFees_${index}_endDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_endDate`]}</p>}
        </div>
      </div>

      {/* Available Slots */}
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Available Slot</label>
        <Select
          options={entry.availableSlots || []}
          value={entry.slot}
          onChange={(sel) => onChange(index, "slot", sel)}
          placeholder="Select time slot"
          isClearable
          isOptionDisabled={(opt) => opt.disabled}
          classNamePrefix="react-select"
        />
      </div>

      {/* Membership Status & Responsible Person */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Membership Status</label>
          <select name="membershipStatus" value={entry.membershipStatus} onChange={handleField}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
          <Select
            options={staffOptions}
            value={staffOptions.find((opt) => opt.value === entry.staff) || null}
            onChange={(sel) => onChange(index, "staff", sel?.value || null)}
            placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
            isClearable isLoading={loadingStaff}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Plan Notes */}
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
export default function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const fileRef  = useRef();

  const [form, setForm]     = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const [enquiryOptions, setEnquiryOptions]       = useState([]);
  const [selectedEnquiry, setSelectedEnquiry]     = useState(null);
  const [loadingEnquiries, setLoadingEnquiries]   = useState(false);

  const [staffOptions, setStaffOptions]           = useState([]);
  const [loadingStaff, setLoadingStaff]           = useState(false);

  const [activityOptions, setActivityOptions]     = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [feeTypes, setFeeTypes]             = useState([]);
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  const [loadingFeeTypes, setLoadingFeeTypes] = useState(false);

  const [availableSlots, setAvailableSlots] = useState({});

  // Load Enquiries
  useEffect(() => {
    if (isEdit) return;
    (async () => {
      try {
        setLoadingEnquiries(true);
        const res = await api.fitnessEnquiry.getAll({ limit: 100 });
        const raw = res?.data ?? res;
        const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
        setEnquiryOptions(list.map((e) => ({
          value: e._id,
          label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
          data: e,
        })));
      } catch {
        toast.error("Could not load enquiries.");
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
        toast.error("Could not load staff list.");
      } finally {
        setLoadingStaff(false);
      }
    })();
  }, []);

  // Load Activities
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
      } catch {
        toast.error("Could not load activities.");
      } finally {
        setLoadingActivities(false);
      }
    })();
  }, []);

  // Load Fee Types
  useEffect(() => {
    (async () => {
      try {
        setLoadingFeeTypes(true);
        const res = await api.fitnessFees.getTypes();
        const fullList = res?.data || [];
        setFeeTypes(fullList);
        setFeeTypeOptions(fullList.map((ft) => ({
          value: ft._id,
          label: ft.description,
          data: ft,
        })));
      } catch {
        toast.error("Could not load fee types.");
      } finally {
        setLoadingFeeTypes(false);
      }
    })();
  }, []);

  // Prefill from Enquiry
  useEffect(() => {
    if (!isEdit && location.state?.enquiry) {
      const enq = location.state.enquiry;
      setForm((prev) => ({
        ...prev,
        enquiryId: enq._id,
        name: enq.fullName || enq.name || "",
        mobile: enq.mobile || enq.contact || "",
        email: enq.email || "",
        age: enq.age || "",
        gender: enq.gender || "Male",
        address: enq.address || "",
        staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
      }));
      setSelectedEnquiry({
        value: enq._id,
        label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
        data: enq,
      });
    }
  }, [isEdit, location.state]);

  // Load Member for Edit
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.fitnessMember.getById(id);
        const member = res?.data ?? res;
        if (!member) return;

        let activityFees = [{ ...emptyActivityFee }];
        if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
          activityFees = member.activityFees.map((af) => {
            const ftId = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
            const ftData = feeTypes.find((f) => f._id === ftId);
            return {
              activity: af.activity ? { value: af.activity._id || af.activity, label: af.activity.name || af.activity.activityName || "" } : null,
              feeType: ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
              plan: af.plan || "Monthly",
              planFee: af.planFee ?? "",
              discount: af.discount ?? "",
              finalAmount: af.finalAmount ?? "",
              paymentStatus: af.paymentStatus || "Pending",
              paymentMode: af.paymentMode || "",
              paymentDate: formatDateForInput(af.paymentDate),
              planNotes: af.planNotes || "",
              startDate: formatDateForInput(af.startDate),
              endDate: formatDateForInput(af.endDate),
              membershipStatus: af.membershipStatus || "Active",
              staff: typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
              slot: af.slot ? { value: af.slot, label: af.slot } : null,
            };
          });
        }

        setForm({
          ...emptyForm,
          ...member,
          startDate: formatDateForInput(member.startDate),
          endDate: formatDateForInput(member.endDate),
          photoPreview: member.photo || null,
          staff: typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
          activityFees,
        });
      } catch {
        toast.error("Failed to load member details.");
      }
    })();
  }, [id, isEdit, feeTypes]);

  // Auto userId & password
  useEffect(() => {
    if (!isEdit && form.mobile) setForm((p) => ({ ...p, userId: form.mobile }));
  }, [form.mobile, isEdit]);

  useEffect(() => {
    if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
  }, [isEdit]);

  const prefillFromEnquiry = (enq) => {
    setForm((prev) => ({
      ...prev,
      enquiryId: enq._id,
      name: enq.fullName || enq.name || "",
      mobile: enq.mobile || enq.contact || "",
      email: enq.email || "",
      age: enq.age || "",
      gender: enq.gender || "Male",
      address: enq.address || "",
      staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
    }));
  };

  const handleEnquirySelect = (option) => {
    setSelectedEnquiry(option);
    if (option) {
      prefillFromEnquiry(option.data);
      toast.success("Enquiry details loaded!");
    } else {
      setForm((prev) => ({ ...prev, enquiryId: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
    if (name === "age") v = value.replace(/\D/g, "").slice(0, 3);
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

  const fetchAvailableSlots = async (index, activityId, startDate, endDate) => {
    if (!activityId || !startDate || !endDate) return;

    try {
      const res = await api.fitnessActivities.availability({
        activityId,
        startDate,
        endDate,
      });

      const availabilityData = res.data?.data || res.data || [];

      const slots = availabilityData
        .filter(slotInfo => slotInfo.membersOnly === true)
        .map((slotInfo) => ({
          value: slotInfo.slotId,
          label: `${slotInfo.startTime} - ${slotInfo.endTime} (${slotInfo.fullyAvailableDays}/${slotInfo.totalDays} days - ${slotInfo.availabilityPercentage}%)`,
          disabled: slotInfo.fullyAvailableDays === 0,
        }));

      setAvailableSlots((prev) => ({ ...prev, [index]: slots }));

      setForm((prev) => {
        const current = prev.activityFees[index];
        if (!current.slot && slots.length > 0) {
          const firstAvailable = slots.find((s) => !s.disabled);
          if (firstAvailable) {
            const updated = [...prev.activityFees];
            updated[index] = { ...updated[index], slot: firstAvailable };
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

  const addActivityFee = () => {
    setForm((prev) => ({ ...prev, activityFees: [...prev.activityFees, { ...emptyActivityFee }] }));
  };

  const removeActivityFee = (index) => {
    setForm((prev) => ({ ...prev, activityFees: prev.activityFees.filter((_, i) => i !== index) }));
    setAvailableSlots((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password?.trim()) e.password = "Password is required.";

    form.activityFees.forEach((af, i) => {
      if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
      if (!af.startDate) e[`activityFees_${i}_startDate`] = "Start date is required.";
      if (!af.endDate) e[`activityFees_${i}_endDate`] = "End date is required.";
      if (af.startDate && af.endDate && af.endDate < af.startDate) {
        e[`activityFees_${i}_endDate`] = "End date cannot be before start date.";
      }
      if (af.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(af.paymentDate)) {
        e[`activityFees_${i}_paymentDate`] = "Enter a valid date.";
      }
    });
    return e;
  };

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
        if (key === "staff") {
          value = (value && value !== "" && value !== "-") ? value : "";
        }

        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
      if (form.photo instanceof File) formData.append("photo", form.photo);

      const serialized = form.activityFees.map((af, index) => ({
        activity: af.activity?.value || null,
        feeType: af.feeType?.value || null,
        plan: af.plan,
        planFee: Number(af.planFee) || 0,
        discount: Number(af.discount) || 0,
        finalAmount: Number(af.finalAmount) || 0,
        paymentStatus: af.paymentStatus || "Pending",
        paymentMode: af.paymentMode || "",
        paymentDate: af.paymentDate || null,
        planNotes: af.planNotes || "",
        startDate: af.startDate,
        endDate: af.endDate,
        membershipStatus: af.membershipStatus || "Inactive",
        staff: (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
        slot: af.slot?.value || null,
        activityFeeIndex: index
      }));

      formData.append("activityFees", JSON.stringify(serialized));

      if (isEdit) {
        await api.fitnessMember.update(id, formData);
        toast.success("Member updated successfully!");
      } else {
        await api.fitnessMember.create(formData);
        toast.success("Member added successfully!");
      }

      setSaved(true);
      setTimeout(() => navigate("/fitness/members"), 1500);
    } catch (err) {
      console.error("Save Error:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to save member.");
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
          <p className="text-sm text-gray-500">Redirecting to members list…</p>
        </div>
      </div>
    );
  }

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
        <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Back to Members
        </button>
      </div>

      {!isEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose an existing enquiry to auto-fill details</label>
            <Select
              options={enquiryOptions}
              onChange={handleEnquirySelect}
              value={selectedEnquiry}
              placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
              isClearable
              isLoading={loadingEnquiries}
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
              <div onClick={() => fileRef.current.click()} className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden">
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
              <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
            <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
            <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
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
            <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
            <button type="button" onClick={addActivityFee}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Activity
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Select a <span className="font-medium text-gray-700">Fee Type</span> and <span className="font-medium text-gray-700">Plan</span> — the fee amount auto-fills from your fee catalogue.
          </p>

          <div className="space-y-4">
            {form.activityFees.map((entry, index) => (
              <ActivityFeeRow
                key={index}
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
            <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text" name="password" value={form.password} onChange={handleChange}
                placeholder="e.g. EMP@1234"
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
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
          </button>
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

// // Plan keys must match AllotFees fieldMap exactly
// const PLAN_OPTIONS = [
//   { value: "Monthly",     label: "Monthly",     feeKey: "monthly"    },
//   { value: "Quarterly",   label: "Quarterly",   feeKey: "quarterly"  },
//   { value: "Half Yearly", label: "Half Yearly", feeKey: "halfYearly" },
//   { value: "Yearly",      label: "Yearly",      feeKey: "annual"     },
// ];

// const GENDERS          = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES    = ["Cash", "Cheque", "Online", "UPI"];

// const emptyActivityFee = {
//   activity:         null,
//   feeType:          null,
//   plan:             "Monthly",
//   planFee:          "",
//   discount:         "",
//   finalAmount:      "",
//   paymentStatus:    "Pending",
//   paymentMode:      "",
//   paymentDate:      "",
//   planNotes:        "",
//   startDate:        "",
//   endDate:          "",
//   membershipStatus: "Active",
//   staff:            "",
//   slot:             null,
// };

// const emptyForm = {
//   name:             "",
//   mobile:           "",
//   email:            "",
//   age:              "",
//   gender:           "Male",
//   address:          "",
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
//   activityFees:     [{ ...emptyActivityFee }],
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

// // ── Generic Field Component ───────────────────────────────────────────────
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

// // ── Per Activity Row ──────────────────────────────────────────────────────
// const ActivityFeeRow = ({
//   index, entry,
//   activityOptions, feeTypeOptions, staffOptions,
//   loadingActivities, loadingFeeTypes, loadingStaff,
//   errors, onChange, onRemove, canRemove,
//   onSlotFetch,
// }) => {
//   const fee      = parseFloat(entry.planFee)  || 0;
//   const disc     = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const handleField = (e) => onChange(index, e.target.name, e.target.value);

//   const handleFeeTypeChange = (selected) => {
//     onChange(index, "feeType", selected);
//     if (selected?.data) {
//       const planMeta = PLAN_OPTIONS.find((p) => p.value === entry.plan);
//       const autoFee  = planMeta ? (selected.data[planMeta.feeKey] ?? "") : "";
//       onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
//     } else {
//       onChange(index, "planFee", "");
//     }
//   };

//   const handlePlanChange = (e) => {
//     const newPlan = e.target.value;
//     onChange(index, "plan", newPlan);
//     if (entry.feeType?.data) {
//       const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
//       const autoFee  = planMeta ? (entry.feeType.data[planMeta.feeKey] ?? "") : "";
//       onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
//     }
//   };

//   // Trigger slot fetch when activity, startDate, or endDate changes
//   useEffect(() => {
//     if (entry.activity?.value && entry.startDate && entry.endDate) {
//       onSlotFetch(index, entry.activity.value, entry.startDate, entry.endDate);
//     }
//   }, [entry.activity?.value, entry.startDate, entry.endDate]);

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {canRemove && (
//         <button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
//           title="Remove activity"
//         >
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}

//       <p className="text-xs font-semibold text-[#1a2a5e] mb-3 uppercase tracking-wide">
//         Activity {index + 1}
//       </p>

//       {/* Activity, Fee Type, Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Activity<span className="text-red-400 ml-0.5">*</span></label>
//           <Select
//             options={activityOptions}
//             value={entry.activity}
//             onChange={(sel) => onChange(index, "activity", sel)}
//             placeholder={loadingActivities ? "Loading…" : "Select activity"}
//             isClearable isLoading={loadingActivities}
//             classNamePrefix="react-select"
//           />
//           {errors[`activityFees_${index}_activity`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>}
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
//           <Select
//             options={feeTypeOptions}
//             value={entry.feeType}
//             onChange={handleFeeTypeChange}
//             placeholder={loadingFeeTypes ? "Loading…" : "Select fee type"}
//             isClearable isLoading={loadingFeeTypes}
//             classNamePrefix="react-select"
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

//       {/* Plan Fee, Discount, Final Amount */}
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

//       {/* Payment Status, Mode, Date */}
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
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`} />
//         </div>
//       </div>

//       {/* Start Date & End Date */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
//           <input type="date" name="startDate" value={entry.startDate} onChange={handleField}
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_startDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_startDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_startDate`]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">End Date<span className="text-red-400 ml-0.5">*</span></label>
//           <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
//             min={entry.startDate || "1900-01-01"} max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_endDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_endDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_endDate`]}</p>}
//         </div>
//       </div>

//       {/* Available Slots */}
//       <div className="mb-4">
//         <label className="block text-xs text-gray-600 mb-1">Available Slot</label>
//         <Select
//           options={entry.availableSlots || []}
//           value={entry.slot}
//           onChange={(sel) => onChange(index, "slot", sel)}
//           placeholder="Select time slot"
//           isClearable
//           isOptionDisabled={(opt) => opt.disabled}
//           classNamePrefix="react-select"
//         />
//       </div>

//       {/* Membership Status & Responsible Person */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Membership Status</label>
//           <select name="membershipStatus" value={entry.membershipStatus} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
//           <Select
//             options={staffOptions}
//             value={staffOptions.find((opt) => opt.value === entry.staff) || null}
//             onChange={(sel) => onChange(index, "staff", sel?.value || null)}
//             placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
//             isClearable isLoading={loadingStaff}
//             classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {/* Plan Notes */}
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
// export default function AddMember() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id }   = useParams();
//   const isEdit   = Boolean(id);
//   const fileRef  = useRef();

//   const [form, setForm]     = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved]   = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [enquiryOptions, setEnquiryOptions]       = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry]     = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries]   = useState(false);

//   const [staffOptions, setStaffOptions]           = useState([]);
//   const [loadingStaff, setLoadingStaff]           = useState(false);

//   const [activityOptions, setActivityOptions]     = useState([]);
//   const [loadingActivities, setLoadingActivities] = useState(false);

//   const [feeTypes, setFeeTypes]             = useState([]);
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [loadingFeeTypes, setLoadingFeeTypes] = useState(false);

//   const [availableSlots, setAvailableSlots] = useState({});

//   // Load Enquiries
//   useEffect(() => {
//     if (isEdit) return;
//     (async () => {
//       try {
//         setLoadingEnquiries(true);
//         const res = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw = res?.data ?? res;
//         const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
//         setEnquiryOptions(list.map((e) => ({
//           value: e._id,
//           label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
//           data: e,
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

//   // Load Activities
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
//       } catch {
//         toast.error("Could not load activities.");
//       } finally {
//         setLoadingActivities(false);
//       }
//     })();
//   }, []);

//   // Load Fee Types
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
//       } catch {
//         toast.error("Could not load fee types.");
//       } finally {
//         setLoadingFeeTypes(false);
//       }
//     })();
//   }, []);

//   // Prefill from Enquiry
//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enq = location.state.enquiry;
//       setForm((prev) => ({
//         ...prev,
//         enquiryId: enq._id,
//         name: enq.fullName || enq.name || "",
//         mobile: enq.mobile || enq.contact || "",
//         email: enq.email || "",
//         age: enq.age || "",
//         gender: enq.gender || "Male",
//         address: enq.address || "",
//         staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//       }));
//       setSelectedEnquiry({
//         value: enq._id,
//         label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
//         data: enq,
//       });
//     }
//   }, [isEdit, location.state]);

//   // Load Member for Edit
//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       try {
//         const res = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) return;

//         let activityFees = [{ ...emptyActivityFee }];
//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           activityFees = member.activityFees.map((af) => {
//             const ftId = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
//             const ftData = feeTypes.find((f) => f._id === ftId);
//             return {
//               activity: af.activity ? { value: af.activity._id || af.activity, label: af.activity.name || af.activity.activityName || "" } : null,
//               feeType: ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
//               plan: af.plan || "Monthly",
//               planFee: af.planFee ?? "",
//               discount: af.discount ?? "",
//               finalAmount: af.finalAmount ?? "",
//               paymentStatus: af.paymentStatus || "Pending",
//               paymentMode: af.paymentMode || "",
//               paymentDate: formatDateForInput(af.paymentDate),
//               planNotes: af.planNotes || "",
//               startDate: formatDateForInput(af.startDate),
//               endDate: formatDateForInput(af.endDate),
//               membershipStatus: af.membershipStatus || "Active",
//               staff: typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
//               slot: af.slot ? { value: af.slot, label: af.slot } : null,
//             };
//           });
//         }

//         setForm({
//           ...emptyForm,
//           ...member,
//           startDate: formatDateForInput(member.startDate),
//           endDate: formatDateForInput(member.endDate),
//           photoPreview: member.photo || null,
//           staff: typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
//           activityFees,
//         });
//       } catch {
//         toast.error("Failed to load member details.");
//       }
//     })();
//   }, [id, isEdit, feeTypes]);

//   // Auto userId & password
//   useEffect(() => {
//     if (!isEdit && form.mobile) setForm((p) => ({ ...p, userId: form.mobile }));
//   }, [form.mobile, isEdit]);

//   useEffect(() => {
//     if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
//   }, [isEdit]);

//   const prefillFromEnquiry = (enq) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enq._id,
//       name: enq.fullName || enq.name || "",
//       mobile: enq.mobile || enq.contact || "",
//       email: enq.email || "",
//       age: enq.age || "",
//       gender: enq.gender || "Male",
//       address: enq.address || "",
//       staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) {
//       prefillFromEnquiry(option.data);
//       toast.success("Enquiry details loaded!");
//     } else {
//       setForm((prev) => ({ ...prev, enquiryId: null }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age") v = value.replace(/\D/g, "").slice(0, 3);
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

//   // ── Updated fetchAvailableSlots to work with new backend (date range) ──
//   const fetchAvailableSlots = async (index, activityId, startDate, endDate) => {
//     if (!activityId || !startDate || !endDate) return;

//     try {
//       const res = await api.fitnessActivities.availability({
//         activityId,
//         startDate,
//         endDate,
//       });

//       const availabilityData = res.data?.data || res.data || [];

//       const slots = availabilityData
//         .filter(slotInfo => slotInfo.membersOnly === true)   // ✅ Only Members Only slots
//         .map((slotInfo) => ({
//           value: slotInfo.slotId,
//           label: `${slotInfo.startTime} - ${slotInfo.endTime} (${slotInfo.fullyAvailableDays}/${slotInfo.totalDays} days - ${slotInfo.availabilityPercentage}%)`,
//           disabled: slotInfo.fullyAvailableDays === 0,
//         }));

//       setAvailableSlots((prev) => ({ ...prev, [index]: slots }));

//       // Auto-select first available members-only slot
//       setForm((prev) => {
//         const current = prev.activityFees[index];
//         if (!current.slot && slots.length > 0) {
//           const firstAvailable = slots.find((s) => !s.disabled);
//           if (firstAvailable) {
//             const updated = [...prev.activityFees];
//             updated[index] = { ...updated[index], slot: firstAvailable };
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

//   const addActivityFee = () => {
//     setForm((prev) => ({ ...prev, activityFees: [...prev.activityFees, { ...emptyActivityFee }] }));
//   };

//   const removeActivityFee = (index) => {
//     setForm((prev) => ({ ...prev, activityFees: prev.activityFees.filter((_, i) => i !== index) }));
//     setAvailableSlots((prev) => {
//       const updated = { ...prev };
//       delete updated[index];
//       return updated;
//     });
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.password?.trim()) e.password = "Password is required.";

//     form.activityFees.forEach((af, i) => {
//       if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
//       if (!af.startDate) e[`activityFees_${i}_startDate`] = "Start date is required.";
//       if (!af.endDate) e[`activityFees_${i}_endDate`] = "End date is required.";
//       if (af.startDate && af.endDate && af.endDate < af.startDate) {
//         e[`activityFees_${i}_endDate`] = "End date cannot be before start date.";
//       }
//       if (af.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(af.paymentDate)) {
//         e[`activityFees_${i}_paymentDate`] = "Enter a valid date.";
//       }
//     });
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
//         if (key === "staff") {
//           value = (value && value !== "" && value !== "-") ? value : "";
//         }

//         if (value !== null && value !== undefined && value !== "") {
//           formData.append(key, value);
//         }
//       });

//       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       // ✅ Improved serialization for backend
//       const serialized = form.activityFees.map((af, index) => ({
//         activity: af.activity?.value || null,
//         feeType: af.feeType?.value || null,
//         plan: af.plan,
//         planFee: Number(af.planFee) || 0,
//         discount: Number(af.discount) || 0,
//         finalAmount: Number(af.finalAmount) || 0,
//         paymentStatus: af.paymentStatus || "Pending",
//         paymentMode: af.paymentMode || "",
//         paymentDate: af.paymentDate || null,
//         planNotes: af.planNotes || "",
//         startDate: af.startDate,
//         endDate: af.endDate,
//         membershipStatus: af.membershipStatus || "Inactive",
//         staff: (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
//         slot: af.slot?.value || null,
//         activityFeeIndex: index   // ✅ Important for booking linking
//       }));

//       formData.append("activityFees", JSON.stringify(serialized));

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Member added successfully!");
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
//           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
//         <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           Back to Members
//         </button>
//       </div>

//       {!isEdit && (
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
//               <div onClick={() => fileRef.current.click()} className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden">
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
//               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
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
//             <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
//             <button type="button" onClick={addActivityFee}
//               className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Activity
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mb-4">
//             Select a <span className="font-medium text-gray-700">Fee Type</span> and <span className="font-medium text-gray-700">Plan</span> — the fee amount auto-fills from your fee catalogue.
//           </p>

//           <div className="space-y-4">
//             {form.activityFees.map((entry, index) => (
//               <ActivityFeeRow
//                 key={index}
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
//           <button
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
//             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
//           </button>
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

// // Plan keys must match AllotFees fieldMap exactly
// const PLAN_OPTIONS = [
//   { value: "Monthly",     label: "Monthly",     feeKey: "monthly"    },
//   { value: "Quarterly",   label: "Quarterly",   feeKey: "quarterly"  },
//   { value: "Half Yearly", label: "Half Yearly", feeKey: "halfYearly" },
//   { value: "Yearly",      label: "Yearly",      feeKey: "annual"     },
// ];

// const GENDERS          = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES    = ["Cash", "Cheque", "Online", "UPI"];

// const emptyActivityFee = {
//   activity:         null,
//   feeType:          null,
//   plan:             "Monthly",
//   planFee:          "",
//   discount:         "",
//   finalAmount:      "",
//   paymentStatus:    "Pending",
//   paymentMode:      "",
//   paymentDate:      "",
//   planNotes:        "",
//   startDate:        "",
//   endDate:          "",
//   membershipStatus: "Active",
//   staff:            "",
//   slot:             null,
// };

// const emptyForm = {
//   name:             "",
//   mobile:           "",
//   email:            "",
//   age:              "",
//   gender:           "Male",
//   address:          "",
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
//   activityFees:     [{ ...emptyActivityFee }],
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

// // ── Generic Field Component ───────────────────────────────────────────────
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

// // ── Per Activity Row ──────────────────────────────────────────────────────
// const ActivityFeeRow = ({
//   index, entry,
//   activityOptions, feeTypeOptions, staffOptions,
//   loadingActivities, loadingFeeTypes, loadingStaff,
//   errors, onChange, onRemove, canRemove,
//   onSlotFetch, // ← added
// }) => {
//   const fee      = parseFloat(entry.planFee)  || 0;
//   const disc     = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const handleField = (e) => onChange(index, e.target.name, e.target.value);

//   const handleFeeTypeChange = (selected) => {
//     onChange(index, "feeType", selected);
//     if (selected?.data) {
//       const planMeta = PLAN_OPTIONS.find((p) => p.value === entry.plan);
//       const autoFee  = planMeta ? (selected.data[planMeta.feeKey] ?? "") : "";
//       onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
//     } else {
//       onChange(index, "planFee", "");
//     }
//   };

//   const handlePlanChange = (e) => {
//     const newPlan = e.target.value;
//     onChange(index, "plan", newPlan);
//     if (entry.feeType?.data) {
//       const planMeta = PLAN_OPTIONS.find((p) => p.value === newPlan);
//       const autoFee  = planMeta ? (entry.feeType.data[planMeta.feeKey] ?? "") : "";
//       onChange(index, "planFee", autoFee !== "" ? String(autoFee) : "");
//     }
//   };

//   // ── FIX: trigger slot fetch whenever activity, startDate, or endDate changes ──
//   useEffect(() => {
//     if (entry.activity?.value && entry.startDate && entry.endDate) {
//       onSlotFetch(index, entry.activity.value, entry.startDate, entry.endDate);
//     }
//   }, [entry.activity?.value, entry.startDate, entry.endDate]);

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {canRemove && (
//         <button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
//           title="Remove activity"
//         >
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}

//       <p className="text-xs font-semibold text-[#1a2a5e] mb-3 uppercase tracking-wide">
//         Activity {index + 1}
//       </p>

//       {/* Activity, Fee Type, Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Activity<span className="text-red-400 ml-0.5">*</span></label>
//           <Select
//             options={activityOptions}
//             value={entry.activity}
//             onChange={(sel) => onChange(index, "activity", sel)}
//             placeholder={loadingActivities ? "Loading…" : "Select activity"}
//             isClearable isLoading={loadingActivities}
//             classNamePrefix="react-select"
//           />
//           {errors[`activityFees_${index}_activity`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>}
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
//           <Select
//             options={feeTypeOptions}
//             value={entry.feeType}
//             onChange={handleFeeTypeChange}
//             placeholder={loadingFeeTypes ? "Loading…" : "Select fee type"}
//             isClearable isLoading={loadingFeeTypes}
//             classNamePrefix="react-select"
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

//       {/* Plan Fee, Discount, Final Amount */}
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

//       {/* Payment Status, Mode, Date */}
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
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`} />
//         </div>
//       </div>

//       {/* Start Date & End Date */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Start Date<span className="text-red-400 ml-0.5">*</span></label>
//           <input type="date" name="startDate" value={entry.startDate} onChange={handleField}
//             min="1900-01-01" max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_startDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_startDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_startDate`]}</p>}
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">End Date<span className="text-red-400 ml-0.5">*</span></label>
//           <input type="date" name="endDate" value={entry.endDate} onChange={handleField}
//             min={entry.startDate || "1900-01-01"} max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_endDate`] ? "border-red-400" : "border-gray-300"}`} />
//           {errors[`activityFees_${index}_endDate`] && <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_endDate`]}</p>}
//         </div>
//       </div>

//       {/* Available Slots */}
//       <div className="mb-4">
//         <label className="block text-xs text-gray-600 mb-1">Available Slot</label>
//         <Select
//           options={entry.availableSlots || []}
//           value={entry.slot}
//           onChange={(sel) => onChange(index, "slot", sel)}
//           placeholder="Select time slot"
//           isClearable
//           isOptionDisabled={(opt) => opt.disabled}
//           classNamePrefix="react-select"
//         />
//       </div>

//       {/* Membership Status & Responsible Person */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Membership Status</label>
//           <select name="membershipStatus" value={entry.membershipStatus} onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Responsible Person</label>
//           <Select
//             options={staffOptions}
//             value={staffOptions.find((opt) => opt.value === entry.staff) || null}
//             onChange={(sel) => onChange(index, "staff", sel?.value || null)}
//             placeholder={loadingStaff ? "Loading..." : "Select Responsible Staff"}
//             isClearable isLoading={loadingStaff}
//             classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {/* Plan Notes */}
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
// export default function AddMember() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id }   = useParams();
//   const isEdit   = Boolean(id);
//   const fileRef  = useRef();

//   const [form, setForm]     = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved]   = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [enquiryOptions, setEnquiryOptions]       = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry]     = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries]   = useState(false);

//   const [staffOptions, setStaffOptions]           = useState([]);
//   const [loadingStaff, setLoadingStaff]           = useState(false);

//   const [activityOptions, setActivityOptions]     = useState([]);
//   const [loadingActivities, setLoadingActivities] = useState(false);

//   const [feeTypes, setFeeTypes]             = useState([]);
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [loadingFeeTypes, setLoadingFeeTypes] = useState(false);

//   const [availableSlots, setAvailableSlots] = useState({});

//   // Load Enquiries
//   useEffect(() => {
//     if (isEdit) return;
//     (async () => {
//       try {
//         setLoadingEnquiries(true);
//         const res = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw = res?.data ?? res;
//         const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
//         setEnquiryOptions(list.map((e) => ({
//           value: e._id,
//           label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
//           data: e,
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

//   // Load Activities
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
//       } catch {
//         toast.error("Could not load activities.");
//       } finally {
//         setLoadingActivities(false);
//       }
//     })();
//   }, []);

//   // Load Fee Types
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
//       } catch {
//         toast.error("Could not load fee types.");
//       } finally {
//         setLoadingFeeTypes(false);
//       }
//     })();
//   }, []);

//   // Prefill from Enquiry
//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enq = location.state.enquiry;
//       setForm((prev) => ({
//         ...prev,
//         enquiryId: enq._id,
//         name: enq.fullName || enq.name || "",
//         mobile: enq.mobile || enq.contact || "",
//         email: enq.email || "",
//         age: enq.age || "",
//         gender: enq.gender || "Male",
//         address: enq.address || "",
//         staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//       }));
//       setSelectedEnquiry({
//         value: enq._id,
//         label: `${enq.enquiryId || "ENQ"} - ${enq.fullName} (${enq.mobile})`,
//         data: enq,
//       });
//     }
//   }, [isEdit, location.state]);

//   // Load Member for Edit
//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       try {
//         const res = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) return;

//         let activityFees = [{ ...emptyActivityFee }];
//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           activityFees = member.activityFees.map((af) => {
//             const ftId = typeof af.feeType === "object" ? af.feeType?._id : af.feeType;
//             const ftData = feeTypes.find((f) => f._id === ftId);
//             return {
//               activity: af.activity ? { value: af.activity._id || af.activity, label: af.activity.name || af.activity.activityName || "" } : null,
//               feeType: ftData ? { value: ftData._id, label: ftData.description, data: ftData } : null,
//               plan: af.plan || "Monthly",
//               planFee: af.planFee ?? "",
//               discount: af.discount ?? "",
//               finalAmount: af.finalAmount ?? "",
//               paymentStatus: af.paymentStatus || "Pending",
//               paymentMode: af.paymentMode || "",
//               paymentDate: formatDateForInput(af.paymentDate),
//               planNotes: af.planNotes || "",
//               startDate: formatDateForInput(af.startDate),
//               endDate: formatDateForInput(af.endDate),
//               membershipStatus: af.membershipStatus || "Active",
//               staff: typeof af.staff === "object" ? af.staff?._id || "" : af.staff || "",
//               slot: af.slot ? { value: af.slot, label: af.slot } : null,
//             };
//           });
//         }

//         setForm({
//           ...emptyForm,
//           ...member,
//           startDate: formatDateForInput(member.startDate),
//           endDate: formatDateForInput(member.endDate),
//           photoPreview: member.photo || null,
//           staff: typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
//           activityFees,
//         });
//       } catch {
//         toast.error("Failed to load member details.");
//       }
//     })();
//   }, [id, isEdit, feeTypes]);

//   // Auto userId & password
//   useEffect(() => {
//     if (!isEdit && form.mobile) setForm((p) => ({ ...p, userId: form.mobile }));
//   }, [form.mobile, isEdit]);

//   useEffect(() => {
//     if (!isEdit) setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
//   }, [isEdit]);

//   const prefillFromEnquiry = (enq) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enq._id,
//       name: enq.fullName || enq.name || "",
//       mobile: enq.mobile || enq.contact || "",
//       email: enq.email || "",
//       age: enq.age || "",
//       gender: enq.gender || "Male",
//       address: enq.address || "",
//       staff: typeof enq.responsibleStaff === "object" ? enq.responsibleStaff?._id || "" : enq.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) {
//       prefillFromEnquiry(option.data);
//       toast.success("Enquiry details loaded!");
//     } else {
//       setForm((prev) => ({ ...prev, enquiryId: null }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age") v = value.replace(/\D/g, "").slice(0, 3);
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

//   // ── FIX: use functional setForm for auto-select to avoid stale closure ──
//   const fetchAvailableSlots = async (index, activityId, startDate, endDate) => {
//     if (!activityId || !startDate || !endDate) return;

//     try {
//       const res = await api.fitnessActivities.availability({
//         activityId,
//         startDate,
//         endDate,
//       });

//       const slots = (res.data?.slots || res.data || []).map((slot) => ({
//         value: slot.id || slot.time,
//         label: `${slot.time} (${slot.available ? "Available" : "Booked"})`,
//         disabled: !slot.available,
//       }));

//       setAvailableSlots((prev) => ({ ...prev, [index]: slots }));

//       // Auto-select first available slot using functional update to avoid stale closure
//       setForm((prev) => {
//         const current = prev.activityFees[index];
//         if (!current.slot && slots.length > 0) {
//           const firstAvailable = slots.find((s) => !s.disabled);
//           if (firstAvailable) {
//             const updated = [...prev.activityFees];
//             updated[index] = { ...updated[index], slot: firstAvailable };
//             return { ...prev, activityFees: updated };
//           }
//         }
//         return prev;
//       });
//     } catch (err) {
//       console.error("Failed to fetch slots", err);
//       toast.error("Could not load available slots");
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

//   const addActivityFee = () => {
//     setForm((prev) => ({ ...prev, activityFees: [...prev.activityFees, { ...emptyActivityFee }] }));
//   };

//   const removeActivityFee = (index) => {
//     setForm((prev) => ({ ...prev, activityFees: prev.activityFees.filter((_, i) => i !== index) }));
//     setAvailableSlots((prev) => {
//       const updated = { ...prev };
//       delete updated[index];
//       return updated;
//     });
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.password?.trim()) e.password = "Password is required.";

//     form.activityFees.forEach((af, i) => {
//       if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
//       if (!af.startDate) e[`activityFees_${i}_startDate`] = "Start date is required.";
//       if (!af.endDate) e[`activityFees_${i}_endDate`] = "End date is required.";
//       if (af.startDate && af.endDate && af.endDate < af.startDate) {
//         e[`activityFees_${i}_endDate`] = "End date cannot be before start date.";
//       }
//       if (af.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(af.paymentDate)) {
//         e[`activityFees_${i}_paymentDate`] = "Enter a valid date.";
//       }
//     });
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

//         // Safe handling for top-level staff
//         if (key === "staff") {
//           value = (value && value !== "" && value !== "-") ? value : "";
//         }

//         if (value !== null && value !== undefined && value !== "") {
//           formData.append(key, value);
//         }
//       });

//       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       const serialized = form.activityFees.map((af) => ({
//         activity: af.activity?.value || null,
//         feeType: af.feeType?.value || null,
//         plan: af.plan,
//         planFee: af.planFee || 0,
//         discount: af.discount || 0,
//         finalAmount: af.finalAmount || 0,
//         paymentStatus: af.paymentStatus || "Pending",
//         paymentMode: af.paymentMode || "",
//         paymentDate: af.paymentDate || null,
//         planNotes: af.planNotes || "",
//         startDate: af.startDate,
//         endDate: af.endDate,
//         membershipStatus: af.membershipStatus || "Inactive",
//         staff: (af.staff && af.staff !== "" && af.staff !== "-") ? af.staff : null,
//         slot: af.slot?.value || af.slot || null,
//       }));

//       formData.append("activityFees", JSON.stringify(serialized));

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Member added successfully!");
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
//           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
//         <button onClick={() => navigate("/fitness/members")} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           Back to Members
//         </button>
//       </div>

//       {!isEdit && (
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
//               <div onClick={() => fileRef.current.click()} className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden">
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
//               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
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
//             <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
//             <button type="button" onClick={addActivityFee}
//               className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Activity
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mb-4">
//             Select a <span className="font-medium text-gray-700">Fee Type</span> and <span className="font-medium text-gray-700">Plan</span> — the fee amount auto-fills from your fee catalogue.
//           </p>

//           <div className="space-y-4">
//             {form.activityFees.map((entry, index) => (
//               <ActivityFeeRow
//                 key={index}
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
//           <button
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
//             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
//           </button>
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

// const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const GENDERS = ["Male", "Female", "Other"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES = ["Cash", "Cheque", "Online", "UPI"];

// const emptyActivityFee = {
//   activity: null,       // { value, label }
//   plan: "Monthly",
//   planFee: "",
//   discount: "",
//   finalAmount: "",
//   paymentStatus: "Pending",
//   paymentMode: "",
//   paymentDate: "",
//   planNotes: "",
// };

// const emptyForm = {
//   name: "",
//   mobile: "",
//   email: "",
//   age: "",
//   gender: "Male",
//   address: "",
//   photo: null,
//   photoPreview: null,
//   membershipStatus: "Active",
//   status: "Active",
//   startDate: "",
//   endDate: "",
//   staff: "",
//   userId: "",
//   password: "",
//   enquiryId: null,
//   activityFees: [{ ...emptyActivityFee }],
// };

// const formatDateForInput = (dateValue) => {
//   if (!dateValue) return "";
//   const d = new Date(dateValue);
//   if (isNaN(d.getTime())) return "";
//   return d.toISOString().split("T")[0];
// };

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
//   let password = "";
//   for (let i = 0; i < 8; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// };

// const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}
//       {required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {options ? (
//       <select
//         name={name}
//         value={form[name] || ""}
//         onChange={onChange}
//         disabled={readOnly}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((o) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     ) : (
//       <input
//         type={type}
//         name={name}
//         value={form[name] || ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         readOnly={readOnly}
//         maxLength={name === "mobile" ? 10 : undefined}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//       />
//     )}
//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );

// // ── Per-activity fee row ──────────────────────────────────────────────────────
// const ActivityFeeRow = ({ index, entry, activityOptions, loadingActivities, errors, onChange, onRemove, canRemove }) => {
//   const fee = parseFloat(entry.planFee) || 0;
//   const disc = parseFloat(entry.discount) || 0;
//   const computed = fee > 0 ? Math.max(0, fee - disc) : "";

//   const handleField = (e) => onChange(index, e.target.name, e.target.value);

//   return (
//     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
//       {canRemove && (
//         <button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
//           title="Remove activity"
//         >
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}

//       <p className="text-xs font-semibold text-[#1a2a5e] mb-3 uppercase tracking-wide">
//         Activity {index + 1}
//       </p>

//       {/* Row 1: Activity + Plan */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">
//             Activity<span className="text-red-400 ml-0.5">*</span>
//           </label>
//           <Select
//             options={activityOptions}
//             value={entry.activity}
//             onChange={(selected) => onChange(index, "activity", selected)}
//             placeholder={loadingActivities ? "Loading activities..." : "Select activity"}
//             isClearable
//             isLoading={loadingActivities}
//             classNamePrefix="react-select"
//           />
//           {errors[`activityFees_${index}_activity`] && (
//             <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_activity`]}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan</label>
//           <select
//             name="plan"
//             value={entry.plan}
//             onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Row 2: Fee + Discount + Final */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
//           <input
//             type="number"
//             name="planFee"
//             value={entry.planFee}
//             onChange={handleField}
//             placeholder="0"
//             min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
//           <input
//             type="number"
//             name="discount"
//             value={entry.discount}
//             onChange={handleField}
//             placeholder="0"
//             min="0"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Final Amount (₹)</label>
//           <input
//             type="text"
//             value={computed !== "" ? computed : ""}
//             readOnly
//             placeholder="Auto calculated"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Row 3: Payment Status + Mode + Date */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
//           <select
//             name="paymentStatus"
//             value={entry.paymentStatus}
//             onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             <option value="">Select Status</option>
//             {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//           <select
//             name="paymentMode"
//             value={entry.paymentMode}
//             onChange={handleField}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//           >
//             <option value="">Select Mode</option>
//             {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//           <input
//             type="date"
//             name="paymentDate"
//             value={entry.paymentDate}
//             onChange={handleField}
//             min="1900-01-01"
//             max="9999-12-31"
//             className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors[`activityFees_${index}_paymentDate`] ? "border-red-400" : "border-gray-300"}`}
//           />
//           {errors[`activityFees_${index}_paymentDate`] && (
//             <p className="mt-1 text-xs text-red-500">{errors[`activityFees_${index}_paymentDate`]}</p>
//           )}
//         </div>
//       </div>

//       {/* Row 4: Notes */}
//       <div>
//         <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//         <textarea
//           name="planNotes"
//           value={entry.planNotes}
//           onChange={handleField}
//           rows={2}
//           placeholder="Any additional notes for this activity..."
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AddMember() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const fileRef = useRef();

//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [enquiryOptions, setEnquiryOptions] = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);

//   const [staffOptions, setStaffOptions] = useState([]);
//   const [loadingStaff, setLoadingStaff] = useState(false);

//   const [activityOptions, setActivityOptions] = useState([]);
//   const [loadingActivities, setLoadingActivities] = useState(false);

//   // ── Prefill from navigation state ────────────────────────────────────────
//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enquiry = location.state.enquiry;
//       prefillFromEnquiry(enquiry);
//       setSelectedEnquiry({
//         value: enquiry._id,
//         label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
//         data: enquiry,
//       });
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Load Enquiries ────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (isEdit) return;
//     const load = async () => {
//       try {
//         setLoadingEnquiries(true);
//         const res = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw = res?.data ?? res;
//         const list = (Array.isArray(raw) ? raw : []).filter((e) => e.status !== "Admitted");
//         setEnquiryOptions(list.map((e) => ({
//           value: e._id,
//           label: `${e.enquiryId || "ENQ"} - ${e.fullName} (${e.mobile})`,
//           data: e,
//         })));
//       } catch {
//         toast.error("Could not load enquiries. You can still fill the form manually.");
//       } finally {
//         setLoadingEnquiries(false);
//       }
//     };
//     load();
//   }, [isEdit]);

//   // ── Load Staff ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoadingStaff(true);
//         const res = await api.fitnessStaff.getAll({ limit: 200 });
//         const raw =
//           res?.data?.data?.staff || res?.data?.staff || res?.data?.data || res?.data || [];
//         const list = Array.isArray(raw) ? raw : [];
//         setStaffOptions(list.map((s) => ({
//           value: s._id,
//           label: s.fullName || s.name || "Unnamed Staff",
//         })));
//       } catch {
//         toast.error("Could not load responsible staff list.");
//       } finally {
//         setLoadingStaff(false);
//       }
//     };
//     load();
//   }, []);

//   // ── Load Activities ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoadingActivities(true);
//         const res = await api.fitnessActivities.getAll();
//         const raw = res?.data?.data || res?.data || res || [];
//         const list = Array.isArray(raw) ? raw : [];
//         setActivityOptions(list.map((a) => ({
//           value: a._id,
//           label: a.name || a.activityName || "Unnamed Activity",
//         })));
//       } catch {
//         toast.error("Could not load activities.");
//       } finally {
//         setLoadingActivities(false);
//       }
//     };
//     load();
//   }, []);

//   // ── Load member for edit ──────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isEdit) return;
//     const fetch = async () => {
//       try {
//         const res = await api.fitnessMember.getById(id);
//         const member = res?.data ?? res;
//         if (!member) return;

//         // Reconstruct activityFees array
//         let activityFees = [{ ...emptyActivityFee }];
//         if (Array.isArray(member.activityFees) && member.activityFees.length > 0) {
//           activityFees = member.activityFees.map((af) => ({
//             activity: af.activity
//               ? { value: af.activity._id || af.activity, label: af.activity.name || af.activity.activityName || "" }
//               : null,
//             plan: af.plan || "Monthly",
//             planFee: af.planFee || "",
//             discount: af.discount || "",
//             finalAmount: af.finalAmount || "",
//             paymentStatus: af.paymentStatus || "Pending",
//             paymentMode: af.paymentMode || "",
//             paymentDate: formatDateForInput(af.paymentDate),
//             planNotes: af.planNotes || "",
//           }));
//         }

//         setForm({
//           ...emptyForm,
//           ...member,
//           startDate: formatDateForInput(member.startDate),
//           endDate: formatDateForInput(member.endDate),
//           photoPreview: member.photo || null,
//           staff:
//             typeof member.staff === "object" ? member.staff?._id || "" : member.staff || "",
//           activityFees,
//         });
//       } catch {
//         toast.error("Failed to load member details.");
//       }
//     };
//     fetch();
//   }, [id, isEdit]);

//   // ── Auto userId from mobile ───────────────────────────────────────────────
//   useEffect(() => {
//     if (!isEdit && form.mobile) {
//       setForm((p) => ({ ...p, userId: form.mobile }));
//     }
//   }, [form.mobile, isEdit]);

//   // ── Auto generate password ────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isEdit) {
//       setForm((prev) => prev.password ? prev : { ...prev, password: generatePassword() });
//     }
//   }, [isEdit]);

//   // ── Auto membershipStatus from dates ─────────────────────────────────────
//   useEffect(() => {
//     if (!form.startDate || !form.endDate) return;
//     const today = new Date().toISOString().split("T")[0];
//     const status = today >= form.startDate && today <= form.endDate ? "Active" : "Inactive";
//     setForm((prev) => ({ ...prev, membershipStatus: status, status }));
//   }, [form.startDate, form.endDate]);

//   // ── Enquiry helpers ───────────────────────────────────────────────────────
//   const prefillFromEnquiry = (enquiry) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enquiry._id,
//       name: enquiry.fullName || enquiry.name || "",
//       mobile: enquiry.mobile || enquiry.contact || "",
//       email: enquiry.email || "",
//       age: enquiry.age || "",
//       gender: enquiry.gender || "Male",
//       address: enquiry.address || "",
//       staff:
//         typeof enquiry.responsibleStaff === "object"
//           ? enquiry.responsibleStaff?._id || ""
//           : enquiry.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) {
//       prefillFromEnquiry(option.data);
//       toast.success("Enquiry details loaded successfully!");
//     } else {
//       setForm((prev) => ({ ...prev, enquiryId: null }));
//     }
//   };

//   // ── Form handlers ─────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let v = value;
//     if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);
//     if (name === "age") v = value.replace(/\D/g, "").slice(0, 3);
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

//   // ── Activity fee handlers ─────────────────────────────────────────────────
//   const handleActivityFeeChange = (index, field, value) => {
//     setForm((prev) => {
//       const updated = [...prev.activityFees];
//       updated[index] = { ...updated[index], [field]: value };

//       // Recompute finalAmount whenever planFee or discount changes
//       if (field === "planFee" || field === "discount") {
//         const fee = parseFloat(field === "planFee" ? value : updated[index].planFee) || 0;
//         const disc = parseFloat(field === "discount" ? value : updated[index].discount) || 0;
//         updated[index].finalAmount = fee > 0 ? String(Math.max(0, fee - disc)) : "";
//       }

//       return { ...prev, activityFees: updated };
//     });

//     // Clear related error
//     const errKey = `activityFees_${index}_${field}`;
//     if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
//   };

//   const addActivityFee = () => {
//     setForm((prev) => ({
//       ...prev,
//       activityFees: [...prev.activityFees, { ...emptyActivityFee }],
//     }));
//   };

//   const removeActivityFee = (index) => {
//     setForm((prev) => ({
//       ...prev,
//       activityFees: prev.activityFees.filter((_, i) => i !== index),
//     }));
//   };

//   // ── Validation ────────────────────────────────────────────────────────────
//   const validate = () => {
//     const e = {};

//     if (!form.name.trim()) e.name = "Full name is required.";
//     if (!form.mobile.trim()) {
//       e.mobile = "Mobile number is required.";
//     } else if (!/^\d{10}$/.test(form.mobile)) {
//       e.mobile = "Enter a valid 10-digit mobile.";
//     }
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.startDate) e.startDate = "Start date is required.";
//     if (!form.endDate) e.endDate = "End date is required.";
//     if (form.startDate && form.endDate && form.endDate < form.startDate)
//       e.endDate = "End date cannot be before start date.";
//     if (!form.password?.trim()) e.password = "Password is required.";

//     // Validate each activity fee row
//     form.activityFees.forEach((af, i) => {
//       if (!af.activity) e[`activityFees_${i}_activity`] = "Activity is required.";
//       if (af.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(af.paymentDate))
//         e[`activityFees_${i}_paymentDate`] = "Enter a valid date.";
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

//     setLoading(true);
//     try {
//       const formData = new FormData();

//       // Append scalar fields
//       const skip = new Set(["photo", "photoPreview", "enquiryId", "activityFees"]);
//       Object.keys(form).forEach((key) => {
//         if (skip.has(key)) return;
//         if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
//           formData.append(key, form[key]);
//         }
//       });

//       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       // Serialize activityFees as JSON string
//       const serialized = form.activityFees.map((af) => ({
//         activity: af.activity?.value || null,
//         plan: af.plan,
//         planFee: af.planFee,
//         discount: af.discount,
//         finalAmount: af.finalAmount,
//         paymentStatus: af.paymentStatus,
//         paymentMode: af.paymentMode,
//         paymentDate: af.paymentDate,
//         planNotes: af.planNotes,
//       }));
//       formData.append("activityFees", JSON.stringify(serialized));

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Member added successfully!");
//       }

//       setSaved(true);
//       setTimeout(() => navigate("/fitness/members"), 1500);
//     } catch (err) {
//       const message = err?.response?.data?.message || err?.message || "Failed to save member. Please try again.";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Success screen ────────────────────────────────────────────────────────
//   if (saved) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
//         <button
//           onClick={() => navigate("/fitness/members")}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           Back to Members
//         </button>
//       </div>

//       {/* Enquiry selector */}
//       {!isEdit && (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
//           <div className="max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Choose an existing enquiry to auto-fill details
//             </label>
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

//         {/* ── Personal Information ── */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             {/* Photo */}
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
//               <div
//                 onClick={() => fileRef.current.click()}
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
//               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Full address"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         {/* ── Membership ── */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Membership Status" name="membershipStatus" readOnly {...fieldProps} />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {/* Start Date */}
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">
//                 Start Date<span className="text-red-400 ml-0.5">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={form.startDate || ""}
//                 onChange={handleChange}
//                 min="1900-01-01"
//                 max="9999-12-31"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.startDate ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
//             </div>

//             {/* End Date */}
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">
//                 End Date<span className="text-red-400 ml-0.5">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={form.endDate || ""}
//                 onChange={handleChange}
//                 min={form.startDate || ""}
//                 max="9999-12-31"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.endDate ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
//             </div>

//             {/* Responsible Staff */}
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Responsible Staff</label>
//               <Select
//                 options={staffOptions}
//                 value={staffOptions.find((opt) => opt.value === form.staff) || null}
//                 onChange={(selected) => setForm((prev) => ({ ...prev, staff: selected?.value || "" }))}
//                 placeholder={loadingStaff ? "Loading staff..." : "Select Responsible Staff"}
//                 isClearable
//                 isLoading={loadingStaff}
//                 classNamePrefix="react-select"
//               />
//               {errors.staff && <p className="mt-1 text-xs text-red-500">{errors.staff}</p>}
//             </div>
//           </div>
//         </div>

//         {/* ── Activities & Fees ── */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-base font-bold text-[#1a2a5e]">Activities &amp; Fee Details</h2>
//             <button
//               type="button"
//               onClick={addActivityFee}
//               className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2a5e] hover:bg-[#152147] text-white text-sm font-semibold rounded-lg transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Activity
//             </button>
//           </div>

//           <div className="space-y-4">
//             {form.activityFees.map((entry, index) => (
//               <ActivityFeeRow
//                 key={index}
//                 index={index}
//                 entry={entry}
//                 activityOptions={activityOptions}
//                 loadingActivities={loadingActivities}
//                 errors={errors}
//                 onChange={handleActivityFeeChange}
//                 onRemove={removeActivityFee}
//                 canRemove={form.activityFees.length > 1}
//               />
//             ))}
//           </div>

//           {form.activityFees.length > 1 && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="font-semibold text-gray-700">Total Final Amount</span>
//                 <span className="font-bold text-[#1a2a5e] text-base">
//                   ₹{form.activityFees.reduce((sum, af) => sum + (parseFloat(af.finalAmount) || 0), 0).toLocaleString("en-IN")}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Login Details ── */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Password<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="e.g. EMP@1234"
//                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
//               />
//               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
//             </div>
//           </div>
//         </div>

//         {/* ── Actions ── */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <button
//             onClick={() => navigate("/fitness/members")}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
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
//             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
//           </button>
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

// const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const GENDERS = ["Male", "Female", "Other"];
// const STATUSES = ["Active", "Inactive"];
// const PAYMENT_STATUSES = ["Paid", "Pending"];
// const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

// const emptyForm = {
//   name: "",
//   mobile: "",
//   email: "",
//   age: "",
//   gender: "Male",
//   address: "",
//   photo: null,
//   photoPreview: null,
//   activity: "",
//   plan: "Monthly",
//   membershipStatus: "Active",
//   status: "Active",
//   startDate: "",
//   endDate: "",
//   staff: "",
//   paymentStatus: "Pending",
//   paymentMode: "",
//   planFee: "",
//   discount: "",
//   finalAmount: "",
//   paymentDate: "",
//   planNotes: "",
//   userId: "",
//   password: "",
//   enquiryId: null,
// };

// const formatDateForInput = (dateValue) => {
//   if (!dateValue) return "";
//   const d = new Date(dateValue);
//   if (isNaN(d.getTime())) return "";
//   return d.toISOString().split("T")[0];
// };

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
//   let password = "";
//   for (let i = 0; i < 8; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// };

// const Field = ({
//   label,
//   name,
//   type = "text",
//   placeholder = "",
//   required = false,
//   readOnly = false,
//   options,
//   form,
//   errors,
//   onChange,
// }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}
//       {required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>

//     {options ? (
//       <select
//         name={name}
//         value={form[name] || ""}
//         onChange={onChange}
//         disabled={readOnly}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"
//           }`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     ) : (
//       <input
//         type={type}
//         name={name}
//         value={form[name] || ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         readOnly={readOnly}
//         maxLength={name === "mobile" ? 10 : undefined}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"
//           }`}
//       />
//     )}

//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );

// export default function AddMember() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const fileRef = useRef();

//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved] = useState(false);
//   const [enquiryOptions, setEnquiryOptions] = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [staffOptions, setStaffOptions] = useState([]);
//   const [loadingStaff, setLoadingStaff] = useState(false);

//   useEffect(() => {
//     if (!isEdit && location.state?.enquiry) {
//       const enquiry = location.state.enquiry;
//       prefillFromEnquiry(enquiry);
//       setSelectedEnquiry({
//         value: enquiry._id,
//         label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
//         data: enquiry,
//       });
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (isEdit) return;

//     const loadEnquiries = async () => {
//       try {
//         setLoadingEnquiries(true);
//         const response = await api.fitnessEnquiry.getAll({ limit: 100 });
//         const raw = response?.data ?? response;
//         const list = Array.isArray(raw) ? raw : [];
//         const filteredList = list.filter((e) => e.status !== "Admitted");

//         const options = filteredList.map((enquiry) => ({
//           value: enquiry._id,
//           label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
//           data: enquiry,
//         }));

//         setEnquiryOptions(options);
//       } catch (err) {
//         console.error("Failed to load enquiries:", err);
//         toast.error("Could not load enquiries. You can still fill the form manually.");
//       } finally {
//         setLoadingEnquiries(false);
//       }
//     };

//     loadEnquiries();
//   }, [isEdit]);

//   // ✅ NEW: Load staff dynamically
//   useEffect(() => {
//     const loadStaff = async () => {
//       try {
//         setLoadingStaff(true);
//         const response = await api.fitnessStaff.getAll({ limit: 200 });

//         const raw =
//           response?.data?.data?.staff ||
//           response?.data?.staff ||
//           response?.data?.data ||
//           response?.data ||
//           [];

//         const list = Array.isArray(raw) ? raw : [];

//         const options = list.map((staff) => ({
//           value: staff._id,
//           label: staff.fullName || staff.name || "Unnamed Staff",
//         }));

//         setStaffOptions(options);
//       } catch (err) {
//         console.error("Failed to load staff:", err);
//         toast.error("Could not load responsible staff list.");
//       } finally {
//         setLoadingStaff(false);
//       }
//     };

//     loadStaff();
//   }, []);

//   useEffect(() => {
//     if (!isEdit) return;

//     const fetchMember = async () => {
//       try {
//         const response = await api.fitnessMember.getById(id);
//         const member = response?.data ?? response;

//         if (member) {
//           setForm({
//             ...emptyForm,
//             ...member,
//             startDate: formatDateForInput(member.startDate),
//             endDate: formatDateForInput(member.endDate),
//             paymentDate: formatDateForInput(member.paymentDate),
//             photoPreview: member.photo || null,
//             staff:
//               typeof member.staff === "object"
//                 ? member.staff?._id || ""
//                 : member.staff || "",
//             responsibleStaff:
//               typeof member.responsibleStaff === "object"
//                 ? member.responsibleStaff?._id || ""
//                 : member.responsibleStaff || "",
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load member details.");
//       }
//     };

//     fetchMember();
//   }, [id, isEdit]);

//   useEffect(() => {
//     const fee = parseFloat(form.planFee) || 0;
//     const disc = parseFloat(form.discount) || 0;

//     if (fee > 0 || disc > 0) {
//       setForm((p) => ({
//         ...p,
//         finalAmount: String(Math.max(0, fee - disc)),
//       }));
//     } else {
//       setForm((p) => ({
//         ...p,
//         finalAmount: "",
//       }));
//     }
//   }, [form.planFee, form.discount]);

//   useEffect(() => {
//     if (!isEdit && form.mobile) {
//       setForm((p) => ({ ...p, userId: form.mobile }));
//     }
//   }, [form.mobile, isEdit]);

//   useEffect(() => {
//     if (!isEdit) {
//       setForm((prev) => {
//         if (prev.password) return prev;
//         return { ...prev, password: generatePassword() };
//       });
//     }
//   }, [isEdit]);

//   useEffect(() => {
//     if (!form.startDate || !form.endDate) return;

//     const today = new Date().toISOString().split("T")[0];
//     let status = "Inactive";

//     if (today >= form.startDate && today <= form.endDate) {
//       status = "Active";
//     }

//     setForm((prev) => ({
//       ...prev,
//       membershipStatus: status,
//       status: status,
//     }));
//   }, [form.startDate, form.endDate]);

//   const prefillFromEnquiry = (enquiry) => {
//     setForm((prev) => ({
//       ...prev,
//       enquiryId: enquiry._id,
//       name: enquiry.fullName || enquiry.name || "",
//       mobile: enquiry.mobile || enquiry.contact || "",
//       email: enquiry.email || "",
//       age: enquiry.age || "",
//       gender: enquiry.gender || "Male",
//       address: enquiry.address || "",
//       activity:
//         typeof enquiry.interestedActivity === "object"
//           ? enquiry.interestedActivity?.name || enquiry.interestedActivity?.activityName || prev.activity
//           : enquiry.interestedActivity || enquiry.activity || prev.activity,
//       staff:
//         typeof enquiry.responsibleStaff === "object"
//           ? enquiry.responsibleStaff?._id || ""
//           : enquiry.responsibleStaff || prev.staff,
//     }));
//   };

//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);

//     if (option) {
//       prefillFromEnquiry(option.data);
//       toast.success("Enquiry details loaded successfully!");
//     } else {
//       setForm((prev) => ({ ...prev, enquiryId: null }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let updatedValue = value;

//     if (name === "mobile") {
//       updatedValue = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "age") {
//       updatedValue = value.replace(/\D/g, "").slice(0, 3);
//     }

//     setForm((p) => ({ ...p, [name]: updatedValue }));

//     if (errors[name]) {
//       setErrors((p) => ({ ...p, [name]: "" }));
//     }
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       setForm((p) => ({
//         ...p,
//         photo: file,
//         photoPreview: ev.target.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const validate = () => {
//     const e = {};

//     if (form.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) {
//       e.startDate = "Enter a valid date.";
//     }

//     if (form.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.endDate)) {
//       e.endDate = "Enter a valid date.";
//     }

//     if (form.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.paymentDate)) {
//       e.paymentDate = "Enter a valid date.";
//     }

//     if (form.startDate && form.endDate && form.endDate < form.startDate) {
//       e.endDate = "End date cannot be before start date.";
//     }

//     if (!form.name.trim()) e.name = "Full name is required.";

//     if (!form.mobile.trim()) {
//       e.mobile = "Mobile number is required.";
//     } else if (!/^\d{10}$/.test(form.mobile)) {
//       e.mobile = "Enter a valid 10-digit mobile.";
//     }

//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
//       e.email = "Enter a valid email.";
//     }

//     if (!form.activity) e.activity = "Activity is required.";
//     if (!form.startDate) e.startDate = "Start date is required.";
//     if (!form.endDate) e.endDate = "End date is required.";
//     if (!form.password?.trim()) e.password = "Password is required.";

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

//       Object.keys(form).forEach((key) => {
//         if (key === "photo" || key === "photoPreview" || key === "enquiryId") return;

//         if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
//           formData.append(key, form[key]);
//         }
//       });

//       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
//       if (form.photo instanceof File) formData.append("photo", form.photo);

//       if (isEdit) {
//         await api.fitnessMember.update(id, formData);
//         toast.success("Member updated successfully!");
//       } else {
//         await api.fitnessMember.create(formData);
//         toast.success("Member added successfully!");
//       }

//       setSaved(true);
//       setTimeout(() => navigate("/fitness/members"), 1500);
//     } catch (err) {
//       console.error(err);
//       const message = err?.response?.data?.message || err?.message || "Failed to save member. Please try again.";
//       toast.error(message);
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
//           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
//           <p className="text-sm text-gray-500">Redirecting to members list…</p>
//         </div>
//       </div>
//     );
//   }

//   const fieldProps = { form, errors, onChange: handleChange };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
//         <button
//           onClick={() => navigate("/fitness/members")}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           Back to Members
//         </button>
//       </div>

//       {!isEdit && (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
//           <div className="max-w-md">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Choose an existing enquiry to auto-fill details
//             </label>
//             <Select
//               options={enquiryOptions}
//               onChange={handleEnquirySelect}
//               value={selectedEnquiry}
//               placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
//               isClearable
//               isLoading={loadingEnquiries}
//               noOptionsMessage={() => "No pending enquiries found"}
//               className="react-select-container"
//               classNamePrefix="react-select"
//             />
//           </div>
//           <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
//         </div>
//       )}

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
//               <div
//                 onClick={() => fileRef.current.click()}
//                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
//               >
//                 {form.photoPreview ? (
//                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-center">
//                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                     <p className="text-xs text-gray-400 mt-1">Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
//             </div>

//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
//             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
//             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Full address"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Activity" name="activity" options={ACTIVITIES} required {...fieldProps} />
//             <Field label="Membership Status" name="membershipStatus" readOnly {...fieldProps} />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">
//                 Start Date<span className="text-red-400 ml-0.5">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={form.startDate || ""}
//                 onChange={handleChange}
//                 min="1900-01-01"
//                 max="9999-12-31"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.startDate ? "border-red-400" : "border-gray-300"
//                   }`}
//               />
//               {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1">
//                 End Date<span className="text-red-400 ml-0.5">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={form.endDate || ""}
//                 onChange={handleChange}
//                 min={form.startDate || ""}
//                 max="9999-12-31"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.endDate ? "border-red-400" : "border-gray-300"
//                   }`}
//               />
//               {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             {/* ✅ CHANGED: Dynamic Responsible Staff */}
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Responsible Staff</label>
//               <Select
//                 options={staffOptions}
//                 value={staffOptions.find((opt) => opt.value === form.staff) || null}
//                 onChange={(selected) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     staff: selected?.value || "",
//                   }))
//                 }
//                 placeholder={loadingStaff ? "Loading staff..." : "Select Responsible Staff"}
//                 isClearable
//                 isLoading={loadingStaff}
//                 classNamePrefix="react-select"
//               />
//               {errors.staff && <p className="mt-1 text-xs text-red-500">{errors.staff}</p>}
//             </div>

//             <Field label="Plan" name="plan" options={PLANS} {...fieldProps} />
//             <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fieldProps} />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fieldProps} />
//             <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fieldProps} />

//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//               <input
//                 type="date"
//                 name="paymentDate"
//                 value={form.paymentDate || ""}
//                 onChange={handleChange}
//                 min="1900-01-01"
//                 max="9999-12-31"
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.paymentDate ? "border-red-400" : "border-gray-300"
//                   }`}
//               />
//               {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Status" name="paymentStatus" options={PAYMENT_STATUSES} {...fieldProps} />
//             <Field label="Payment Mode" name="paymentMode" options={PAYMENT_MODES} {...fieldProps} />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//             <textarea
//               name="planNotes"
//               value={form.planNotes}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Any additional notes..."
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Password<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="e.g. EMP@1234"
//                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//                 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//                 ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
//               />
//               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <button
//             onClick={() => navigate("/fitness/members")}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button
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
//             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


