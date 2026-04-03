// export default function SchoolDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Participants</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">80</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Staff</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">70</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Upcoming Events</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">10</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Today Total Enquiries</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">18</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-xl font-bold mb-4">Today's Schedule</h3>
//           <div className="space-y-3">
//             {['Yoga 10:00 AM', 'Art 11:00 AM', 'Music 12:00 PM', 'Therapy 01:00 PM', 'Group Exercises 03:00 PM', 'Health Awareness Talk 04:00 PM'].map((act, i) => (
//               <div key={i} className="bg-gray-50 p-3 rounded-lg">{act}</div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-xl font-bold mb-4">Today's Activities Attendance</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="font-medium">Yoga</span>
//                 <span>32 / 40 Present</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div className="h-full bg-green-500 w-[80%]"></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="font-medium">Music</span>
//                 <span>18 / 25 Present</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div className="h-full bg-green-500 w-[72%]"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function SchoolDashboard() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-4 sm:space-y-5">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Row 1: 3 stat cards — number LEFT, label RIGHT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { value: "80", label: "Total Participants" },
          { value: "70", label: "Total Staff" },
          { value: "10", label: "Upcoming Events" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">{s.value}</span>
            <span className="text-sm sm:text-base text-gray-600 font-medium leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Row 2: 3-column grid — col1: Participants, col2: Staff, col3: Fee+Enquiries stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:gap-4">
        {/* Participants Present Today */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3">Participants Present Today</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-3">72%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2 sm:mb-3">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: "72%" }} />
            </div>
            <p className="text-xs text-gray-500">72 of 100 participants attended at least one activity</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-2">Total Activity Check-ins</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">76</p>
            <p className="text-xs text-gray-500">Multiple activities counted separately</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Staff Attendance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3">Staff Attendance</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-3">18 / 20</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2 sm:mb-3">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: "90%" }} />
            </div>
            <p className="text-xs text-gray-500">Staff present in assigned activities</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-2">Most Active Program</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">Yoga</p>
            <p className="text-xs text-gray-500">32 participants attended today</p>
          </div>
        </div>





        {/* Right column: Fee Management + Today Enquiries */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Fee Management</p>
            <div className="flex gap-2 mb-3">
              <select className="text-xs border border-gray-300 rounded-md px-2 py-1 text-gray-600 focus:outline-none bg-white">
                <option>2023-2024</option>
              </select>
              <select className="text-xs border border-gray-300 rounded-md px-2 py-1 text-gray-600 focus:outline-none bg-white">
                <option>Annual</option>
              </select>
            </div>
            <div className="bg-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-base sm:text-lg font-bold text-gray-800">₹29,545,000</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Fee</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Today Total Enquiries</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800">18</p>
          </div>
        </div>
      </div>

      {/* Today's Schedule Actives */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">Today's Schedule Actives</h2>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
          {[
            { name: "Yoga",                  time: "10:00 AM", border: "border-purple-300",  bg: "bg-purple-50"  },
            { name: "Art",                   time: "11:00 AM", border: "border-yellow-300",  bg: "bg-yellow-50"  },
            { name: "Music",                 time: "12:00 PM", border: "border-pink-300",    bg: "bg-pink-50"    },
            { name: "Therapy",               time: "01:00 PM", border: "border-violet-300",  bg: "bg-violet-50"  },
            { name: "Group Exercises",       time: "03:00 PM", border: "border-green-300",   bg: "bg-green-50"   },
            { name: "Health Awareness Talk", time: "04:00 PM", border: "border-cyan-300",    bg: "bg-cyan-50"    },
          ].map((a) => (
            <div
              key={a.name}
              className={`flex-shrink-0 border-2 ${a.border} ${a.bg} rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-center min-w-[100px] sm:min-w-[110px]`}
            >
              <p className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">{a.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{a.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Actives Attendance */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">Today's Actives Attendance</h2>
        <div className="space-y-2 sm:space-y-3">
          {[
            { emoji: "🧘", name: "Yoga",  present: 32, total: 40, accent: "border-blue-500"  },
            { emoji: "🎵", name: "Music", present: 18, total: 25, accent: "border-pink-500"   },
            { emoji: "🎨", name: "Art",   present: 14, total: 20, accent: "border-green-600"  },
          ].map((a) => (
            <div
              key={a.name}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${a.accent} px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between`}
            >
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {a.emoji} {a.name}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 font-medium">
                {a.present} / {a.total} Present
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}