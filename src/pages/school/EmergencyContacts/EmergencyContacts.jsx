// pages/school/EmergencyContacts/EmergencyContacts.jsx
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const RELATIONS = ["Son", "Daughter", "Spouse", "Brother", "Sister", "Father", "Mother", "Friend", "Other"];

const emptyForm = {
  participant: "",
  participantId: "",
  primaryName: "",
  primaryRelation: "Son",
  primaryPhone: "",
  secondaryName: "",
  secondaryRelation: "Daughter",
  secondaryPhone: "",
};

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchRelation, setSearchRelation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch all students
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.students.getAll();   // This matches exports.getAllStudents
      const students = res.data || [];

      const list = students
        .filter(s => s.primaryContactName || s.primaryPhone)
        .map(s => ({
          _id: s._id,
          participant: s.fullName,
          participantId: s.studentId || s.admissionIdStr || '',
          primaryName: s.primaryContactName || '',
          primaryRelation: s.primaryRelation || '',
          primaryPhone: s.primaryPhone || '',
          secondaryName: s.secondaryContactName || '',
          secondaryRelation: s.secondaryRelation || '',
          secondaryPhone: s.secondaryPhone || '',
          date: s.updatedAt ? new Date(s.updatedAt).toISOString().split('T')[0] : '',
        }));

      setContacts(list);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filtered = contacts.filter((c) => {
    const nameMatch = c.participant.toLowerCase().includes(searchName.toLowerCase());
    const idMatch = c.participantId.toLowerCase().includes(searchId.toLowerCase());
    const relationMatch = !searchRelation || 
      c.primaryRelation === searchRelation || 
      c.secondaryRelation === searchRelation;
    const dateMatch = !searchDate || c.date === searchDate;
    return nameMatch && idMatch && relationMatch && dateMatch;
  });

  const openEdit = (contact) => {
    setForm({
      participant: contact.participant,
      participantId: contact.participantId,
      primaryName: contact.primaryName,
      primaryRelation: contact.primaryRelation || "Son",
      primaryPhone: contact.primaryPhone,
      secondaryName: contact.secondaryName,
      secondaryRelation: contact.secondaryRelation || "Daughter",
      secondaryPhone: contact.secondaryPhone,
    });
    setErrors({});
    setModal({ mode: "edit", contact });
  };

  const openDelete = (contact) => {
    setModal({ mode: "delete", contact });
  };

  const closeModal = () => {
    setModal(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.primaryName?.trim()) e.primaryName = "Primary name is required";
    if (!form.primaryPhone?.trim() || !/^\d{10}$/.test(form.primaryPhone)) {
      e.primaryPhone = "Primary phone must be exactly 10 digits";
    }
    if (form.secondaryPhone && !/^\d{10}$/.test(form.secondaryPhone)) {
      e.secondaryPhone = "Secondary phone must be exactly 10 digits";
    }
    return e;
  };

  // === UPDATE EMERGENCY CONTACT ===
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(Object.values(errs)[0]);
      return;
    }

    setSaving(true);
    try {
      // This should call PUT /api/students/:id/emergency-contact
      await api.students.updateEmergencyContact(modal.contact._id, {
        primaryContactName: form.primaryName.trim(),
        primaryRelation: form.primaryRelation.trim(),
        primaryPhone: form.primaryPhone.trim(),
        secondaryContactName: form.secondaryName.trim(),
        secondaryRelation: form.secondaryRelation.trim(),
        secondaryPhone: form.secondaryPhone.trim(),
      });

      toast.success("Emergency contact updated successfully");
      await fetchContacts();   // Refresh list
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update contact";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // === CLEAR / DELETE EMERGENCY CONTACT ===
  const handleDelete = async () => {
    if (!modal?.contact?._id) return;

    try {
      // This should call DELETE /api/students/:id/emergency-contact
      await api.students.clearEmergencyContact(modal.contact._id);

      toast.success("Emergency contact cleared successfully");
      setContacts(prev => prev.filter(c => c._id !== modal.contact._id));
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to clear contact";
      toast.error(msg);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Emergency Contacts</h1>

      {/* Filters - same as before */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <input type="text" placeholder="Search By Name" value={searchName} onChange={e => setSearchName(e.target.value)} 
          className="flex-1 min-w-[140px] border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white" />
        <input type="text" placeholder="Search By ID" value={searchId} onChange={e => setSearchId(e.target.value)} 
          className="flex-1 min-w-[140px] border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white" />
        <select value={searchRelation} onChange={e => setSearchRelation(e.target.value)} 
          className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white">
          <option value="">Search By Relation</option>
          {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} 
          className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white" />
      </div>

      {/* Table - unchanged UI */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-4 py-3 text-left font-semibold">Participant</th>
                <th className="px-4 py-3 text-left font-semibold">Primary Name</th>
                <th className="px-4 py-3 text-left font-semibold">Relation</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Secondary Name</th>
                <th className="px-4 py-3 text-left font-semibold">Relation</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No contacts found.</td></tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={c._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">{c.participant}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.primaryName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.primaryRelation}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.primaryPhone}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.secondaryName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.secondaryRelation}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.secondaryPhone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors">Edit</button>
                        <button onClick={() => openDelete(c)} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal - same beautiful UI */}
      {modal?.mode === "edit" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Emergency Contact</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {/* Form fields same as previous version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Participant Name</label>
                  <input type="text" value={form.participant} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-100" disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Contact Name</label>
                  <input type="text" name="primaryName" value={form.primaryName} onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm ${errors.primaryName ? 'border-red-400' : 'border-gray-300'}`} />
                  {errors.primaryName && <p className="text-xs text-red-500 mt-1">{errors.primaryName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Relation</label>
                  <select name="primaryRelation" value={form.primaryRelation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
                    {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Phone</label>
                  <input type="tel" name="primaryPhone" value={form.primaryPhone} onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm ${errors.primaryPhone ? 'border-red-400' : 'border-gray-300'}`} />
                  {errors.primaryPhone && <p className="text-xs text-red-500 mt-1">{errors.primaryPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Contact Name</label>
                  <input type="text" name="secondaryName" value={form.secondaryName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Relation</label>
                  <select name="secondaryRelation" value={form.secondaryRelation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
                    {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Phone</label>
                <input type="tel" name="secondaryPhone" value={form.secondaryPhone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
                {errors.secondaryPhone && <p className="text-xs text-red-500 mt-1">{errors.secondaryPhone}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={closeModal} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50" disabled={saving}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal?.mode === "delete" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Contact</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete the emergency contact for <span className="font-semibold">{modal.contact.participant}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}