import { useOrg } from '../../context/OrgContext';
import { useNavigate } from 'react-router-dom';

export default function StaffNavigation() {
  const { user, isSchoolStaff } = useOrg();
  const navigate = useNavigate();

  const flowSteps = [
    {
      id: 1,
      title: "Staff Login",
      description: "Login with your Staff ID and password",
      path: "/login",
      icon: "Login",
      status: "completed",
      details: "Use your SCHSTF#### ID and default password: staff123"
    },
    {
      id: 2,
      title: "Dashboard Access",
      description: "View your personalized dashboard",
      path: "/school/dashboard",
      icon: "Home",
      status: "current",
      details: "See your welcome message and organization overview"
    },
    {
      id: 3,
      title: "Manage Participants",
      description: "View and manage participant information",
      path: "/school/participants",
      icon: "Users",
      status: "available",
      details: "Access participant records and health information"
    },
    {
      id: 4,
      title: "Activities Management",
      description: "Schedule and manage daily activities",
      path: "/school/activities",
      icon: "Target",
      status: "available",
      details: "Create and track participant activities"
    },
    {
      id: 5,
      title: "Attendance Tracking",
      description: "Mark and view attendance records",
      path: "/school/attendance",
      icon: "Calendar",
      status: "available",
      details: "Daily attendance for participants and activities"
    },
    {
      id: 6,
      title: "Health Records",
      description: "Manage participant health information",
      path: "/school/health-records",
      icon: "Stethoscope",
      status: "available",
      details: "View health records and emergency information"
    },
    {
      id: 7,
      title: "Events Management",
      description: "Organize and track school events",
      path: "/school/events",
      icon: "Calendar",
      status: "available",
      details: "Create and manage school events"
    }
  ];

  const handleStepClick = (step) => {
    if (step.status === "completed" || step.status === "current") {
      navigate(step.path);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "available":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "current":
        return "bg-blue-500 text-white";
      case "available":
        return "bg-gray-300 text-gray-600";
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Staff Navigation Flow</h1>
          <p className="text-blue-100">
            Complete guide to your School Staff workflow and access
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {user?.fullName || 'Staff Member'}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              ID: {user?.userId || 'N/A'}
            </span>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="space-y-4">
          {flowSteps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white rounded-xl border-2 p-4 transition-all duration-200 ${
                step.status === "current" 
                  ? "border-blue-400 shadow-lg" 
                  : step.status === "completed"
                  ? "border-green-200 hover:border-green-300 cursor-pointer"
                  : "border-gray-200 hover:border-gray-300 cursor-pointer"
              }`}
              onClick={() => handleStepClick(step)}
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getStepColor(step.status)}`}>
                  {step.status === "completed" ? "ü" : step.id}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                      {step.status === "completed" && "Completed"}
                      {step.status === "current" && "Current"}
                      {step.status === "available" && "Available"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <p className="text-gray-500 text-xs">{step.details}</p>
                </div>

                {/* Action Icon */}
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/school/dashboard")}
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Go to Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/school/participants")}
              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">View Participants</span>
            </button>
            <button
              onClick={() => navigate("/school/activities")}
              className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Manage Activities</span>
            </button>
            <button
              onClick={() => navigate("/school/attendance")}
              className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Need Help?</h3>
              <p className="text-yellow-700 text-sm">
                Contact your administrator for any issues with your account or access permissions.
                Default login credentials: Staff ID (SCHSTF####) and password (staff123)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
