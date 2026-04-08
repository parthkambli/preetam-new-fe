// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { initialMembers } from "./Members";

// const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// const PLANS      = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const GENDERS    = ["Male", "Female", "Other"];
// const STATUSES   = ["Active", "Inactive"];
// const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

// const emptyForm = {
//   name: "", mobile: "", email: "", age: "", gender: "Male", address: "",
//   photo: null, photoPreview: null,
//   activity: "", plan: "Monthly", membershipStatus: "Active", status: "Active",
//   startDate: "", endDate: "",
//   planDuration: "1 Month", planFee: "", discount: "", finalAmount: "",
//   paymentDate: "", planNotes: "",
//   userId: "", password: "",
// };

// /* ── tiny reusable field components ───────────────────────── */
// function Label({ text, required }) {
//   return (
//     <label className="block text-xs text-gray-600 mb-1">
//       {text}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//   );
// }

// function SectionTitle({ children }) {
//   return <h2 className="text-base font-bold text-[#1a2a5e] mb-4">{children}</h2>;
// }

// export default function EditMember() {
//   const { id }     = useParams();
//   const navigate   = useNavigate();
//   const fileRef    = useRef();

//   const [form,   setForm]   = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saved,  setSaved]  = useState(false);
//   const [notFound, setNotFound] = useState(false);

//   /* load member on mount */
//   useEffect(() => {
//     const store  = window.__membersStore || initialMembers;
//     const member = store.find((m) => String(m.id) === String(id));
//     if (!member) { setNotFound(true); return; }
//     setForm({ ...emptyForm, ...member, photoPreview: member.photo || null });
//   }, [id]);

//   /* auto-recalculate final amount */
//   useEffect(() => {
//     const fee  = parseFloat(form.planFee)  || 0;
//     const disc = parseFloat(form.discount) || 0;
//     if (fee > 0) setForm((p) => ({ ...p, finalAmount: String(Math.max(0, fee - disc)) }));
//   }, [form.planFee, form.discount]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) =>
//       setForm((p) => ({ ...p, photo: ev.target.result, photoPreview: ev.target.result }));
//     reader.readAsDataURL(file);
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())   e.name   = "Full name is required.";
//     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.activity)      e.activity  = "Activity is required.";
//     if (!form.startDate)     e.startDate = "Start date is required.";
//     if (!form.password.trim()) e.password = "Password is required.";
//     return e;
//   };

//   const handleSave = () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     if (!window.__membersStore) window.__membersStore = [...initialMembers];
//     window.__membersStore = window.__membersStore.map((m) =>
//       String(m.id) === String(id) ? { ...m, ...form, id: m.id } : m
//     );
//     setSaved(true);
//     setTimeout(() => navigate("/fitness/members"), 1200);
//   };

//   /* ── not found ── */
//   if (notFound) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-gray-500 mb-4">Member not found.</p>
//         <button onClick={() => navigate("/fitness/members")}
//           className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm">
//           Back to Members
//         </button>
//       </div>
//     </div>
//   );

//   /* ── success ── */
//   if (saved) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//         <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//           <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <p className="text-lg font-semibold text-gray-800">Member updated successfully!</p>
//         <p className="text-sm text-gray-500">Redirecting to members list…</p>
//       </div>
//     </div>
//   );

//   /* ── shared input helpers ── */
//   const inp = (name, type = "text", placeholder = "", readOnly = false) => (
//     <input
//       type={type} name={name} value={form[name]}
//       onChange={handleChange} placeholder={placeholder} readOnly={readOnly}
//       className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none
//         focus:ring-2 focus:ring-[#1a2a5e] bg-white
//         read-only:bg-gray-50 read-only:text-gray-500 read-only:cursor-default
//         ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//     />
//   );

//   const sel = (name, options) => (
//     <select
//       name={name} value={form[name]} onChange={handleChange}
//       className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none
//         focus:ring-2 focus:ring-[#1a2a5e] bg-white
//         ${errors[name] ? "border-red-400" : "border-gray-300"}`}
//     >
//       {options.map((o) => <option key={o} value={o}>{o}</option>)}
//     </select>
//   );

//   const err = (name) =>
//     errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Member</h1>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

//         {/* ══ Personal Information ══════════════════════════════ */}
//         <section>
//           <SectionTitle>Personal Information</SectionTitle>

//           {/* photo + name + mobile */}
//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             {/* photo */}
//             <div>
//               <Label text="Profile Photo" />
//               <div
//                 onClick={() => fileRef.current.click()}
//                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl
//                   bg-gray-50 flex items-center justify-center cursor-pointer
//                   hover:border-[#1a2a5e] transition-colors overflow-hidden"
//               >
//                 {form.photoPreview ? (
//                   <img src={form.photoPreview} alt="Preview"
//                     className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="text-center px-2">
//                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none"
//                       viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2
//                           0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0
//                           00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mt-1">Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*"
//                 className="hidden" onChange={handlePhoto} />
//               {form.photoPreview && (
//                 <button
//                   onClick={() => setForm((p) => ({ ...p, photo: null, photoPreview: null }))}
//                   className="mt-1 text-xs text-red-400 hover:text-red-600"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>

//             {/* name + mobile */}
//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <Label text="Full Name" required />
//                 {inp("name", "text", "Enter name")}
//                 {err("name")}
//               </div>
//               <div>
//                 <Label text="Mobile Number" required />
//                 {inp("mobile", "tel", "10-digit number")}
//                 {err("mobile")}
//               </div>
//             </div>
//           </div>

//           {/* email + age + gender */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <div>
//               <Label text="Email" />
//               {inp("email", "email", "email@example.com")}
//               {err("email")}
//             </div>
//             <div>
//               <Label text="Age" />
//               {inp("age", "number", "Age")}
//             </div>
//             <div>
//               <Label text="Gender" />
//               {sel("gender", GENDERS)}
//             </div>
//           </div>

//           {/* address */}
//           <div>
//             <Label text="Address" />
//             <input
//               type="text" name="address" value={form.address}
//               onChange={handleChange} placeholder="Enter full address"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
//                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//             />
//           </div>
//         </section>

//         {/* ══ Membership & Activity ════════════════════════════ */}
//         <section>
//           <SectionTitle>Membership &amp; Activity</SectionTitle>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <div>
//               <Label text="Activity" required />
//               <select
//                 name="activity" value={form.activity} onChange={handleChange}
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800
//                   focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white
//                   ${errors.activity ? "border-red-400" : "border-gray-300"}`}
//               >
//                 <option value="">Select Activity</option>
//                 {ACTIVITIES.map((a) => <option key={a} value={a}>{a}</option>)}
//               </select>
//               {err("activity")}
//             </div>
//             <div>
//               <Label text="Membership Status" />
//               {sel("membershipStatus", STATUSES)}
//             </div>
//             <div>
//               <Label text="Status" />
//               {sel("status", STATUSES)}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <Label text="Start Date" required />
//               {inp("startDate", "date")}
//               {err("startDate")}
//             </div>
//             <div>
//               <Label text="End Date" />
//               {inp("endDate", "date")}
//             </div>
//           </div>
//         </section>

//         {/* ══ Membership Plan & Fee Details ════════════════════ */}
//         <section>
//           <SectionTitle>Membership Plan &amp; Fee Details</SectionTitle>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <div>
//               <Label text="Plan Duration" />
//               {sel("planDuration", PLAN_DURATIONS)}
//             </div>
//             <div>
//               <Label text="Plan" />
//               {sel("plan", PLANS)}
//             </div>
//             <div>
//               <Label text="Plan Fee (₹)" />
//               {inp("planFee", "number", "0")}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <div>
//               <Label text="Discount (₹)" />
//               {inp("discount", "number", "0")}
//             </div>
//             <div>
//               <Label text="Final Amount (₹)" />
//               {inp("finalAmount", "text", "Auto calculated", true)}
//             </div>
//             <div>
//               <Label text="Payment Date" />
//               {inp("paymentDate", "date")}
//             </div>
//           </div>

//           <div>
//             <Label text="Plan Notes" />
//             <textarea
//               name="planNotes" value={form.planNotes} onChange={handleChange}
//               rows={3} placeholder="Enter any notes about the plan"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
//                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]
//                 bg-white resize-none"
//             />
//           </div>
//         </section>

//         {/* ══ Login Details ════════════════════════════════════ */}
//         <section>
//           <SectionTitle>Login Details</SectionTitle>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <Label text="User ID" />
//               {inp("userId", "text", "User ID")}
//             </div>
//             <div>
//               <Label text="Password" required />
//               {inp("password", "password", "Enter password")}
//               {err("password")}
//             </div>
//           </div>
//         </section>

//         {/* ══ Action buttons ═══════════════════════════════════ */}
//         <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold
//               text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg
//               text-sm font-semibold transition-colors shadow-md"
//           >
//             Update Member
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }










// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const GENDERS = ["Male", "Female", "Other"];
// const STATUSES = ["Active", "Inactive"];
// const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

// const emptyForm = {
//   name: "", mobile: "", email: "", age: "", gender: "Male", address: "",
//   photo: null, photoPreview: null,
//   activity: "", plan: "Monthly", membershipStatus: "Active", status: "Active",
//   startDate: "", endDate: "",
//   planDuration: "1 Month", planFee: "", discount: "", finalAmount: "",
//   paymentDate: "", planNotes: "",
//   userId: "", password: "",
// };

// // ── Defined OUTSIDE the parent component so React never remounts it on re-render ──
// const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange }) => (
//   <div>
//     <label className="block text-xs text-gray-600 mb-1">
//       {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {options ? (
//       <select
//         name={name}
//         value={form[name] || ""}
//         onChange={onChange}
//         disabled={readOnly}
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${
//           errors[name] ? "border-red-400" : "border-gray-300"
//         }`}
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
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${
//           errors[name] ? "border-red-400" : "border-gray-300"
//         }`}
//       />
//     )}
//     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
//   </div>
// );
// // ──────────────────────────────────────────────────────────────────────────────

// export default function EditMember() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const fileRef = useRef();

//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [notFound, setNotFound] = useState(false);

//   // Load member data
//   useEffect(() => {
//     if (!id) return;
//     const fetchMember = async () => {
//       setLoading(true);
//       try {
//         const response = await api.fitnessMember.getById(id);
//         const member = response?.data ?? response;
//         setForm({
//           ...emptyForm,
//           ...member,
//           photoPreview: member.photo || null,
//           password: "", // never pre-fill password
//         });
//       } catch (err) {
//         console.error(err);
//         toast.error(err?.response?.data?.message || "Member not found or failed to load");
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMember();
//   }, [id]);

//   // Auto-calculate final amount
//   useEffect(() => {
//     const fee = parseFloat(form.planFee) || 0;
//     const disc = parseFloat(form.discount) || 0;
//     if (fee > 0) {
//       setForm((p) => ({ ...p, finalAmount: String(Math.max(0, fee - disc)) }));
//     }
//   }, [form.planFee, form.discount]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name?.trim()) e.name = "Full name is required.";
//     if (!form.mobile?.trim()) e.mobile = "Mobile number is required.";
//     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.activity) e.activity = "Activity is required.";
//     if (!form.startDate) e.startDate = "Start date is required.";
//     return e;
//   };

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

//       Object.keys(form).forEach(key => {
//         if (key === 'photo' || key === 'photoPreview') return;
//         if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
//           formData.append(key, form[key]);
//         }
//       });

//       // Only send photo if a new file was picked
//       if (form.photo instanceof File) {
//         formData.append('photo', form.photo);
//       }

//       await api.fitnessMember.update(id, formData);
//       toast.success("Member updated successfully!");
//       setTimeout(() => navigate("/fitness/members"), 1200);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to update member. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Loading skeleton ──────────────────────────────────────────────────────
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
//           <button
//             onClick={() => navigate("/fitness/members")}
//             className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm"
//           >
//             Back to Members
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Shared props passed to every Field — keeps JSX clean and avoids prop drilling noise
//   const fp = { form, errors, onChange: handleChange };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
//         <button
//           onClick={() => navigate("/fitness/members")}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           Back to Members
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

//         {/* Personal Information */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//             {/* Photo upload */}
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
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mt-1">Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
//               {form.photoPreview && (
//                 <button
//                   onClick={() => setForm(p => ({ ...p, photo: null, photoPreview: null }))}
//                   className="mt-1 text-xs text-red-500 hover:text-red-600"
//                 >
//                   Remove Photo
//                 </button>
//               )}
//             </div>

//             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fp} />
//               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fp} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fp} />
//             <Field label="Age" name="age" type="number" placeholder="Age" {...fp} />
//             <Field label="Gender" name="gender" options={GENDERS} {...fp} />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={form.address || ""}
//               onChange={handleChange}
//               placeholder="Enter full address"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         {/* Membership & Activity */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Activity" name="activity" options={ACTIVITIES} required {...fp} />
//             <Field label="Membership Status" name="membershipStatus" options={STATUSES} {...fp} />
//             <Field label="Status" name="status" options={STATUSES} {...fp} />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <Field label="Start Date" name="startDate" type="date" required {...fp} />
//             <Field label="End Date" name="endDate" type="date" {...fp} />
//           </div>
//         </div>

//         {/* Plan & Fee Details */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Plan Duration" name="planDuration" options={PLAN_DURATIONS} {...fp} />
//             <Field label="Plan" name="plan" options={PLANS} {...fp} />
//             <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fp} />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fp} />
//             <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fp} />
//             <Field label="Payment Date" name="paymentDate" type="date" {...fp} />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
//             <textarea
//               name="planNotes"
//               value={form.planNotes || ""}
//               onChange={handleChange}
//               rows={3}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         {/* Login Details */}
//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field label="User ID" name="userId" readOnly {...fp} />
//             <Field label="New Password" name="password" type="password" placeholder="Leave blank to keep current" {...fp} />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <button
//             onClick={() => navigate("/fitness/members")}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
//           >
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


//New oneeeeeeeeee



import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
const GENDERS = ["Male", "Female", "Other"];
const STATUSES = ["Active", "Inactive"];
const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

const emptyForm = {
  name: "", mobile: "", email: "", age: "", gender: "Male", address: "",
  photo: null, photoPreview: null,
  activity: "", plan: "Monthly", membershipStatus: "Active",
  startDate: "", endDate: "",
  planDuration: "1 Month", planFee: "", discount: "", finalAmount: "",
  paymentDate: "", planNotes: "",
  userId: "", password: "",
};

// ── Defined OUTSIDE the parent component so React never remounts it on re-render ──
const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options, form, errors, onChange }) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={form[name] || ""}
        onChange={onChange}
        disabled={readOnly}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${
          errors[name] ? "border-red-400" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        maxLength={name === "mobile" ? 10 : undefined}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${
          errors[name] ? "border-red-400" : "border-gray-300"
        }`}
      />
    )}
    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
  </div>
);
// ──────────────────────────────────────────────────────────────────────────────

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load member data
  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      setLoading(true);
      try {
        const response = await api.fitnessMember.getById(id);
        const member = response?.data ?? response;
        setForm({
          ...emptyForm,
          ...member,
          photoPreview: member.photo || null,
          password: "", // never pre-fill password
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Member not found or failed to load");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  // Auto-calculate final amount
  useEffect(() => {
    const fee = parseFloat(form.planFee) || 0;
    const disc = parseFloat(form.discount) || 0;
    if (fee > 0) {
      setForm((p) => ({ ...p, finalAmount: String(Math.max(0, fee - disc)) }));
    }
  }, [form.planFee, form.discount]);

  // Auto membership status from start and end date
  useEffect(() => {
    if (!form.startDate || !form.endDate) return;

    const today = new Date().toISOString().split("T")[0];

    let liveStatus = "Inactive";
    if (today >= form.startDate && today <= form.endDate) {
      liveStatus = "Active";
    }

    setForm((prev) => ({
      ...prev,
      membershipStatus: liveStatus,
    }));
  }, [form.startDate, form.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "age") {
      updatedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setForm((p) => ({ ...p, [name]: updatedValue }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, photo: file, photoPreview: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Full name is required.";
    if (!form.mobile?.trim()) e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.activity) e.activity = "Activity is required.";
    if (!form.startDate) e.startDate = "Start date is required.";
    if (!form.endDate) e.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "End date cannot be before start date.";
    }
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the highlighted errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (key === 'photo' || key === 'photoPreview') return;
        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      if (form.photo instanceof File) {
        formData.append('photo', form.photo);
      }

      await api.fitnessMember.update(id, formData);
      toast.success("Member updated successfully!");
      setTimeout(() => navigate("/fitness/members"), 1200);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
          <button
            onClick={() => navigate("/fitness/members")}
            className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const fp = { form, errors, onChange: handleChange };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
        <button
          onClick={() => navigate("/fitness/members")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
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
              <div
                onClick={() => fileRef.current.click()}
                className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              {form.photoPreview && (
                <button
                  onClick={() => setForm(p => ({ ...p, photo: null, photoPreview: null }))}
                  className="mt-1 text-xs text-red-500 hover:text-red-600"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" placeholder="Enter full name" required {...fp} />
              <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fp} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fp} />
            <Field label="Age" name="age" type="number" placeholder="Age" {...fp} />
            <Field label="Gender" name="gender" options={GENDERS} {...fp} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Enter full address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>
        </div>

        {/* Membership & Activity */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Activity" name="activity" options={ACTIVITIES} required {...fp} />
            <Field label="Membership Status" name="membershipStatus" options={STATUSES} readOnly {...fp} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Start Date" name="startDate" type="date" required {...fp} />
            <Field label="End Date" name="endDate" type="date" required {...fp} />
          </div>
        </div>

        {/* Plan & Fee Details */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Plan Duration" name="planDuration" options={PLAN_DURATIONS} {...fp} />
            <Field label="Plan" name="plan" options={PLANS} {...fp} />
            <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fp} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fp} />
            <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fp} />
            <Field label="Payment Date" name="paymentDate" type="date" {...fp} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
            <textarea
              name="planNotes"
              value={form.planNotes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>
        </div>

        {/* Login Details */}
        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User ID" name="userId" readOnly {...fp} />
            <Field label="New Password" name="password" type="password" placeholder="Leave blank to keep current" {...fp} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={() => navigate("/fitness/members")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
          >
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