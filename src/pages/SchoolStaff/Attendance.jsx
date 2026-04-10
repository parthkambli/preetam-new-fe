
import React, { useState } from "react";
import { Users, Search, Check, UserCheck } from "lucide-react";

function Card({ className = "", ...props }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`} {...props} />;
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(12);
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(new Set(["Ramesh Deshmukh", "Vijay Pawar"]));

  const dates = [
    { day: "MON", date: 12 }, { day: "TUE", date: 13 }, { day: "WED", date: 14 },
    { day: "THU", date: 15 }, { day: "FRI", date: 16 }, { day: "SAT", date: 17 },
  ];

  const members = [
    "Sunita Patil", "Anita Joshi", "Nisha Naik", "Mahesh Patil", "Dinesh Kamat",
    "Sonia Verma", "Ramesh Deshmukh", "Vijay Pawar", "Rajesh Sawant", "Seema Khare",
    "Amit Sharma", "John Doe"
  ];

  const toggleMember = (name) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    setSelectedMembers(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedMembers.size === members.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(members));
    }
  };

  const filteredMembers = members.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#000033]">Mark Attendance</h2>
        <p className="text-lg font-medium text-gray-600">12 October 2026</p>
      </div>

      {/* Date Selector */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all font-medium ${
              selectedDate === d.date
                ? "bg-[#000033] text-white shadow-lg scale-105"
                : "bg-white border border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <span className="text-xs opacity-75">{d.day}</span>
            <span className="text-2xl font-bold mt-1">{d.date}</span>
          </button>
        ))}
      </div>

      <Card className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserCheck className="text-[#000033]" size={28} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Mark Attendance – {selectedDate} Oct</h3>
              <p className="text-gray-500">Total Members: {members.length}</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedMembers.size === members.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 accent-[#000033]"
            />
            <span className="font-medium text-gray-700">Select All</span>
          </label>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search member name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#000033] transition-all text-sm"
          />
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredMembers.map((name, index) => {
            const isChecked = selectedMembers.has(name);
            return (
              <div
                key={index}
                onClick={() => toggleMember(name)}
                className={`group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  isChecked 
                    ? "border-[#000033] bg-[#000033]/5" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium">
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="font-medium text-gray-800">{name}</span>
                </div>

                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isChecked 
                    ? "bg-[#000033] border-[#000033]" 
                    : "border-gray-300 group-hover:border-gray-400"
                }`}>
                  {isChecked && <Check className="text-white" size={16} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-10 pt-6 border-t">
          <button
            onClick={() => alert(`Attendance Saved! ${selectedMembers.size} members marked present`)}
            className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98]"
          >
            Save Attendance ({selectedMembers.size})
          </button>

          <button
            onClick={() => setSelectedMembers(new Set())}
            className="flex-1 border border-gray-300 hover:bg-gray-50 font-semibold py-4 rounded-2xl transition-all"
          >
            Reset
          </button>
        </div>
      </Card>
    </div>
  );
}