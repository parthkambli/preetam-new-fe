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
  const [periodMap, setPeriodMap] = useState({});
  const [activityMap, setActivityMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [staffMap, setStaffMap] = useState({});
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    fetchAdmission();
    fetchReferenceData();
    fetchPayments();
  }, [id]);

  const fetchReferenceData = async () => {
    try {
      const [periodsRes, activitiesRes, servicesRes, staffRes] = await Promise.all([
        api.periods.getAll(),
        api.activities.getAll(),
        api.schoolServices.getAll(),
        api.fitnessStaff.getAll()
      ]);
      const pm = {};
      (periodsRes.data.data || []).forEach(p => { pm[p._id] = `${p.name} (${p.startTime} - ${p.endTime})`; });
      setPeriodMap(pm);
      const am = {};
      (activitiesRes.data.data || []).forEach(a => { am[a._id] = a.name; });
      setActivityMap(am);
      const sm = {};
      (servicesRes.data.data || []).forEach(s => { sm[s._id] = s.serviceName; });
      setServiceMap(sm);
      const stm = {};
      (staffRes.data?.data?.staff || []).forEach(s => { stm[s._id] = s.fullName; });
      setStaffMap(stm);
    } catch (err) {
      console.error('Failed to fetch reference data', err);
    }
  };

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

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await api.schoolAdmission.getPayments(id);
      setPayments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to load payment history', err);
    } finally {
      setLoadingPayments(false);
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

        {/* QR Code */}
        <section className="p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-3">Student QR Code</h2>
          {data.qrCode ? (
            <>
              <img src={data.qrCode} alt="QR Code" className="w-40 h-40 border p-2 rounded-lg bg-white" />
              <a href={data.qrCode} download={`qr-${data.admissionId}.png`}
                 className="mt-2 text-sm text-blue-600 hover:underline">Download QR</a>
            </>
          ) : (
            <p className="text-sm text-gray-400">QR not generated</p>
          )}
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
            <div><strong>Assigned Caregiver:</strong> {staffMap[data.assignedCaregiver] || data.assignedCaregiver || '-'}</div>
            <div><strong>Responsible Staff:</strong> {staffMap[data.responsibleStaffId] || data.responsibleStaffId || '-'}</div>
            <div><strong>Fee Plan:</strong> {data.feePlan}</div>
            <div><strong>Fee Amount:</strong> ₹{data.feeAmount?.toLocaleString() || '-'}</div>
            <div><strong>Discount:</strong> ₹{data.discount?.toLocaleString() || '0'}</div>
            <div><strong>Total Fee:</strong> ₹{data.totalFee?.toLocaleString() || data.amount?.toLocaleString() || '-'}</div>
            <div><strong>Paid Amount:</strong> ₹{data.paidAmount?.toLocaleString() || '0'}</div>
            <div><strong>Payment Status:</strong> {data.paymentStatus}</div>
            <div><strong>Payment Mode:</strong> {data.paymentMode || '-'}</div>
            <div><strong>Next Due:</strong> {data.nextDueDate ? new Date(data.nextDueDate).toLocaleDateString() : '-'}</div>
            <div className="col-span-3"><strong>Remarks:</strong> {data.feeRemarks || '-'}</div>
          </div>
        </section>

        {/* Payment History */}
<section className="p-8">
  <h2 className="text-xl font-semibold mb-6">Payment History</h2>
  {loadingPayments ? (
    <p className="text-gray-400">Loading...</p>
  ) : payments.length === 0 ? (
    <p className="text-gray-400">No payments recorded yet.</p>
  ) : (
    <div className="space-y-6">
      {(() => {
        const groups = {};
        payments.forEach(p => {
          const allotId = p.allotmentId?._id || 'unknown';
          if (!groups[allotId]) groups[allotId] = { allotment: p.allotmentId, payments: [] };
          groups[allotId].payments.push(p);
        });

        return Object.entries(groups).map(([key, group]) => {
          const totalFee = group.allotment?.amount || 0;
          const groupPayments = group.payments;
          const groupPaid = groupPayments.reduce((s, p) => s + p.amount, 0);
          const groupPending = Math.max(0, totalFee - groupPaid);

          return (
            <div key={key} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 font-semibold flex justify-between items-center">
                <span>{groupPayments[0]?.description || 'Fee'}</span>
                <span>Total Fee: ₹{totalFee.toLocaleString()}</span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left text-sm">Date</th>
                    <th className="border p-2 text-right text-sm">Amount</th>
                    <th className="border p-2 text-left text-sm">Mode</th>
                    <th className="border p-2 text-left text-sm">Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {groupPayments.map((p, i) => (
                    <tr key={p._id || i}>
                      <td className="border p-2 text-sm">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="border p-2 text-sm text-right font-medium text-green-700">₹{p.amount.toLocaleString()}</td>
                      <td className="border p-2 text-sm">{p.paymentMode || '-'}</td>
                      <td className="border p-2 text-sm">{p.responsibleStaff?.fullName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 text-sm font-semibold">
                    <td className="border p-2">Subtotal</td>
                    <td className="border p-2 text-right text-green-700">₹{groupPaid.toLocaleString()}</td>
                    <td className="border p-2 text-red-600" colSpan="2">Pending: ₹{groupPending.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          );
        });
      })()}
      <div className="border rounded-lg bg-gray-100 px-4 py-3 font-semibold flex justify-between items-center text-base">
        <span>Overall Total</span>
        <span>₹{(data.totalFee || 0).toLocaleString()} &nbsp;|&nbsp; Paid: ₹{(data.paidAmount || 0).toLocaleString()} &nbsp;|&nbsp; Pending: ₹{(data.remainingAmount || 0).toLocaleString()}</span>
      </div>
    </div>
  )}
</section>

        {/* Timetable */}
<section className="p-8">
  <h2 className="text-xl font-semibold mb-6">
    Member Timetable
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[1100px] border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-3">Period</th>
          <th className="border p-3">Monday</th>
          <th className="border p-3">Tuesday</th>
          <th className="border p-3">Wednesday</th>
          <th className="border p-3">Thursday</th>
          <th className="border p-3">Friday</th>
          <th className="border p-3">Saturday</th>
          <th className="border p-3">Sunday</th>
        </tr>
      </thead>

      <tbody>
        {(data.timetable || []).map((row, index) => (
          <tr key={index}>
            <td className="border p-3 font-medium bg-gray-50">
              {periodMap[row.periodId] || row.periodId || '-'}
            </td>

            {[
              row.mondayActivityId,
              row.tuesdayActivityId,
              row.wednesdayActivityId,
              row.thursdayActivityId,
              row.fridayActivityId,
              row.saturdayActivityId,
              row.sundayActivityId,
            ].map((activityId, idx) => (
              <td key={idx} className="border p-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {activityMap[activityId] || activityId || '-'}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

{/* Additional Services */}
<section className="p-8">
  <h2 className="text-xl font-semibold mb-6">
    Additional Services
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-3 text-left">
            Service
          </th>

          <th className="border p-3 text-left">
            Start Date
          </th>

          <th className="border p-3 text-left">
            End Date
          </th>

          <th className="border p-3 text-left">
            Days
          </th>

          <th className="border p-3 text-left">
            Amount
          </th>
        </tr>
      </thead>

      <tbody>
        {(data.services || []).map((service, index) => (
          <tr key={index}>
            <td className="border p-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {serviceMap[service.serviceId] || service.serviceId || '-'}
              </span>
            </td>

            <td className="border p-3">
              {service.startDate ? new Date(service.startDate).toLocaleDateString() : '-'}
            </td>

            <td className="border p-3">
              {service.endDate ? new Date(service.endDate).toLocaleDateString() : '-'}
            </td>

            <td className="border p-3">
              {service.days || '-'}
            </td>

            <td className="border p-3 font-semibold">
              ₹{service.totalFee?.toLocaleString() || '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

      </div>
    </div>
  );
}