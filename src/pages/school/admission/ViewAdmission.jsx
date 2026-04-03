// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function ViewAdmission() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchAdmission();
//   }, [id]);

//   const fetchAdmission = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await api.schoolAdmission.getById(id);
//       setData(response.data);
//     } catch (err) {
//       setError('Failed to load admission details');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-10 pb-12">
//         <div className="text-center text-gray-500 py-12">Loading...</div>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-10 pb-12">
//         <div className="text-center text-red-500 py-12">{error || 'Admission not found'}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto space-y-10 pb-12">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Admission Details – {data.admissionId}</h1>
//         <button
//           onClick={() => navigate('/school/admission')}
//           className="px-6 py-2 border rounded-lg hover:bg-gray-50"
//         >
//           Back to List
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow divide-y">

//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6">Personal & Health Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div><strong>Full Name:</strong> {data.fullName}</div>
//             <div><strong>Age:</strong> {data.age}</div>
//             <div><strong>Gender:</strong> {data.gender}</div>
//             <div><strong>Date of Birth:</strong> {data.dob ? new Date(data.dob).toLocaleDateString() : '-'}</div>
//             <div><strong>Aadhaar:</strong> {data.aadhaar || '-'}</div>
//             <div><strong>Mobile:</strong> {data.mobile}</div>
//             <div className="col-span-3"><strong>Address:</strong> {data.fullAddress}</div>
//             <div><strong>Blood Group:</strong> {data.bloodGroup || '-'}</div>
//             <div><strong>Physical Disability:</strong> {data.physicalDisability}</div>
//             <div><strong>Main Illness:</strong> {data.mainIllness || '-'}</div>
//             <div><strong>Doctor:</strong> {data.doctorName || '-'} ({data.doctorVillage || '-'}, {data.doctorMobile || '-'})</div>
//             <div><strong>Serious Disease:</strong> {data.seriousDisease}</div>
//             <div><strong>Regular Medication:</strong> {data.regularMedication}</div>
//             <div className="col-span-3"><strong>Health Details:</strong> {data.healthDetails || '-'}</div>
//           </div>
//         </section>

//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6">Education, Routine & Interests</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div><strong>Education:</strong> {data.education || '-'}</div>
//             <div><strong>Place:</strong> {data.educationPlace || '-'}</div>
//             <div><strong>Years of Service:</strong> {data.yearsOfService || '-'}</div>
//             <div><strong>Occupation Type:</strong> {data.occupationType || '-'}</div>
//             <div className="col-span-3"><strong>Daily Routine:</strong> Wake {data.wakeUpTime || '-'} | Breakfast {data.breakfastTime || '-'} | Lunch {data.lunchTime || '-'} | Dinner {data.dinnerTime || '-'}</div>
//             <div><strong>Behaviour:</strong> {data.behaviour || '-'}</div>
//             <div><strong>Hobbies:</strong> {data.hobbies?.filter(Boolean).join(', ') || '-'}</div>
//             <div><strong>Games:</strong> {data.games?.filter(Boolean).join(', ') || '-'}</div>
//           </div>
//         </section>

//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6">Emergency & Declaration</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div><strong>Emergency Contact:</strong> {data.emergencyContactName || '-'} ({data.relationship || '-'})</div>
//             <div><strong>Mobile:</strong> {data.emergencyMobile || '-'}</div>
//             <div><strong>Location:</strong> {data.villageCity || '-'}</div>
//             <div className="col-span-3"><strong>Declaration:</strong> Agreed on {data.declarationDate ? new Date(data.declarationDate).toLocaleDateString() : '-'} at {data.declarationPlace || '-'}</div>
//           </div>
//         </section>

//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6">Admission & Payment Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div><strong>Admission ID:</strong> {data.admissionId}</div>
//             <div><strong>Login Mobile:</strong> {data.loginMobile}</div>
//             <div><strong>Assigned Caregiver:</strong> {data.assignedCaregiver || '-'}</div>
//             <div><strong>Fee Plan:</strong> {data.feePlan}</div>
//             <div><strong>Amount:</strong> ₹{data.amount?.toLocaleString() || '-'}</div>
//             <div><strong>Payment Status:</strong> {data.paymentStatus}</div>
//             <div><strong>Payment Mode:</strong> {data.paymentMode || '-'}</div>
//             <div><strong>Next Due:</strong> {data.nextDueDate ? new Date(data.nextDueDate).toLocaleDateString() : '-'}</div>
//             <div className="col-span-3"><strong>Remarks:</strong> {data.feeRemarks || '-'}</div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }







import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/apiClient';

export default function ViewAdmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmission();
  }, [id]);

  const fetchAdmission = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.schoolAdmission.getById(id);
      setData(response.data);
    } catch (err) {
      setError('Failed to load admission details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-gray-500 py-12">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-red-500 py-12">{error || 'Admission not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admission Details – {data.admissionId}</h1>
        <button
          onClick={() => navigate('/school/admission')}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-xl shadow divide-y">

        {/* Personal */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6">Personal & Health Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><strong>Full Name:</strong> {data.fullName}</div>
            <div><strong>Age:</strong> {data.age}</div>
            <div><strong>Gender:</strong> {data.gender}</div>
            <div><strong>Date of Birth:</strong> {data.dob ? new Date(data.dob).toLocaleDateString() : '-'}</div>
            <div><strong>Aadhaar:</strong> {data.aadhaar || '-'}</div>
            <div><strong>Mobile:</strong> {data.mobile}</div>
            <div className="col-span-3"><strong>Address:</strong> {data.fullAddress}</div>
            <div><strong>Blood Group:</strong> {data.bloodGroup || '-'}</div>
            <div><strong>Physical Disability:</strong> {data.physicalDisability}</div>
            <div><strong>Main Illness:</strong> {data.mainIllness || '-'}</div>
            <div><strong>Doctor:</strong> {data.doctorName || '-'} ({data.doctorVillage || '-'}, {data.doctorMobile || '-'})</div>
            <div><strong>Serious Disease:</strong> {data.seriousDisease}</div>
            <div><strong>Regular Medication:</strong> {data.regularMedication}</div>
            <div className="col-span-3"><strong>Health Details:</strong> {data.healthDetails || '-'}</div>
          </div>
        </section>

        {/* Education */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6">Education, Routine & Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><strong>Education:</strong> {data.education || '-'}</div>
            <div><strong>Place:</strong> {data.educationPlace || '-'}</div>
            <div><strong>Years of Service:</strong> {data.yearsOfService || '-'}</div>
            <div><strong>Occupation Type:</strong> {data.occupationType || '-'}</div>
            <div className="col-span-3">
              <strong>Daily Routine:</strong> Wake {data.wakeUpTime || '-'} | Breakfast {data.breakfastTime || '-'} | Lunch {data.lunchTime || '-'} | Dinner {data.dinnerTime || '-'}
            </div>
            <div><strong>Behaviour:</strong> {data.behaviour || '-'}</div>
            <div><strong>Hobbies:</strong> {data.hobbies?.filter(Boolean).join(', ') || '-'}</div>
            <div><strong>Games:</strong> {data.games?.filter(Boolean).join(', ') || '-'}</div>
          </div>
        </section>

        {/* ✅ UPDATED EMERGENCY SECTION */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6">Emergency Contact & Declaration</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div><strong>Primary Contact:</strong> {data.primaryContactName || '-'}</div>
            <div><strong>Relation:</strong> {data.primaryRelation || '-'}</div>
            <div><strong>Phone:</strong> {data.primaryPhone || '-'}</div>

            <div><strong>Secondary Contact:</strong> {data.secondaryContactName || '-'}</div>
            <div><strong>Relation:</strong> {data.secondaryRelation || '-'}</div>
            <div><strong>Phone:</strong> {data.secondaryPhone || '-'}</div>

            <div><strong>Village / City:</strong> {data.villageCity || '-'}</div>
            <div><strong>Alternate Contact:</strong> {data.alternateContact || '-'}</div>

            <div className="col-span-3">
              <strong>Declaration:</strong> Agreed on{' '}
              {data.declarationDate ? new Date(data.declarationDate).toLocaleDateString() : '-'}{' '}
              at {data.declarationPlace || '-'}
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6">Admission & Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><strong>Admission ID:</strong> {data.admissionId}</div>
            <div><strong>Login Mobile:</strong> {data.loginMobile}</div>
            <div><strong>Assigned Caregiver:</strong> {data.assignedCaregiver || '-'}</div>
            <div><strong>Fee Plan:</strong> {data.feePlan}</div>
            <div><strong>Amount:</strong> ₹{data.amount?.toLocaleString() || '-'}</div>
            <div><strong>Payment Status:</strong> {data.paymentStatus}</div>
            <div><strong>Payment Mode:</strong> {data.paymentMode || '-'}</div>
            <div><strong>Next Due:</strong> {data.nextDueDate ? new Date(data.nextDueDate).toLocaleDateString() : '-'}</div>
            <div className="col-span-3"><strong>Remarks:</strong> {data.feeRemarks || '-'}</div>
          </div>
        </section>

      </div>
    </div>
  );
}