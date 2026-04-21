// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent, Button } from "./Layout";

// export default function Schedule() {
//   const [selectedDate, setSelectedDate] = useState(12);
//   const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

//   const dates = [
//     { day: "MON", date: 12 },
//     { day: "TUE", date: 13 },
//     { day: "WED", date: 14 },
//     { day: "THU", date: 15 },
//     { day: "FRI", date: 16 },
//     { day: "SAT", date: 17 },
//   ];

//   const participants = [
//     "Sunita Patil", "Ramesh Deshmukh", "Anita Joshi", "Vijay Pawar", 
//     "Nisha Naik", "Rajesh Sawant", "Mahesh Patil", "Seema Khare", "Dinesh Kamat"
//   ];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-[#000033]">My Schedule</h2>

//       {/* Date Selector */}
//       <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
//         {dates.map((item) => (
//           <button
//             key={item.date}
//             onClick={() => setSelectedDate(item.date)}
//             className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl transition-all ${
//               selectedDate === item.date
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-[10px] font-bold mb-1">{item.day}</span>
//             <span className="text-xl font-bold">{item.date}</span>
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//         <div className="space-y-4">
//           {/* Activity Card */}
//           <Card className="bg-[#F0EFFF] border-none shadow-sm p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">Yoga – 08:00 AM</h3>
//                 <p className="text-sm text-gray-600 mt-1">Meet at courtyard</p>
//               </div>
//               <div className="flex flex-col items-end gap-2">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-gray-600">Status</span>
//                   <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Pending</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-gray-600">Attendance</span>
//                   <Button 
//                     size="xs" 
//                     className="bg-[#4CAF50] hover:bg-[#45a049] h-6 px-3 text-[10px] font-bold"
//                     onClick={() => setIsMarkingAttendance(true)}
//                   >
//                     Mark
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <p className="text-lg font-medium text-gray-800">Participants - 20</p>
//           </Card>
//         </div>

//         {/* Attendance Marking Section */}
//         {isMarkingAttendance && (
//           <Card className="border-none shadow-md bg-white">
//             <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
//               <CardTitle className="text-base font-bold text-gray-800">
//                 Mark Attendance – Yoga (24 Oct)
//               </CardTitle>
//               <button 
//                 onClick={() => setIsMarkingAttendance(false)}
//                 className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
//               >
//                 <span className="text-xs font-bold">✕</span>
//               </button>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
//                 {participants.map((name, i) => (
//                   <div key={i} className="flex items-center justify-between group">
//                     <div className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-black" />
//                       <span className="text-sm font-medium text-gray-700">{name} —</span>
//                     </div>
//                     <input 
//                       type="checkbox" 
//                       className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-4 mt-8">
//                 <Button 
//                   className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold"
//                   onClick={() => setIsMarkingAttendance(false)}
//                 >
//                   Save
//                 </Button>
//                 <Button 
//                   variant="destructive" 
//                   className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold"
//                   onClick={() => setIsMarkingAttendance(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";

// function Card({ className = "", ...props }) {
//   return <div className={`rounded-xl bg-white shadow-sm border border-gray-100 ${className}`} {...props} />;
// }

// function CardHeader({ className = "", ...props }) {
//   return <div className={`px-6 pt-6 pb-4 ${className}`} {...props} />;
// }

// function CardTitle({ className = "", ...props }) {
//   return <h3 className={`text-xl font-bold ${className}`} {...props} />;
// }

// function CardContent({ className = "", ...props }) {
//   return <div className={`px-6 pb-6 ${className}`} {...props} />;
// }

// function Button({ children, className = "", ...props }) {
//   return <button className={`font-medium ${className}`} {...props}>{children}</button>;
// }

// export default function MySchedule() {
//   const [selectedDate, setSelectedDate] = useState(12);
//   const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

//   const dates = [
//     { day: "MON", date: 12 }, { day: "TUE", date: 13 }, { day: "WED", date: 14 },
//     { day: "THU", date: 15 }, { day: "FRI", date: 16 }, { day: "SAT", date: 17 },
//   ];

//   const participants = [
//     "Sunita Patil", "Ramesh Deshmukh", "Anita Joshi", "Vijay Pawar", 
//     "Nisha Naik", "Rajesh Sawant", "Mahesh Patil", "Seema Khare", "Dinesh Kamat"
//   ];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-[#000033]">My Schedule</h2>

//       {/* Date Selector */}
//       <div className="flex gap-4 overflow-x-auto pb-2">
//         {dates.map((item) => (
//           <button
//             key={item.date}
//             onClick={() => setSelectedDate(item.date)}
//             className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl transition-all ${
//               selectedDate === item.date
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-[10px] font-bold mb-1">{item.day}</span>
//             <span className="text-xl font-bold">{item.date}</span>
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <Card className="bg-[#F0EFFF] border-none p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900">Yoga – 08:00 AM</h3>
//               <p className="text-sm text-gray-600 mt-1">Meet at courtyard</p>
//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <div className="flex items-center gap-2">
//                 <span className="text-xs font-medium text-gray-600">Status</span>
//                 <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Pending</span>
//               </div>
//               <Button 
//                 className="bg-[#4CAF50] hover:bg-[#45a049] h-6 px-3 text-[10px] font-bold"
//                 onClick={() => setIsMarkingAttendance(true)}
//               >
//                 Mark
//               </Button>
//             </div>
//           </div>
//           <p className="text-lg font-medium text-gray-800">Participants - 20</p>
//         </Card>

//         {isMarkingAttendance && (
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between border-b">
//               <CardTitle>Mark Attendance – Yoga (24 Oct)</CardTitle>
//               <button 
//                 onClick={() => setIsMarkingAttendance(false)}
//                 className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-xs font-bold"
//               >
//                 ✕
//               </button>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="max-h-[400px] overflow-y-auto space-y-4">
//                 {participants.map((name, i) => (
//                   <div key={i} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-black" />
//                       <span className="text-sm font-medium text-gray-700">{name}</span>
//                     </div>
//                     <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-4 mt-8">
//                 <Button className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold" onClick={() => setIsMarkingAttendance(false)}>
//                   Save
//                 </Button>
//                 <Button className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold" onClick={() => setIsMarkingAttendance(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }




///////////////////////////////

import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../src/services/apiClient";

function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border border-gray-200 ${className}`}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }) {
  return (
    <div className={`px-5 sm:px-6 pt-5 sm:pt-6 pb-4 ${className}`} {...props} />
  );
}

function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-xl sm:text-xl font-bold ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`px-5 sm:px-6 pb-5 sm:pb-6 ${className}`} {...props} />;
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`font-semibold transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function MySchedule() {
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [isViewingAttendance, setIsViewingAttendance] = useState(false);
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [activeSlotId, setActiveSlotId] = useState(null);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [attendanceByActivity, setAttendanceByActivity] = useState({});
  const [statusByActivity, setStatusByActivity] = useState({});

  const makeKey = (activityId, slotId) => `${activityId}_${slotId}`;

  useEffect(() => {
    fetchMySchedule();
  }, []);

  const fetchMySchedule = async () => {
    try {
      setLoading(true);

      const res = await api.staffPanel.getMySchedule();
      const scheduleData = Array.isArray(res?.data?.data) ? res.data.data : [];

      const mappedActivities = scheduleData.map((item, index) => ({
        id: item.activityId || `activity-${index}`,
        slotId: item.slotId || `slot-${index}`,
        title: item.activityName || "Activity",
        time:
          item.startTime && item.endTime
            ? `${item.startTime} - ${item.endTime}`
            : item.startTime || "-",
        place: item.place || item.location || item.description || "",
        participants: Array.isArray(item.participants)
          ? item.participants.map((participant) =>
              typeof participant === "string"
                ? participant
                : participant?.name || participant?.customerName || "Participant"
            )
          : [],
      }));

      setActivities(mappedActivities);

      const attendanceObj = {};
      const statusObj = {};

      mappedActivities.forEach((activity) => {
        const key = makeKey(activity.id, activity.slotId);

        attendanceObj[key] = activity.participants.reduce((acc, name) => {
          acc[name] = null;
          return acc;
        }, {});

        statusObj[key] = "Pending";
      });

      setAttendanceByActivity(attendanceObj);
      setStatusByActivity(statusObj);
    } catch (error) {
      console.error("Error fetching my schedule:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const activeActivity = useMemo(() => {
    return (
      activities.find(
        (activity) =>
          activity.id === activeActivityId && activity.slotId === activeSlotId
      ) || null
    );
  }, [activities, activeActivityId, activeSlotId]);

  const currentAttendance = useMemo(() => {
    if (!activeActivityId || !activeSlotId) return {};
    const key = makeKey(activeActivityId, activeSlotId);
    return attendanceByActivity[key] || {};
  }, [attendanceByActivity, activeActivityId, activeSlotId]);

  const getActivityAttendance = (activityId, slotId) => {
    const key = makeKey(activityId, slotId);
    return attendanceByActivity[key] || {};
  };

  const getActivityStatus = (activityId, slotId) => {
    const key = makeKey(activityId, slotId);
    return statusByActivity[key] || "Pending";
  };

  const getCounts = (activityId, slotId) => {
    const activity = activities.find(
      (item) => item.id === activityId && item.slotId === slotId
    );
    const attendance = getActivityAttendance(activityId, slotId);

    const total = activity?.participants.length || 0;
    const present = Object.values(attendance).filter(
      (value) => value === "Present"
    ).length;
    const absent = Object.values(attendance).filter(
      (value) => value === "Absent"
    ).length;

    return { total, present, absent };
  };

  const handleStatusChange = (name, value) => {
    const key = makeKey(activeActivityId, activeSlotId);

    setAttendanceByActivity((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!activeActivityId || !activeSlotId) return;

    const key = makeKey(activeActivityId, activeSlotId);

    setStatusByActivity((prev) => ({
      ...prev,
      [key]: "Marked",
    }));

    setIsMarkingAttendance(false);
    setIsViewingAttendance(false);
  };

  const openMarkModal = (activityId, slotId) => {
    setActiveActivityId(activityId);
    setActiveSlotId(slotId);
    setIsViewingAttendance(false);
    setIsMarkingAttendance(true);
  };

  const openViewModal = (activityId, slotId) => {
    setActiveActivityId(activityId);
    setActiveSlotId(slotId);
    setIsMarkingAttendance(false);
    setIsViewingAttendance(true);
  };

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <h2 className="text-[32px] sm:text-2xl font-bold text-[#000033]">
        My Schedule
      </h2>

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
          {activities.map((activity) => {
            const counts = getCounts(activity.id, activity.slotId);
            const currentStatus = getActivityStatus(activity.id, activity.slotId);

            return (
              <Card key={makeKey(activity.id, activity.slotId)} className="bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div>
                    <h3 className="text-[28px] sm:text-xl font-bold text-gray-900 leading-tight">
                      {activity.title} – {activity.time}
                    </h3>
                    <p className="text-[16px] sm:text-sm text-gray-600 mt-2">
                      {activity.place}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] sm:text-xs font-medium text-gray-600">
                        Status
                      </span>
                      <span
                        className={`text-white text-[11px] sm:text-[10px] px-3 py-1 rounded-full font-bold ${
                          currentStatus === "Marked" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="bg-[#4CAF50] hover:bg-[#45a049] min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
                        onClick={() => openMarkModal(activity.id, activity.slotId)}
                      >
                        Mark
                      </Button>

                      <Button
                        className="bg-blue-600 hover:bg-blue-700 min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
                        onClick={() => openViewModal(activity.id, activity.slotId)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[20px] sm:text-lg font-semibold text-gray-800">
                    Participants - {counts.total}
                  </p>
                  <p className="text-[16px] sm:text-sm text-gray-700">
                    Present - {counts.present}
                  </p>
                  <p className="text-[16px] sm:text-sm text-gray-700">
                    Absent - {counts.absent}
                  </p>
                </div>
              </Card>
            );
          })}

          {isMarkingAttendance && activeActivity && (
            <Card className="xl:col-span-2">
              <CardHeader className="flex items-center justify-between border-b">
                <CardTitle className="text-[24px] sm:text-xl">
                  Mark Attendance – {activeActivity.title}
                </CardTitle>
                <button
                  onClick={() => setIsMarkingAttendance(false)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
                >
                  ✕
                </button>
              </CardHeader>

              <CardContent className="pt-5">
                <div className="mb-5 space-y-2">
                  <p className="text-[16px] sm:text-sm font-medium text-gray-800">
                    Participants - {activeActivity.participants.length}
                  </p>
                  <p className="text-[16px] sm:text-sm text-green-700 font-medium">
                    Present - {getCounts(activeActivity.id, activeActivity.slotId).present}
                  </p>
                  <p className="text-[16px] sm:text-sm text-red-700 font-medium">
                    Absent - {getCounts(activeActivity.id, activeActivity.slotId).absent}
                  </p>
                </div>

                <div className="max-h-[420px] overflow-y-auto space-y-4">
                  {activeActivity.participants.map((name, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                        <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
                          {name}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(name, "Present")}
                          className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${
                            currentAttendance[name] === "Present"
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-green-600 border-green-300"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(name, "Absent")}
                          className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${
                            currentAttendance[name] === "Absent"
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-red-600 border-red-300"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
                    onClick={handleSaveAttendance}
                  >
                    Save
                  </Button>

                  <Button
                    className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
                    onClick={() => setIsMarkingAttendance(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isViewingAttendance && activeActivity && (
            <Card className="xl:col-span-2">
              <CardHeader className="flex items-center justify-between border-b">
                <CardTitle className="text-[24px] sm:text-xl">
                  View Attendance – {activeActivity.title}
                </CardTitle>
                <button
                  onClick={() => setIsViewingAttendance(false)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
                >
                  ✕
                </button>
              </CardHeader>

              <CardContent className="pt-5">
                <div className="mb-5 space-y-2">
                  <p className="text-[16px] sm:text-sm font-medium text-gray-800">
                    Participants - {activeActivity.participants.length}
                  </p>
                  <p className="text-[16px] sm:text-sm text-green-700 font-medium">
                    Present - {getCounts(activeActivity.id, activeActivity.slotId).present}
                  </p>
                  <p className="text-[16px] sm:text-sm text-red-700 font-medium">
                    Absent - {getCounts(activeActivity.id, activeActivity.slotId).absent}
                  </p>
                </div>

                <div className="max-h-[420px] overflow-y-auto space-y-4">
                  {activeActivity.participants.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                        <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
                          {name}
                        </span>
                      </div>

                      <span
                        className={`text-[13px] sm:text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
                          currentAttendance[name] === "Present"
                            ? "bg-green-100 text-green-700"
                            : currentAttendance[name] === "Absent"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {currentAttendance[name] || "Not Marked"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
                    onClick={() => setIsViewingAttendance(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}



///////////////////////////////




// import React, { useMemo, useState } from "react";

// function Card({ className = "", ...props }) {
//   return (
//     <div
//       className={`rounded-2xl bg-white shadow-sm border border-gray-200 ${className}`}
//       {...props}
//     />
//   );
// }

// function CardHeader({ className = "", ...props }) {
//   return (
//     <div className={`px-5 sm:px-6 pt-5 sm:pt-6 pb-4 ${className}`} {...props} />
//   );
// }

// function CardTitle({ className = "", ...props }) {
//   return <h3 className={`text-xl sm:text-xl font-bold ${className}`} {...props} />;
// }

// function CardContent({ className = "", ...props }) {
//   return <div className={`px-5 sm:px-6 pb-5 sm:pb-6 ${className}`} {...props} />;
// }

// function Button({ children, className = "", ...props }) {
//   return (
//     <button
//       className={`font-semibold transition-all duration-200 ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

// export default function MySchedule() {
//   const [selectedDate, setSelectedDate] = useState(12);
//   const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
//   const [isViewingAttendance, setIsViewingAttendance] = useState(false);
//   const [activeActivityId, setActiveActivityId] = useState(null);

//   const dates = [
//     { day: "MON", date: 12 },
//     { day: "TUE", date: 13 },
//     { day: "WED", date: 14 },
//     { day: "THU", date: 15 },
//     { day: "FRI", date: 16 },
//     { day: "SAT", date: 17 },
//   ];

//   const activities = [
//     {
//       id: "yoga",
//       title: "Yoga",
//       time: "08:00 AM",
//       place: "Meet at courtyard",
//       participants: [
//         "Sunita Patil",
//         "Ramesh Deshmukh",
//         "Anita Joshi",
//         "Vijay Pawar",
//         "Nisha Naik",
//         "Rajesh Sawant",
//         "Mahesh Patil",
//         "Seema Khare",
//         "Dinesh Kamat",
//       ],
//     },
//     {
//       id: "zumba",
//       title: "Zumba",
//       time: "10:30 AM",
//       place: "Activity Hall",
//       participants: [
//         "Aarti More",
//         "Pooja Jadhav",
//         "Rohit Kale",
//         "Sneha Patil",
//         "Kunal Shinde",
//         "Bhavna Chavan",
//       ],
//     },
//     {
//       id: "meditation",
//       title: "Meditation",
//       time: "02:00 PM",
//       place: "Room 204",
//       participants: [
//         "Meena Pawar",
//         "Suresh Naik",
//         "Kalpana More",
//         "Nitin Patil",
//         "Komal Sawant",
//       ],
//     },
//   ];

//   const createDefaultAttendanceForActivity = (participants) =>
//     participants.reduce((acc, name) => {
//       acc[name] = null;
//       return acc;
//     }, {});

//   const [attendanceByDate, setAttendanceByDate] = useState(() =>
//     dates.reduce((dateAcc, dateItem) => {
//       dateAcc[dateItem.date] = activities.reduce((activityAcc, activity) => {
//         activityAcc[activity.id] = createDefaultAttendanceForActivity(
//           activity.participants
//         );
//         return activityAcc;
//       }, {});
//       return dateAcc;
//     }, {})
//   );

//   const [statusByDate, setStatusByDate] = useState(() =>
//     dates.reduce((dateAcc, dateItem) => {
//       dateAcc[dateItem.date] = activities.reduce((activityAcc, activity) => {
//         activityAcc[activity.id] = "Pending";
//         return activityAcc;
//       }, {});
//       return dateAcc;
//     }, {})
//   );

//   const activeActivity = useMemo(() => {
//     return activities.find((activity) => activity.id === activeActivityId) || null;
//   }, [activeActivityId]);

//   const currentAttendance = useMemo(() => {
//     if (!activeActivityId) return {};
//     return attendanceByDate[selectedDate]?.[activeActivityId] || {};
//   }, [attendanceByDate, selectedDate, activeActivityId]);

//   const getActivityAttendance = (activityId) => {
//     return attendanceByDate[selectedDate]?.[activityId] || {};
//   };

//   const getActivityStatus = (activityId) => {
//     return statusByDate[selectedDate]?.[activityId] || "Pending";
//   };

//   const getCounts = (activityId) => {
//     const activity = activities.find((item) => item.id === activityId);
//     const attendance = getActivityAttendance(activityId);

//     const total = activity?.participants.length || 0;
//     const present = Object.values(attendance).filter(
//       (value) => value === "Present"
//     ).length;
//     const absent = Object.values(attendance).filter(
//       (value) => value === "Absent"
//     ).length;

//     return { total, present, absent };
//   };

//   const handleStatusChange = (name, value) => {
//     setAttendanceByDate((prev) => ({
//       ...prev,
//       [selectedDate]: {
//         ...prev[selectedDate],
//         [activeActivityId]: {
//           ...prev[selectedDate][activeActivityId],
//           [name]: value,
//         },
//       },
//     }));
//   };

//   const handleSaveAttendance = () => {
//     if (!activeActivityId) return;

//     setStatusByDate((prev) => ({
//       ...prev,
//       [selectedDate]: {
//         ...prev[selectedDate],
//         [activeActivityId]: "Marked",
//       },
//     }));

//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(false);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(false);
//     setActiveActivityId(null);
//   };

//   const openMarkModal = (activityId) => {
//     setActiveActivityId(activityId);
//     setIsViewingAttendance(false);
//     setIsMarkingAttendance(true);
//   };

//   const openViewModal = (activityId) => {
//     setActiveActivityId(activityId);
//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(true);
//   };

//   return (
//     <div className="space-y-6 px-1 sm:px-0">
//       <h2 className="text-[32px] sm:text-2xl font-bold text-[#000033]">
//         My Schedule
//       </h2>

//       {/* <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
//         {dates.map((item) => (
//           <button
//             key={item.date}
//             onClick={() => handleDateChange(item.date)}
//             className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-[78px] sm:h-20 rounded-2xl transition-all shrink-0 ${
//               selectedDate === item.date
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-[10px] font-bold mb-1">{item.day}</span>
//             <span className="text-[28px] sm:text-xl font-bold leading-none">
//               {item.date}
//             </span>
//           </button>
//         ))}
//       </div> */}

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
//         {activities.map((activity) => {
//           const counts = getCounts(activity.id);
//           const currentStatus = getActivityStatus(activity.id);

//           return (
//             <Card key={activity.id} className="bg-white p-5 sm:p-6">
//               <div className="flex flex-col gap-4 mb-4">
//                 <div>
//                   <h3 className="text-[28px] sm:text-xl font-bold text-gray-900 leading-tight">
//                     {activity.title} – {activity.time}
//                   </h3>
//                   <p className="text-[16px] sm:text-sm text-gray-600 mt-2">
//                     {activity.place}
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="text-[13px] sm:text-xs font-medium text-gray-600">
//                       Status
//                     </span>
//                     <span
//                       className={`text-white text-[11px] sm:text-[10px] px-3 py-1 rounded-full font-bold ${
//                         currentStatus === "Marked" ? "bg-green-500" : "bg-red-500"
//                       }`}
//                     >
//                       {currentStatus}
//                     </span>
//                   </div>

//                   <div className="flex gap-2 flex-wrap">
//                     <Button
//                       className="bg-[#4CAF50] hover:bg-[#45a049] min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
//                       onClick={() => openMarkModal(activity.id)}
//                     >
//                       Mark
//                     </Button>

//                     <Button
//                       className="bg-blue-600 hover:bg-blue-700 min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
//                       onClick={() => openViewModal(activity.id)}
//                     >
//                       View
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <p className="text-[20px] sm:text-lg font-semibold text-gray-800">
//                   Participants - {counts.total}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-gray-700">
//                   Present - {counts.present}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-gray-700">
//                   Absent - {counts.absent}
//                 </p>
//               </div>
//             </Card>
//           );
//         })}

//         {isMarkingAttendance && activeActivity && (
//           <Card className="xl:col-span-2">
//             <CardHeader className="flex items-center justify-between border-b">
//               <CardTitle className="text-[24px] sm:text-xl">
//                 Mark Attendance – {activeActivity.title} ({selectedDate} Oct)
//               </CardTitle>
//               <button
//                 onClick={() => setIsMarkingAttendance(false)}
//                 className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
//               >
//                 ✕
//               </button>
//             </CardHeader>

//             <CardContent className="pt-5">
//               <div className="mb-5 space-y-2">
//                 <p className="text-[16px] sm:text-sm font-medium text-gray-800">
//                   Participants - {activeActivity.participants.length}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-green-700 font-medium">
//                   Present - {getCounts(activeActivity.id).present}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-red-700 font-medium">
//                   Absent - {getCounts(activeActivity.id).absent}
//                 </p>
//               </div>

//               <div className="max-h-[420px] overflow-y-auto space-y-4">
//                 {activeActivity.participants.map((name, i) => (
//                   <div
//                     key={i}
//                     className="flex flex-col gap-3 border-b border-gray-100 pb-4"
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <div className="w-2 h-2 rounded-full bg-black shrink-0" />
//                       <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
//                         {name}
//                       </span>
//                     </div>

//                     <div className="flex gap-2 flex-wrap">
//                       <button
//                         type="button"
//                         onClick={() => handleStatusChange(name, "Present")}
//                         className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${
//                           currentAttendance[name] === "Present"
//                             ? "bg-green-500 text-white border-green-500"
//                             : "bg-white text-green-600 border-green-300"
//                         }`}
//                       >
//                         Present
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => handleStatusChange(name, "Absent")}
//                         className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${
//                           currentAttendance[name] === "Absent"
//                             ? "bg-red-500 text-white border-red-500"
//                             : "bg-white text-red-600 border-red-300"
//                         }`}
//                       >
//                         Absent
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                 <Button
//                   className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={handleSaveAttendance}
//                 >
//                   Save
//                 </Button>

//                 <Button
//                   className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={() => setIsMarkingAttendance(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {isViewingAttendance && activeActivity && (
//           <Card className="xl:col-span-2">
//             <CardHeader className="flex items-center justify-between border-b">
//               <CardTitle className="text-[24px] sm:text-xl">
//                 View Attendance – {activeActivity.title} ({selectedDate} Oct)
//               </CardTitle>
//               <button
//                 onClick={() => setIsViewingAttendance(false)}
//                 className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
//               >
//                 ✕
//               </button>
//             </CardHeader>

//             <CardContent className="pt-5">
//               <div className="mb-5 space-y-2">
//                 <p className="text-[16px] sm:text-sm font-medium text-gray-800">
//                   Participants - {activeActivity.participants.length}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-green-700 font-medium">
//                   Present - {getCounts(activeActivity.id).present}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-red-700 font-medium">
//                   Absent - {getCounts(activeActivity.id).absent}
//                 </p>
//               </div>

//               <div className="max-h-[420px] overflow-y-auto space-y-4">
//                 {activeActivity.participants.map((name, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <div className="w-2 h-2 rounded-full bg-black shrink-0" />
//                       <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
//                         {name}
//                       </span>
//                     </div>

//                     <span
//                       className={`text-[13px] sm:text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
//                         currentAttendance[name] === "Present"
//                           ? "bg-green-100 text-green-700"
//                           : currentAttendance[name] === "Absent"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {currentAttendance[name] || "Not Marked"}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6">
//                 <Button
//                   className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={() => setIsViewingAttendance(false)}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }



///////////////////////////////////

/// Final 


// import React, { useEffect, useMemo, useState } from "react";
// import { api } from "../../services/apiClient";


// function Card({ className = "", ...props }) {
//   return (
//     <div
//       className={`rounded-2xl bg-white shadow-sm border border-gray-200 ${className}`}
//       {...props}
//     />
//   );
// }

// function CardHeader({ className = "", ...props }) {
//   return (
//     <div className={`px-5 sm:px-6 pt-5 sm:pt-6 pb-4 ${className}`} {...props} />
//   );
// }

// function CardTitle({ className = "", ...props }) {
//   return <h3 className={`text-xl sm:text-xl font-bold ${className}`} {...props} />;
// }

// function CardContent({ className = "", ...props }) {
//   return <div className={`px-5 sm:px-6 pb-5 sm:pb-6 ${className}`} {...props} />;
// }

// function Button({ children, className = "", ...props }) {
//   return (
//     <button
//       className={`font-semibold transition-all duration-200 ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

// export default function MySchedule() {
//   const [selectedDate, setSelectedDate] = useState(12);
//   const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
//   const [isViewingAttendance, setIsViewingAttendance] = useState(false);
//   const [activeActivityId, setActiveActivityId] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const dates = [
//     { day: "MON", date: 12 },
//     { day: "TUE", date: 13 },
//     { day: "WED", date: 14 },
//     { day: "THU", date: 15 },
//     { day: "FRI", date: 16 },
//     { day: "SAT", date: 17 },
//   ];

//   useEffect(() => {
//     const loadSchedule = async () => {
//       try {
//         setLoading(true);

//        const res = await api?.staffPanel?.getMySchedule?.();
//         const apiData = res.data?.data || [];

//         const formatted = apiData.map((item, index) => ({
//           id: item.slotId || `${item.activityId}-${index}`,
//           title: item.activityName || "Activity",
//           time:
//             item.startTime && item.endTime
//               ? `${item.startTime} - ${item.endTime}`
//               : item.startTime || "N/A",
//           place: "Assigned Activity",
//           participants: Array.isArray(item.participants) ? item.participants : [],
//         }));

//         setActivities(formatted);
//       } catch (err) {
//         console.error("Schedule load error:", err);
//         setActivities([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSchedule();
//   }, []);

//   const createDefaultAttendanceForActivity = (participants) =>
//     participants.reduce((acc, name) => {
//       acc[name] = null;
//       return acc;
//     }, {});

//   const [attendanceByDate, setAttendanceByDate] = useState(() =>
//     dates.reduce((dateAcc, dateItem) => {
//       dateAcc[dateItem.date] = {};
//       return dateAcc;
//     }, {})
//   );

//   const [statusByDate, setStatusByDate] = useState(() =>
//     dates.reduce((dateAcc, dateItem) => {
//       dateAcc[dateItem.date] = {};
//       return dateAcc;
//     }, {})
//   );

//   useEffect(() => {
//     if (!activities.length) return;

//     setAttendanceByDate((prev) => {
//       const updated = { ...prev };

//       dates.forEach((dateItem) => {
//         if (!updated[dateItem.date]) updated[dateItem.date] = {};

//         activities.forEach((activity) => {
//           if (!updated[dateItem.date][activity.id]) {
//             updated[dateItem.date][activity.id] = createDefaultAttendanceForActivity(
//               activity.participants || []
//             );
//           }
//         });
//       });

//       return updated;
//     });

//     setStatusByDate((prev) => {
//       const updated = { ...prev };

//       dates.forEach((dateItem) => {
//         if (!updated[dateItem.date]) updated[dateItem.date] = {};

//         activities.forEach((activity) => {
//           if (!updated[dateItem.date][activity.id]) {
//             updated[dateItem.date][activity.id] = "Pending";
//           }
//         });
//       });

//       return updated;
//     });
//   }, [activities]);

//   const activeActivity = useMemo(() => {
//     return activities.find((activity) => activity.id === activeActivityId) || null;
//   }, [activities, activeActivityId]);

//   const currentAttendance = useMemo(() => {
//     if (!activeActivityId) return {};
//     return attendanceByDate[selectedDate]?.[activeActivityId] || {};
//   }, [attendanceByDate, selectedDate, activeActivityId]);

//   const getActivityAttendance = (activityId) => {
//     return attendanceByDate[selectedDate]?.[activityId] || {};
//   };

//   const getActivityStatus = (activityId) => {
//     return statusByDate[selectedDate]?.[activityId] || "Pending";
//   };

//   const getCounts = (activityId) => {
//     const activity = activities.find((item) => item.id === activityId);
//     const attendance = getActivityAttendance(activityId);

//     const total = activity?.participants?.length || 0;
//     const present = Object.values(attendance).filter(
//       (value) => value === "Present"
//     ).length;
//     const absent = Object.values(attendance).filter(
//       (value) => value === "Absent"
//     ).length;

//     return { total, present, absent };
//   };

//   const handleStatusChange = (name, value) => {
//     setAttendanceByDate((prev) => ({
//       ...prev,
//       [selectedDate]: {
//         ...prev[selectedDate],
//         [activeActivityId]: {
//           ...prev[selectedDate]?.[activeActivityId],
//           [name]: value,
//         },
//       },
//     }));
//   };

//   const handleSaveAttendance = () => {
//     if (!activeActivityId) return;

//     setStatusByDate((prev) => ({
//       ...prev,
//       [selectedDate]: {
//         ...prev[selectedDate],
//         [activeActivityId]: "Marked",
//       },
//     }));

//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(false);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(false);
//     setActiveActivityId(null);
//   };

//   const openMarkModal = (activityId) => {
//     setActiveActivityId(activityId);
//     setIsViewingAttendance(false);
//     setIsMarkingAttendance(true);
//   };

//   const openViewModal = (activityId) => {
//     setActiveActivityId(activityId);
//     setIsMarkingAttendance(false);
//     setIsViewingAttendance(true);
//   };

//   return (
//     <div className="space-y-6 px-1 sm:px-0">
//       <h2 className="text-[32px] sm:text-2xl font-bold text-[#000033]">
//         My Schedule
//       </h2>

//       <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
//         {dates.map((item) => (
//           <button
//             key={item.date}
//             onClick={() => handleDateChange(item.date)}
//             className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-[78px] sm:h-20 rounded-2xl transition-all shrink-0 ${selectedDate === item.date
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//               }`}
//           >
//             <span className="text-[10px] font-bold mb-1">{item.day}</span>
//             <span className="text-[28px] sm:text-xl font-bold leading-none">
//               {item.date}
//             </span>
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
//         {loading ? (
//           <Card className="bg-white p-5 sm:p-6 xl:col-span-2">
//             <p className="text-gray-600 text-base sm:text-sm">Loading schedule...</p>
//           </Card>
//         ) : activities.length === 0 ? (
//           <Card className="bg-white p-5 sm:p-6 xl:col-span-2">
//             <p className="text-gray-600 text-base sm:text-sm">
//               No assigned activities found.
//             </p>
//           </Card>
//         ) : (
//           activities.map((activity) => {
//             const counts = getCounts(activity.id);
//             const currentStatus = getActivityStatus(activity.id);

//             return (
//               <Card key={activity.id} className="bg-white p-5 sm:p-6">
//                 <div className="flex flex-col gap-4 mb-4">
//                   <div>
//                     <h3 className="text-[28px] sm:text-xl font-bold text-gray-900 leading-tight">
//                       {activity.title} – {activity.time}
//                     </h3>
//                     <p className="text-[16px] sm:text-sm text-gray-600 mt-2">
//                       {activity.place}
//                     </p>
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="text-[13px] sm:text-xs font-medium text-gray-600">
//                         Status
//                       </span>
//                       <span
//                         className={`text-white text-[11px] sm:text-[10px] px-3 py-1 rounded-full font-bold ${currentStatus === "Marked" ? "bg-green-500" : "bg-red-500"
//                           }`}
//                       >
//                         {currentStatus}
//                       </span>
//                     </div>

//                     <div className="flex gap-2 flex-wrap">
//                       <Button
//                         className="bg-[#4CAF50] hover:bg-[#45a049] min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
//                         onClick={() => openMarkModal(activity.id)}
//                       >
//                         Mark
//                       </Button>

//                       <Button
//                         className="bg-blue-600 hover:bg-blue-700 min-h-[38px] sm:h-8 px-4 sm:px-3 text-[13px] sm:text-[10px] font-bold text-white rounded-md"
//                         onClick={() => openViewModal(activity.id)}
//                       >
//                         View
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <p className="text-[20px] sm:text-lg font-semibold text-gray-800">
//                     Participants - {counts.total}
//                   </p>
//                   <p className="text-[16px] sm:text-sm text-gray-700">
//                     Present - {counts.present}
//                   </p>
//                   <p className="text-[16px] sm:text-sm text-gray-700">
//                     Absent - {counts.absent}
//                   </p>
//                 </div>
//               </Card>
//             );
//           })
//         )}

//         {isMarkingAttendance && activeActivity && (
//           <Card className="xl:col-span-2">
//             <CardHeader className="flex items-center justify-between border-b">
//               <CardTitle className="text-[24px] sm:text-xl">
//                 Mark Attendance – {activeActivity.title} ({selectedDate} Oct)
//               </CardTitle>
//               <button
//                 onClick={() => setIsMarkingAttendance(false)}
//                 className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
//               >
//                 ✕
//               </button>
//             </CardHeader>

//             <CardContent className="pt-5">
//               <div className="mb-5 space-y-2">
//                 <p className="text-[16px] sm:text-sm font-medium text-gray-800">
//                   Participants - {activeActivity.participants?.length || 0}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-green-700 font-medium">
//                   Present - {getCounts(activeActivity.id).present}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-red-700 font-medium">
//                   Absent - {getCounts(activeActivity.id).absent}
//                 </p>
//               </div>

//               <div className="max-h-[420px] overflow-y-auto space-y-4">
//                 {(activeActivity.participants || []).length === 0 ? (
//                   <p className="text-[16px] sm:text-sm text-gray-500">
//                     No participants found.
//                   </p>
//                 ) : (
//                   activeActivity.participants.map((name, i) => (
//                     <div
//                       key={i}
//                       className="flex flex-col gap-3 border-b border-gray-100 pb-4"
//                     >
//                       <div className="flex items-center gap-2 min-w-0">
//                         <div className="w-2 h-2 rounded-full bg-black shrink-0" />
//                         <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
//                           {name}
//                         </span>
//                       </div>

//                       <div className="flex gap-2 flex-wrap">
//                         <button
//                           type="button"
//                           onClick={() => handleStatusChange(name, "Present")}
//                           className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${currentAttendance[name] === "Present"
//                               ? "bg-green-500 text-white border-green-500"
//                               : "bg-white text-green-600 border-green-300"
//                             }`}
//                         >
//                           Present
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => handleStatusChange(name, "Absent")}
//                           className={`px-4 py-2 rounded-lg text-[13px] sm:text-xs font-bold border ${currentAttendance[name] === "Absent"
//                               ? "bg-red-500 text-white border-red-500"
//                               : "bg-white text-red-600 border-red-300"
//                             }`}
//                         >
//                           Absent
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                 <Button
//                   className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={handleSaveAttendance}
//                 >
//                   Save
//                 </Button>

//                 <Button
//                   className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={() => setIsMarkingAttendance(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {isViewingAttendance && activeActivity && (
//           <Card className="xl:col-span-2">
//             <CardHeader className="flex items-center justify-between border-b">
//               <CardTitle className="text-[24px] sm:text-xl">
//                 View Attendance – {activeActivity.title} ({selectedDate} Oct)
//               </CardTitle>
//               <button
//                 onClick={() => setIsViewingAttendance(false)}
//                 className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold"
//               >
//                 ✕
//               </button>
//             </CardHeader>

//             <CardContent className="pt-5">
//               <div className="mb-5 space-y-2">
//                 <p className="text-[16px] sm:text-sm font-medium text-gray-800">
//                   Participants - {activeActivity.participants?.length || 0}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-green-700 font-medium">
//                   Present - {getCounts(activeActivity.id).present}
//                 </p>
//                 <p className="text-[16px] sm:text-sm text-red-700 font-medium">
//                   Absent - {getCounts(activeActivity.id).absent}
//                 </p>
//               </div>

//               <div className="max-h-[420px] overflow-y-auto space-y-4">
//                 {(activeActivity.participants || []).length === 0 ? (
//                   <p className="text-[16px] sm:text-sm text-gray-500">
//                     No participants found.
//                   </p>
//                 ) : (
//                   activeActivity.participants.map((name, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"
//                     >
//                       <div className="flex items-center gap-2 min-w-0">
//                         <div className="w-2 h-2 rounded-full bg-black shrink-0" />
//                         <span className="text-[16px] sm:text-sm font-medium text-gray-700 break-words">
//                           {name}
//                         </span>
//                       </div>

//                       <span
//                         className={`text-[13px] sm:text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${currentAttendance[name] === "Present"
//                             ? "bg-green-100 text-green-700"
//                             : currentAttendance[name] === "Absent"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                       >
//                         {currentAttendance[name] || "Not Marked"}
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div className="mt-6">
//                 <Button
//                   className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white py-3 rounded-lg text-[15px] sm:text-sm"
//                   onClick={() => setIsViewingAttendance(false)}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }