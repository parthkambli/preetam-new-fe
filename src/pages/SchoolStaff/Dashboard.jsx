
// import React from "react";
// import { Clock } from "lucide-react";

// function Card({ className = "", ...props }) {
//   return <div className={`rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`} {...props} />;
// }

// function CardHeader({ className = "", ...props }) {
//   return <div className={`px-6 pt-6 pb-3 ${className}`} {...props} />;
// }

// function CardTitle({ className = "", ...props }) {
//   return <h3 className={`text-lg font-bold text-[#000033] ${className}`} {...props} />;
// }

// function CardContent({ className = "", ...props }) {
//   return <div className={`px-6 pb-6 ${className}`} {...props} />;
// }

// function StatCard({ title, value, valueColor }) {
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <p className="text-sm font-medium text-gray-600">{title}</p>
//       </CardHeader>
//       <CardContent>
//         <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
//       </CardContent>
//     </Card>
//   );
// }

// function Table({ className = "", ...props }) {
//   return <table className={`w-full text-sm ${className}`} {...props} />;
// }

// function TableHeader({ className = "", ...props }) {
//   return <thead className={`bg-gray-50 ${className}`} {...props} />;
// }

// function TableRow({ className = "", ...props }) {
//   return <tr className={`border-b hover:bg-gray-50 ${className}`} {...props} />;
// }

// function TableHead({ className = "", ...props }) {
//   return <th className={`px-4 py-3 text-left font-medium text-[#000033] ${className}`} {...props} />;
// }

// function TableCell({ className = "", ...props }) {
//   return <td className={`px-4 py-3 ${className}`} {...props} />;
// }

// function Avatar({ className = "", ...props }) {
//   return <div className={`size-8 rounded-full overflow-hidden ${className}`} {...props} />;
// }

// function AvatarFallback({ children }) {
//   return <div className="size-full bg-gray-100 flex items-center justify-center text-xs font-medium">{children}</div>;
// }

// export default function Dashboard() {
//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-[#000033]">Dashboard</h2>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Members" value="12" valueColor="text-[#000033]" />
//         <StatCard title="Active Members" value="10" valueColor="text-[#00C853]" />
//         <StatCard title="Today's Attendance" value="8" valueColor="text-[#000033]" />
//         <StatCard title="Pending Tasks" value="3" valueColor="text-[#E50914]" />
//       </div>

//       {/* Upcoming Sessions & Recent Attendance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Upcoming Sessions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 { time: "09:00 AM", task: "Yoga Class", instructor: "Meera" },
//                 { time: "11:00 AM", task: "Cardio Blast", instructor: "Rahul" },
//                 { time: "04:00 PM", task: "Strength Training", instructor: "Vikas" },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <Clock size={18} className="text-gray-400" />
//                     <div>
//                       <p className="font-medium">{item.task}</p>
//                       <p className="text-sm text-gray-500">{item.instructor}</p>
//                     </div>
//                   </div>
//                   <span className="text-sm font-semibold text-[#000033]">{item.time}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Attendance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 { name: "Amit Sharma", time: "08:15 AM", status: "Present" },
//                 { name: "Sonia Verma", time: "08:30 AM", status: "Present" },
//                 { name: "Rohit Patel", time: "09:05 AM", status: "Present" },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
//                   <div className="flex items-center gap-3">
//                     <Avatar>
//                       <AvatarFallback>{item.name[0]}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">{item.time}</p>
//                     </div>
//                   </div>
//                   <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
//                     {item.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Today's Schedule */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Today's Schedule Activities</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 py-8 text-center">No schedules for today</p>
//         </CardContent>
//       </Card>

//       {/* Pending Fees */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Fees Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-lg border overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Member Name</TableHead>
//                   <TableHead>Plan</TableHead>
//                   <TableHead>Due Amount</TableHead>
//                   <TableHead>Due Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <tbody>
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-32 text-center text-gray-500">
//                     No pending fees found
//                   </TableCell>
//                 </TableRow>
//               </tbody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



/// NEW ONEEE 

import React from "react";
import { Search, CalendarDays } from "lucide-react";

function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-[22px] bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`}
      {...props}
    />
  );
}

function Avatar({ className = "", ...props }) {
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      {...props}
    />
  );
}

function AvatarFallback({ children, className = "" }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center font-semibold ${className}`}
    >
      {children}
    </div>
  );
}

function StatMiniCard({ icon, value, label }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F3F0FF] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[26px] sm:text-2xl font-bold text-[#111111] leading-none">
            {value}
          </p>
          <p className="text-[14px] sm:text-sm text-gray-400 mt-1 leading-snug">
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const upcomingSessions = [
    {
      title: "Yoga - 08:00 AM",
      place: "Meet at courtyard",
      bg: "bg-[#E8E0FA]",
    },
    {
      title: "Yoga - 10:00 AM",
      place: "Hall A",
      bg: "bg-[#D8F0E8]",
    },
  ];

  const weeklySchedule = [
    {
      dateLabel: "Today — 3 event(s)",
      items: [
        { time: "08:00", title: "Yoga Session", place: "Meet at courtyard" },
        { time: "10:00", title: "Yoga Session", place: "Hall A" },
      ],
    },
    {
      dateLabel: "10/26/2025 — 1 event(s)",
      items: [
        {
          time: "15:00",
          title: "Group Exercise",
          place: "gym Room — Group session",
        },
      ],
    },
    {
      dateLabel: "10/27/2025 — 1 event(s)",
      items: [
        {
          time: "09:30",
          title: "Health Talk: Nutrition",
          place: "Dining Hall",
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="space-y-5 sm:space-y-6">
          {/* Search + Avatar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-12 rounded-full bg-[#F2F0F4] border border-transparent pl-11 pr-4 text-[15px] sm:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#000033]"
              />
            </div>

            <Avatar className="w-11 h-11 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Avatar>
          </div>

          {/* Welcome Card */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[24px] sm:text-xl font-semibold text-[#111111]">
                  Welcome, Meena Patil
                </h3>
                <p className="text-[15px] sm:text-sm text-gray-400 mt-3 leading-7 sm:leading-6 max-w-md">
                  Welcome to your staff dashboard.
                  <br />
                  Check your upcoming classes,
                  <br />
                  update attendance here.
                </p>
              </div>

              <Avatar className="w-16 h-16 sm:w-14 sm:h-14 bg-[#EEEAF8] shrink-0">
                <AvatarFallback className="text-[#333] text-[22px] sm:text-lg">
                  MP
                </AvatarFallback>
              </Avatar>
            </div>
          </Card>

          {/* Mini Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <StatMiniCard
              icon={<CalendarDays size={16} className="text-[#7C6CF5]" />}
              value="3"
              label="Total Sessions Today"
            />
            <StatMiniCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#2DA5F3]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              }
              value="28"
              label="Total Participants"
            />
          </div>

          {/* Upcoming Session */}
          <Card className="p-5 sm:p-6">
            <h3 className="text-[24px] sm:text-xl font-semibold text-[#111111] mb-4">
              Upcoming Session
            </h3>

            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <div
                  key={index}
                  className={`rounded-xl px-4 py-3 ${session.bg}`}
                >
                  <p className="text-[17px] sm:text-base font-semibold text-[#111111]">
                    {session.title}
                  </p>
                  <p className="text-[14px] sm:text-sm text-gray-500 mt-1">
                    {session.place}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* This Week */}
          <Card className="p-5 sm:p-6">
            <h3 className="text-[24px] sm:text-xl font-semibold text-[#111111] mb-4">
              This Week
            </h3>

            <div className="space-y-4">
              {weeklySchedule.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <p className="text-[15px] sm:text-sm font-semibold text-[#111111] mb-2">
                    {group.dateLabel}
                  </p>

                  <div className="space-y-2">
                    {group.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="grid grid-cols-[58px_1fr] sm:grid-cols-[72px_1fr_1fr] gap-2 text-[14px] sm:text-sm text-[#111111]"
                      >
                        <div className="font-medium">{item.time}</div>
                        <div>{item.title}</div>
                        <div className="text-gray-600 sm:block hidden">
                          {item.place}
                        </div>
                        <div className="text-gray-600 sm:hidden col-span-2 pl-[58px]">
                          {item.place}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 