
import React from "react";
import { Clock } from "lucide-react";

function Card({ className = "", ...props }) {
  return <div className={`rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`} {...props} />;
}

function CardHeader({ className = "", ...props }) {
  return <div className={`px-6 pt-6 pb-3 ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-lg font-bold text-[#000033] ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`px-6 pb-6 ${className}`} {...props} />;
}

function StatCard({ title, value, valueColor }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </CardHeader>
      <CardContent>
        <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function Table({ className = "", ...props }) {
  return <table className={`w-full text-sm ${className}`} {...props} />;
}

function TableHeader({ className = "", ...props }) {
  return <thead className={`bg-gray-50 ${className}`} {...props} />;
}

function TableRow({ className = "", ...props }) {
  return <tr className={`border-b hover:bg-gray-50 ${className}`} {...props} />;
}

function TableHead({ className = "", ...props }) {
  return <th className={`px-4 py-3 text-left font-medium text-[#000033] ${className}`} {...props} />;
}

function TableCell({ className = "", ...props }) {
  return <td className={`px-4 py-3 ${className}`} {...props} />;
}

function Avatar({ className = "", ...props }) {
  return <div className={`size-8 rounded-full overflow-hidden ${className}`} {...props} />;
}

function AvatarFallback({ children }) {
  return <div className="size-full bg-gray-100 flex items-center justify-center text-xs font-medium">{children}</div>;
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#000033]">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" value="12" valueColor="text-[#000033]" />
        <StatCard title="Active Members" value="10" valueColor="text-[#00C853]" />
        <StatCard title="Today's Attendance" value="8" valueColor="text-[#000033]" />
        <StatCard title="Pending Tasks" value="3" valueColor="text-[#E50914]" />
      </div>

      {/* Upcoming Sessions & Recent Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00 AM", task: "Yoga Class", instructor: "Meera" },
                { time: "11:00 AM", task: "Cardio Blast", instructor: "Rahul" },
                { time: "04:00 PM", task: "Strength Training", instructor: "Vikas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{item.task}</p>
                      <p className="text-sm text-gray-500">{item.instructor}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#000033]">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Amit Sharma", time: "08:15 AM", status: "Present" },
                { name: "Sonia Verma", time: "08:30 AM", status: "Present" },
                { name: "Rohit Patel", time: "09:05 AM", status: "Present" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 py-8 text-center">No schedules for today</p>
        </CardContent>
      </Card>

      {/* Pending Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Fees Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Due Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    No pending fees found
                  </TableCell>
                </TableRow>
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}