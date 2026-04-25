import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { useOrg } from "../../context/OrgContext";
import { api } from "../../../src/services/apiClient";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export default function StaffProfilePage() {

  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const { logout } = useOrg();
  
  
const fetchProfile = async () => {
  try {
    const res = await api.staffPanel.getProfile();
    setStaff(res?.data?.data || null);
  } catch (err) {
    console.error(
      "Profile fetch error:",
      err?.response?.data || err.message
    );
  }
};

const handleLogout = () => {
  logout();
  navigate("/login");
};

useEffect(() => {
  fetchProfile();
}, []);
  return (
    <div className="w-full min-h-screen bg-[#F4F4F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Header */}
        {/* <div className="bg-[#00004D] rounded-2xl px-5 py-4 flex items-center justify-between shadow-md">
          <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft size={20} className="text-[#00004D]" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-semibold text-[#333] text-lg">
              M
            </div>
            <div className="text-right text-white">
              <p className="font-semibold text-lg leading-none">FS-1</p>
              <p className="text-sm opacity-90">FITSTFLEXZ3W</p>
            </div>
          </div>
        </div> */}

        {/* Main Section */}
        <div className="mt-8">
          <h1 className="text-4xl font-bold text-[#111] mb-8">Profile</h1>

          <Card className="p-6 sm:p-8">
            {/* Profile Top */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
              <div className="relative mx-auto md:mx-0">
                <img
                  src={
  staff?.profileImage?.trim()
    ? staff.profileImage
    : "https://via.placeholder.com/300"
}
                  alt="Profile"
                  className="w-44 h-44 rounded-3xl object-cover shadow-sm"
                />
                {/* <button className="absolute -right-3 top-3 bg-[#00004D] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm">
                  <Pencil size={14} />
                  Edit
                </button> */}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#111] mb-6">My Details</h2>

                <div className="space-y-5">
                  <div className="bg-[#F3F0FA] rounded-2xl p-5">
                    <p className="font-semibold text-lg mb-3">Personal</p>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-medium text-black">Name:</span> {staff?.name || "N/A"}</p>
                      <p><span className="font-medium text-black">Contact:</span> {staff?.mobile || "N/A"}</p>
                      <p><span className="font-medium text-black">Email:</span> {staff?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="bg-[#F3F0FA] rounded-2xl p-5">
                    <p className="font-semibold text-lg mb-2">Role</p>
                    <p className="text-gray-700">{staff?.role || "N/A"}</p>
                  </div>

                  <div className="bg-[#F3F0FA] rounded-2xl p-5">
                    <p className="font-semibold text-lg mb-2">Assigned Activities</p>
                    <p className="text-gray-700">
                      {staff?.assignedActivities?.length
  ? staff.assignedActivities.join(", ")
  : "No Activities Assigned"}
                    </p>
                  </div>
                </div>

                <button
  onClick={handleLogout}
  className="mt-8 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-medium transition"
>
  Log out
</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
