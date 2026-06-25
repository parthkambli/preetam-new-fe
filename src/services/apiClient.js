import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// services/apiClient.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Request interceptor — attach auth token + org ID
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const currentOrgId = localStorage.getItem("currentOrgId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (currentOrgId) {
      config.headers["X-Organization-ID"] = currentOrgId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("organizations");
      localStorage.removeItem("currentOrgId");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
export const api = {

  // Auth
  auth: {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    getMe: () => apiClient.get("/auth/me"),
  },

  // School Enquiry
  schoolEnquiry: {
    getAll: (params) => apiClient.get("/school/enquiry", { params }),
    getForAdmission: () => apiClient.get("/school/enquiry/admission-list"),
    getById: (id) => apiClient.get(`/school/enquiry/${id}`),
    create: (data) => apiClient.post("/school/enquiry", data),
    update: (id, data) => apiClient.put(`/school/enquiry/${id}`, data),
    delete: (id) => apiClient.delete(`/school/enquiry/${id}`),
  },

  // Fitness Enquiry
  fitnessEnquiry: {
    getAll: (params) => apiClient.get("/fitness/enquiry", { params }),
    getById: (id) => apiClient.get(`/fitness/enquiry/${id}`),
    create: (data) => apiClient.post("/fitness/enquiry", data),
    update: (id, data) => apiClient.put(`/fitness/enquiry/${id}`, data),
    delete: (id) => apiClient.delete(`/fitness/enquiry/${id}`),
  },

  // School Admission
  schoolAdmission: {
    getAll: (params) => apiClient.get("/school/admission", { params }),
    getById: (id) => apiClient.get(`/school/admission/${id}`),
    // create: (data) => apiClient.post("/school/admission", data),
    create: (data) => {
  return apiClient.post("/school/admission", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},
    // update: (id, data) => apiClient.put(`/school/admission/${id}`, data),
    update: (id, data) => {
  return apiClient.put(`/school/admission/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},
    delete: (id) => apiClient.delete(`/school/admission/${id}`),
    collectPayment: (id, data) => apiClient.post(`/school/admission/${id}/collect-payment`, data),
    getPayments: (id) => apiClient.get(`/school/admission/${id}/payments`),
  },

  // School Attendance (admin)
  schoolAttendance: {
    getSummary: (params) => apiClient.get('/school/attendance/summary', { params }),
    getActivities: () => apiClient.get('/school/attendance/activities'),
    getStudents: (params) => apiClient.get('/school/attendance/students', { params }),
  },

  // Service bookings (standalone collection)
  serviceBookings: {
    getAll: (params) => apiClient.get('/school/service-bookings', { params }),
    create: (data) => apiClient.post('/school/service-bookings', data),
    cancel: (id) => apiClient.patch(`/school/service-bookings/${id}/cancel`),
    getAvailableSeats: (serviceId, params) =>
      apiClient.get(`/school/service-bookings/seats/${serviceId}`, { params }),
  },

  // Followups
  followups: {
    getAll: (params) => apiClient.get("/followups", { params }),
    getUpcoming: () => apiClient.get("/followups/upcoming"),
    create: (data) => apiClient.post("/followups", data),
    update: (id, data) => apiClient.put(`/followups/${id}`, data),
    delete: (id) => apiClient.delete(`/followups/${id}`),
  },

  // Students
  students: {
    getAll: (params) => apiClient.get("/students", { params }),
    getById: (id) => apiClient.get(`/students/${id}`),
    update: (id, data) => apiClient.put(`/students/${id}`, data),
    delete: (id) => apiClient.delete(`/students/${id}`),
    updateEmergencyContact: (id, data) =>
      apiClient.put(`/students/${id}/emergency-contact`, data),

    clearEmergencyContact: (id) =>
      apiClient.delete(`/students/${id}/emergency-contact`),
  },


// ====================== STAFF MANAGEMENT (SCHOOL) ======================
staff: {
    getAll: (params = {}) => apiClient.get("/staff", { params }),
    getById: (id) => apiClient.get(`/staff/${id}`),
    create: (formData) => {
      return apiClient.post("/staff", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    update: (id, formData) => {
      return apiClient.put(`/staff/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    delete: (id) => apiClient.delete(`/staff/${id}`),

    // === ROLES (School) ===
    roles: {
      getAll: () => apiClient.get("/staff/roles"),
      create: (data) => apiClient.post("/staff/roles", data),
      update: (id, data) => apiClient.put(`/staff/roles/${id}`, data),   // added
      delete: (id) => apiClient.delete(`/staff/roles/${id}`),
    },

    // === EMPLOYMENT TYPES (School) ===
    employmentTypes: {                    // renamed for clarity
      getAll: () => apiClient.get("/staff/employment-types"),
      create: (data) => apiClient.post("/staff/employment-types", data),
      update: (id, data) => apiClient.put(`/staff/employment-types/${id}`, data), // added
      delete: (id) => apiClient.delete(`/staff/employment-types/${id}`),
    },

    // Attendances
    getAttendance: (params = {}) =>
      apiClient.get("/staff/attendance", { params }),
  },
  // periods
  periods: {
  getAll: () => apiClient.get("/period"),
  create: (data) => apiClient.post("/period", data),
  update: (id, data) => apiClient.put(`/period/${id}`, data),
  delete: (id) => apiClient.delete(`/period/${id}`),
},
  // Period Students
  periodStudents: {
    getStudents: (params) => apiClient.get('/school/period-students', { params }),
  },
  // Activities
  activities: {
    // Master Activities
    getAll: () => apiClient.get("/activities"),
    create: (data) => apiClient.post("/activities", data),
    update: (id, data) => apiClient.put(`/activities/${id}`, data),
    delete: (id) => apiClient.delete(`/activities/${id}`),

    // Scheduled Activities
    getAllScheduled: () => apiClient.get("/activities/scheduled"),
    createScheduled: (data) => apiClient.post("/activities/scheduled", data),
    getScheduledById: (id) => apiClient.get(`/activities/scheduled/${id}`),
    updateScheduled: (id, data) =>
      apiClient.put(`/activities/scheduled/${id}`, data),
    deleteScheduled: (id) => apiClient.delete(`/activities/scheduled/${id}`),
  },

  fees: {
    // Fee Types
    getTypes: () => apiClient.get("/fees/types"),
    createType: (data) => apiClient.post("/fees/types", data),
    updateType: (id, data) => apiClient.put(`/fees/types/${id}`, data),
    deleteType: (id) => apiClient.delete(`/fees/types/${id}`),

    // Allotments
    getAllotments: (params) => apiClient.get("/fees/allotments", { params }),
    allotFee: (data) => apiClient.post("/fees/allotments", data),
    updateAllotment: (id, data) =>
      apiClient.put(`/fees/allotments/${id}`, data),

    // Payments
    getPayments: (params) => apiClient.get("/fees/payments", { params }),
    addPayment: (data) => apiClient.post("/fees/payments", data),
  },

  // ── Health Records ────────────────────────────────────────────────────────
  // Backend: routes/healthRecordRoutes.js  ←→  controllers/healthRecordController.js
  // Files stored at: uploads/student/health-report/<filename>
  healthRecords: {
    getAll: (params = {}) => apiClient.get("/health-records", { params }),
    create: (formData) =>
      apiClient.post("/health-records", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    update: (id, formData) =>
      apiClient.put(`/health-records/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    delete: (id) => apiClient.delete(`/health-records/${id}`),
  },
  // ─────────────────────────────────────────────────────────────────────────
// School Services
schoolServices: {
  getAll: (params = {}) =>
    apiClient.get("/school/services", { params }),

  getById: (id) =>
    apiClient.get(`/school/services/${id}`),

  create: (data) =>
    apiClient.post("/school/services", data),

  update: (id, data) =>
    apiClient.put(`/school/services/${id}`, data),

  toggleStatus: (id, isActive) =>
    apiClient.patch(
      `/school/services/${id}/status`,
      { isActive }
    ),

  delete: (id) =>
    apiClient.delete(`/school/services/${id}`),
},


  // Events
  events: {
    getAll: (params = {}) => apiClient.get("/events", { params }),
    create: (data) => apiClient.post("/events", data),
    update: (id, data) => apiClient.put(`/events/${id}`, data),
    delete: (id) => apiClient.delete(`/events/${id}`),
  },

  // Fitness Members (NEW)
  fitnessMember: {
    getAll: (params) => apiClient.get("/fitness/member", { params }),
    getById: (id) => apiClient.get(`/fitness/member/${id}`),
    create: (formData) => {
      return apiClient.post("/fitness/member", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    update: (id, formData) => {
      return apiClient.put(`/fitness/member/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    delete: (id) => apiClient.delete(`/fitness/member/${id}`),
    renew: (id, data) => apiClient.post(`/fitness/member/${id}/renew`, data),
  },

fitnessStaff: {
  getAll: (params) => apiClient.get('/fitness/staff', { params }),
  getById: (id) => apiClient.get(`/fitness/staff/${id}`),
  create: (formData) => apiClient.post('/fitness/staff/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => apiClient.put(`/fitness/staff/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiClient.delete(`/fitness/staff/${id}`),

  // Roles — mounted at /api/fitness/roles
  getRoles: () => apiClient.get('/fitness/roles'),
  createRole: (data) => apiClient.post('/fitness/roles/create', data),
  deleteRole: (id) => apiClient.delete(`/fitness/roles/${id}`),

  // Employment Types — mounted at /api/fitness/types
  getEmploymentTypes: () => apiClient.get('/fitness/types'),
  createEmploymentType: (data) => apiClient.post('/fitness/types/create', data),
  deleteEmploymentType: (id) => apiClient.delete(`/fitness/types/${id}`),
},

// ====================== FITNESS ATTENDANCE ======================
  attendance: {
    // For main Attendance listing page
    getSummary: (params = {}) => 
      apiClient.get('/attendance/summary', { params }),

    // For detailed student list
    getStudentAttendance: (activityId, date) => 
      apiClient.get(`/attendance/details/${activityId}/${date}`),
    
  //   getStudentAttendance: (activityId, date, params) =>
  // apiClient.get(`/attendance/${activityId}/${date}`, { params }),

    validate: (memberId, organizationId) =>
      apiClient.get(`/attendance/validate/${memberId}`, {
        params: { organizationId }
      }),

    mark: (data) => apiClient.post('/attendance/mark', data),
  },


// ====================== FITNESS FEES ======================
fitnessFees: {
  getTypes:        ()             => apiClient.get('/fitness/fees/types'),
  createType:      (data)         => apiClient.post('/fitness/fees/types', data),
  updateType:      (id, data)     => apiClient.put(`/fitness/fees/types/${id}`, data),
  deleteType:      (id)           => apiClient.delete(`/fitness/fees/types/${id}`),

  getAllotments:   (params = {})  => apiClient.get('/fitness/fees/allotments', { params }),
  allotFee:        (data)         => apiClient.post('/fitness/fees/allotments', data),
  updateAllotment: (id, data)     => apiClient.put(`/fitness/fees/allotments/${id}`, data),

  getPayments:     (params = {})  => apiClient.get('/fitness/fees/payments', { params }),
  addPayment:      (data)         => apiClient.post('/fitness/fees/payments', data),

  getStats: () => apiClient.get('/fitness/fees/stats'),

},

  // Fitness Events
  fitnessEvents: {
    getAll: (params = {}) => apiClient.get("/fitness/events", { params }),
    create: (data) => apiClient.post("/fitness/events", data),
    update: (id, data) => apiClient.put(`/fitness/events/${id}`, data),
    delete: (id) => apiClient.delete(`/fitness/events/${id}`),
  },
  // Fitness Activities
  fitnessActivities: {
    getAll: () => apiClient.get("/fitness/activities"),
    getById: (id) => apiClient.get(`/fitness/activities/${id}`),
    create: (data) => apiClient.post("/fitness/activities", data),
    update: (id, data) => apiClient.put(`/fitness/activities/${id}`, data),
    delete: (id) => apiClient.delete(`/fitness/activities/${id}`),
    availability: (params) =>
      apiClient.get("/fitness/activities/availability", { params }),

    bookSlot: (data) => apiClient.post("/fitness/activities/book", data),

    // getBookings: () => apiClient.get("/fitness/activities/bookings"),
    getBookings: (params) =>
  apiClient.get('/fitness/activities/bookings', { params }),

   getDashboardByDate: (date) =>
  apiClient.get("/fitness/activities/dashboard", {
    params: { date }
  }),// for bookings dashboard only..

    cancelBooking: (id) => apiClient.delete(`/fitness/activities/bookings/${id}`),
  },
  

  // staff panel
  staffPanel: {
  getMySchedule: () => apiClient.get('/fitness/staff-panel/my-schedule'),
  getAvailableActivities: () => apiClient.get('/fitness/staff-panel/available-activities'),

  getAttendanceByDate: (date) =>
  apiClient.get(`/fitness/staff-panel/attendance-by-date?date=${date}`),

  getProfile: () =>
  apiClient.get(`/fitness/staff-panel/profile`),

  getEvents: () =>
  apiClient.get(`/fitness/staff-panel/events`),

  // getMembers: () => apiClient.get('/fitness/staff-panel/members'),
  getMembers: (params) =>
  apiClient.get('/fitness/staff-panel/members', {
    params,
  }),
  getStaff: () => apiClient.get('/fitness/staff-panel/staff'),

  scanQR: (memberId) =>
    apiClient.post('/fitness/staff-panel/scan-qr', { memberId }),
},

  // Fitness Schedules
  fitnessSchedules: {
    getAll: (params = {}) => apiClient.get("/fitness/schedules", { params }),
    getById: (id) => apiClient.get(`/fitness/schedules/${id}`),
    create: (data) => apiClient.post("/fitness/schedules", data),
    update: (id, data) => apiClient.put(`/fitness/schedules/${id}`, data),
    delete: (id) => apiClient.delete(`/fitness/schedules/${id}`),
  },

  // fitness dashboard
  dashboard: {
    get: () => apiClient.get("/dashboard"),
    getTodaySchedules: () => apiClient.get("/fitness/schedules"),
  },

   //fitness reports summery
 reports: {
  getSummary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/reports/summary${query ? "?" + query : ""}`);
  },
},

  // School Reports Dashboard
  schoolReports: {
    getDashboard: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/reports/dashboard${query ? '?' + query : ''}`);
    },
  },

  // School Renewals
  renewals: {
    getExpiring: (params) => apiClient.get("/school/renewals", { params }),
    renew: (data) => apiClient.post("/school/renewals/renew", data),
  },

  //schoolDashboard
  schoolDashboard: {
    getData: () => apiClient.get("/school/dashboard"),
  },

  // ================= USER MANAGEMENT =================
  userManagement: {
  getAll: (params = {}) =>
    apiClient.get("/user-management", { params }),

    create: (data) => apiClient.post('/user-management', data),

    assignRole: (data) =>
      apiClient.put("/user-management/assign-role", data),

    updatePermissions: (data) =>
      apiClient.put("/user-management/permissions", data),
  },

  // ================= ACCESS ROLES =================
  accessRoles: {
    getAll: () => apiClient.get("/access-roles"),
      create: (data) => apiClient.post("/access-roles", data),
      update: (id, data) => apiClient.put(`/access-roles/${id}`, data),
  },

  // ================= SCHOOL STAFF PANEL =================
schoolStaffPanel: {
  getDashboard: () =>
    apiClient.get('/school-staff/dashboard'),

  getMySchedule: () =>
    apiClient.get('/school-staff/my-schedule'),

  getScheduleStudents: (params) =>
    apiClient.get('/school-staff/my-schedule/students', { params }),

  getProfile: () =>
    apiClient.get('/school-staff/profile'),

  // Enquiry
  getEnquiries: (params) =>
    apiClient.get('/school-staff/enquiry', { params }),

  getEnquiryById: (id) =>
    apiClient.get(`/school-staff/enquiry/${id}`),

  createEnquiry: (data) =>
    apiClient.post('/school-staff/enquiry', data),

  updateEnquiry: (id, data) =>
    apiClient.put(`/school-staff/enquiry/${id}`, data),

  deleteEnquiry: (id) =>
    apiClient.delete(`/school-staff/enquiry/${id}`),

  // Followups
  getFollowups: (params) =>
    apiClient.get('/school-staff/followups', { params }),

  createFollowup: (data) =>
    apiClient.post('/school-staff/followups', data),

  updateFollowup: (id, data) =>
    apiClient.put(`/school-staff/followups/${id}`, data),

  // Admission
  getAdmissions: (params) =>
    apiClient.get('/school-staff/admission', { params }),

  getAdmissionById: (id) =>
    apiClient.get(`/school-staff/admission/${id}`),

  getAdmissionPayments: (id) =>
    apiClient.get(`/school-staff/admission/${id}/payments`),

  createAdmission: (data) =>
    apiClient.post('/school-staff/admission', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateAdmission: (id, data) =>
    apiClient.put(`/school-staff/admission/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteAdmission: (id) =>
    apiClient.delete(`/school-staff/admission/${id}`),

  collectPayment: (admissionId, data) =>
    apiClient.post(`/school-staff/admission/${admissionId}/collect-payment`, data),

  // Participants
  getStudents: (params) =>
    apiClient.get('/school-staff/participants', { params }),

  getStudentById: (id) =>
    apiClient.get(`/school-staff/participants/${id}`),

  updateStudent: (id, data) =>
    apiClient.put(`/school-staff/participants/${id}`, data),

  updateEmergencyContact: (id, data) =>
    apiClient.put(`/school-staff/participants/${id}/emergency-contact`, data),

  clearEmergencyContact: (id) =>
    apiClient.delete(`/school-staff/participants/${id}/emergency-contact`),

  // Attendance
  getAttendance: (params) =>
    apiClient.get('/school-staff/attendance', { params }),

  getAttendanceStudents: (params) =>
    apiClient.get('/school-staff/attendance/students', { params }),

  getStudentPeriods: (params) =>
    apiClient.get('/school-staff/attendance/student-periods', { params }),

  scanMark: (data) =>
    apiClient.post('/school-staff/attendance/scan-mark', data),

  // Services
  getServices: (params) =>
    apiClient.get('/school-staff/services', { params }),

  createService: (data) =>
    apiClient.post('/school-staff/services', data),

  updateService: (id, data) =>
    apiClient.put(`/school-staff/services/${id}`, data),

  deleteService: (id) =>
    apiClient.delete(`/school-staff/services/${id}`),

  toggleServiceStatus: (id, data) =>
    apiClient.patch(`/school-staff/services/${id}/toggle-status`, data),

  getServiceBookings: (params) =>
    apiClient.get('/school-staff/services/bookings', { params }),

  createServiceBooking: (data) =>
    apiClient.post('/school-staff/services/bookings', data),

  cancelServiceBooking: (id) =>
    apiClient.delete(`/school-staff/services/bookings/${id}`),

  getAvailableSeats: (params) =>
    apiClient.get('/school-staff/services/bookings/available-seats', { params }),

  // Fees
  getFeeTypes: () =>
    apiClient.get('/school-staff/fees/types'),

  createFeeType: (data) =>
    apiClient.post('/school-staff/fees/types', data),

  updateFeeType: (id, data) =>
    apiClient.put(`/school-staff/fees/types/${id}`, data),

  deleteFeeType: (id) =>
    apiClient.delete(`/school-staff/fees/types/${id}`),

  getAllotments: (params) =>
    apiClient.get('/school-staff/fees/allotments', { params }),

  allotFee: (data) =>
    apiClient.post('/school-staff/fees/allotments', data),

  getPayments: (params) =>
    apiClient.get('/school-staff/fees/payments', { params }),

  getFeePayments: (params) =>
    apiClient.get('/school-staff/fees/payments', { params }),

  addPayment: (data) =>
    apiClient.post('/school-staff/fees/payments', data),

  // Health Records
  getHealthRecords: (params) =>
    apiClient.get('/school-staff/health-records', { params }),

  getHealthRecordById: (id) =>
    apiClient.get(`/school-staff/health-records/${id}`),

  createHealthRecord: (data) =>
    apiClient.post('/school-staff/health-records', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateHealthRecord: (id, data) =>
    apiClient.put(`/school-staff/health-records/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteHealthRecord: (id) =>
    apiClient.delete(`/school-staff/health-records/${id}`),

  // Activities
  getActivities: () =>
    apiClient.get('/school-staff/activities'),

  // Renewals
  getExpiring: (params) =>
    apiClient.get('/school-staff/renewals/expiring', { params }),

  renew: (data) =>
    apiClient.post('/school-staff/renewals/renew', data),

  // Events
  getEvents: () =>
    apiClient.get('/school-staff/events'),

  // Reports
  getReports: (params) =>
    apiClient.get('/school-staff/reports', { params }),
}

  

};

export default apiClient;
