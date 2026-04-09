// // import { useState, useEffect, useRef } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { initialMembers } from "./Members";

// // const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// // const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// // const GENDERS = ["Male", "Female", "Other"];
// // const STATUSES = ["Active", "Inactive"];
// // const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

// // const emptyForm = {
// //   name: "",
// //   mobile: "",
// //   email: "",
// //   age: "",
// //   gender: "Male",
// //   address: "",
// //   photo: null,
// //   photoPreview: null,
// //   activity: "",
// //   plan: "Monthly",
// //   membershipStatus: "Active",
// //   status: "Active",
// //   startDate: "",
// //   endDate: "",
// //   planDuration: "1 Month",
// //   planFee: "",
// //   discount: "",
// //   finalAmount: "",
// //   paymentDate: "",
// //   planNotes: "",
// //   userId: "",
// //   password: "",
// // };

// // export default function AddMember() {
// //   const navigate = useNavigate();
// //   const { id } = useParams(); // defined for edit route
// //   const isEdit = Boolean(id);
// //   const fileRef = useRef();

// //   const [form, setForm] = useState(emptyForm);
// //   const [errors, setErrors] = useState({});
// //   const [saved, setSaved] = useState(false);

// //   useEffect(() => {
// //     if (isEdit) {
// //       const store = window.__membersStore || initialMembers;
// //       const member = store.find((m) => String(m.id) === String(id));
// //       if (member) {
// //         setForm({ ...emptyForm, ...member, photoPreview: member.photo || null });
// //       }
// //     }
// //   }, [id]);

// //   // Auto-calculate final amount
// //   useEffect(() => {
// //     const fee = parseFloat(form.planFee) || 0;
// //     const disc = parseFloat(form.discount) || 0;
// //     if (fee > 0) {
// //       setForm((p) => ({ ...p, finalAmount: String(Math.max(0, fee - disc)) }));
// //     }
// //   }, [form.planFee, form.discount]);

// //   // Auto-set userId from mobile
// //   useEffect(() => {
// //     if (!isEdit && form.mobile) {
// //       setForm((p) => ({ ...p, userId: form.mobile }));
// //     }
// //   }, [form.mobile]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((p) => ({ ...p, [name]: value }));
// //     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
// //   };

// //   const handlePhoto = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       setForm((p) => ({ ...p, photo: ev.target.result, photoPreview: ev.target.result }));
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   const validate = () => {
// //     const e = {};
// //     if (!form.name.trim()) e.name = "Full name is required.";
// //     if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
// //     else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile.";
// //     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
// //     if (!form.activity) e.activity = "Activity is required.";
// //     if (!form.startDate) e.startDate = "Start date is required.";
// //     if (!form.password.trim()) e.password = "Password is required.";
// //     return e;
// //   };

// //   const handleSave = () => {
// //     const errs = validate();
// //     if (Object.keys(errs).length) { setErrors(errs); return; }

// //     if (!window.__membersStore) window.__membersStore = [...initialMembers];

// //     if (isEdit) {
// //       window.__membersStore = window.__membersStore.map((m) =>
// //         String(m.id) === String(id) ? { ...m, ...form, id: m.id } : m
// //       );
// //     } else {
// //       const newId = Math.max(0, ...window.__membersStore.map((m) => m.id)) + 1;
// //       window.__membersStore = [...window.__membersStore, { ...form, id: newId }];
// //     }

// //     setSaved(true);
// //     setTimeout(() => navigate("/members"), 1200);
// //   };

// //   if (saved) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
// //           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
// //             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //             </svg>
// //           </div>
// //           <p className="text-lg font-semibold text-gray-800">
// //             Member {isEdit ? "updated" : "added"} successfully!
// //           </p>
// //           <p className="text-sm text-gray-500">Redirecting to members list…</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const Field = ({ label, name, type = "text", placeholder = "", required = false, readOnly = false, options }) => (
// //     <div>
// //       <label className="block text-xs text-gray-600 mb-1">
// //         {label}{required && <span className="text-red-400 ml-0.5">*</span>}
// //       </label>
// //       {options ? (
// //         <select
// //           name={name}
// //           value={form[name]}
// //           onChange={handleChange}
// //           disabled={readOnly}
// //           className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${
// //             errors[name] ? "border-red-400" : "border-gray-300"
// //           }`}
// //         >
// //           <option value="">Select {label}</option>
// //           {options.map((o) => <option key={o} value={o}>{o}</option>)}
// //         </select>
// //       ) : (
// //         <input
// //           type={type}
// //           name={name}
// //           value={form[name]}
// //           onChange={handleChange}
// //           placeholder={placeholder}
// //           readOnly={readOnly}
// //           className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${
// //             errors[name] ? "border-red-400" : "border-gray-300"
// //           }`}
// //         />
// //       )}
// //       {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
// //       <h1 className="text-2xl font-bold text-gray-800 mb-6">
// //         {isEdit ? "Edit Member" : "Add Members"}
// //       </h1>

// //       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">

// //         {/* ── Personal Information ── */}
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

// //           {/* Photo + Name + Mobile */}
// //           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
// //               <div
// //                 onClick={() => fileRef.current.click()}
// //                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
// //               >
// //                 {form.photoPreview ? (
// //                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
// //                 ) : (
// //                   <div className="text-center">
// //                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
// //                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                     </svg>
// //                     <p className="text-xs text-gray-400 mt-1">Photo</p>
// //                   </div>
// //                 )}
// //               </div>
// //               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
// //             </div>

// //             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <Field label="Full Name" name="name" placeholder="Enter name" required />
// //               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Email" name="email" type="email" placeholder="email@example.com" />
// //             <Field label="Age" name="age" type="number" placeholder="Age" />
// //             <Field label="Gender" name="gender" options={GENDERS} />
// //           </div>

// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Address</label>
// //             <input
// //               type="text"
// //               name="address"
// //               value={form.address}
// //               onChange={handleChange}
// //               placeholder="Enter address"
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
// //             />
// //           </div>
// //         </div>

// //         {/* ── Membership & Activity ── */}
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Activity" name="activity" options={ACTIVITIES} required />
// //             <Field label="Membership Status" name="membershipStatus" options={STATUSES} />
// //             <Field label="Status" name="status" options={STATUSES} />
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //             <Field label="Start Date" name="startDate" type="date" required />
// //             <Field label="End Date" name="endDate" type="date" />
// //           </div>
// //         </div>

// //         {/* ── Membership Plan & Fee Details ── */}
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Plan Duration" name="planDuration" options={PLAN_DURATIONS} />
// //             <Field label="Plan" name="plan" options={PLANS} />
// //             <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" />
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Discount (₹)" name="discount" type="number" placeholder="0" />
// //             <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" />
// //             <Field label="Payment Date" name="paymentDate" type="date" />
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
// //             <textarea
// //               name="planNotes"
// //               value={form.planNotes}
// //               onChange={handleChange}
// //               rows={3}
// //               placeholder="Enter any notes about the plan"
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white resize-none"
// //             />
// //           </div>
// //         </div>

// //         {/* ── Login Details ── */}
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <Field label="User ID" name="userId" placeholder="Auto-filled from mobile" />
// //             <Field label="Password" name="password" type="password" placeholder="Enter password" required />
// //           </div>
// //         </div>

// //         {/* ── Actions ── */}
// //         <div className="flex justify-end gap-3 pt-2">
// //           <button
// //             onClick={() => navigate("/members")}
// //             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleSave}
// //             className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors shadow-md"
// //           >
// //             {isEdit ? "Update Member" : "Save Member"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // import { useState, useEffect, useRef } from "react";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // import { toast } from "sonner";
// // import { api } from "../../../services/apiClient";
// // import Select from "react-select";

// // const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// // const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// // const GENDERS = ["Male", "Female", "Other"];
// // const STATUSES = ["Active", "Inactive"];
// // const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

// // const emptyForm = {
// //   name: "",
// //   mobile: "",
// //   email: "",
// //   age: "",
// //   gender: "Male",
// //   address: "",
// //   photo: null,
// //   photoPreview: null,
// //   activity: "",
// //   plan: "Monthly",
// //   membershipStatus: "Active",
// //   status: "Active",
// //   startDate: "",
// //   endDate: "",
// //   planDuration: "1 Month",
// //   planFee: "",
// //   discount: "",
// //   finalAmount: "",
// //   paymentDate: "",
// //   planNotes: "",
// //   userId: "",
// //   password: "",
// //   enquiryId: null,
// // };

// // const formatDateForInput = (dateValue) => {
// //   if (!dateValue) return "";
// //   const d = new Date(dateValue);
// //   if (isNaN(d.getTime())) return "";
// //   return d.toISOString().split("T")[0];
// // };

// // const generatePassword = () => {
// //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
// //   let password = "";
// //   for (let i = 0; i < 8; i++) {
// //     password += chars.charAt(Math.floor(Math.random() * chars.length));
// //   }
// //   return password;
// // };

// // // Field component OUTSIDE parent so it never remounts on re-render
// // const Field = ({
// //   label,
// //   name,
// //   type = "text",
// //   placeholder = "",
// //   required = false,
// //   readOnly = false,
// //   options,
// //   form,
// //   errors,
// //   onChange,
// // }) => (
// //   <div>
// //     <label className="block text-xs text-gray-600 mb-1">
// //       {label}
// //       {required && <span className="text-red-400 ml-0.5">*</span>}
// //     </label>

// //     {options ? (
// //       <select
// //         name={name}
// //         value={form[name] || ""}
// //         onChange={onChange}
// //         disabled={readOnly}
// //         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${errors[name] ? "border-red-400" : "border-gray-300"
// //           }`}
// //       >
// //         <option value="">Select {label}</option>
// //         {options.map((o) => (
// //           <option key={o} value={o}>
// //             {o}
// //           </option>
// //         ))}
// //       </select>
// //     ) : (
// //       <input
// //         type={type}
// //         name={name}
// //         value={form[name] || ""}
// //         onChange={onChange}
// //         placeholder={placeholder}
// //         readOnly={readOnly}
// //         maxLength={name === "mobile" ? 10 : undefined}
// //         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${errors[name] ? "border-red-400" : "border-gray-300"
// //           }`}
// //       />
// //     )}

// //     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
// //   </div>
// // );

// // export default function AddMember() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { id } = useParams();
// //   const isEdit = Boolean(id);
// //   const fileRef = useRef();

// //   const [form, setForm] = useState(emptyForm);
// //   const [errors, setErrors] = useState({});
// //   const [saved, setSaved] = useState(false);
// //   const [enquiryOptions, setEnquiryOptions] = useState([]);
// //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// //   const [loadingEnquiries, setLoadingEnquiries] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // Pre-fill from enquiry passed via navigation state
// //   useEffect(() => {
// //     if (!isEdit && location.state?.enquiry) {
// //       const enquiry = location.state.enquiry;
// //       prefillFromEnquiry(enquiry);
// //       setSelectedEnquiry({
// //         value: enquiry._id,
// //         label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
// //         data: enquiry,
// //       });
// //     }
// //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

// //   // Load pending enquiries for dropdown
// //   useEffect(() => {
// //     if (isEdit) return;

// //     const loadEnquiries = async () => {
// //       try {
// //         setLoadingEnquiries(true);
// //         const response = await api.fitnessEnquiry.getAll({ limit: 100 });
// //         const raw = response?.data ?? response;
// //         const list = Array.isArray(raw) ? raw : [];
// //         const filteredList = list.filter((e) => e.status !== "Admitted");

// //         const options = filteredList.map((enquiry) => ({
// //           value: enquiry._id,
// //           label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
// //           data: enquiry,
// //         }));

// //         setEnquiryOptions(options);
// //       } catch (err) {
// //         console.error("Failed to load enquiries:", err);
// //         toast.error("Could not load enquiries. You can still fill the form manually.");
// //       } finally {
// //         setLoadingEnquiries(false);
// //       }
// //     };

// //     loadEnquiries();
// //   }, [isEdit]);

// //   // Load existing member for edit
// //   useEffect(() => {
// //     if (!isEdit) return;

// //     const fetchMember = async () => {
// //       try {
// //         const response = await api.fitnessMember.getById(id);
// //         const member = response?.data ?? response;

// //         if (member) {
// //           setForm({
// //             ...emptyForm,
// //             ...member,
// //             startDate: formatDateForInput(member.startDate),
// //             endDate: formatDateForInput(member.endDate),
// //             paymentDate: formatDateForInput(member.paymentDate),
// //             photoPreview: member.photo || null,
// //           });
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         toast.error("Failed to load member details.");
// //       }
// //     };

// //     fetchMember();
// //   }, [id, isEdit]);

// //   // Auto-calculate final amount
// //   useEffect(() => {
// //     const fee = parseFloat(form.planFee) || 0;
// //     const disc = parseFloat(form.discount) || 0;

// //     if (fee > 0 || disc > 0) {
// //       setForm((p) => ({
// //         ...p,
// //         finalAmount: String(Math.max(0, fee - disc)),
// //       }));
// //     }
// //   }, [form.planFee, form.discount]);

// //   // Auto-set userId from mobile
// //   useEffect(() => {
// //     if (!isEdit && form.mobile) {
// //       setForm((p) => ({ ...p, userId: form.mobile }));
// //     }
// //   }, [form.mobile, isEdit]);

// //   // Auto-generate password for add mode
// //   useEffect(() => {
// //     if (!isEdit) {
// //       setForm((prev) => {
// //         if (prev.password) return prev;
// //         return { ...prev, password: generatePassword() };
// //       });
// //     }
// //   }, [isEdit]);

// //   const prefillFromEnquiry = (enquiry) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       enquiryId: enquiry._id,
// //       name: enquiry.fullName || enquiry.name || "",
// //       mobile: enquiry.mobile || enquiry.contact || "",
// //       email: enquiry.email || "",
// //       age: enquiry.age || "",
// //       gender: enquiry.gender || "Male",
// //       address: enquiry.address || "",
// //       activity: enquiry.interestedActivity || enquiry.activity || prev.activity,
// //     }));
// //   };

// //   const handleEnquirySelect = (option) => {
// //     setSelectedEnquiry(option);

// //     if (option) {
// //       prefillFromEnquiry(option.data);
// //       toast.success("Enquiry details loaded successfully!");
// //     } else {
// //       setForm((prev) => ({ ...prev, enquiryId: null }));
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     let updatedValue = value;

// //     if (name === "mobile") {
// //       updatedValue = value.replace(/\D/g, "").slice(0, 10);
// //     }

// //     if (name === "age") {
// //       updatedValue = value.replace(/\D/g, "").slice(0, 3);
// //     }

// //     setForm((p) => ({ ...p, [name]: updatedValue }));

// //     if (errors[name]) {
// //       setErrors((p) => ({ ...p, [name]: "" }));
// //     }
// //   };

// //   const handlePhoto = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       setForm((p) => ({
// //         ...p,
// //         photo: file,
// //         photoPreview: ev.target.result,
// //       }));
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   const validate = () => {
// //     const e = {};

// //     if (form.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) {
// //       e.startDate = "Enter a valid date.";
// //     }

// //     if (form.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.endDate)) {
// //       e.endDate = "Enter a valid date.";
// //     }

// //     if (form.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.paymentDate)) {
// //       e.paymentDate = "Enter a valid date.";
// //     }

// //     if (form.startDate && form.endDate && form.endDate < form.startDate) {
// //       e.endDate = "End date cannot be before start date.";
// //     }

// //     if (!form.name.trim()) e.name = "Full name is required.";

// //     if (!form.mobile.trim()) {
// //       e.mobile = "Mobile number is required.";
// //     } else if (!/^\d{10}$/.test(form.mobile)) {
// //       e.mobile = "Enter a valid 10-digit mobile.";
// //     }

// //     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
// //       e.email = "Enter a valid email.";
// //     }

// //     if (!form.activity) e.activity = "Activity is required.";
// //     if (!form.startDate) e.startDate = "Start date is required.";
// //     if (!form.endDate) e.endDate = "End date is required.";
// //     if (!form.password?.trim()) e.password = "Password is required.";

// //     return e;
// //   };

// //   const handleSave = async () => {
// //     const errs = validate();

// //     if (Object.keys(errs).length) {
// //       setErrors(errs);
// //       toast.error("Please fix the highlighted errors before saving.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const formData = new FormData();

// //       Object.keys(form).forEach((key) => {
// //         if (key === "photo" || key === "photoPreview" || key === "enquiryId") return;

// //         if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
// //           formData.append(key, form[key]);
// //         }
// //       });

// //       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
// //       if (form.photo instanceof File) formData.append("photo", form.photo);

// //       if (isEdit) {
// //         await api.fitnessMember.update(id, formData);
// //         toast.success("Member updated successfully!");
// //       } else {
// //         await api.fitnessMember.create(formData);
// //         toast.success("Member added successfully!");
// //       }

// //       setSaved(true);
// //       setTimeout(() => navigate("/fitness/members"), 1500);
// //     } catch (err) {
// //       console.error(err);
// //       const message = err?.response?.data?.message || err?.message || "Failed to save member. Please try again.";
// //       toast.error(message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (saved) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
// //           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
// //             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //             </svg>
// //           </div>
// //           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
// //           <p className="text-sm text-gray-500">Redirecting to members list…</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const fieldProps = { form, errors, onChange: handleChange };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
// //       <div className="flex items-center justify-between mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
// //         <button
// //           onClick={() => navigate("/fitness/members")}
// //           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// //         >
// //           Back to Members
// //         </button>
// //       </div>

// //       {!isEdit && (
// //         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
// //           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
// //           <div className="max-w-md">
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Choose an existing enquiry to auto-fill details
// //             </label>
// //             <Select
// //               options={enquiryOptions}
// //               onChange={handleEnquirySelect}
// //               value={selectedEnquiry}
// //               placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
// //               isClearable
// //               isLoading={loadingEnquiries}
// //               noOptionsMessage={() => "No pending enquiries found"}
// //               className="react-select-container"
// //               classNamePrefix="react-select"
// //             />
// //           </div>
// //           <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
// //         </div>
// //       )}

// //       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
// //               <div
// //                 onClick={() => fileRef.current.click()}
// //                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
// //               >
// //                 {form.photoPreview ? (
// //                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
// //                 ) : (
// //                   <div className="text-center">
// //                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={1.5}
// //                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
// //                       />
// //                     </svg>
// //                     <p className="text-xs text-gray-400 mt-1">Photo</p>
// //                   </div>
// //                 )}
// //               </div>
// //               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
// //             </div>

// //             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
// //               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
// //             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
// //             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
// //           </div>

// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Address</label>
// //             <input
// //               type="text"
// //               name="address"
// //               value={form.address}
// //               onChange={handleChange}
// //               placeholder="Full address"
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Activity" name="activity" options={ACTIVITIES} required {...fieldProps} />
// //             <Field label="Membership Status" name="membershipStatus" readOnly {...fieldProps} />
// //             {/* <Field label="Status" name="status" options={STATUSES} {...fieldProps} /> */}
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">
// //                 Start Date<span className="text-red-400 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="date"
// //                 name="startDate"
// //                 value={form.startDate || ""}
// //                 onChange={handleChange}
// //                 min="1900-01-01"
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.startDate ? "border-red-400" : "border-gray-300"
// //                   }`}
// //               />
// //               {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
// //             </div>

// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">
// //                 End Date<span className="text-red-400 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="date"
// //                 name="endDate"
// //                 value={form.endDate || ""}
// //                 onChange={handleChange}
// //                 min={form.startDate || ""}
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.endDate ? "border-red-400" : "border-gray-300"
// //                   }`}
// //               />
// //               {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
// //             </div>
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Plan Duration" name="planDuration" options={PLAN_DURATIONS} {...fieldProps} />
// //             <Field label="Plan" name="plan" options={PLANS} {...fieldProps} />
// //             <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fieldProps} />
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fieldProps} />
// //             <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fieldProps} />

// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
// //               <input
// //                 type="date"
// //                 name="paymentDate"
// //                 value={form.paymentDate || ""}
// //                 onChange={handleChange}
// //                 min="1900-01-01"
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.paymentDate ? "border-red-400" : "border-gray-300"
// //                   }`}
// //               />
// //               {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate}</p>}
// //             </div>
// //           </div>

// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
// //             <textarea
// //               name="planNotes"
// //               value={form.planNotes}
// //               onChange={handleChange}
// //               rows={3}
// //               placeholder="Any additional notes..."
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />

// //             <div className="flex flex-col gap-1">
// //               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //                 Password<span className="text-red-500 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 name="password"
// //                 value={form.password}
// //                 onChange={handleChange}
// //                 placeholder="e.g. EMP@1234"
// //                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
// //                 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
// //                 ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
// //               />
// //               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex justify-end gap-3 pt-6 border-t">
// //           <button
// //             onClick={() => navigate("/fitness/members")}
// //             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
// //           >
// //             Cancel
// //           </button>

// //           <button
// //             onClick={handleSave}
// //             disabled={loading}
// //             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
// //           >
// //             {loading && (
// //               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
// //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
// //               </svg>
// //             )}
// //             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// // new oneeeee











// // import { useState, useEffect, useRef } from "react";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // import { toast } from "sonner";
// // import { api } from "../../../services/apiClient";
// // import Select from "react-select";

// // const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// // const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// // const GENDERS = ["Male", "Female", "Other"];
// // const STATUSES = ["Active", "Inactive"];
// // const PLAN_DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

// // const emptyForm = {
// //   name: "",
// //   mobile: "",
// //   email: "",
// //   age: "",
// //   gender: "Male",
// //   address: "",
// //   photo: null,
// //   photoPreview: null,
// //   activity: "",
// //   plan: "Monthly",
// //   membershipStatus: "Active",
// //   status: "Active",
// //   startDate: "",
// //   endDate: "",
// //   planDuration: "1 Month",
// //   planFee: "",
// //   discount: "",
// //   finalAmount: "",
// //   paymentDate: "",
// //   planNotes: "",
// //   userId: "",
// //   password: "",
// //   enquiryId: null,
// // };

// // const formatDateForInput = (dateValue) => {
// //   if (!dateValue) return "";
// //   const d = new Date(dateValue);
// //   if (isNaN(d.getTime())) return "";
// //   return d.toISOString().split("T")[0];
// // };

// // const generatePassword = () => {
// //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
// //   let password = "";
// //   for (let i = 0; i < 8; i++) {
// //     password += chars.charAt(Math.floor(Math.random() * chars.length));
// //   }
// //   return password;
// // };

// // // Field component OUTSIDE parent so it never remounts on re-render
// // const Field = ({
// //   label,
// //   name,
// //   type = "text",
// //   placeholder = "",
// //   required = false,
// //   readOnly = false,
// //   options,
// //   form,
// //   errors,
// //   onChange,
// // }) => (
// //   <div>
// //     <label className="block text-xs text-gray-600 mb-1">
// //       {label}
// //       {required && <span className="text-red-400 ml-0.5">*</span>}
// //     </label>

// //     {options ? (
// //       <select
// //         name={name}
// //         value={form[name] || ""}
// //         onChange={onChange}
// //         disabled={readOnly}
// //         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${
// //           errors[name] ? "border-red-400" : "border-gray-300"
// //         }`}
// //       >
// //         <option value="">Select {label}</option>
// //         {options.map((o) => (
// //           <option key={o} value={o}>
// //             {o}
// //           </option>
// //         ))}
// //       </select>
// //     ) : (
// //       <input
// //         type={type}
// //         name={name}
// //         value={form[name] || ""}
// //         onChange={onChange}
// //         placeholder={placeholder}
// //         readOnly={readOnly}
// //         maxLength={name === "mobile" ? 10 : undefined}
// //         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${
// //           errors[name] ? "border-red-400" : "border-gray-300"
// //         }`}
// //       />
// //     )}

// //     {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
// //   </div>
// // );

// // export default function AddMember() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { id } = useParams();
// //   const isEdit = Boolean(id);
// //   const fileRef = useRef();

// //   const [form, setForm] = useState(emptyForm);
// //   const [errors, setErrors] = useState({});
// //   const [saved, setSaved] = useState(false);
// //   const [enquiryOptions, setEnquiryOptions] = useState([]);
// //   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
// //   const [loadingEnquiries, setLoadingEnquiries] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // Pre-fill from enquiry passed via navigation state
// //   useEffect(() => {
// //     if (!isEdit && location.state?.enquiry) {
// //       const enquiry = location.state.enquiry;
// //       prefillFromEnquiry(enquiry);
// //       setSelectedEnquiry({
// //         value: enquiry._id,
// //         label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
// //         data: enquiry,
// //       });
// //     }
// //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

// //   // Load pending enquiries for dropdown
// //   useEffect(() => {
// //     if (isEdit) return;

// //     const loadEnquiries = async () => {
// //       try {
// //         setLoadingEnquiries(true);
// //         const response = await api.fitnessEnquiry.getAll({ limit: 100 });
// //         const raw = response?.data ?? response;
// //         const list = Array.isArray(raw) ? raw : [];
// //         const filteredList = list.filter((e) => e.status !== "Admitted");

// //         const options = filteredList.map((enquiry) => ({
// //           value: enquiry._id,
// //           label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
// //           data: enquiry,
// //         }));

// //         setEnquiryOptions(options);
// //       } catch (err) {
// //         console.error("Failed to load enquiries:", err);
// //         toast.error("Could not load enquiries. You can still fill the form manually.");
// //       } finally {
// //         setLoadingEnquiries(false);
// //       }
// //     };

// //     loadEnquiries();
// //   }, [isEdit]);

// //   // Load existing member for edit
// //   useEffect(() => {
// //     if (!isEdit) return;

// //     const fetchMember = async () => {
// //       try {
// //         const response = await api.fitnessMember.getById(id);
// //         const member = response?.data ?? response;

// //         if (member) {
// //           setForm({
// //             ...emptyForm,
// //             ...member,
// //             startDate: formatDateForInput(member.startDate),
// //             endDate: formatDateForInput(member.endDate),
// //             paymentDate: formatDateForInput(member.paymentDate),
// //             photoPreview: member.photo || null,
// //           });
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         toast.error("Failed to load member details.");
// //       }
// //     };

// //     fetchMember();
// //   }, [id, isEdit]);

// //   // Auto-calculate final amount
// //   useEffect(() => {
// //     const fee = parseFloat(form.planFee) || 0;
// //     const disc = parseFloat(form.discount) || 0;

// //     if (fee > 0 || disc > 0) {
// //       setForm((p) => ({
// //         ...p,
// //         finalAmount: String(Math.max(0, fee - disc)),
// //       }));
// //     }
// //   }, [form.planFee, form.discount]);

// //   // Auto-set userId from mobile
// //   useEffect(() => {
// //     if (!isEdit && form.mobile) {
// //       setForm((p) => ({ ...p, userId: form.mobile }));
// //     }
// //   }, [form.mobile, isEdit]);

// //   // Auto-generate password for add mode
// //   useEffect(() => {
// //     if (!isEdit) {
// //       setForm((prev) => {
// //         if (prev.password) return prev;
// //         return { ...prev, password: generatePassword() };
// //       });
// //     }
// //   }, [isEdit]);

// //   // Auto membership status from start and end date
// //   useEffect(() => {
// //     if (!form.startDate || !form.endDate) return;

// //     const today = new Date().toISOString().split("T")[0];

// //     let status = "Inactive";

// //     if (today >= form.startDate && today <= form.endDate) {
// //       status = "Active";
// //     }

// //     setForm((prev) => ({
// //       ...prev,
// //       membershipStatus: status,
// //       status: status,
// //     }));
// //   }, [form.startDate, form.endDate]);

// //   const prefillFromEnquiry = (enquiry) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       enquiryId: enquiry._id,
// //       name: enquiry.fullName || enquiry.name || "",
// //       mobile: enquiry.mobile || enquiry.contact || "",
// //       email: enquiry.email || "",
// //       age: enquiry.age || "",
// //       gender: enquiry.gender || "Male",
// //       address: enquiry.address || "",
// //       activity: enquiry.interestedActivity || enquiry.activity || prev.activity,
// //     }));
// //   };

// //   const handleEnquirySelect = (option) => {
// //     setSelectedEnquiry(option);

// //     if (option) {
// //       prefillFromEnquiry(option.data);
// //       toast.success("Enquiry details loaded successfully!");
// //     } else {
// //       setForm((prev) => ({ ...prev, enquiryId: null }));
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     let updatedValue = value;

// //     if (name === "mobile") {
// //       updatedValue = value.replace(/\D/g, "").slice(0, 10);
// //     }

// //     if (name === "age") {
// //       updatedValue = value.replace(/\D/g, "").slice(0, 3);
// //     }

// //     setForm((p) => ({ ...p, [name]: updatedValue }));

// //     if (errors[name]) {
// //       setErrors((p) => ({ ...p, [name]: "" }));
// //     }
// //   };

// //   const handlePhoto = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       setForm((p) => ({
// //         ...p,
// //         photo: file,
// //         photoPreview: ev.target.result,
// //       }));
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   const validate = () => {
// //     const e = {};

// //     if (form.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) {
// //       e.startDate = "Enter a valid date.";
// //     }

// //     if (form.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.endDate)) {
// //       e.endDate = "Enter a valid date.";
// //     }

// //     if (form.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.paymentDate)) {
// //       e.paymentDate = "Enter a valid date.";
// //     }

// //     if (form.startDate && form.endDate && form.endDate < form.startDate) {
// //       e.endDate = "End date cannot be before start date.";
// //     }

// //     if (!form.name.trim()) e.name = "Full name is required.";

// //     if (!form.mobile.trim()) {
// //       e.mobile = "Mobile number is required.";
// //     } else if (!/^\d{10}$/.test(form.mobile)) {
// //       e.mobile = "Enter a valid 10-digit mobile.";
// //     }

// //     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
// //       e.email = "Enter a valid email.";
// //     }

// //     if (!form.activity) e.activity = "Activity is required.";
// //     if (!form.startDate) e.startDate = "Start date is required.";
// //     if (!form.endDate) e.endDate = "End date is required.";
// //     if (!form.password?.trim()) e.password = "Password is required.";

// //     return e;
// //   };

// //   const handleSave = async () => {
// //     const errs = validate();

// //     if (Object.keys(errs).length) {
// //       setErrors(errs);
// //       toast.error("Please fix the highlighted errors before saving.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const formData = new FormData();

// //       Object.keys(form).forEach((key) => {
// //         if (key === "photo" || key === "photoPreview" || key === "enquiryId") return;

// //         if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
// //           formData.append(key, form[key]);
// //         }
// //       });

// //       if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
// //       if (form.photo instanceof File) formData.append("photo", form.photo);

// //       if (isEdit) {
// //         await api.fitnessMember.update(id, formData);
// //         toast.success("Member updated successfully!");
// //       } else {
// //         await api.fitnessMember.create(formData);
// //         toast.success("Member added successfully!");
// //       }

// //       setSaved(true);
// //       setTimeout(() => navigate("/fitness/members"), 1500);
// //     } catch (err) {
// //       console.error(err);
// //       const message = err?.response?.data?.message || err?.message || "Failed to save member. Please try again.";
// //       toast.error(message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (saved) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
// //           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
// //             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //             </svg>
// //           </div>
// //           <p className="text-lg font-semibold text-gray-800">Member {isEdit ? "updated" : "added"} successfully!</p>
// //           <p className="text-sm text-gray-500">Redirecting to members list…</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const fieldProps = { form, errors, onChange: handleChange };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
// //       <div className="flex items-center justify-between mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Member" : "Add Member"}</h1>
// //         <button
// //           onClick={() => navigate("/fitness/members")}
// //           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// //         >
// //           Back to Members
// //         </button>
// //       </div>

// //       {!isEdit && (
// //         <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
// //           <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
// //           <div className="max-w-md">
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Choose an existing enquiry to auto-fill details
// //             </label>
// //             <Select
// //               options={enquiryOptions}
// //               onChange={handleEnquirySelect}
// //               value={selectedEnquiry}
// //               placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
// //               isClearable
// //               isLoading={loadingEnquiries}
// //               noOptionsMessage={() => "No pending enquiries found"}
// //               className="react-select-container"
// //               classNamePrefix="react-select"
// //             />
// //           </div>
// //           <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
// //         </div>
// //       )}

// //       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">
// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Personal Information</h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
// //               <div
// //                 onClick={() => fileRef.current.click()}
// //                 className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#1a2a5e] transition-colors overflow-hidden"
// //               >
// //                 {form.photoPreview ? (
// //                   <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
// //                 ) : (
// //                   <div className="text-center">
// //                     <svg className="w-7 h-7 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={1.5}
// //                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
// //                       />
// //                     </svg>
// //                     <p className="text-xs text-gray-400 mt-1">Photo</p>
// //                   </div>
// //                 )}
// //               </div>
// //               <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
// //             </div>

// //             <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <Field label="Full Name" name="name" placeholder="Enter full name" required {...fieldProps} />
// //               <Field label="Mobile Number" name="mobile" placeholder="10-digit number" required {...fieldProps} />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Email" name="email" type="email" placeholder="email@example.com" {...fieldProps} />
// //             <Field label="Age" name="age" type="number" placeholder="Age" {...fieldProps} />
// //             <Field label="Gender" name="gender" options={GENDERS} {...fieldProps} />
// //           </div>

// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Address</label>
// //             <input
// //               type="text"
// //               name="address"
// //               value={form.address}
// //               onChange={handleChange}
// //               placeholder="Full address"
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Activity" name="activity" options={ACTIVITIES} required {...fieldProps} />
// //             <Field label="Membership Status" name="membershipStatus" readOnly {...fieldProps} />
// //             {/* <Field label="Status" name="status" options={STATUSES} {...fieldProps} /> */}
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">
// //                 Start Date<span className="text-red-400 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="date"
// //                 name="startDate"
// //                 value={form.startDate || ""}
// //                 onChange={handleChange}
// //                 min="1900-01-01"
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
// //                   errors.startDate ? "border-red-400" : "border-gray-300"
// //                 }`}
// //               />
// //               {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
// //             </div>

// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">
// //                 End Date<span className="text-red-400 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="date"
// //                 name="endDate"
// //                 value={form.endDate || ""}
// //                 onChange={handleChange}
// //                 min={form.startDate || ""}
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
// //                   errors.endDate ? "border-red-400" : "border-gray-300"
// //                 }`}
// //               />
// //               {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
// //             </div>
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Plan Duration" name="planDuration" options={PLAN_DURATIONS} {...fieldProps} />
// //             <Field label="Plan" name="plan" options={PLANS} {...fieldProps} />
// //             <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fieldProps} />
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //             <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fieldProps} />
// //             <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fieldProps} />

// //             <div>
// //               <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
// //               <input
// //                 type="date"
// //                 name="paymentDate"
// //                 value={form.paymentDate || ""}
// //                 onChange={handleChange}
// //                 min="1900-01-01"
// //                 max="9999-12-31"
// //                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
// //                   errors.paymentDate ? "border-red-400" : "border-gray-300"
// //                 }`}
// //               />
// //               {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate}</p>}
// //             </div>
// //           </div>

// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
// //             <textarea
// //               name="planNotes"
// //               value={form.planNotes}
// //               onChange={handleChange}
// //               rows={3}
// //               placeholder="Any additional notes..."
// //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />

// //             <div className="flex flex-col gap-1">
// //               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //                 Password<span className="text-red-500 ml-0.5">*</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 name="password"
// //                 value={form.password}
// //                 onChange={handleChange}
// //                 placeholder="e.g. EMP@1234"
// //                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
// //                 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
// //                 ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
// //               />
// //               {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex justify-end gap-3 pt-6 border-t">
// //           <button
// //             onClick={() => navigate("/fitness/members")}
// //             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
// //           >
// //             Cancel
// //           </button>

// //           <button
// //             onClick={handleSave}
// //             disabled={loading}
// //             className="px-8 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold disabled:opacity-70 flex items-center gap-2"
// //           >
// //             {loading && (
// //               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
// //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
// //               </svg>
// //             )}
// //             {loading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }















// // New Oneeee 









// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { toast } from "sonner";
// import { api } from "../../../services/apiClient";
// import Select from "react-select";

// const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
// const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const GENDERS = ["Male", "Female", "Other"];
// const STATUSES = ["Active", "Inactive"];
// const STAFF_OPTIONS = ["Staff 1", "Staff 2", "Staff 3"];
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

// // Field component OUTSIDE parent so it never remounts on re-render
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
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white disabled:bg-gray-50 ${
//           errors[name] ? "border-red-400" : "border-gray-300"
//         }`}
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
//         className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white read-only:bg-gray-50 read-only:text-gray-500 ${
//           errors[name] ? "border-red-400" : "border-gray-300"
//         }`}
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

//   // Pre-fill from enquiry passed via navigation state
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

//   // Load pending enquiries for dropdown
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

//   // Load existing member for edit
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
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load member details.");
//       }
//     };

//     fetchMember();
//   }, [id, isEdit]);

//   // Auto-calculate final amount
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

//   // Auto-set userId from mobile
//   useEffect(() => {
//     if (!isEdit && form.mobile) {
//       setForm((p) => ({ ...p, userId: form.mobile }));
//     }
//   }, [form.mobile, isEdit]);

//   // Auto-generate password for add mode
//   useEffect(() => {
//     if (!isEdit) {
//       setForm((prev) => {
//         if (prev.password) return prev;
//         return { ...prev, password: generatePassword() };
//       });
//     }
//   }, [isEdit]);

//   // Auto membership status from start and end date
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
//       activity: enquiry.interestedActivity || enquiry.activity || prev.activity,
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
//             {/* <Field label="Status" name="status" options={STATUSES} {...fieldProps} /> */}
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
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
//                   errors.startDate ? "border-red-400" : "border-gray-300"
//                 }`}
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
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
//                   errors.endDate ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <Field label="Responsible Staff" name="Staff" options={STAFF_OPTIONS} {...fieldProps} />
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
//                 className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
//                   errors.paymentDate ? "border-red-400" : "border-gray-300"
//                 }`}
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



// New Oneee






import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";
import Select from "react-select";

const ACTIVITIES = ["Gym Fitness", "Yoga", "Personal Training", "Zumba", "Swimming", "Aerobics", "Other"];
const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
const GENDERS = ["Male", "Female", "Other"];
const STATUSES = ["Active", "Inactive"];
const PAYMENT_STATUSES = ["Paid", "Pending"];
const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  age: "",
  gender: "Male",
  address: "",
  photo: null,
  photoPreview: null,
  activity: "",
  plan: "Monthly",
  membershipStatus: "Active",
  status: "Active",
  startDate: "",
  endDate: "",
  staff: "",
  paymentStatus: "Pending",
  paymentMode: "",
  planFee: "",
  discount: "",
  finalAmount: "",
  paymentDate: "",
  planNotes: "",
  userId: "",
  password: "",
  enquiryId: null,
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const Field = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  readOnly = false,
  options,
  form,
  errors,
  onChange,
}) => (
  <div>
    <label className="block text-xs text-gray-600 mb-1">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
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
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
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

export default function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileRef = useRef();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [enquiryOptions, setEnquiryOptions] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [loading, setLoading] = useState(false);

  const [staffOptions, setStaffOptions] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    if (!isEdit && location.state?.enquiry) {
      const enquiry = location.state.enquiry;
      prefillFromEnquiry(enquiry);
      setSelectedEnquiry({
        value: enquiry._id,
        label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
        data: enquiry,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEdit) return;

    const loadEnquiries = async () => {
      try {
        setLoadingEnquiries(true);
        const response = await api.fitnessEnquiry.getAll({ limit: 100 });
        const raw = response?.data ?? response;
        const list = Array.isArray(raw) ? raw : [];
        const filteredList = list.filter((e) => e.status !== "Admitted");

        const options = filteredList.map((enquiry) => ({
          value: enquiry._id,
          label: `${enquiry.enquiryId || "ENQ"} - ${enquiry.fullName} (${enquiry.mobile})`,
          data: enquiry,
        }));

        setEnquiryOptions(options);
      } catch (err) {
        console.error("Failed to load enquiries:", err);
        toast.error("Could not load enquiries. You can still fill the form manually.");
      } finally {
        setLoadingEnquiries(false);
      }
    };

    loadEnquiries();
  }, [isEdit]);

  // ✅ NEW: Load staff dynamically
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoadingStaff(true);
        const response = await api.fitnessStaff.getAll({ limit: 200 });

        const raw =
          response?.data?.data?.staff ||
          response?.data?.staff ||
          response?.data?.data ||
          response?.data ||
          [];

        const list = Array.isArray(raw) ? raw : [];

        const options = list.map((staff) => ({
          value: staff._id,
          label: staff.fullName || staff.name || "Unnamed Staff",
        }));

        setStaffOptions(options);
      } catch (err) {
        console.error("Failed to load staff:", err);
        toast.error("Could not load responsible staff list.");
      } finally {
        setLoadingStaff(false);
      }
    };

    loadStaff();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const response = await api.fitnessMember.getById(id);
        const member = response?.data ?? response;

        if (member) {
          setForm({
            ...emptyForm,
            ...member,
            startDate: formatDateForInput(member.startDate),
            endDate: formatDateForInput(member.endDate),
            paymentDate: formatDateForInput(member.paymentDate),
            photoPreview: member.photo || null,
            staff:
              typeof member.staff === "object"
                ? member.staff?._id || ""
                : member.staff || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load member details.");
      }
    };

    fetchMember();
  }, [id, isEdit]);

  useEffect(() => {
    const fee = parseFloat(form.planFee) || 0;
    const disc = parseFloat(form.discount) || 0;

    if (fee > 0 || disc > 0) {
      setForm((p) => ({
        ...p,
        finalAmount: String(Math.max(0, fee - disc)),
      }));
    } else {
      setForm((p) => ({
        ...p,
        finalAmount: "",
      }));
    }
  }, [form.planFee, form.discount]);

  useEffect(() => {
    if (!isEdit && form.mobile) {
      setForm((p) => ({ ...p, userId: form.mobile }));
    }
  }, [form.mobile, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      setForm((prev) => {
        if (prev.password) return prev;
        return { ...prev, password: generatePassword() };
      });
    }
  }, [isEdit]);

  useEffect(() => {
    if (!form.startDate || !form.endDate) return;

    const today = new Date().toISOString().split("T")[0];
    let status = "Inactive";

    if (today >= form.startDate && today <= form.endDate) {
      status = "Active";
    }

    setForm((prev) => ({
      ...prev,
      membershipStatus: status,
      status: status,
    }));
  }, [form.startDate, form.endDate]);

  const prefillFromEnquiry = (enquiry) => {
    setForm((prev) => ({
      ...prev,
      enquiryId: enquiry._id,
      name: enquiry.fullName || enquiry.name || "",
      mobile: enquiry.mobile || enquiry.contact || "",
      email: enquiry.email || "",
      age: enquiry.age || "",
      gender: enquiry.gender || "Male",
      address: enquiry.address || "",
      activity:
        typeof enquiry.interestedActivity === "object"
          ? enquiry.interestedActivity?.name || enquiry.interestedActivity?.activityName || prev.activity
          : enquiry.interestedActivity || enquiry.activity || prev.activity,
      staff:
        typeof enquiry.responsibleStaff === "object"
          ? enquiry.responsibleStaff?._id || ""
          : enquiry.responsibleStaff || prev.staff,
    }));
  };

  const handleEnquirySelect = (option) => {
    setSelectedEnquiry(option);

    if (option) {
      prefillFromEnquiry(option.data);
      toast.success("Enquiry details loaded successfully!");
    } else {
      setForm((prev) => ({ ...prev, enquiryId: null }));
    }
  };

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

    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({
        ...p,
        photo: file,
        photoPreview: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};

    if (form.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) {
      e.startDate = "Enter a valid date.";
    }

    if (form.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.endDate)) {
      e.endDate = "Enter a valid date.";
    }

    if (form.paymentDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.paymentDate)) {
      e.paymentDate = "Enter a valid date.";
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "End date cannot be before start date.";
    }

    if (!form.name.trim()) e.name = "Full name is required.";

    if (!form.mobile.trim()) {
      e.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      e.mobile = "Enter a valid 10-digit mobile.";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Enter a valid email.";
    }

    if (!form.activity) e.activity = "Activity is required.";
    if (!form.startDate) e.startDate = "Start date is required.";
    if (!form.endDate) e.endDate = "End date is required.";
    if (!form.password?.trim()) e.password = "Password is required.";

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

      Object.keys(form).forEach((key) => {
        if (key === "photo" || key === "photoPreview" || key === "enquiryId") return;

        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      if (form.enquiryId) formData.append("enquiryId", form.enquiryId);
      if (form.photo instanceof File) formData.append("photo", form.photo);

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
      console.error(err);
      const message = err?.response?.data?.message || err?.message || "Failed to save member. Please try again.";
      toast.error(message);
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
        <button
          onClick={() => navigate("/fitness/members")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Members
        </button>
      </div>

      {!isEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an existing enquiry to auto-fill details
            </label>
            <Select
              options={enquiryOptions}
              onChange={handleEnquirySelect}
              value={selectedEnquiry}
              placeholder={loadingEnquiries ? "Loading enquiries..." : "Search and select fitness enquiry..."}
              isClearable
              isLoading={loadingEnquiries}
              noOptionsMessage={() => "No pending enquiries found"}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">OR fill the member form manually below</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl space-y-8">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
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
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership &amp; Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Activity" name="activity" options={ACTIVITIES} required {...fieldProps} />
            <Field label="Membership Status" name="membershipStatus" readOnly {...fieldProps} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Start Date<span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate || ""}
                onChange={handleChange}
                min="1900-01-01"
                max="9999-12-31"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
                  errors.startDate ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                End Date<span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate || ""}
                onChange={handleChange}
                min={form.startDate || ""}
                max="9999-12-31"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
                  errors.endDate ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Membership Plan &amp; Fee Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* ✅ CHANGED: Dynamic Responsible Staff */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Responsible Staff</label>
              <Select
                options={staffOptions}
                value={staffOptions.find((opt) => opt.value === form.staff) || null}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    staff: selected?.value || "",
                  }))
                }
                placeholder={loadingStaff ? "Loading staff..." : "Select Responsible Staff"}
                isClearable
                isLoading={loadingStaff}
                classNamePrefix="react-select"
              />
              {errors.staff && <p className="mt-1 text-xs text-red-500">{errors.staff}</p>}
            </div>

            <Field label="Plan" name="plan" options={PLANS} {...fieldProps} />
            <Field label="Plan Fee (₹)" name="planFee" type="number" placeholder="0" {...fieldProps} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Discount (₹)" name="discount" type="number" placeholder="0" {...fieldProps} />
            <Field label="Final Amount (₹)" name="finalAmount" readOnly placeholder="Auto calculated" {...fieldProps} />

            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate || ""}
                onChange={handleChange}
                min="1900-01-01"
                max="9999-12-31"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${
                  errors.paymentDate ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Status" name="paymentStatus" options={PAYMENT_STATUSES} {...fieldProps} />
            <Field label="Payment Mode" name="paymentMode" options={PAYMENT_MODES} {...fieldProps} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Plan Notes</label>
            <textarea
              name="planNotes"
              value={form.planNotes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-[#1a2a5e] mb-4">Login Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User ID (Mobile)" name="userId" placeholder="Auto from mobile" readOnly {...fieldProps} />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="e.g. EMP@1234"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={() => navigate("/fitness/members")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
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


