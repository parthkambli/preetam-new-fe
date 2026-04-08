// import { useParams, useNavigate } from "react-router-dom";
// import { initialMembers } from "./Members";

// function ReadField({ label, value, className = "" }) {
//   return (
//     <div className={className}>
//       <label className="block text-xs text-gray-500 mb-1">{label}</label>
//       <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 min-h-[38px]">
//         {value || <span className="text-gray-400">—</span>}
//       </div>
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-base font-bold text-[#1a2a5e] mb-4 mt-6 first:mt-0">{children}</h2>
//   );
// }

// export default function ViewMember() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Pull from global store if available, fall back to initial data
//   const store = window.__membersStore || initialMembers;
//   const member = store.find((m) => String(m.id) === String(id));

//   if (!member) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 mb-4">Member not found.</p>
//           <button
//             onClick={() => navigate("/members")}
//             className="bg-[#1a2a5e] text-white px-5 py-2 rounded-lg text-sm"
//           >
//             Back to Members
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (d) => {
//     if (!d) return "";
//     const dt = new Date(d);
//     return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-24">
//       {/* Page title */}
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">View Member</h1>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl">

//         {/* ── Personal Information ── */}
//         <SectionTitle>Personal Information</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-4 mb-4">
//           {/* Profile photo */}
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Profile Photo</label>
//             <div className="w-28 h-28 border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
//               {member.photo ? (
//                 <img src={member.photo} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-xs text-gray-400">Photo</span>
//               )}
//             </div>
//           </div>

//           <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <ReadField label="Full Name" value={member.name} />
//             <ReadField label="Mobile Number" value={member.mobile} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Email" value={member.email} />
//           <ReadField label="Age" value={member.age} />
//           <ReadField label="Gender" value={member.gender} />
//         </div>

//         <div className="mb-6">
//           <ReadField label="Address" value={member.address} />
//         </div>

//         {/* ── Membership & Activity ── */}
//         <SectionTitle>Membership &amp; Activity</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Activity" value={member.activity} />
//           <ReadField label="Membership Status" value={member.membershipStatus} />
//           <ReadField label="Start Date" value={formatDate(member.startDate)} />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <ReadField label="End Date" value={formatDate(member.endDate)} />
//         </div>

//         {/* ── Membership Plan & Fee Details ── */}
//         <SectionTitle>Membership Plan &amp; Fee Details</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Plan Duration" value={member.planDuration} />
//           <ReadField label="Plan Fee" value={member.planFee ? `₹ ${Number(member.planFee).toLocaleString("en-IN")}` : ""} />
//           <ReadField label="Discount" value={member.discount ? `₹ ${Number(member.discount).toLocaleString("en-IN")}` : ""} />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Final Amount" value={member.finalAmount ? `₹ ${Number(member.finalAmount).toLocaleString("en-IN")}` : ""} />
//           <ReadField label="Payment Date" value={formatDate(member.paymentDate)} />
//         </div>
//         <div className="mb-6">
//           <ReadField label="Plan Notes" value={member.planNotes} />
//         </div>

//         {/* ── Login Details ── */}
//         <SectionTitle>Login Details</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <ReadField label="User ID" value={member.userId} />
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Password</label>
//             <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50">
//               {"•".repeat(8)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Fixed Edit button bottom-right ── */}
//       <div className="fixed bottom-6 right-6 z-40">
//         <button
//           onClick={() => navigate(`/fitness/members/edit-member/${member.id}`)}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-6 py-3 rounded-xl shadow-lg text-sm transition-colors duration-200 flex items-center gap-2"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//           </svg>
//           Edit
//         </button>
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// function ReadField({ label, value, className = "" }) {
//   return (
//     <div className={className}>
//       <label className="block text-xs text-gray-500 mb-1">{label}</label>
//       <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 min-h-[42px] flex items-center">
//         {value || <span className="text-gray-400">—</span>}
//       </div>
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-base font-bold text-[#1a2a5e] mb-4 mt-8 first:mt-0">
//       {children}
//     </h2>
//   );
// }

// export default function ViewMember() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [member, setMember] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const fetchMember = async () => {
//       if (!id) return;
//       setLoading(true);
//       setError(false);

//       try {
//         const response = await api.fitnessMember.getById(id);
//         setMember(response.data);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load member details");
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMember();
//   }, [id]);

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "—";
//     const dt = new Date(dateStr);
//     return dt.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric"
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "—";
//     return `₹ ${Number(amount).toLocaleString("en-IN")}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a5e] mx-auto"></div>
//           <p className="text-gray-500 mt-4">Loading member details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !member) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 mb-4">Member not found or failed to load.</p>
//           <button
//             onClick={() => navigate("/fitness/members")}
//             className="bg-[#1a2a5e] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#152147]"
//           >
//             Back to Members
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-24">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Member Details</h1>
//         <button
//           onClick={() => navigate("/fitness/members")}
//           className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
//         >
//           Back to Members
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl mx-auto">

//         {/* Personal Information */}
//         <SectionTitle>Personal Information</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-6 mb-6">
//           {/* Profile Photo */}
//           <div>
//             <label className="block text-xs text-gray-500 mb-2">Profile Photo</label>
//             <div className="w-32 h-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-100">
//               {member.photo ? (
//                 <img
//                   src={member.photo}
//                   alt={member.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
//                   No Photo
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <ReadField label="Full Name" value={member.name} />
//             <ReadField label="Mobile Number" value={member.mobile} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <ReadField label="Email" value={member.email} />
//           <ReadField label="Age" value={member.age} />
//           <ReadField label="Gender" value={member.gender} />
//         </div>

//         <ReadField label="Address" value={member.address} className="mb-8" />

//         {/* Membership & Activity */}
//         <SectionTitle>Membership &amp; Activity</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <ReadField label="Activity" value={member.activity} />
//           <ReadField label="Membership Status" value={member.membershipStatus} />
//           <ReadField label="Status" value={member.status} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <ReadField label="Start Date" value={formatDate(member.startDate)} />
//           <ReadField label="End Date" value={formatDate(member.endDate)} />
//         </div>

//         {/* Membership Plan & Fee Details */}
//         <SectionTitle>Membership Plan &amp; Fee Details</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Plan Duration" value={member.planDuration} />
//           <ReadField label="Plan" value={member.plan} />
//           <ReadField label="Plan Fee" value={formatCurrency(member.planFee)} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <ReadField label="Discount" value={formatCurrency(member.discount)} />
//           <ReadField label="Final Amount" value={formatCurrency(member.finalAmount)} />
//           <ReadField label="Payment Date" value={formatDate(member.paymentDate)} />
//         </div>

//         <ReadField label="Plan Notes" value={member.planNotes} className="mb-8" />

//         {/* Login Details */}
//         <SectionTitle>Login Details</SectionTitle>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <ReadField label="User ID" value={member.userId} />
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Password</label>
//             <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50">
//               ••••••••
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating Edit Button */}
//       <div className="fixed bottom-8 right-8 z-50">
//         <button
//           onClick={() => navigate(`/fitness/members/edit-member/${id}`)}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 transition-all active:scale-95"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//           </svg>
//           Edit Member
//         </button>
//       </div>
//     </div>
//   );
// }






// New One 




import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

function ReadField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 min-h-[42px] flex items-center">
        {value || <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-bold text-[#1a2a5e] mb-4 mt-8 first:mt-0">
      {children}
    </h2>
  );
}

export default function ViewMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);

      try {
        const response = await api.fitnessMember.getById(id);
        setMember(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load member details");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const dt = new Date(dateStr);
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "—";
    return `₹ ${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "";
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return "";
    return dt.toISOString().split("T")[0];
  };

  const getStatusFromDate = (startDate, endDate) => {
    const formattedStartDate = formatDateOnly(startDate);
    const formattedEndDate = formatDateOnly(endDate);

    if (!formattedStartDate || !formattedEndDate) return "Inactive";

    const today = new Date().toISOString().split("T")[0];

    if (today >= formattedStartDate && today <= formattedEndDate) {
      return "Active";
    }

    return "Inactive";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a5e] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Member not found or failed to load.</p>
          <button
            onClick={() => navigate("/fitness/members")}
            className="bg-[#1a2a5e] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#152147]"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const liveStatus = getStatusFromDate(member.startDate, member.endDate);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Member Details</h1>
        <button
          onClick={() => navigate("/fitness/members")}
          className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          Back to Members
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl mx-auto">

        {/* Personal Information */}
        <SectionTitle>Personal Information</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-6 mb-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Profile Photo</label>
            <div className="w-32 h-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-100">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Photo
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadField label="Full Name" value={member.name} />
            <ReadField label="Mobile Number" value={member.mobile} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ReadField label="Email" value={member.email} />
          <ReadField label="Age" value={member.age} />
          <ReadField label="Gender" value={member.gender} />
        </div>

        <ReadField label="Address" value={member.address} className="mb-8" />

        {/* Membership & Activity */}
        <SectionTitle>Membership &amp; Activity</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ReadField label="Activity" value={member.activity} />
          <ReadField label="Membership Status" value={liveStatus} />
          {/* <ReadField label="Status" value={liveStatus} /> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <ReadField label="Start Date" value={formatDate(member.startDate)} />
          <ReadField label="End Date" value={formatDate(member.endDate)} />
        </div>

        {/* Membership Plan & Fee Details */}
        <SectionTitle>Membership Plan &amp; Fee Details</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <ReadField label="Plan Duration" value={member.planDuration} />
          <ReadField label="Plan" value={member.plan} />
          <ReadField label="Plan Fee" value={formatCurrency(member.planFee)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <ReadField label="Discount" value={formatCurrency(member.discount)} />
          <ReadField label="Final Amount" value={formatCurrency(member.finalAmount)} />
          <ReadField label="Payment Date" value={formatDate(member.paymentDate)} />
        </div>

        <ReadField label="Plan Notes" value={member.planNotes} className="mb-8" />

        {/* Login Details */}
        <SectionTitle>Login Details</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadField label="User ID" value={member.userId} />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50">
              ••••••••
            </div>
          </div>
        </div>
      </div>

      {/* Floating Edit Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate(`/fitness/members/edit-member/${id}`)}
          className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Member
        </button>
      </div>
    </div>
  );
}