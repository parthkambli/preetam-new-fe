import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

export default function AddPassMember() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    membershipPass: "",
    startDate: "",
    endDate: "",
    paymentMode: "",
    password: ""
  });

  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load passes (you need API for this)
  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await api.membershipPass.getAll(); // ⚠️ you must create this API
        setPasses(res?.data || []);
      } catch {
        toast.error("Failed to load membership passes");
      }
    };

    fetchPasses();
  }, []);

  // 🔹 Auto generate password
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    const password = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    setForm((prev) => ({ ...prev, password }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;
    if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10);

    setForm((prev) => ({ ...prev, [name]: v }));
  };

  // 🔹 Auto end date from pass duration
  const handlePassChange = (e) => {
    const passId = e.target.value;
    const selected = passes.find((p) => p._id === passId);

    let endDate = "";

    if (selected && form.startDate) {
      const d = new Date(form.startDate);
      d.setDate(d.getDate() + (selected.durationDays || 30) - 1);
      endDate = d.toISOString().split("T")[0];
    }

    setForm((prev) => ({
      ...prev,
      membershipPass: passId,
      endDate
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || !form.membershipPass) {
      toast.error("Name, mobile and pass are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      // 🔴 IMPORTANT (backend expects this)
      formData.append("activityFees", JSON.stringify([]));

      await api.fitnessMember.create(formData);

      toast.success("Pass member added successfully");

      setTimeout(() => {
        navigate("/fitness/members");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-xl font-bold mb-6">Add Pass Member</h1>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 border px-3 py-2 rounded"
        />

        {/* Mobile */}
        <input
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
          className="w-full mb-4 border px-3 py-2 rounded"
        />

        {/* Pass */}
        <select
          name="membershipPass"
          value={form.membershipPass}
          onChange={handlePassChange}
          className="w-full mb-4 border px-3 py-2 rounded"
        >
          <option value="">Select Pass</option>
          {passes.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} - ₹{p.amount}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full mb-4 border px-3 py-2 rounded"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          readOnly
          className="w-full mb-4 border px-3 py-2 rounded bg-gray-100"
        />

        {/* Payment Mode */}
        <select
          name="paymentMode"
          value={form.paymentMode}
          onChange={handleChange}
          className="w-full mb-4 border px-3 py-2 rounded"
        >
          <option value="">Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#1a2a5e] text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add Member"}
        </button>
      </div>
    </div>
  );
}