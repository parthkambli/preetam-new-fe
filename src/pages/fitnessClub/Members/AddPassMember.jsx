import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export default function AddPassMember() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    numberOfPersons: 1,
    membershipPass: "",
    startDate: "",
    endDate: "",
    paymentMode: "",
    userId: "",
    password: ""
  });

  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load passes
  useEffect(() => {
    (async () => {
      try {
        const res = await api.fitnessFees.getTypes();

        const passes = (res.data || []).filter(
          (p) => p.type === "Membership Pass"
        );

        setPasses(passes);
      } catch {
        toast.error("Failed to load passes");
      }
    })();
  }, []);

  // Auto password
  useEffect(() => {
    setForm((p) => ({
      ...p,
      password: generatePassword()
    }));
  }, []);

  // userId = mobile
  useEffect(() => {
    if (form.mobile) {
      setForm((p) => ({ ...p, userId: form.mobile }));
    }
  }, [form.mobile]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "mobile") value = value.replace(/\D/g, "").slice(0, 10);

    setForm((p) => ({ ...p, [name]: value }));
  };

  // Handle pass + duration
  const handlePassChange = (e) => {
    const passId = e.target.value;
    const selected = passes.find((p) => p._id === passId);

    let endDate = "";

    if (selected && form.startDate) {
      const d = new Date(form.startDate);

      let duration = 30;
      if (selected.monthly) duration = 30;
      else if (selected.annual) duration = 365;
      else if (selected.weekly) duration = 7;

      d.setDate(d.getDate() + duration - 1);
      endDate = d.toISOString().split("T")[0];
    }

    setForm((p) => ({
      ...p,
      membershipPass: passId,
      endDate
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || !form.membershipPass) {
      toast.error("Required fields missing");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      formData.append("activityFees", JSON.stringify([]));

      await api.fitnessMember.create(formData);

      toast.success("Pass member added");

      setTimeout(() => navigate("/fitness/members"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Add Pass Member
        </h1>
        <button
          onClick={() => navigate("/fitness/members")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Members
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

        {/* PERSONAL INFO */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Full Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Mobile *
              </label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Number of Persons
              </label>
              <input
                type="number"
                name="numberOfPersons"
                value={form.numberOfPersons}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

          </div>
        </div>

        {/* PASS DETAILS */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">
            Pass Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Pass */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Membership Pass *
              </label>
              <select
                value={form.membershipPass}
                onChange={handlePassChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Pass</option>
                {passes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.description} - ₹{p.monthly || p.annual || p.weekly}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                End Date (auto)
              </label>
              <input
                type="date"
                value={form.endDate}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
              />
            </div>

            {/* Payment */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Payment Mode
              </label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </div>

          </div>
        </div>

        {/* LOGIN */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">
            Login Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                User ID
              </label>
              <input
                value={form.userId}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Password
              </label>
              <input
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={() => navigate("/fitness/members")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-[#1a2a5e] text-white rounded-lg text-sm font-semibold"
          >
            {loading ? "Saving..." : "Save Member"}
          </button>
        </div>

      </div>
    </div>
  );
}