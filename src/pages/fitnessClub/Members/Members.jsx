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







import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 🔥 AUTO STATUS FUNCTION
  const getStatusFromDate = (startDate, endDate) => {
    if (!startDate || !endDate) return "Inactive";

    const today = new Date().toISOString().split("T")[0];
    const s = new Date(startDate).toISOString().split("T")[0];
    const e = new Date(endDate).toISOString().split("T")[0];

    if (today >= s && today <= e) return "Active";
    return "Inactive";
  };

  // Fetch members from API
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.fitnessMember.getAll();
      setMembers(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Client-side filtering (UPDATED 🔥)
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile?.includes(searchTerm);

    const liveStatus = getStatusFromDate(member.startDate, member.endDate);

    const matchesStatus = !statusFilter || liveStatus === statusFilter;

    return matchesSearch && matchesStatus;
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fitness Members</h1>
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
                <th className="px-5 py-4 text-left font-semibold">Name</th>
                <th className="px-5 py-4 text-left font-semibold">Mobile</th>
                <th className="px-5 py-4 text-left font-semibold">Activity</th>
                <th className="px-5 py-4 text-left font-semibold">Plan</th>
                <th className="px-5 py-4 text-left font-semibold">Status</th>
                <th className="px-5 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a5e]"></div>
                    </div>
                    <p className="text-gray-500 mt-3">Loading members...</p>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => {
                  const liveStatus = getStatusFromDate(member.startDate, member.endDate);

                  return (
                    <tr 
                      key={member._id || member.id} 
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {member.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{member.mobile}</td>
                      <td className="px-5 py-4 text-gray-600">{member.activity}</td>
                      <td className="px-5 py-4 text-gray-600">{member.plan}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            liveStatus === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {liveStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/fitness/members/view-member/${member._id || member.id}`)}
                            className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/fitness/members/edit-member/${member._id || member.id}`)}
                            className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member._id || member.id)}
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