import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

const PAYMENT_MODES = ["Cash", "Cheque", "Online", "UPI"];

const todayString = () => new Date().toISOString().split("T")[0];

const computeEndDate = (startDate, plan) => {
  if (!startDate || !plan) return "";
  const d = new Date(startDate);

  switch (plan) {
    case "Annual":
      d.setFullYear(d.getFullYear() + 1);
      d.setDate(d.getDate() - 1);
      break;
    case "Monthly":
      d.setMonth(d.getMonth() + 1);
      d.setDate(d.getDate() - 1);
      break;
    case "Weekly":
      d.setDate(d.getDate() + 6);
      break;
    default:
      break;
  }

  return d.toISOString().split("T")[0];
};

export default function PassRenewModal({ member, onClose, onRenewed }) {
  const af = member.activityFees?.[0]; // pass always single

  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);


useEffect(() => {
  const fetchStaff = async () => {
    try {
      const res = await api.fitnessStaff.getAll();

      console.log("Staff API:", res.data);

      const data = res.data?.data?.staff || [];
      setStaffList(data);

    } catch (err) {
      console.error("Failed to fetch staff:", err);
      setStaffList([]);
    }
  };

  fetchStaff();
}, []);




  const [form, setForm] = useState({
    plan: af?.plan || "Monthly",
    startDate: todayString(),
    endDate: "",
    planFee: af?.planFee || "",
    discount: 0,
    finalAmount: af?.planFee || "",
    paymentMode: "",
    paymentDate: todayString(),
    noOfPersons: af?.noOfPersons, 
  });

  // auto end date
  useEffect(() => {
    if (form.startDate && form.plan) {
      setForm((p) => ({
        ...p,
        endDate: computeEndDate(form.startDate, form.plan),
      }));
    }
  }, [form.startDate, form.plan]);

  // auto final amount
  useEffect(() => {
    const f = parseFloat(form.planFee) || 0;
    const d = parseFloat(form.discount) || 0;

    setForm((p) => ({
      ...p,
      finalAmount: f > 0 ? Math.max(0, f - d) : "",
    }));
  }, [form.planFee, form.discount]);

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleRenew = async () => {
    if (loading) return;

    if (!form.startDate) {
      toast.error("Start date required");
      return;
    }

    setLoading(true);

    try {
      await api.fitnessMember.renew(member._id, {
        renewals: [
          {
            activityFeeId: af._id,
            activityId: null,
            feeTypeId: af.feeType?._id || af.feeType,
            staffId: form.staffId || af.staff?._id || null,
            plan: form.plan,
            startDate: form.startDate,
            endDate: form.endDate,
            planFee: Number(form.planFee) || 0,
            discount: Number(form.discount) || 0,
            finalAmount: Number(form.finalAmount) || 0,
            paymentStatus: "Paid",
            paymentMode: form.paymentMode || "",
            paymentDate: form.paymentDate,
          },
        ],
      });

      toast.success("Pass renewed successfully");
      onRenewed();
      onClose();

    } catch (err) {
      toast.error(err?.response?.data?.message || "Renewal failed");
    } finally {
      setLoading(false);
    }
  };

  return (

 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
      <div>
        <h2 className="text-lg font-bold text-[#1a2a5e]">
          Renew Membership Pass
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {member.name} • {member.mobile}
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
      >
        ✕
      </button>
    </div>

    {/* Body */}
    <div className="px-6 py-3 overflow-y-auto flex-1 space-y-4">

      {/* Plan + Start */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Plan</label>
          <select
            value={form.plan}
            onChange={(e) => handleChange("plan", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option>Monthly</option>
            <option>Annual</option>
            <option>Weekly</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* No of Persons + End Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            No. of Persons
          </label>
          <input
            type="number"
            min="1"
            value={form.noOfPersons}
            onChange={(e) => handleChange("noOfPersons", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-1 block">End Date</label>
          <input
            type="date"
            value={form.endDate}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
          />
        </div>
      </div>

      {/* Fees */}
      <div>
        {/* <label className="text-xs text-gray-600 mb-1 block">Fees</label> */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Plan Fee</label>
            <input
              type="number"
              value={form.planFee}
              onChange={(e) => handleChange("planFee", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Discount</label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => handleChange("discount", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Final Amount</label>
            <input
              type="text"
              value={form.finalAmount}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Payment</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => handleChange("paymentMode", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Mode</option>
              {PAYMENT_MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Payment Date</label>
            <input
              type="date"
              value={form.paymentDate}
              onChange={(e) => handleChange("paymentDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Responsible Staff */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">
          Responsible Staff
        </label>
        <select
          value={form.staffId}
          onChange={(e) => handleChange("staffId", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select Staff</option>
          {staffList.map((staff) => (
  <option key={staff._id} value={staff._id}>
    {staff.name || staff.fullName || staff.user?.name || "Unnamed"}
  </option>
))}
        </select>
      </div>

    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm text-gray-700"
        >
          Cancel
        </button>

        <button
          onClick={handleRenew}
          disabled={loading}
          className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold"
        >
          {loading ? "Renewing..." : "Renew"}
        </button>
      </div>
    </div>

  </div>
</div>




















    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
    //   <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

    //     {/* Header */}
    //     <div className="flex items-center justify-between px-6 py-4 border-b">
    //       <div>
    //         <h2 className="text-lg font-bold text-[#1a2a5e]">
    //           Renew Membership Pass
    //         </h2>
    //         <p className="text-xs text-gray-500 mt-0.5">
    //           {member.name} • {member.mobile}
    //         </p>
    //       </div>
    //       <button onClick={onClose}>✕</button>
    //     </div>

    //     {/* Body */}
    //     <div className="px-6 py-4 space-y-4">

    //       {/* Plan + Start */}
    //       <div className="grid grid-cols-2 gap-3">
    //         <div>
    //           <label className="text-xs text-gray-600">Plan</label>
    //           <select
    //             value={form.plan}
    //             onChange={(e) => handleChange("plan", e.target.value)}
    //             className="w-full border rounded px-3 py-2 text-sm"
    //           >
    //             <option>Monthly</option>
    //             <option>Annual</option>
    //             <option>Weekly</option>
    //           </select>
    //         </div>

    //         <div>
    //           <label className="text-xs text-gray-600">Start Date</label>
    //           <input
    //             type="date"
    //             value={form.startDate}
    //             onChange={(e) => handleChange("startDate", e.target.value)}
    //             className="w-full border rounded px-3 py-2 text-sm"
    //           />
    //         </div>
    //       </div>

    //       {/* End Date */}
    //       <div>
    //         <label className="text-xs text-gray-600">End Date</label>
    //         <input
    //           type="date"
    //           value={form.endDate}
    //           readOnly
    //           className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
    //         />
    //       </div>

    //       {/* Fees */}
    //       <div className="grid grid-cols-3 gap-2">
    //         <input
    //           type="number"
    //           placeholder="Plan Fee"
    //           value={form.planFee}
    //           onChange={(e) => handleChange("planFee", e.target.value)}
    //           className="border rounded px-2 py-2 text-sm"
    //         />
    //         <input
    //           type="number"
    //           placeholder="Discount"
    //           value={form.discount}
    //           onChange={(e) => handleChange("discount", e.target.value)}
    //           className="border rounded px-2 py-2 text-sm"
    //         />
    //         <input
    //           type="text"
    //           value={form.finalAmount}
    //           readOnly
    //           className="border rounded px-2 py-2 text-sm bg-gray-100"
    //         />
    //       </div>

    //       {/* Payment */}
    //       <div className="grid grid-cols-2 gap-3">
    //         <select
    //           value={form.paymentMode}
    //           onChange={(e) => handleChange("paymentMode", e.target.value)}
    //           className="border rounded px-3 py-2 text-sm"
    //         >
    //           <option value="">Payment Mode</option>
    //           {PAYMENT_MODES.map((m) => (
    //             <option key={m}>{m}</option>
    //           ))}
    //         </select>

    //         <input
    //           type="date"
    //           value={form.paymentDate}
    //           onChange={(e) => handleChange("paymentDate", e.target.value)}
    //           className="border rounded px-3 py-2 text-sm"
    //         />
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className="px-6 py-4 border-t flex gap-3">
    //       <button
    //         onClick={onClose}
    //         className="flex-1 border rounded py-2"
    //       >
    //         Cancel
    //       </button>

    //       <button
    //         onClick={handleRenew}
    //         disabled={loading}
    //         className="flex-1 bg-green-600 text-white rounded py-2"
    //       >
    //         {loading ? "Renewing..." : "Renew"}
    //       </button>
    //     </div>

    //   </div>
    // </div>
  );
}