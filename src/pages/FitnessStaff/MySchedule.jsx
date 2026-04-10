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



import React, { useState } from "react";

function Card({ className = "", ...props }) {
  return <div className={`rounded-xl bg-white shadow-sm border border-gray-100 ${className}`} {...props} />;
}

function CardHeader({ className = "", ...props }) {
  return <div className={`px-6 pt-6 pb-4 ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-xl font-bold ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`px-6 pb-6 ${className}`} {...props} />;
}

function Button({ children, className = "", ...props }) {
  return <button className={`font-medium ${className}`} {...props}>{children}</button>;
}

export default function MySchedule() {
  const [selectedDate, setSelectedDate] = useState(12);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  const dates = [
    { day: "MON", date: 12 }, { day: "TUE", date: 13 }, { day: "WED", date: 14 },
    { day: "THU", date: 15 }, { day: "FRI", date: 16 }, { day: "SAT", date: 17 },
  ];

  const participants = [
    "Sunita Patil", "Ramesh Deshmukh", "Anita Joshi", "Vijay Pawar", 
    "Nisha Naik", "Rajesh Sawant", "Mahesh Patil", "Seema Khare", "Dinesh Kamat"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#000033]">My Schedule</h2>
      
      {/* Date Selector */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {dates.map((item) => (
          <button
            key={item.date}
            onClick={() => setSelectedDate(item.date)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl transition-all ${
              selectedDate === item.date
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span className="text-[10px] font-bold mb-1">{item.day}</span>
            <span className="text-xl font-bold">{item.date}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#F0EFFF] border-none p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Yoga – 08:00 AM</h3>
              <p className="text-sm text-gray-600 mt-1">Meet at courtyard</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Status</span>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Pending</span>
              </div>
              <Button 
                className="bg-[#4CAF50] hover:bg-[#45a049] h-6 px-3 text-[10px] font-bold"
                onClick={() => setIsMarkingAttendance(true)}
              >
                Mark
              </Button>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-800">Participants - 20</p>
        </Card>

        {isMarkingAttendance && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle>Mark Attendance – Yoga (24 Oct)</CardTitle>
              <button 
                onClick={() => setIsMarkingAttendance(false)}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-xs font-bold"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {participants.map((name, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <Button className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] font-bold" onClick={() => setIsMarkingAttendance(false)}>
                  Save
                </Button>
                <Button className="flex-1 bg-[#C62828] hover:bg-[#b71c1c] font-bold" onClick={() => setIsMarkingAttendance(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
