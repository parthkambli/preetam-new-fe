// import React, { useState } from "react";
// import { 
//   LayoutDashboard, 
//   Activity, 
//   CreditCard, 
//   LogOut, 
//   ChevronLeft, 
//   ChevronDown,
//   Clock
// } from "lucide-react";
// import { Button as ButtonPrimitive } from "@base-ui/react/button";
// import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
// import { Menu as MenuPrimitive } from "@base-ui/react/menu";
// import { cva } from "class-variance-authority";
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// // --- Utility ---
// function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// // --- Button ---
// const buttonVariants = cva(
//   "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         outline: "border-border bg-background hover:bg-muted hover:text-foreground",
//         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-muted hover:text-foreground",
//         destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-8 gap-1.5 px-2.5",
//         sm: "h-7 gap-1 px-2.5 text-sm",
//         lg: "h-9 gap-1.5 px-2.5",
//         icon: "size-8",
//       },
//     },
//     defaultVariants: { variant: "default", size: "default" },
//   }
// );

// const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
//   <ButtonPrimitive
//     ref={ref}
//     className={cn(buttonVariants({ variant, size, className }))}
//     {...props}
//   />
// ));
// Button.displayName = "Button";

// // --- Card Components ---
// function Card({ className, ...props }) {
//   return (
//     <div
//       className={cn(
//         "rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CardHeader({ className, ...props }) {
//   return <div className={cn("px-6 pt-6 pb-3", className)} {...props} />;
// }

// function CardTitle({ className, ...props }) {
//   return (
//     <h3 className={cn("text-lg font-bold text-[#000033]", className)} {...props} />
//   );
// }

// function CardContent({ className, ...props }) {
//   return <div className={cn("px-6 pb-6", className)} {...props} />;
// }

// // --- Table Components ---
// function Table({ className, ...props }) {
//   return <table className={cn("w-full text-sm", className)} {...props} />;
// }

// function TableHeader({ className, ...props }) {
//   return <thead className={cn("bg-gray-50", className)} {...props} />;
// }

// function TableBody({ className, ...props }) {
//   return <tbody className={cn(className)} {...props} />;
// }

// function TableRow({ className, ...props }) {
//   return <tr className={cn("border-b hover:bg-gray-50", className)} {...props} />;
// }

// function TableHead({ className, ...props }) {
//   return <th className={cn("px-4 py-3 text-left font-medium text-[#000033]", className)} {...props} />;
// }

// function TableCell({ className, ...props }) {
//   return <td className={cn("px-4 py-3", className)} {...props} />;
// }

// // --- Avatar ---
// function Avatar({ className, ...props }) {
//   return (
//     <AvatarPrimitive.Root
//       className={cn("size-8 rounded-full overflow-hidden", className)}
//       {...props}
//     />
//   );
// }

// function AvatarImage({ className, ...props }) {
//   return <AvatarPrimitive.Image className={cn("size-full object-cover", className)} {...props} />;
// }

// function AvatarFallback({ className, ...props }) {
//   return (
//     <AvatarPrimitive.Fallback
//       className={cn("size-full bg-gray-100 flex items-center justify-center text-xs font-medium", className)}
//       {...props}
//     />
//   );
// }

// // --- Dropdown Menu ---
// function DropdownMenu({ ...props }) {
//   return <MenuPrimitive.Root {...props} />;
// }

// function DropdownMenuTrigger({ className, ...props }) {
//   return <MenuPrimitive.Trigger className={cn("flex items-center gap-2", className)} {...props} />;
// }

// function DropdownMenuContent({ className, ...props }) {
//   return (
//     <MenuPrimitive.Portal>
//       <MenuPrimitive.Positioner>
//         <MenuPrimitive.Popup
//           className={cn(
//             "bg-white rounded-lg shadow-lg border p-1 z-50 min-w-[160px]",
//             className
//           )}
//           {...props}
//         />
//       </MenuPrimitive.Positioner>
//     </MenuPrimitive.Portal>
//   );
// }

// function DropdownMenuItem({ className, ...props }) {
//   return (
//     <MenuPrimitive.Item
//       className={cn(
//         "px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// // Colors
// const COLORS = {
//   sidebar: "bg-[#000033]",
//   sidebarHover: "hover:bg-[#000066]",
//   sidebarActive: "bg-[#000066]",
//   header: "bg-[#000033]",
//   logout: "bg-[#E50914]",
// };

// // Sidebar Item
// function SidebarItem({ icon, label, isActive, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
//         isActive 
//           ? `${COLORS.sidebarActive} text-white font-medium` 
//           : `text-white/70 ${COLORS.sidebarHover} hover:text-white`
//       }`}
//     >
//       {icon}
//       <span className="text-sm">{label}</span>
//     </button>
//   );
// }

// // Stat Card
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

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("Dashboard");

//   return (
//     <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
//       {/* Sidebar */}
//       <aside className={`w-64 ${COLORS.sidebar} text-white flex flex-col shrink-0`}>
//         <div className="p-6 flex items-center gap-3">
//           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
//             <img 
//               src="https://picsum.photos/seed/fitness-logo/100/100" 
//               alt="Logo" 
//               className="w-8 h-8 object-contain"
//               referrerPolicy="no-referrer"
//             />
//           </div>
//           <div>
//             <h1 className="font-bold text-sm leading-tight">Preetam</h1>
//             <p className="text-[10px] opacity-70">Sport Fitness Club</p>
//           </div>
//         </div>

//         <nav className="flex-1 px-2 py-4 space-y-1">
//           <SidebarItem 
//             icon={<LayoutDashboard size={18} />} 
//             label="Dashboard" 
//             isActive={activeTab === "Dashboard"}
//             onClick={() => setActiveTab("Dashboard")}
//           />
//           <SidebarItem 
//             icon={<Activity size={18} />} 
//             label="Available Activities" 
//             isActive={activeTab === "Available Activities"}
//             onClick={() => setActiveTab("Available Activities")}
//           />
//           <SidebarItem 
//             icon={<CreditCard size={18} />} 
//             label="Fee Section" 
//             isActive={activeTab === "Fee Section"}
//             onClick={() => setActiveTab("Fee Section")}
//           />
//         </nav>

//         <div className="p-4">
//           <Button 
//             variant="destructive" 
//             className={`w-full ${COLORS.logout} hover:bg-red-700 border-none flex items-center gap-2 h-10`}
//           >
//             <LogOut size={18} />
//             Logout
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className={`${COLORS.header} h-16 flex items-center justify-between px-6 text-white shrink-0`}>
//           <div className="flex items-center gap-4">
//             <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
//               <ChevronLeft size={20} />
//             </button>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="bg-white text-[#000033] hover:bg-white/90 rounded-full px-4 h-9 flex items-center gap-2 font-medium">
//                 Sport Fitness Club
//                 <ChevronDown size={16} />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Main Branch</DropdownMenuItem>
//                 <DropdownMenuItem>Downtown Branch</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-xs font-semibold">fitness Staff User Test</p>
//               <p className="text-[10px] opacity-70">FITSTF5003</p>
//             </div>
//             <Avatar className="h-9 w-9 border-2 border-white/20">
//               <AvatarImage src="https://picsum.photos/seed/staff/100/100" />
//               <AvatarFallback>FS</AvatarFallback>
//             </Avatar>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <div className="flex-1 overflow-y-auto p-8 space-y-8">
//           <h2 className="text-2xl font-bold text-[#000033]">Dashboard</h2>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatCard title="Total Members" value="12" valueColor="text-[#000033]" />
//             <StatCard title="Active Members" value="10" valueColor="text-[#00C853]" />
//             <StatCard title="Today's Attendance" value="8" valueColor="text-[#000033]" />
//             <StatCard title="Pending Tasks" value="3" valueColor="text-[#E50914]" />
//           </div>

//           {/* Upcoming Sessions & Recent Attendance */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Upcoming Sessions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upcoming Sessions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     { time: "09:00 AM", task: "Yoga Class", instructor: "Meera" },
//                     { time: "11:00 AM", task: "Cardio Blast", instructor: "Rahul" },
//                     { time: "04:00 PM", task: "Strength Training", instructor: "Vikas" },
//                   ].map((item, i) => (
//                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                       <div className="flex items-center gap-3">
//                         <Clock size={18} className="text-gray-400" />
//                         <div>
//                           <p className="font-medium">{item.task}</p>
//                           <p className="text-sm text-gray-500">{item.instructor}</p>
//                         </div>
//                       </div>
//                       <span className="text-sm font-semibold text-[#000033]">{item.time}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recent Attendance */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Attendance</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     { name: "Amit Sharma", time: "08:15 AM", status: "Present" },
//                     { name: "Sonia Verma", time: "08:30 AM", status: "Present" },
//                     { name: "Rohit Patel", time: "09:05 AM", status: "Present" },
//                   ].map((item, i) => (
//                     <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
//                       <div className="flex items-center gap-3">
//                         <Avatar>
//                           <AvatarFallback>{item.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{item.name}</p>
//                           <p className="text-xs text-gray-500">{item.time}</p>
//                         </div>
//                       </div>
//                       <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
//                         {item.status}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Today's Schedule */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Today's Schedule Activities</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-500 py-8 text-center">No schedules for today</p>
//             </CardContent>
//           </Card>

//           {/* Pending Fees */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Pending Fees Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="rounded-lg border overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Member Name</TableHead>
//                       <TableHead>Plan</TableHead>
//                       <TableHead>Due Amount</TableHead>
//                       <TableHead>Due Date</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell colSpan={4} className="h-32 text-center text-gray-500">
//                         No pending fees found
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }






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



/// NEW ONE 



import React from "react";
import { Search, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../src/services/apiClient";

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
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
const [staff, setStaff] = useState(null);
const [events, setEvents] = useState([]);

  useEffect(() => {
  fetchSchedule();
}, []);

const fetchSchedule = async () => {
  try {
    setLoading(true);

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const res = await api.staffPanel.getMySchedule(formattedDate);

setSchedule(res?.data?.data || []);

if (res?.data?.staff) {
  localStorage.setItem("staffName", res.data.staff.name);
  localStorage.setItem("staffImage", res.data.staff.profileImage);

}  } catch (err) {
    console.error("Schedule fetch error:", err?.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchProfile();
}, []);

useEffect(() => {
  fetchEvents();
}, []);

const fetchProfile = async () => {
  try {
    const res = await api.staffPanel.getProfile();
    setStaff(res?.data?.data || null);
  } catch (err) {
    console.error("Profile fetch error:", err);
  }
};

  // const upcomingSessions = [
  //   {
  //     title: "Yoga - 08:00 AM",
  //     place: "Meet at courtyard",
  //     bg: "bg-[#E8E0FA]",
  //   },
  //   {
  //     title: "Yoga - 10:00 AM",
  //     place: "Hall A",
  //     bg: "bg-[#D8F0E8]",
  //   },
  // ];

  // const weeklySchedule = [
  //   {
  //     dateLabel: "Today — 3 event(s)",
  //     items: [
  //       { time: "08:00", title: "Yoga Session", place: "Meet at courtyard" },
  //       { time: "10:00", title: "Yoga Session", place: "Hall A" },
  //     ],
  //   },
  //   {
  //     dateLabel: "10/26/2025 — 1 event(s)",
  //     items: [
  //       {
  //         time: "15:00",
  //         title: "Group Exercise",
  //         place: "gym Room — Group session",
  //       },
  //     ],
  //   },
  //   {
  //     dateLabel: "10/27/2025 — 1 event(s)",
  //     items: [
  //       {
  //         time: "09:30",
  //         title: "Health Talk: Nutrition",
  //         place: "Dining Hall",
  //       },
  //     ],
  //   },
  // ];

  const upcomingSessions = schedule.slice(0, 2).map((s, index) => ({
  title: `${s.activityName} - ${s.startTime}`,
  place: "Assigned Slot",
  bg: index % 2 === 0 ? "bg-[#E8E0FA]" : "bg-[#D8F0E8]",
}));

const fetchEvents = async () => {
  try {
    const res = await api.staffPanel.getEvents();

    console.log("EVENTS API RESPONSE:", res?.data);

    setEvents(res?.data?.data || []);
  } catch (err) {
    console.error(
      "Events fetch error:",
      err?.response?.data || err.message
    );
  }
};


const weeklySchedule = [
  {
    dateLabel: `This Week — ${events.length} event(s)`,
    items: events.map((event) => ({
      time: event.startTime,
      title: event.title,
      place: event.location,
    })),
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
  src={
    staff?.profileImage || "https://via.placeholder.com/150"
  }
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
                  Welcome, {staff?.name || "Staff"}
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
    {staff?.name
      ? staff.name
          .trim()
          .split(" ")
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
      : "ST"}
  </AvatarFallback>
</Avatar>
            </div>
          </Card>

          {/* Mini Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <StatMiniCard
              icon={<CalendarDays size={16} className="text-[#7C6CF5]" />}
              value={schedule.length}
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
              value={schedule.reduce(
  (acc, s) => acc + (s.participants?.length || 0),
  0
)}
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
                  key={`${session.title}-${index}`}
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