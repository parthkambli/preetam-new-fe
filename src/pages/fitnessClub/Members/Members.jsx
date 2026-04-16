// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const MEMBERS_DATA_KEY = "members_data";

// export const initialMembers = [
//   {
//     id: 1,
//     name: "Rohit Sharma",
//     mobile: "9876543210",
//     activity: "Gym Fitness",
//     plan: "Monthly",
//     status: "Active",
//     email: "rohit@gmail.com",
//     age: "29",
//     gender: "Male",
//     address: "Andheri East, Mumbai",
//     photo: null,
//     membershipStatus: "Active",
//     startDate: "2026-01-01",
//     endDate: "2026-01-31",
//     planDuration: "1 Month",
//     planFee: "2500",
//     discount: "500",
//     finalAmount: "2000",
//     paymentDate: "2026-01-01",
//     planNotes: "Morning batch preferred",
//     userId: "9876543210",
//     password: "rohit@123",
//   },
//   {
//     id: 2,
//     name: "Anjali Mehta",
//     mobile: "9123456789",
//     activity: "Yoga",
//     plan: "Quarterly",
//     status: "Active",
//     email: "anjali@gmail.com",
//     age: "34",
//     gender: "Female",
//     address: "Bandra West, Mumbai",
//     photo: null,
//     membershipStatus: "Active",
//     startDate: "2025-10-01",
//     endDate: "2025-12-31",
//     planDuration: "3 Months",
//     planFee: "6000",
//     discount: "500",
//     finalAmount: "5500",
//     paymentDate: "2025-10-01",
//     planNotes: "Evening batch only",
//     userId: "9123456789",
//     password: "anjali@123",
//   },
//   {
//     id: 3,
//     name: "Suresh Patil",
//     mobile: "9988776655",
//     activity: "Personal Training",
//     plan: "Yearly",
//     status: "Inactive",
//     email: "suresh@gmail.com",
//     age: "42",
//     gender: "Male",
//     address: "Pune, Maharashtra",
//     photo: null,
//     membershipStatus: "Inactive",
//     startDate: "2025-01-01",
//     endDate: "2025-12-31",
//     planDuration: "12 Months",
//     planFee: "24000",
//     discount: "2000",
//     finalAmount: "22000",
//     paymentDate: "2025-01-01",
//     planNotes: "Weekdays only",
//     userId: "9988776655",
//     password: "suresh@123",
//   },
// ];

// // Simple global store (in-memory, survives navigation within session)
// if (!window.__membersStore) window.__membersStore = [...initialMembers];

// export function useMembersStore() {
//   return window.__membersStore;
// }

// export default function Members() {
//   const navigate = useNavigate();
//   const [members, setMembers] = useState(window.__membersStore);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // Keep local state in sync with global store
//   const syncedMembers = window.__membersStore;

//   const filtered = syncedMembers.filter((m) => {
//     const nameMatch =
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       m.mobile.includes(searchTerm);
//     const statusMatch = !statusFilter || m.status === statusFilter;
//     return nameMatch && statusMatch;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Members</h1>
//         <button
//           onClick={() => navigate("/fitness/members/add-members")}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm shadow-md whitespace-nowrap"
//         >
//           Add Members
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <input
//           type="text"
//           placeholder="Search Name / Mobile"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//         >
//           <option value="">Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-3 text-left font-semibold">Name</th>
//                 <th className="px-5 py-3 text-left font-semibold">Mobile</th>
//                 <th className="px-5 py-3 text-left font-semibold">Activity</th>
//                 <th className="px-5 py-3 text-left font-semibold">Plan</th>
//                 <th className="px-5 py-3 text-left font-semibold">Status</th>
//                 <th className="px-5 py-3 text-left font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
//                     No members found.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((member, idx) => (
//                   <tr key={member.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                     <td className="px-5 py-3 text-gray-800 font-medium whitespace-nowrap">{member.name}</td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{member.mobile}</td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{member.activity}</td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{member.plan}</td>
//                     <td className="px-5 py-3 whitespace-nowrap">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                           member.status === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-500"
//                         }`}
//                       >
//                         {member.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => navigate(`/fitness/members/view-member/${member.id}`)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => navigate(`/fitness/members/edit-member/${member.id}`)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// export default function Members() {
//   const navigate = useNavigate();

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // Fetch members from API
//   const fetchMembers = async () => {
//     setLoading(true);
//     try {
//       const response = await api.fitnessMember.getAll({
//         // You can add query params here if backend supports
//         // search: searchTerm,
//         // status: statusFilter
//       });
//       setMembers(response.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load members");
//       setMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   // Client-side filtering
//   const filteredMembers = members.filter((member) => {
//     const matchesSearch =
//       member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       member.mobile?.includes(searchTerm);

//     const matchesStatus = !statusFilter || member.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this member?")) return;

//     try {
//       await api.fitnessMember.delete(id);
//       toast.success("Member deleted successfully");
//       fetchMembers(); // Refresh list
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete member");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Fitness Members</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={fetchMembers}
//             className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//           >
//             ↻ Refresh
//           </button>
//           <button
//             onClick={() => navigate("/fitness/members/add-members")}
//             className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-md"
//           >
//             + Add Member
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search by Name or Mobile"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-4 text-left font-semibold">Name</th>
//                 <th className="px-5 py-4 text-left font-semibold">Mobile</th>
//                 <th className="px-5 py-4 text-left font-semibold">Activity</th>
//                 <th className="px-5 py-4 text-left font-semibold">Plan</th>
//                 <th className="px-5 py-4 text-left font-semibold">Status</th>
//                 <th className="px-5 py-4 text-left font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-20 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a5e]"></div>
//                     </div>
//                     <p className="text-gray-500 mt-3">Loading members...</p>
//                   </td>
//                 </tr>
//               ) : filteredMembers.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
//                     No members found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMembers.map((member, idx) => (
//                   <tr 
//                     key={member._id || member.id} 
//                     className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   >
//                     <td className="px-5 py-4 font-medium text-gray-800">
//                       {member.name}
//                     </td>
//                     <td className="px-5 py-4 text-gray-600">{member.mobile}</td>
//                     <td className="px-5 py-4 text-gray-600">{member.activity}</td>
//                     <td className="px-5 py-4 text-gray-600">{member.plan}</td>
//                     <td className="px-5 py-4">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                           member.status === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {member.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => navigate(`/fitness/members/view-member/${member._id || member.id}`)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => navigate(`/fitness/members/edit-member/${member._id || member.id}`)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(member._id || member.id)}
//                           className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <p className="text-xs text-gray-400 mt-4 text-center">
//         Showing {filteredMembers.length} of {members.length} members
//       </p>
//     </div>
//   );
// }





// New Oneeeee







// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// export default function Members() {
//   const navigate = useNavigate();

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // 🔥 AUTO STATUS FUNCTION
//   const getStatusFromDate = (startDate, endDate) => {
//     if (!startDate || !endDate) return "Inactive";

//     const today = new Date().toISOString().split("T")[0];
//     const s = new Date(startDate).toISOString().split("T")[0];
//     const e = new Date(endDate).toISOString().split("T")[0];

//     if (today >= s && today <= e) return "Active";
//     return "Inactive";
//   };

//   // Fetch members from API
//   const fetchMembers = async () => {
//     setLoading(true);
//     try {
//       const response = await api.fitnessMember.getAll();
//       setMembers(response.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load members");
//       setMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   // Client-side filtering (UPDATED 🔥)
//   const filteredMembers = members.filter((member) => {
//     const matchesSearch =
//       member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       member.mobile?.includes(searchTerm);

//     const liveStatus = getStatusFromDate(member.startDate, member.endDate);

//     const matchesStatus = !statusFilter || liveStatus === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this member?")) return;

//     try {
//       await api.fitnessMember.delete(id);
//       toast.success("Member deleted successfully");
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete member");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Fitness Members</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={fetchMembers}
//             className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//           >
//             ↻ Refresh
//           </button>
//           <button
//             onClick={() => navigate("/fitness/members/add-members")}
//             className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-md"
//           >
//             + Add Member
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search by Name or Mobile"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-4 text-left font-semibold">Name</th>
//                 <th className="px-5 py-4 text-left font-semibold">Mobile</th>
//                 <th className="px-5 py-4 text-left font-semibold">Activity</th>
//                 <th className="px-5 py-4 text-left font-semibold">Plan</th>
//                 <th className="px-5 py-4 text-left font-semibold">Responsible Staff</th>
//                 <th className="px-5 py-4 text-left font-semibold">Status</th>
//                 <th className="px-5 py-4 text-left font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-20 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a5e]"></div>
//                     </div>
//                     <p className="text-gray-500 mt-3">Loading members...</p>
//                   </td>
//                 </tr>
//               ) : filteredMembers.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
//                     No members found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMembers.map((member, idx) => {
//                   const liveStatus = getStatusFromDate(member.startDate, member.endDate);

//                   return (
//                     <tr
//                       key={member._id || member.id}
//                       className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="px-5 py-4 font-medium text-gray-800">
//                         {member.name}
//                       </td>
//                       <td className="px-5 py-4 text-gray-600">{member.mobile}</td>
//                       <td className="px-5 py-4 text-gray-600">{member.activity}</td>
//                       <td className="px-5 py-4 text-gray-600">{member.plan}</td>
//                       <td className="px-5 py-4 text-gray-600">
//                         {member.staff?.fullName || '-'}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${liveStatus === "Active"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-red-100 text-red-600"
//                             }`}
//                         >
//                           {liveStatus}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => navigate(`/fitness/members/view-member/${member._id || member.id}`)}
//                             className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => navigate(`/fitness/members/edit-member/${member._id || member.id}`)}
//                             className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(member._id || member.id)}
//                             className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <p className="text-xs text-gray-400 mt-4 text-center">
//         Showing {filteredMembers.length} of {members.length} members
//       </p>
//     </div>
//   );
// }











// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const PLANS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
// const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];
// const PAYMENT_STATUSES = ["Paid", "Pending"];

// // ─── Renew Modal Component ───────────────────────────────────────────────────
// function RenewModal({ member, onClose, onRenewed }) {
//   const [form, setForm] = useState({
//     plan: member.plan || "Monthly",
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: "",
//     planFee: member.planFee || "",
//     discount: "0",
//     finalAmount: "",
//     paymentMode: member.paymentMode || "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     paymentStatus: "Paid",
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [staffOptions, setStaffOptions] = useState([]);
//   const [loadingStaff, setLoadingStaff] = useState(false);

//   // Auto calculate endDate based on plan
//   useEffect(() => {
//     if (!form.startDate || !form.plan) return;
//     const start = new Date(form.startDate);
//     let end = new Date(start);

//     if (form.plan === "Monthly")      end.setMonth(end.getMonth() + 1);
//     else if (form.plan === "Quarterly") end.setMonth(end.getMonth() + 3);
//     else if (form.plan === "Half Yearly") end.setMonth(end.getMonth() + 6);
//     else if (form.plan === "Yearly")  end.setFullYear(end.getFullYear() + 1);

//     end.setDate(end.getDate() - 1);
//     setForm(prev => ({ ...prev, endDate: end.toISOString().split("T")[0] }));
//   }, [form.startDate, form.plan]);

//   // Auto calculate finalAmount
//   useEffect(() => {
//     const fee = parseFloat(form.planFee) || 0;
//     const disc = parseFloat(form.discount) || 0;
//     setForm(prev => ({
//       ...prev,
//       finalAmount: fee > 0 ? String(Math.max(0, fee - disc)) : ""
//     }));
//   }, [form.planFee, form.discount]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.startDate) e.startDate = "Start date required";
//     if (!form.endDate)   e.endDate   = "End date required";
//     if (form.endDate < form.startDate) e.endDate = "End date cannot be before start date";
//     return e;
//   };

//   const handleRenew = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     setLoading(true);
//     try {
//       await api.fitnessMember.renew(member._id, form);
//       toast.success(`${member.name} ka membership renew ho gaya!`);
//       onRenewed();
//       onClose();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Renew failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Backdrop
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div>
//             <h2 className="text-lg font-bold text-[#1a2a5e]">Renew Membership</h2>
//             <p className="text-xs text-gray-500 mt-0.5">{member.name} • {member.mobile}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="px-6 py-5 space-y-4">
//           {/* Plan + Start Date */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Plan</label>
//               <select
//                 name="plan"
//                 value={form.plan}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               >
//                 {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Start Date <span className="text-red-400">*</span></label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={form.startDate}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.startDate ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
//             </div>
//           </div>

//           {/* End Date (auto calculated) */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">End Date <span className="text-red-400">*</span></label>
//             <input
//               type="date"
//               name="endDate"
//               value={form.endDate}
//               onChange={handleChange}
//               className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] ${errors.endDate ? "border-red-400" : "border-gray-300"}`}
//             />
//             {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
//             <p className="text-xs text-gray-400 mt-1">Plan select karne se auto set ho jaata hai</p>
//           </div>

//           {/* Fee Details */}
//           <div className="grid grid-cols-3 gap-3">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
//               <input
//                 type="number"
//                 name="planFee"
//                 value={form.planFee}
//                 onChange={handleChange}
//                 placeholder="0"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
//               <input
//                 type="number"
//                 name="discount"
//                 value={form.discount}
//                 onChange={handleChange}
//                 placeholder="0"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Final (₹)</label>
//               <input
//                 type="number"
//                 name="finalAmount"
//                 value={form.finalAmount}
//                 readOnly
//                 placeholder="Auto"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 focus:outline-none"
//               />
//             </div>
//           </div>

//           {/* Payment Details */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//               <select
//                 name="paymentMode"
//                 value={form.paymentMode}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               >
//                 <option value="">Select</option>
//                 {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
//               <select
//                 name="paymentStatus"
//                 value={form.paymentStatus}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//               >
//                 {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Payment Date */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//             <input
//               type="date"
//               name="paymentDate"
//               value={form.paymentDate}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//             />
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
//           <button
//             onClick={onClose}
//             className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleRenew}
//             disabled={loading}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
//           >
//             {loading && (
//               <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
//               </svg>
//             )}
//             {loading ? "Renewing..." : "✓ Renew Now"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ///



// // ─── Main Members Component ──────────────────────────────────────────────────
// export default function Members() {
//   const navigate = useNavigate();

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // Renew modal state
//   const [renewMember, setRenewMember] = useState(null); // null = modal closed

//   const getStatusFromDate = (startDate, endDate) => {
//     if (!startDate || !endDate) return "Inactive";
//     const today = new Date().toISOString().split("T")[0];
//     const s = new Date(startDate).toISOString().split("T")[0];
//     const e = new Date(endDate).toISOString().split("T")[0];
//     if (today >= s && today <= e) return "Active";
//     return "Inactive";
//   };

//   const fetchMembers = async () => {
//     setLoading(true);
//     try {
//       const response = await api.fitnessMember.getAll();
//       setMembers(response.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load members");
//       setMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchMembers(); }, []);

//   const filteredMembers = members.filter((member) => {
//     const matchesSearch =
//       member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       member.mobile?.includes(searchTerm);
//     const liveStatus = getStatusFromDate(member.startDate, member.endDate);
//     const matchesStatus = !statusFilter || liveStatus === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this member?")) return;
//     try {
//       await api.fitnessMember.delete(id);
//       toast.success("Member deleted successfully");
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete member");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

//       {/* Renew Modal */}
//       {renewMember && (
//         <RenewModal
//           member={renewMember}
//           onClose={() => setRenewMember(null)}
//           onRenewed={fetchMembers}
//         />
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Fitness Members</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={fetchMembers}
//             className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//           >
//             ↻ Refresh
//           </button>
//           <button
//             onClick={() => navigate("/fitness/members/add-members")}
//             className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-md"
//           >
//             + Add Member
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search by Name or Mobile"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-4 text-left font-semibold">Name</th>
//                 <th className="px-5 py-4 text-left font-semibold">Mobile</th>
//                 <th className="px-5 py-4 text-left font-semibold">Activity</th>
//                 <th className="px-5 py-4 text-left font-semibold">Plan</th>
//                 <th className="px-5 py-4 text-left font-semibold">Responsible Staff</th>
//                 <th className="px-5 py-4 text-left font-semibold">Status</th>
//                 <th className="px-5 py-4 text-left font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-20 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a5e]"></div>
//                     </div>
//                     <p className="text-gray-500 mt-3">Loading members...</p>
//                   </td>
//                 </tr>
//               ) : filteredMembers.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
//                     No members found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMembers.map((member, idx) => {
//                   const liveStatus = getStatusFromDate(member.startDate, member.endDate);

//                   return (
//                     <tr
//                       key={member._id || member.id}
//                       className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="px-5 py-4 font-medium text-gray-800">{member.name}</td>
//                       <td className="px-5 py-4 text-gray-600">{member.mobile}</td>
//                       <td className="px-5 py-4 text-gray-600">{member.activity}</td>
//                       <td className="px-5 py-4 text-gray-600">{member.plan}</td>
//                       <td className="px-5 py-4 text-gray-600">
//                        {member.staff?.fullName || member.staff?.name || (typeof member.staff === 'string' ? member.staff : '-')}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                           liveStatus === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-600"
//                         }`}>
//                           {liveStatus}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex gap-2 flex-wrap">
//                           <button
//                             onClick={() => navigate(`/fitness/members/view-member/${member._id || member.id}`)}
//                             className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => navigate(`/fitness/members/edit-member/${member._id || member.id}`)}
//                             className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             Edit
//                           </button>

//                           {/* ✅ RENEW BUTTON - sirf Inactive members ko dikhega */}
//                           {liveStatus === "Inactive" && (
//                             <button
//                               onClick={() => setRenewMember(member)}
//                               className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                             >
//                               Renew
//                             </button>
//                           )}

//                           <button
//                             onClick={() => handleDelete(member._id || member.id)}
//                             className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <p className="text-xs text-gray-400 mt-4 text-center">
//         Showing {filteredMembers.length} of {members.length} members
//       </p>
//     </div>
//   );
// } 





// Members.jsx — updated for multi-activity members
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";
import PassRenewModal from "./PassRenewModal";

const PLAN_OPTIONS = [
  { value: "Annual",  label: "Annual",  months: 12 },
  { value: "Monthly", label: "Monthly", months: 1  },
  { value: "Weekly",  label: "Weekly",  days: 7    },
  { value: "Daily",   label: "Daily",   days: 1    },
  { value: "Hourly",  label: "Hourly",  days: 1    },
];

const PAYMENT_MODES    = ["Cash", "Cheque", "Online", "UPI"];
const PAYMENT_STATUSES = ["Paid", "Pending"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayString = () => new Date().toISOString().split("T")[0];

const computeActivityStatus = (af) => {
  if (af.paymentStatus !== "Paid") return "Inactive";
  if (!af.startDate || !af.endDate) return "Inactive";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(af.startDate); start.setHours(0, 0, 0, 0);
  const end   = new Date(af.endDate);   end.setHours(23, 59, 59, 999);
  return today >= start && today <= end ? "Active" : "Inactive";
};

const computeEndDate = (startDate, plan) => {
  if (!startDate || !plan) return "";
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return "";
  switch (plan) {
    case "Annual":  d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1); break;
    case "Monthly": d.setMonth(d.getMonth() + 1);       d.setDate(d.getDate() - 1); break;
    case "Weekly":  d.setDate(d.getDate() + 6); break;
    default: break; // Daily/Hourly = same day
  }
  return d.toISOString().split("T")[0];
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// Remaining Days Logic
const getNearestEndDate = (member) => {
  // Pass member
  if (member.membershipPass?.endDate) {
    return member.membershipPass.endDate;
  }

  // Activity member
  const validDates = (member.activityFees || [])
    .map((af) => af.endDate)
    .filter(Boolean);

  if (validDates.length === 0) return null;

  return validDates.reduce((earliest, curr) =>
    new Date(curr) < new Date(earliest) ? curr : earliest
  );
};

const getRemainingDays = (endDate) => {
  if (!endDate) return { label: "—", type: "normal" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: "Expired", type: "expired" };
  if (diff === 0) return { label: "Last Day", type: "warning" };
  if (diff <= 3) return { label: `${diff} days`, type: "warning" };

  return { label: `${diff} days`, type: "normal" };
};


const getActivityExpiryDetails = (activityFees = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return activityFees
    .map((af, i) => {
      if (!af.endDate) return null;

      const end = new Date(af.endDate);
      const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

      const name =
        typeof af.activity === "object"
          ? af.activity?.name || af.activity?.activityName || `Activity ${i + 1}`
          : `Activity ${i + 1}`;

      return `${name}: ${
        diff < 0 ? "Expired" : diff === 0 ? "Last Day" : `${diff} days`
      }`;
    })
    .filter(Boolean)
    .join(" | ");
};



// ── Activity Summary Pill (used in table row) ─────────────────────────────────
function ActivitySummaryPills({ activityFees }) {
  if (!Array.isArray(activityFees) || activityFees.length === 0) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {activityFees.map((af, i) => {
        const status = computeActivityStatus(af);
        const name =
          typeof af.activity === "object"
            ? af.activity?.name || af.activity?.activityName || `Activity ${i + 1}`
            : `Activity ${i + 1}`;
        return (
          <span
            key={af._id || i}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
              status === "Active"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
            title={`${name} • ${af.plan || ""} • Ends ${formatDate(af.endDate)}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
            {name}
          </span>
        );
      })}
    </div>
  );
}

// ── Single Activity Renewal Row (inside modal) ────────────────────────────────
function ActivityRenewRow({ af, index, renewal, onChange, activityName }) {
  const currentStatus = computeActivityStatus(af);

  // Auto-compute end date when start or plan changes
  useEffect(() => {
    if (renewal.startDate && renewal.plan) {
      const end = computeEndDate(renewal.startDate, renewal.plan);
      if (end && end !== renewal.endDate) {
        onChange(index, "endDate", end);
      }
    }
  }, [renewal.startDate, renewal.plan]);

  // Auto-compute final amount
  const computedFinal =
    parseFloat(renewal.planFee) > 0
      ? Math.max(0, (parseFloat(renewal.planFee) || 0) - (parseFloat(renewal.discount) || 0))
      : "";

  return (
    <div className={`rounded-xl border p-4 ${
      renewal.selected
        ? "border-[#1a2a5e] bg-blue-50/40"
        : "border-gray-200 bg-gray-50 opacity-60"
    }`}>
      {/* Header: checkbox + activity name + current status */}
      <div className="flex items-center gap-3 mb-3">
        <input
          type="checkbox"
          checked={renewal.selected}
          onChange={(e) => onChange(index, "selected", e.target.checked)}
          className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
          id={`renew-check-${index}`}
        />
        <label htmlFor={`renew-check-${index}`} className="font-semibold text-sm text-gray-800 cursor-pointer flex-1">
          {activityName}
        </label>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
          currentStatus === "Active"
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-red-50 border-red-300 text-red-600"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${currentStatus === "Active" ? "bg-green-500" : "bg-red-400"}`} />
          {currentStatus}
        </span>
      </div>

      {/* Current expiry info */}
      <p className="text-xs text-gray-500 mb-3">
        Current period: <span className="font-medium text-gray-700">{formatDate(af.startDate)}</span>
        {" → "}
        <span className="font-medium text-gray-700">{formatDate(af.endDate)}</span>
      </p>

      {/* Renewal fields — only interactive when selected */}
      {renewal.selected && (
        <div className="space-y-3">
          {/* Plan + Start Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Plan</label>
              <select
                value={renewal.plan}
                onChange={(e) => onChange(index, "plan", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                New Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={renewal.startDate}
                onChange={(e) => onChange(index, "startDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              New End Date
              <span className="ml-1 text-[10px] text-gray-400">(auto-filled)</span>
            </label>
            <input
              type="date"
              value={renewal.endDate}
              onChange={(e) => onChange(index, "endDate", e.target.value)}
              min={renewal.startDate || "1900-01-01"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>

          {/* Fees */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Plan Fee (₹)</label>
              <input
                type="number" min="0"
                value={renewal.planFee}
                onChange={(e) => onChange(index, "planFee", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Discount (₹)</label>
              <input
                type="number" min="0"
                value={renewal.discount}
                onChange={(e) => onChange(index, "discount", e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Final (₹)</label>
              <input
                type="text" readOnly
                value={computedFinal !== "" ? computedFinal : ""}
                placeholder="Auto"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
              <select
                value={renewal.paymentStatus}
                onChange={(e) => onChange(index, "paymentStatus", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              >
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
              <select
                value={renewal.paymentMode}
                onChange={(e) => onChange(index, "paymentMode", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              >
                <option value="">Select</option>
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
            <input
              type="date"
              value={renewal.paymentDate}
              max={todayString()}
              onChange={(e) => onChange(index, "paymentDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Renew Modal ───────────────────────────────────────────────────────────────
function RenewModal({ member, onClose, onRenewed }) {
  // Build initial renewal state for each activityFee
  const buildInitialRenewals = () =>
    (member.activityFees || []).map((af) => {
      // Default start = day after current end date (or today if expired)
      const afterEnd = af.endDate
        ? new Date(new Date(af.endDate).getTime() + 86400000).toISOString().split("T")[0]
        : todayString();
      const startDate = afterEnd < todayString() ? todayString() : afterEnd;
      const plan = af.plan || "Monthly";
      return {
        selected:      computeActivityStatus(af) !== "Active", // pre-select inactive ones
        plan,
        startDate,
        endDate:       computeEndDate(startDate, plan),
        planFee:       String(af.planFee || ""),
        discount:      "0",
        paymentStatus: "Paid",
        paymentMode:   af.paymentMode || "",
        paymentDate:   todayString(),
        // carry through for the API
        activityFeeId:    af._id,
        activityId:       typeof af.activity === "object" ? af.activity?._id : af.activity,
        feeTypeId:        typeof af.feeType   === "object" ? af.feeType?._id  : af.feeType,
        staffId:          typeof af.staff     === "object" ? af.staff?._id    : af.staff,
      };
    });

  const [renewals, setRenewals] = useState(buildInitialRenewals);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const handleChange = (index, field, value) => {
    setRenewals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Recompute final amount on fee/discount change
      if (field === "planFee" || field === "discount") {
        const f = parseFloat(field === "planFee" ? value : updated[index].planFee) || 0;
        const d = parseFloat(field === "discount" ? value : updated[index].discount) || 0;
        updated[index].finalAmount = f > 0 ? String(Math.max(0, f - d)) : "";
      }
      return updated;
    });
    // Clear related error
    const errKey = `${index}_${field}`;
    if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" }));
  };

  const validate = () => {
    const e = {};
    const selected = renewals.filter((r) => r.selected);
    if (selected.length === 0) {
      e.global = "Please select at least one activity to renew.";
      return e;
    }
    renewals.forEach((r, i) => {
      if (!r.selected) return;
      if (!r.startDate) e[`${i}_startDate`] = "Start date required";
      if (!r.endDate)   e[`${i}_endDate`]   = "End date required";
      if (r.startDate && r.endDate && r.endDate < r.startDate)
        e[`${i}_endDate`] = "End date cannot be before start date";
    });
    return e;
  };

  const handleRenew = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const selectedRenewals = renewals
      .map((r, i) => ({ ...r, originalIndex: i }))
      .filter((r) => r.selected)
      .map((r) => ({
        activityFeeId:  r.activityFeeId,
        activityId:     r.activityId,
        feeTypeId:      r.feeTypeId,
        staffId:        r.staffId,
        plan:           r.plan,
        startDate:      r.startDate,
        endDate:        r.endDate,
        planFee:        Number(r.planFee)    || 0,
        discount:       Number(r.discount)   || 0,
        finalAmount:    Number(r.planFee) > 0
                          ? Math.max(0, (Number(r.planFee) || 0) - (Number(r.discount) || 0))
                          : 0,
        paymentStatus:  r.paymentStatus,
        paymentMode:    r.paymentMode || "",
        paymentDate:    r.paymentDate || null,
      }));

    setLoading(true);
    try {
      await api.fitnessMember.renew(member._id, { renewals: selectedRenewals });
      const count = selectedRenewals.length;
      toast.success(`${member.name}'s ${count} activit${count === 1 ? "y" : "ies"} renewed successfully!`);
      onRenewed();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Renewal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = renewals.filter((r) => r.selected).length;

  // Get activity display name for each row
  const getActivityName = (af, i) =>
    typeof af.activity === "object"
      ? af.activity?.name || af.activity?.activityName || `Activity ${i + 1}`
      : `Activity ${i + 1}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1a2a5e]">Renew Membership</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {member.name} &bull; {member.mobile}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Instruction */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            Select the activities you want to renew. Inactive ones are pre-selected. Each activity can have its own plan and dates.
          </p>
          {errors.global && (
            <p className="mt-2 text-xs text-red-500 font-medium">{errors.global}</p>
          )}
        </div>

        {/* Scrollable activity list */}
        <div className="px-6 py-3 overflow-y-auto flex-1 space-y-3">
          {(member.activityFees || []).map((af, i) => (
            <ActivityRenewRow
              key={af._id || i}
              af={af}
              index={i}
              renewal={renewals[i]}
              onChange={handleChange}
              activityName={getActivityName(af, i)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {/* Total summary */}
          {selectedCount > 0 && (
            <div className="flex items-center justify-between text-sm mb-3 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-600">
                Renewing <span className="font-semibold text-[#1a2a5e]">{selectedCount}</span> Activity{selectedCount === 1 ? "y" : "ies"}
              </span>
              <span className="font-bold text-[#1a2a5e]">
                ₹{renewals
                    .filter((r) => r.selected)
                    .reduce((sum, r) => {
                      const f = parseFloat(r.planFee)   || 0;
                      const d = parseFloat(r.discount)  || 0;
                      return sum + (f > 0 ? Math.max(0, f - d) : 0);
                    }, 0)
                    .toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRenew}
              disabled={loading || selectedCount === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Renewing…
                </>
              ) : (
                `Renew ${selectedCount > 0 ? `(${selectedCount})` : ""}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Members Component ────────────────────────────────────────────────────
export default function Members() {
  const navigate = useNavigate();

  const [members, setMembers]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [renewMember, setRenewMember] = useState(null);
  const [renewPassMember, setRenewPassMember] = useState(null);
  const [planTypeFilter, setPlanTypeFilter] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.fitnessMember.getAll();
      // backend returns array directly (applyComputedStatuses is run server-side)
      const raw = response?.data ?? response;
      setMembers(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // Overall status is driven by the computed membershipStatus from backend
  const getMemberOverallStatus = (member) => member.membershipStatus || "Inactive";

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile?.includes(searchTerm);
    const matchesStatus =
      !statusFilter || getMemberOverallStatus(member) === statusFilter;

      //New logic for added Plan type filter
      const isPassMember = !!member.membershipPass;

  const matchesPlanType =
    !planTypeFilter ||
    (planTypeFilter === "Pass" && isPassMember) ||
    (planTypeFilter === "Activity" && !isPassMember);

  return matchesSearch && matchesStatus && matchesPlanType;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.fitnessMember.delete(id);
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    }
  };


  

  // Stats
  const activeCount   = members.filter((m) => getMemberOverallStatus(m) === "Active").length;
  const inactiveCount = members.length - activeCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {renewMember && (
        <RenewModal
          member={renewMember}
          onClose={() => setRenewMember(null)}
          onRenewed={fetchMembers}
        />
      )}

      {renewPassMember && (
  <PassRenewModal
    member={renewPassMember}
    onClose={() => setRenewPassMember(null)}
    onRenewed={fetchMembers}
  />
)}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fitness Members</h1>
          {!loading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {members.length} total &bull;{" "}
              <span className="text-green-600 font-medium">{activeCount} active</span>
              {" "}
              &bull;{" "}
              <span className="text-gray-400">{inactiveCount} inactive</span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchMembers}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => navigate("/fitness/members/add-members")}
            className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-md"
          >
            + Add Member
          </button>
          <button
    onClick={() => navigate("/fitness/members/add-pass")}
    className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow-md"
  >
   + Add Pass Member
  </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
        />

        <select
  value={planTypeFilter}
  onChange={(e) => setPlanTypeFilter(e.target.value)}
  className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
>
  <option value="">All Plans</option>
  <option value="Pass">Pass</option>
  <option value="Activity">Activity</option>
</select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Member</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Mobile</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Plan Type</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Activities</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Overall Status</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Remaining Days</th>
                <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a5e]" />
                    </div>
                    <p className="text-gray-500 mt-3 text-sm">Loading members…</p>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 text-sm">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => {
                  const overallStatus = getMemberOverallStatus(member);
                  const activityFees  = member.activityFees || [];
                  const isPassMember = !!member.membershipPass;

                  const endDate = getNearestEndDate(member);
                  const remaining = getRemainingDays(endDate);
                  
                  const tooltip = getActivityExpiryDetails(member.activityFees);


                  const inactiveCount = isPassMember
  ? 0
  : activityFees.filter((af) => computeActivityStatus(af) !== "Active").length;

                  return (
                    <tr key={member._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>

                      {/* Member name + ID */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{member.name}</div>
                        {member.memberId && (
                          <div className="text-xs text-gray-400 mt-0.5">{member.memberId}</div>
                        )}
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 text-gray-600">{member.mobile}</td>

                      <td className="px-5 py-4">
  {isPassMember ? (
    <span className="text-purple-600 font-medium text-xs">Pass</span>
  ) : (
    <span className="text-blue-600 font-medium text-xs">Activity</span>
  )}
</td>

                      {/* Activity pills */}
                      <td className="px-5 py-4 max-w-xs">
                        {isPassMember ? (
  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
    Membership Pass
  </span>
) : (
  <ActivitySummaryPills activityFees={activityFees} />
)}
                      </td>

                      {/* Overall status badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          overallStatus === "Active"
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-red-50 border-red-300 text-red-600"
                        }`}>
                          
                          <span className={`w-1.5 h-1.5 rounded-full ${overallStatus === "Active" ? "bg-green-500" : "bg-red-400"}`} />
                          {overallStatus}
                        </span>
                      </td>

                      {/* Remaining Days */}
                      <td className="px-5 py-4">
  <div className="relative group inline-block">
    
    {/* Main Text */}
    <span
      className={`text-xs font-semibold cursor-pointer ${
        remaining.type === "expired"
          ? "text-red-500"
          : remaining.type === "warning"
          ? "text-orange-500"
          : "text-gray-700"
      }`}
    >
      {remaining.label}
    </span>

    {/* Tooltip */}
    {member.activityFees?.length > 0 && (
      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 text-xs text-gray-700 whitespace-nowrap">
          
          {member.activityFees.map((af, i) => {
            const end = af.endDate ? new Date(af.endDate) : null;
            const today = new Date();
            today.setHours(0,0,0,0);

            let diff = null;
            if (end) {
              diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
            }

            const name =
              typeof af.activity === "object"
                ? af.activity?.name || af.activity?.activityName || `Activity ${i + 1}`
                : `Activity ${i + 1}`;

            return (
              <div key={i} className="flex justify-between gap-4">
                <span>{name}</span>
                <span className={
                  diff < 0
                    ? "text-red-500"
                    : diff <= 3
                    ? "text-orange-500"
                    : "text-gray-600"
                }>
                  {diff < 0
                    ? "Expired"
                    : diff === 0
                    ? "Last Day"
                    : `${diff} days`}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    )}
  </div>
</td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/fitness/members/view-member/${member._id}`)}
                            className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/fitness/members/edit-member/${member._id}`)}
                            className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                          >
                            Edit
                          </button>

                          {/* Renew — show if any activity is inactive/expired */}
                          {(isPassMember ? overallStatus !== "Active" : inactiveCount > 0) && (
                            <button
                              onClick={() => {
                                if (isPassMember) {
                                  setRenewPassMember(member);
                                } else {
                                  setRenewMember(member);
                                }
                              }}
                              className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                              title={`${inactiveCount} activit${inactiveCount === 1 ? "y" : "ies"} need renewal`}
                            >
                              Renew{inactiveCount > 1 ? ` (${inactiveCount})` : ""}
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(member._id)}
                            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Showing {filteredMembers.length} of {members.length} members
      </p>
    </div>
  );
}