import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

// ── Helpers ─────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "—";
  return `₹ ${Number(amount).toLocaleString("en-IN")}`;
};

const computeStatus = (af) => {
  if (af?.paymentStatus !== "Paid") return "Inactive";
  if (!af?.startDate || !af?.endDate) return "Inactive";

  const today = new Date();
  const start = new Date(af.startDate);
  const end = new Date(af.endDate);

  return today >= start && today <= end ? "Active" : "Inactive";
};

// ── UI Components ───────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50">
      {value || "—"}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const active = status === "Active";
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
      active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
    }`}>
      {status}
    </span>
  );
};

// ── MAIN COMPONENT ──────────────────────────────────
export default function ViewPassMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await api.fitnessMember.getById(id);
        setMember(res?.data ?? res);
      } catch (err) {
        toast.error("Failed to load member");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  const af = member.activityFees?.[0];
  const status = computeStatus(af);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Pass Member Details</h1>
        <button
          onClick={() => navigate("/fitness/members")}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Personal Info */}
        <div>
          <h2 className="font-semibold mb-4">Personal Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={member.name} />
            <Field label="Mobile" value={member.mobile} />
            <Field label="Email" value={member.email} />
            <Field label="Gender" value={member.gender} />
          </div>
        </div>

        {/* Pass Details */}
        {af && (
          <div>
            <h2 className="font-semibold mb-4 flex items-center gap-3">
              Membership Pass
              <StatusBadge status={status} />
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Plan" value={af.plan} />
              <Field label="Payment Status" value={af.paymentStatus} />
              <Field label="Payment Mode" value={af.paymentMode} />
              <Field label="Payment Date" value={formatDate(af.paymentDate)} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="Plan Fee" value={formatCurrency(af.planFee)} />
              <Field label="Discount" value={formatCurrency(af.discount)} />
              <Field label="Final Amount" value={formatCurrency(af.finalAmount)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" value={formatDate(af.startDate)} />
              <Field label="End Date" value={formatDate(af.endDate)} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}