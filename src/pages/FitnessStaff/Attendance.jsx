// import React, { useState } from "react";
// import { Users } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardContent, Button } from "./Layout";

// export default function Attendance() {
//   const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(12);
//   const [attendanceSearch, setAttendanceSearch] = useState("");

//   const dates = [
//     { day: "MON", date: 12 },
//     { day: "TUE", date: 13 },
//     { day: "WED", date: 14 },
//     { day: "THU", date: 15 },
//     { day: "FRI", date: 16 },
//     { day: "SAT", date: 17 },
//   ];

//   const attendanceMembers = [
//     { name: "Sunita Patil", status: false },
//     { name: "Ramesh Deshmukh", status: false },
//     { name: "Anita Joshi", status: false },
//     { name: "Vijay Pawar", status: false },
//     { name: "Nisha Naik", status: false },
//     { name: "Rajesh Sawant", status: false },
//     { name: "Mahesh Patil", status: false },
//     { name: "Seema Khare", status: false },
//     { name: "Dinesh Kamat", status: false },
//     { name: "Amit Sharma", status: false },
//     { name: "Sonia Verma", status: false },
//     { name: "John Doe", status: false },
//   ];

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold text-[#000033]">Attendance</h2>
      
//       {/* Date Selector */}
//       <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
//         {dates.map((item) => (
//           <button
//             key={item.date}
//             onClick={() => setSelectedAttendanceDate(item.date)}
//             className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl transition-all ${
//               selectedAttendanceDate === item.date
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-[10px] font-bold mb-1">{item.day}</span>
//             <span className="text-xl font-bold">{item.date}</span>
//           </button>
//         ))}
//       </div>

//       <Card className="border-none shadow-md bg-white overflow-hidden">
//         <CardHeader className="border-b pb-4 space-y-4">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-xl font-bold text-gray-800">
//               Mark Attendance – {selectedAttendanceDate} Oct
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-medium text-gray-500">Select All</span>
//               <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//             </div>
//           </div>
          
//           {/* Search Bar */}
//           <div className="relative">
//             <input 
//               type="text"
//               placeholder="Search member name..."
//               value={attendanceSearch}
//               onChange={(e) => setAttendanceSearch(e.target.value)}
//               className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
//             />
//             <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           </div>
//         </CardHeader>
        
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
//             {attendanceMembers
//               .filter(m => m.name.toLowerCase().includes(attendanceSearch.toLowerCase()))
//               .map((member, i) => (
//                 <div key={i} className="flex items-center justify-between group py-1">
//                   <div className="flex items-center gap-3">
//                     <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
//                     <span className="text-sm font-medium text-gray-700">{member.name} —</span>
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                   />
//                 </div>
//               ))}
//           </div>

//           <div className="flex gap-4 mt-10 pt-6 border-t">
//             <Button className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] h-12 text-base font-bold shadow-sm">
//               Save Attendance
//             </Button>
//             <Button variant="outline" className="flex-1 border-gray-200 h-12 text-base font-bold text-gray-600">
//               Reset
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



















// import React, { useState } from "react";
// import { Users, Search, Check, UserCheck } from "lucide-react";

// function Card({ className = "", ...props }) {
//   return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`} {...props} />;
// }

// export default function Attendance() {
//   const [selectedDate, setSelectedDate] = useState(12);
//   const [search, setSearch] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState(new Set(["Ramesh Deshmukh", "Vijay Pawar"]));

//   const dates = [
//     { day: "MON", date: 12 }, { day: "TUE", date: 13 }, { day: "WED", date: 14 },
//     { day: "THU", date: 15 }, { day: "FRI", date: 16 }, { day: "SAT", date: 17 },
//   ];

//   const members = [
//     "Sunita Patil", "Anita Joshi", "Nisha Naik", "Mahesh Patil", "Dinesh Kamat",
//     "Sonia Verma", "Ramesh Deshmukh", "Vijay Pawar", "Rajesh Sawant", "Seema Khare",
//     "Amit Sharma", "John Doe"
//   ];

//   const toggleMember = (name) => {
//     const newSet = new Set(selectedMembers);
//     if (newSet.has(name)) newSet.delete(name);
//     else newSet.add(name);
//     setSelectedMembers(newSet);
//   };

//   const toggleSelectAll = () => {
//     if (selectedMembers.size === members.length) {
//       setSelectedMembers(new Set());
//     } else {
//       setSelectedMembers(new Set(members));
//     }
//   };

//   const filteredMembers = members.filter(name =>
//     name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="max-w-5xl mx-auto space-y-8">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold text-[#000033]">Mark Attendance</h2>
//         <p className="text-lg font-medium text-gray-600">12 October 2026</p>
//       </div>

//       {/* Date Selector */}
//       <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
//         {dates.map((d) => (
//           <button
//             key={d.date}
//             onClick={() => setSelectedDate(d.date)}
//             className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all font-medium ${
//               selectedDate === d.date
//                 ? "bg-[#000033] text-white shadow-lg scale-105"
//                 : "bg-white border border-gray-200 hover:border-gray-300 text-gray-600"
//             }`}
//           >
//             <span className="text-xs opacity-75">{d.day}</span>
//             <span className="text-2xl font-bold mt-1">{d.date}</span>
//           </button>
//         ))}
//       </div>

//       <Card className="p-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <UserCheck className="text-[#000033]" size={28} />
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900">Mark Attendance – {selectedDate} Oct</h3>
//               <p className="text-gray-500">Total Members: {members.length}</p>
//             </div>
//           </div>

//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={selectedMembers.size === members.length}
//               onChange={toggleSelectAll}
//               className="w-5 h-5 accent-[#000033]"
//             />
//             <span className="font-medium text-gray-700">Select All</span>
//           </label>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-8">
//           <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search member name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#000033] transition-all text-sm"
//           />
//         </div>

//         {/* Members Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
//           {filteredMembers.map((name, index) => {
//             const isChecked = selectedMembers.has(name);
//             return (
//               <div
//                 key={index}
//                 onClick={() => toggleMember(name)}
//                 className={`group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
//                   isChecked 
//                     ? "border-[#000033] bg-[#000033]/5" 
//                     : "border-gray-100 hover:border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium">
//                     {name.split(" ").map(n => n[0]).join("")}
//                   </div>
//                   <span className="font-medium text-gray-800">{name}</span>
//                 </div>

//                 <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
//                   isChecked 
//                     ? "bg-[#000033] border-[#000033]" 
//                     : "border-gray-300 group-hover:border-gray-400"
//                 }`}>
//                   {isChecked && <Check className="text-white" size={16} />}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mt-10 pt-6 border-t">
//           <button
//             onClick={() => alert(`Attendance Saved! ${selectedMembers.size} members marked present`)}
//             className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98]"
//           >
//             Save Attendance ({selectedMembers.size})
//           </button>

//           <button
//             onClick={() => setSelectedMembers(new Set())}
//             className="flex-1 border border-gray-300 hover:bg-gray-50 font-semibold py-4 rounded-2xl transition-all"
//           >
//             Reset
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// }





///  NEW   ONE 



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
//         Available Activies
//       </h2>

//       <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
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
//       </div>

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





////////////////



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
//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
//   const [isViewingAttendance, setIsViewingAttendance] = useState(false);
//   const [activeActivityId, setActiveActivityId] = useState(null);

//   const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

//   const dates = Array.from({ length: daysInMonth }, (_, index) => {
//     const dateNumber = index + 1;
//     const dateObj = new Date(currentYear, currentMonth, dateNumber);

//     return {
//       day: dayNames[dateObj.getDay()],
//       date: dateNumber,
//     };
//   });

//   // 🔥 Date-wise activities
//   const activitiesByDate = {
//     11: [
//       {
//         id: "yoga-11",
//         title: "Yoga",
//         time: "08:00 AM",
//         place: "Meet at courtyard",
//         participants: [
//           "Sunita Patil",
//           "Ramesh Deshmukh",
//           "Anita Joshi",
//           "Vijay Pawar",
//           "Nisha Naik",
//           "Rajesh Sawant",
//           "Mahesh Patil",
//           "Seema Khare",
//           "Dinesh Kamat",
//         ],
//       },
//       {
//         id: "zumba-11",
//         title: "Zumba",
//         time: "10:30 AM",
//         place: "Activity Hall",
//         participants: [
//           "Aarti More",
//           "Pooja Jadhav",
//           "Rohit Kale",
//           "Sneha Patil",
//           "Kunal Shinde",
//           "Bhavna Chavan",
//         ],
//       },
//     ],
//     12: [
//       {
//         id: "meditation-12",
//         title: "Meditation",
//         time: "02:00 PM",
//         place: "Room 204",
//         participants: [
//           "Meena Pawar",
//           "Suresh Naik",
//           "Kalpana More",
//           "Nitin Patil",
//           "Komal Sawant",
//         ],
//       },
//     ],
//     15: [
//       {
//         id: "yoga-15",
//         title: "Yoga",
//         time: "09:00 AM",
//         place: "Main Hall",
//         participants: [
//           "Ravi More",
//           "Sonal Patil",
//           "Ketan Naik",
//         ],
//       },
//       {
//         id: "zumba-15",
//         title: "Zumba",
//         time: "11:30 AM",
//         place: "Activity Hall",
//         participants: [
//           "Asha Sawant",
//           "Komal Jadhav",
//         ],
//       },
//     ],
//   };

//   const activities = activitiesByDate[selectedDate] || [];

//   const createDefaultAttendanceForActivity = (participants) =>
//     participants.reduce((acc, name) => {
//       acc[name] = null;
//       return acc;
//     }, {});

//   const [attendanceByDate, setAttendanceByDate] = useState(() => {
//     const initialState = {};

//     Object.keys(activitiesByDate).forEach((dateKey) => {
//       initialState[dateKey] = {};
//       activitiesByDate[dateKey].forEach((activity) => {
//         initialState[dateKey][activity.id] = createDefaultAttendanceForActivity(
//           activity.participants
//         );
//       });
//     });

//     return initialState;
//   });

//   const [statusByDate, setStatusByDate] = useState(() => {
//     const initialState = {};

//     Object.keys(activitiesByDate).forEach((dateKey) => {
//       initialState[dateKey] = {};
//       activitiesByDate[dateKey].forEach((activity) => {
//         initialState[dateKey][activity.id] = "Pending";
//       });
//     });

//     return initialState;
//   });

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
//         Available Activies
//       </h2>

//       {/* 🔥 Dynamic Month Title */}
//       <div className="text-lg font-semibold text-gray-800">
//         {monthNames[currentMonth]} {currentYear}
//       </div>

//       <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
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
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
//         {activities.length === 0 ? (
//           <Card className="xl:col-span-2 bg-white p-5 sm:p-6">
//             <p className="text-[16px] sm:text-sm text-gray-600">
//               No activities available for {selectedDate} {monthNames[currentMonth]}.
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
//                         className={`text-white text-[11px] sm:text-[10px] px-3 py-1 rounded-full font-bold ${
//                           currentStatus === "Marked" ? "bg-green-500" : "bg-red-500"
//                         }`}
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
//                 Mark Attendance – {activeActivity.title} ({selectedDate}{" "}
//                 {monthNames[currentMonth].slice(0, 3)})
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
//                 View Attendance – {activeActivity.title} ({selectedDate}{" "}
//                 {monthNames[currentMonth].slice(0, 3)})
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

//// 




// working code ---> 


// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { api } from "../../../src/services/apiClient";
// import QRScanner from "../../../src/components/QRScanner";
// import { hasPermission } from "../../../src/utils/permissions";

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
//     <div className={`px-5 sm:px-6 pt-5 pb-4 ${className}`} {...props} />
//   );
// }

// function CardTitle({ className = "", ...props }) {
//   return <h3 className={`text-lg font-bold ${className}`} {...props} />;
// }

// function CardContent({ className = "", ...props }) {
//   return <div className={`px-5 sm:px-6 pb-5 ${className}`} {...props} />;
// }

// export default function AttendancePage() {

//   // 🔥 HARD BLOCK — NO ACCESS
//   if (!hasPermission("VIEW_ATTENDANCE") && !hasPermission("MARK_ATTENDANCE")) {
//   return <div className="p-6">No access</div>;
// }

//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isViewingAttendance, setIsViewingAttendance] = useState(false);
//   const [activeActivity, setActiveActivity] = useState(null);
//   const [scanning, setScanning] = useState(false);
//   const [multiActivities, setMultiActivities] = useState(null);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [toastMsg, setToastMsg] = useState(""); 

//   const containerRef = useRef(null);
//   const selectedRef = useRef(null);

//   const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ];

//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

//   const dates = Array.from({ length: daysInMonth }, (_, i) => {
//     const d = new Date(currentYear, currentMonth, i + 1);
//     return { day: dayNames[d.getDay()], date: i + 1 };
//   });

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (selectedRef.current && containerRef.current) {
//         const container = containerRef.current;
//         const selected = selectedRef.current;

//         const offset =
//           selected.offsetLeft -
//           container.offsetWidth / 2 +
//           selected.offsetWidth / 2;

//         container.scrollTo({
//           left: offset,
//           behavior: "smooth",
//         });
//       }
//     }, 100);

//     return () => clearTimeout(timeout);
//   }, [selectedDate]);

//   useEffect(() => {
//   if (!toastMsg) return;

//   const t = setTimeout(() => {
//     setToastMsg("");
//   }, 2000);

//   return () => clearTimeout(t);
// }, [toastMsg]);

//   // const handleScan = async (raw) => {
//   //   try {
//   //     const parsed = JSON.parse(raw);
//   //     const memberId = parsed.memberId;

//   //     if (!memberId) throw new Error("Invalid QR");

//   //     console.log("STEP 1: VALIDATING MEMBER");

//   //     // 🔥 STEP 1: VALIDATE
//   //     const res = await api.attendance.validate(memberId);

//   //     const data = res.data;

//   //     if (!data.valid) {
//   //       console.error("Invalid member");
//   //       return;
//   //     }

//   //     const activities = data.activeActivities || [];

//   //     if (activities.length === 0) {
//   //       console.error("No active activities");
//   //       return;
//   //     }

//   //     // 🔥 STEP 2: SINGLE ACTIVITY → DIRECT MARK
//   //     if (activities.length === 1) {
//   //       const act = activities[0];

//   //       await api.attendance.mark({
//   //         memberId,
//   //         activityId: act.activityId,
//   //         activityFeeId: act.activityFeeId,
//   //       });

//   //       console.log("Attendance marked directly");
//   //       return;
//   //     }

//   //     // 🔥 STEP 3: MULTIPLE → SHOW UI
//   //     setSelectedMember({
//   //       memberId,
//   //       activities
//   //     });

//   //   } catch (err) {
//   //     console.error("Scan error:", err?.response?.data || err.message);
//   //   }
//   // };

//   const scanLock = useRef(false); // ✅ ADD THIS ABOVE handleScan
// // working -->04/05/26
// // const handleScan = async (raw) => {
// //   console.log("RAW QR:", raw);

// // try {
// //   const parsed = JSON.parse(raw);
// //   console.log("PARSED QR:", parsed);
// // } catch (e) {
// //   console.error("QR NOT JSON:", raw);
// // }

// //   if (scanLock.current) return; // 🚫 prevents multiple scans
// //   scanLock.current = true;

// //   try {
// //     const parsed = JSON.parse(raw);
// //     const memberId = parsed.memberId;
// //     const organizationId = parsed.organizationId;

// // if (!memberId || !organizationId) {
// //   throw new Error("Invalid QR data");
// // }

// //     if (!memberId) throw new Error("Invalid QR");

// //     // 🔥 STEP 1: VALIDATE
// //     const res = await api.attendance.validate(memberId, organizationId);
// //     const data = res.data;

// //     if (!data.valid) {
// //       console.error("Invalid member");
// //       scanLock.current = false;
// //       return;
// //     }

// //     const activities = data.activeActivities || [];

// //     if (activities.length === 0) {
// //       console.error("No active activities");
// //       scanLock.current = false;
// //       return;
// //     }

// //     // ✅ SINGLE ACTIVITY
// //     if (activities.length === 1) {
// //       const act = activities[0];

// //       await api.attendance.mark({
// //         memberId,
// //         activityId: act.activityId,
// //         activityFeeId: act.activityFeeId,
// //       });

// //       console.log("Attendance marked");
// //       return;
// //     }

// //     // ✅ MULTIPLE → SHOW UI
// //     setSelectedMember({
// //       memberId,
// //       activities,
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     scanLock.current = false; // allow retry only if error
// //   }
// // };
// // <--- working 
// const handleScan = async (raw) => {
//   if (scanLock.current) return;
//   scanLock.current = true;

//   try {
//     const parsed = JSON.parse(raw);
//     const memberId = parsed.memberId;
//     const organizationId = parsed.organizationId;

//     if (!memberId || !organizationId) {
//       throw new Error("Invalid QR data");
//     }

//     // ✅ USE SINGLE BACKEND API
//     // const res = await api.staffPanel.scanQR({
//     //   memberId,
//     //   organizationId
//     // });
// const res = await api.staffPanel.scanQR(memberId);
//     const data = res.data;

//     // ✅ SHOW MESSAGE FROM BACKEND
//     setToastMsg(data.message || "Done");

//     // ✅ AUTO MARK
//     if (data.autoMarked) {

//       fetchAttendance(selectedDate); 
//     } 
//     // ✅ MULTIPLE ACTIVITIES
//     else {
//       setSelectedMember({
//         memberId: data.member.memberId,
//         activities: data.activities
//       });
//     }

//   } catch (err) {
//     setToastMsg(err?.response?.data?.message || err.message);
//   }

//   // ✅ RESET LOCK
//   setTimeout(() => {
//     scanLock.current = false;
//   }, 1500);
// };


//   const fetchAttendance = async (date) => {
//     try {
//       setLoading(true);

//       const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

//       const res = await api.staffPanel.getAttendanceByDate(formattedDate);

//       setActivities(res?.data?.data || []);
//     } catch (err) {
//       console.error("Attendance fetch error:", err?.response?.data || err.message);
//       setActivities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance(selectedDate);
//   }, [selectedDate, currentMonth, currentYear]);

//   const openViewModal = (activity) => {
//     setActiveActivity(activity);
//     setIsViewingAttendance(true);
//   };

//   return (
//     <div className="space-y-6 px-2">

//       {/* HEADER */}
//       <h2 className="text-xl sm:text-2xl font-bold text-[#000033]">
//         Attendance
//       </h2>

//       {/* MONTH */}
//       <div className="text-lg font-semibold">
//         {monthNames[currentMonth]} {currentYear}
//       </div>

//       {/* DATE SCROLLER */}
//       <div
//         ref={containerRef}
//         className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
//       >
//         {dates.map((d) => (
//           <button
//             key={d.date}
//             ref={selectedDate === d.date ? selectedRef : null}
//             onClick={() => setSelectedDate(d.date)}
//             className={`min-w-[70px] h-[70px] rounded-xl flex flex-col justify-center items-center ${
//               selectedDate === d.date
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             <span className="text-xs">{d.day}</span>
//             <span className="text-lg font-bold">{d.date}</span>
//           </button>
//         ))}
//       </div>

//       {/* ✅ SCAN BUTTON (permission safe) */}
//       {hasPermission("MARK_ATTENDANCE") && (
//       <button
//         onClick={() => setScanning((s) => !s)}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {scanning ? "Stop Scan" : "Scan QR"}
//       </button>
//     )}

//       {/* ✅ SCANNER (double protected) */}
//       {/* console.log("SCANNER RENDERED"); */}
//       {scanning && hasPermission("MARK_ATTENDANCE") && (
//         <div className="mt-4 p-4 bg-white rounded-xl shadow">
//           <p className="text-sm font-medium mb-2 text-gray-700">
//             Scan Member QR Code
//           </p>

//           <QRScanner onScan={handleScan} />
//           {toastMsg && (
//   <div className="mt-3 bg-green-100 text-green-700 px-3 py-2 rounded">
//     {toastMsg}
//   </div>
// )}

//           <button
//             onClick={() => setScanning(false)}
//             className="mt-3 text-sm text-red-500"
//           >
//             Stop Scanner
//           </button>
//         </div>
//       )}

//       {selectedMember && (
//         <div className="mt-4 bg-white p-4 rounded shadow">
//           <p className="font-semibold mb-2">Select Activity</p>

//           {selectedMember.activities.map((act) => (
//             <button
//               key={act.activityId}
//               onClick={async () => {
//   try {
//     const res = await api.attendance.mark({
//       memberId: selectedMember.memberId,
//       activityId: act.activityId,
//       activityFeeId: act.activityFeeId,
//     });

//     setToastMsg(
//       res?.data?.message || `${act.activityName} attendance marked`
//     );

//     setSelectedMember(null);

//     fetchAttendance(selectedDate); // ✅ THIS FIXES YOUR ISSUE

//   } catch (err) {
//     setToastMsg(err?.response?.data?.message || "Failed to mark attendance");
//   }
// }}
//               className="block w-full text-left p-2 border mb-2 rounded hover:bg-gray-100"
//             >
//               {act.activityName}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* LOADING */}
//       {loading && <div className="text-sm text-gray-500">Loading...</div>}

//       {/* CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//         {activities.length === 0 && !loading ? (
//           <Card className="p-4">
//             No attendance found for this date
//           </Card>
//         ) : (
//           activities.map((activity) => (
//             <Card
//               key={activity.activityId}
//               className="p-4 bg-green-100 border-none"
//             >
//               <div className="flex justify-between">

//                 <div>
//                   <h3 className="font-bold text-sm">
//                     {activity.activityName}
//                   </h3>

//                   <p className="text-sm mt-2 font-semibold">
//                     Participants - {activity.total ?? activity.participants?.length ?? 0}
//                   </p>

//                   <p className="text-xs text-gray-600">
//                     Present: {activity.present ?? activity.participants?.filter(p => p.status === "Present").length ?? 0}
//                     {" | "}
//                     Absent: {activity.absent ?? activity.participants?.filter(p => p.status === "Absent").length ?? 0}
//                   </p>
//                 </div>

//                 <div className="flex flex-col items-end gap-2">

//                   <span
//                     className={`text-xs px-2 py-1 text-white rounded-full ${
//                       activity.status === "Completed"
//                         ? "bg-green-500"
//                         : "bg-orange-500"
//                     }`}
//                   >
//                     {activity.status}
//                   </span>

//                   <button
//                     onClick={() => openViewModal(activity)}
//                     className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full"
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* VIEW MODAL */}
//       {isViewingAttendance && activeActivity && (
//         <Card className="mt-4">
//           <CardHeader className="flex justify-between border-b">
//             <CardTitle>
//               {activeActivity.activityName} Attendance
//             </CardTitle>

//             <button onClick={() => setIsViewingAttendance(false)}>✕</button>
//           </CardHeader>

//           <CardContent>
//             {activeActivity.participants?.map((p, i) => (
//               <div key={i} className="flex justify-between border-b py-2">
//                 <span>{p.name}</span>
//                 <span className="text-sm">{p.status}</span>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// <---- working code

import React, { useEffect, useState, useRef } from "react";
import { api } from "../../../src/services/apiClient";
import QRScanner from "../../../src/components/QRScanner";
import { hasPermission } from "../../../src/utils/permissions";

function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`px-6 pt-5 pb-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className = "", children, ...props }) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>{children}</h3>;
}

export default function AttendancePage() {
  if (!hasPermission("VIEW_ATTENDANCE") && !hasPermission("MARK_ATTENDANCE")) {
    return <div className="p-8 text-center text-gray-500">No access to attendance module</div>;
  }

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isViewingAttendance, setIsViewingAttendance] = useState(false);
  const [activeActivity, setActiveActivity] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMsg, setToastMsg] = useState(""); 

  const containerRef = useRef(null);
  const selectedRef = useRef(null);
  const scanLock = useRef(false);

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const dates = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return { day: dayNames[d.getDay()], date: i + 1 };
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedRef.current && containerRef.current) {
        const container = containerRef.current;
        const selected = selectedRef.current;
        const offset = selected.offsetLeft - container.offsetWidth / 2 + selected.offsetWidth / 2;
        container.scrollTo({ left: offset, behavior: "smooth" });
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [selectedDate]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const handleScan = async (raw) => {
    if (scanLock.current) return;
    scanLock.current = true;

    try {
      const parsed = JSON.parse(raw);
      const memberId = parsed.memberId;
      const organizationId = parsed.organizationId;

      if (!memberId || !organizationId) throw new Error("Invalid QR data");

      const res = await api.staffPanel.scanQR(memberId);
      const data = res.data;

      setToastMsg(data.message || "Attendance processed");

      if (data.autoMarked) {
        fetchAttendance(selectedDate);
      } else if (data.activities?.length > 0) {
        setSelectedMember({
          memberId: data.member.memberId,
          activities: data.activities
        });
      }
    } catch (err) {
      setToastMsg(err?.response?.data?.message || err.message || "Scan failed");
    } finally {
      setTimeout(() => { scanLock.current = false; }, 1500);
    }
  };

  const fetchAttendance = async (date) => {
    try {
      setLoading(true);
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
      const res = await api.staffPanel.getAttendanceByDate(formattedDate);
      setActivities(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const openViewModal = (activity) => {
    setActiveActivity(activity);
    setIsViewingAttendance(true);
  };

  const closeModal = () => {
    setIsViewingAttendance(false);
    setActiveActivity(null);
  };

  // Helper to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "Time N/A";
    // If time is like "09:00:00" or "14:30"
    return timeStr.slice(0, 5); // Show HH:MM
  };

  return (
    <div className="space-y-8 px-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000033]">Attendance</h1>
          <p className="text-gray-500 mt-1">{monthNames[currentMonth]} {currentYear}</p>
        </div>
      </div>

      {/* Date Scroller */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div ref={containerRef} className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {dates.map((d) => (
            <button
              key={d.date}
              ref={selectedDate === d.date ? selectedRef : null}
              onClick={() => setSelectedDate(d.date)}
              className={`min-w-[68px] h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 snap-start
                ${selectedDate === d.date 
                  ? "bg-[#000033] text-white shadow-md scale-105" 
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                }`}
            >
              <span className="text-xs font-medium tracking-widest">{d.day}</span>
              <span className="text-3xl font-bold mt-1">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scan Button */}
      {hasPermission("MARK_ATTENDANCE") && (
        <button
          onClick={() => setScanning(!scanning)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all"
        >
          📱 {scanning ? "Stop Scanning" : "Scan Member QR"}
        </button>
      )}

      {/* Scanner */}
      {scanning && hasPermission("MARK_ATTENDANCE") && (
        <div className="bg-white rounded-3xl p-6 shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-lg">Scan Member QR Code</p>
            <button onClick={() => setScanning(false)} className="text-red-500 hover:text-red-600">Close</button>
          </div>
          <QRScanner onScan={handleScan} />
          {toastMsg && <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl">{toastMsg}</div>}
        </div>
      )}

      {/* Multiple Activity Selection */}
      {selectedMember && (
        <div className="bg-white rounded-3xl p-6 shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Select Activity</h3>
          <div className="space-y-3">
            {selectedMember.activities.map((act) => (
              <button
                key={act.activityId}
                onClick={async () => {
                  try {
                    const res = await api.attendance.mark({
                      memberId: selectedMember.memberId,
                      activityId: act.activityId,
                      activityFeeId: act.activityFeeId,
                    });
                    setToastMsg(res?.data?.message || "Attendance marked");
                    setSelectedMember(null);
                    fetchAttendance(selectedDate);
                  } catch (err) {
                    setToastMsg("Failed to mark attendance");
                  }
                }}
                className="w-full text-left p-5 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-2xl transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{act.activityName}</p>
                  {/* <p className="text-sm text-gray-500">{formatTime(act.time || act.startTime)}</p> */}
                </div>
                <span className="text-blue-600 text-2xl">→</span>
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedMember(null)} className="mt-4 text-gray-500">Cancel</button>
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activities.length === 0 && !loading ? (
          <Card className="col-span-full p-12 text-center text-gray-400">
            No activities for this date
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.activityId}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-900">{activity.activityName}</h3>
                    
                    {/* TIME DISPLAY - IMPROVED */}
                    <p className="text-blue-600 font-medium mt-1 flex items-center gap-2">
                      🕒 {formatTime(activity.time || activity.startTime || activity.scheduleTime)}
                    </p>
                  </div>

                  <span className={`text-xs px-4 py-1.5 font-medium rounded-full ${
                    activity.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {activity.status}
                  </span>
                </div>

                <div className="mt-8 flex items-end gap-6">
                  <div>
                    <div className="text-5xl font-bold text-gray-900">
                      {activity.total ?? activity.participants?.length ?? 0}
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Participants</p>
                  </div>

                  <div className="flex-1 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Present</span>
                      <span className="font-semibold">
                        {activity.present ?? activity.participants?.filter(p => p.status === "Present").length ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600">Absent</span>
                      <span className="font-semibold">
                        {activity.absent ?? activity.participants?.filter(p => p.status === "Absent").length ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-3xl">
                <button
                  onClick={() => openViewModal(activity)}
                  className="w-full bg-white border border-gray-200 hover:border-gray-300 py-3 rounded-2xl font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  View Full Attendance →
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Modal */}
      {isViewingAttendance && activeActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex items-center justify-between bg-gray-50">
              <CardTitle>{activeActivity.activityName}</CardTitle>
              <button onClick={closeModal} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
            </CardHeader>

            <div className="p-6 text-sm text-gray-600 border-b">
              🕒 {formatTime(activeActivity.time || activeActivity.startTime)}
            </div>

            {/* Participants List */}
            <div className="max-h-[55vh] overflow-auto">
              {activeActivity.participants?.length > 0 ? (
                activeActivity.participants.map((p, i) => (
                  <div key={i} className="flex justify-between items-center px-6 py-5 border-b">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.memberId}</p>
                    </div>
                    <span className={`px-5 py-1 rounded-2xl text-sm font-semibold ${
                      p.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">No participants yet</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
