// pages/school/Staff/Viewattendance.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyAttendance = [
  { _id: '1', date: '2026-01-17', name: 'Ravi Sharma',     initials: 'RS', avatarColor: 'bg-blue-200 text-blue-700',    employeeId: 'EMP-0012', inTime: '09:02 AM', outTime: '06:11 PM', workingHours: '9h 09m', status: 'Present' },
  { _id: '2', date: '2026-01-17', name: 'Anjali Kulkarni', initials: 'AK', avatarColor: 'bg-green-200 text-green-700',  employeeId: 'EMP-0015', inTime: '09:18 AM', outTime: '05:55 PM', workingHours: '8h 37m', status: 'Present' },
  { _id: '3', date: '2026-01-17', name: 'Vinod More',      initials: 'VM', avatarColor: 'bg-purple-200 text-purple-700',employeeId: 'EMP-0021', inTime: '—',        outTime: '—',        workingHours: '0h',     status: 'Absent'  },
];

export default function Viewattendance() {
  const navigate = useNavigate();   // ← Added

  const [search, setSearch] = useState('');
  const [date, setDate]     = useState('');
  const [status, setStatus] = useState('');

  const filtered = dummyAttendance.filter(a =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase())) &&
    (!date   || a.date === date) &&
    (!status || a.status === status)
  );

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB');

  const handleView = (id) => {
    navigate(`/school/staff/attendance-detail/${id}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">View Attendance</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <input
          type="text" placeholder="Search Staff Name"
          value={search} onChange={e => setSearch(e.target.value)}
          className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="date"
          value={date} onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white text-gray-500"
        />
        <select
          value={status} onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#000359] text-white text-left">
                {['Date','Staff','Employee ID','In Time','Out Time','Working Hours','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No records found</td></tr>
              ) : filtered.map(a => (
                <tr key={a._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmt(a.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${a.avatarColor}`}>
                        {a.initials}
                      </span>
                      <span className="font-medium text-gray-800">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{a.employeeId}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.inTime}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.outTime}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.workingHours}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      a.status === 'Present'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-500 border-red-200'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button 
                      onClick={() => handleView(a._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}