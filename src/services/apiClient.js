// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// // Create axios instance
// // const apiClient = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // });


// // services/apiClient.js
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   // Remove default Content-Type completely
//   // headers: { 'Content-Type': 'application/json' }  ← DELETE THIS LINE
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     const currentOrgId = localStorage.getItem('currentOrgId');
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (currentOrgId) {
//       config.headers['X-Organization-ID'] = currentOrgId;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid - clear storage and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('organizations');
//       localStorage.removeItem('currentOrgId');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // API methods
// export const api = {
//   // Auth
//   auth: {
//     login: (credentials) => apiClient.post('/auth/login', credentials),
//     getMe: () => apiClient.get('/auth/me')
//   },
  
//   // School Enquiry
//   schoolEnquiry: {
//     getAll: (params) => apiClient.get('/school/enquiry', { params }),
//     getForAdmission: () => apiClient.get('/school/enquiry/admission-list'),
//     getById: (id) => apiClient.get(`/school/enquiry/${id}`),
//     create: (data) => apiClient.post('/school/enquiry', data),
//     update: (id, data) => apiClient.put(`/school/enquiry/${id}`, data),
//     delete: (id) => apiClient.delete(`/school/enquiry/${id}`)
//   },
  
//   // Fitness Enquiry
//   fitnessEnquiry: {
//     getAll: (params) => apiClient.get('/fitness/enquiry', { params }),
//     getById: (id) => apiClient.get(`/fitness/enquiry/${id}`),
//     create: (data) => apiClient.post('/fitness/enquiry', data),
//     update: (id, data) => apiClient.put(`/fitness/enquiry/${id}`, data),
//     delete: (id) => apiClient.delete(`/fitness/enquiry/${id}`)
//   },
  
//   // School Admission
//   schoolAdmission: {
//     getAll: (params) => apiClient.get('/school/admission', { params }),
//     getById: (id) => apiClient.get(`/school/admission/${id}`),
//     create: (data) => apiClient.post('/school/admission', data),
//     update: (id, data) => apiClient.put(`/school/admission/${id}`, data),
//     delete: (id) => apiClient.delete(`/school/admission/${id}`)
//   },
  
//   // Followups
//   followups: {
//     getAll: (params) => apiClient.get('/followups', { params }),
//     getUpcoming: () => apiClient.get('/followups/upcoming'),
//     create: (data) => apiClient.post('/followups', data),
//     update: (id, data) => apiClient.put(`/followups/${id}`, data),
//     delete: (id) => apiClient.delete(`/followups/${id}`)
//   },
  
//   // Students
//   students: {
//     getAll: (params) => apiClient.get('/students', { params }),
//     getById: (id) => apiClient.get(`/students/${id}`),
//     update: (id, data) => apiClient.put(`/students/${id}`, data),
//     delete: (id) => apiClient.delete(`/students/${id}`),
//     updateEmergencyContact: (id, data) => 
//       apiClient.put(`/students/${id}/emergency-contact`, data),
    
//     clearEmergencyContact: (id) => 
//       apiClient.delete(`/students/${id}/emergency-contact`),
//   },

//   // Staff Management
//   staff: {
//     getAll: (params = {}) => apiClient.get('/staff', { params }),
//     getById: (id) => apiClient.get(`/staff/${id}`),
//     create: (formData) => {
//       return apiClient.post('/staff', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',   // Let axios set it automatically
//         }
//       });
//     },

//     update: (id, formData) => {
//       return apiClient.put(`/staff/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });
//     },
//     delete: (id) => apiClient.delete(`/staff/${id}`),

//     // Roles
//     getRoles: () => apiClient.get('/staff/roles'),
//     createRole: (data) => apiClient.post('/staff/roles', data),

//     // Employment Types
//     getEmploymentTypes: () => apiClient.get('/staff/employment-types'),
//     createEmploymentType: (data) => apiClient.post('/staff/employment-types', data),

//     // Attendance
//     getAttendance: (params = {}) => apiClient.get('/staff/attendance', { params }),
//   },

//   // Activities Management
//   activities: {
//     // Master Activities
//     getAll: () => apiClient.get('/activities'),
//     create: (data) => apiClient.post('/activities', data),
//     update: (id, data) => apiClient.put(`/activities/${id}`, data),
//     delete: (id) => apiClient.delete(`/activities/${id}`),

//     // Scheduled Activities
//     getAllScheduled: () => apiClient.get('/activities/scheduled'),
//     createScheduled: (data) => apiClient.post('/activities/scheduled', data),
//     getScheduledById: (id) => apiClient.get(`/activities/scheduled/${id}`),
//     updateScheduled: (id, data) => apiClient.put(`/activities/scheduled/${id}`, data),
//     deleteScheduled: (id) => apiClient.delete(`/activities/scheduled/${id}`),
//   },

//       fees: {
//     // Fee Types
//     getTypes: () => apiClient.get('/fees/types'),
//     createType: (data) => apiClient.post('/fees/types', data),
//     updateType: (id, data) => apiClient.put(`/fees/types/${id}`, data),
//     deleteType: (id) => apiClient.delete(`/fees/types/${id}`),

//     // Allotments
//     getAllotments: (params) => apiClient.get('/fees/allotments', { params }),
//     allotFee: (data) => apiClient.post('/fees/allotments', data),
//     updateAllotment: (id, data) => apiClient.put(`/fees/allotments/${id}`, data),

//     // Payments
//     getPayments: (params) => apiClient.get('/fees/payments', { params }),
//     addPayment: (data) => apiClient.post('/fees/payments', data),
//   },

//   // Health Records
//   healthRecords: {
//     getAll: (params = {}) => apiClient.get('/health-records', { params }),
//     create: (formData) => apiClient.post('/health-records', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     }),
//     update: (id, formData) => apiClient.put(`/health-records/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     }),
//     delete: (id) => apiClient.delete(`/health-records/${id}`),
//   },

//   // Events
//   events: {
//     getAll: (params = {}) => apiClient.get('/events', { params }),
//     create: (data) => apiClient.post('/events', data),
//     update: (id, data) => apiClient.put(`/events/${id}`, data),
//     delete: (id) => apiClient.delete(`/events/${id}`),
//   },

// // Fitness Members (NEW)
//   fitnessMember: {
//     getAll: (params) => apiClient.get('/fitness/member', { params }),
//     getById: (id) => apiClient.get(`/fitness/member/${id}`),
//     create: (formData) => {
//       return apiClient.post('/fitness/member', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     },
//     update: (id, formData) => {
//       return apiClient.put(`/fitness/member/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     },
//     delete: (id) => apiClient.delete(`/fitness/member/${id}`)
//   },

// // Fitness Events
//   fitnessEvents: {
//     getAll: (params = {}) => apiClient.get('/fitness/events', { params }),
//     create: (data) => apiClient.post('/fitness/events', data),
//     update: (id, data) => apiClient.put(`/fitness/events/${id}`, data),
//     delete: (id) => apiClient.delete(`/fitness/events/${id}`),
//   },
//     // Fitness Activities
//   fitnessActivities: {
//     getAll: () => apiClient.get('/fitness/activities'),
//     getById: (id) => apiClient.get(`/fitness/activities/${id}`),
//     create: (data) => apiClient.post('/fitness/activities', data),
//     update: (id, data) => apiClient.put(`/fitness/activities/${id}`, data),
//     delete: (id) => apiClient.delete(`/fitness/activities/${id}`),
//   },
 
//   // Fitness Schedules
//   fitnessSchedules: {
//     getAll: (params = {}) => apiClient.get('/fitness/schedules', { params }),
//     getById: (id) => apiClient.get(`/fitness/schedules/${id}`),
//     create: (data) => apiClient.post('/fitness/schedules', data),
//     update: (id, data) => apiClient.put(`/fitness/schedules/${id}`, data),
//     delete: (id) => apiClient.delete(`/fitness/schedules/${id}`),
//   },

// };

// export default apiClient;




import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// services/apiClient.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // No default Content-Type — multer routes need multipart/form-data
});

// Request interceptor — attach auth token + org ID
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const currentOrgId = localStorage.getItem('currentOrgId');

    if (token)        config.headers.Authorization     = `Bearer ${token}`;
    if (currentOrgId) config.headers['X-Organization-ID'] = currentOrgId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('organizations');
      localStorage.removeItem('currentOrgId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
export const api = {

  // Auth
  auth: {
    login:  (credentials) => apiClient.post('/auth/login', credentials),
    getMe:  ()            => apiClient.get('/auth/me')
  },

  // School Enquiry
  schoolEnquiry: {
    getAll:         (params) => apiClient.get('/school/enquiry', { params }),
    getForAdmission:()       => apiClient.get('/school/enquiry/admission-list'),
    getById:        (id)     => apiClient.get(`/school/enquiry/${id}`),
    create:         (data)   => apiClient.post('/school/enquiry', data),
    update:         (id, data) => apiClient.put(`/school/enquiry/${id}`, data),
    delete:         (id)     => apiClient.delete(`/school/enquiry/${id}`)
  },

  // Fitness Enquiry
  fitnessEnquiry: {
    getAll:  (params)    => apiClient.get('/fitness/enquiry', { params }),
    getById: (id)        => apiClient.get(`/fitness/enquiry/${id}`),
    create:  (data)      => apiClient.post('/fitness/enquiry', data),
    update:  (id, data)  => apiClient.put(`/fitness/enquiry/${id}`, data),
    delete:  (id)        => apiClient.delete(`/fitness/enquiry/${id}`)
  },

  // School Admission
  schoolAdmission: {
    getAll:  (params)    => apiClient.get('/school/admission', { params }),
    getById: (id)        => apiClient.get(`/school/admission/${id}`),
    create:  (data)      => apiClient.post('/school/admission', data),
    update:  (id, data)  => apiClient.put(`/school/admission/${id}`, data),
    delete:  (id)        => apiClient.delete(`/school/admission/${id}`)
  },

  // Followups
  followups: {
    getAll:    (params)   => apiClient.get('/followups', { params }),
    getUpcoming:()        => apiClient.get('/followups/upcoming'),
    create:    (data)     => apiClient.post('/followups', data),
    update:    (id, data) => apiClient.put(`/followups/${id}`, data),
    delete:    (id)       => apiClient.delete(`/followups/${id}`)
  },

  // Students
  students: {
    getAll:                (params)   => apiClient.get('/students', { params }),
    getById:               (id)       => apiClient.get(`/students/${id}`),
    update:                (id, data) => apiClient.put(`/students/${id}`, data),
    delete:                (id)       => apiClient.delete(`/students/${id}`),
    updateEmergencyContact:(id, data) => apiClient.put(`/students/${id}/emergency-contact`, data),
    clearEmergencyContact: (id)       => apiClient.delete(`/students/${id}/emergency-contact`)
  },

// ====================== STAFF MANAGEMENT ======================
  staff: {
    // Main Staff CRUD
    getAll: (params = {}) => apiClient.get('/staff', { params }),
    getById: (id) => apiClient.get(`/staff/${id}`),
    create: (formData) => apiClient.post('/staff', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => apiClient.put(`/staff/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => apiClient.delete(`/staff/${id}`),

    // Roles (School Staff Roles)
    getRoles: () => apiClient.get('/staff/roles'),
    createRole: (data) => apiClient.post('/staff/roles', data),
    // updateRole: (id, data) => apiClient.put(`/staff/roles/${id}`, data),   // if needed later
    deleteRole: (id) => apiClient.delete(`/staff/roles/${id}`),

    // Employment Types (School)
    getEmploymentTypes: () => apiClient.get('/staff/employment-types'),
    createEmploymentType: (data) => apiClient.post('/staff/employment-types', data),
    // updateEmploymentType, deleteEmploymentType can be added later

    // Attendance
    getAttendance: (params = {}) => apiClient.get('/staff/attendance', { params }),
  },

  // Activities
  activities: {
    getAll:           ()          => apiClient.get('/activities'),
    create:           (data)      => apiClient.post('/activities', data),
    update:           (id, data)  => apiClient.put(`/activities/${id}`, data),
    delete:           (id)        => apiClient.delete(`/activities/${id}`),

    getAllScheduled:   ()          => apiClient.get('/activities/scheduled'),
    createScheduled:  (data)      => apiClient.post('/activities/scheduled', data),
    getScheduledById: (id)        => apiClient.get(`/activities/scheduled/${id}`),
    updateScheduled:  (id, data)  => apiClient.put(`/activities/scheduled/${id}`, data),
    deleteScheduled:  (id)        => apiClient.delete(`/activities/scheduled/${id}`)
  },

  // Fees
  fees: {
    getTypes:       ()          => apiClient.get('/fees/types'),
    createType:     (data)      => apiClient.post('/fees/types', data),
    updateType:     (id, data)  => apiClient.put(`/fees/types/${id}`, data),
    deleteType:     (id)        => apiClient.delete(`/fees/types/${id}`),

    getAllotments:   (params)    => apiClient.get('/fees/allotments', { params }),
    allotFee:       (data)      => apiClient.post('/fees/allotments', data),
    updateAllotment:(id, data)  => apiClient.put(`/fees/allotments/${id}`, data),

    getPayments:    (params)    => apiClient.get('/fees/payments', { params }),
    addPayment:     (data)      => apiClient.post('/fees/payments', data)
  },

  // ── Health Records ────────────────────────────────────────────────────────
  // Backend: routes/healthRecordRoutes.js  ←→  controllers/healthRecordController.js
  // Files stored at: uploads/student/health-report/<filename>
  healthRecords: {
    /**
     * Get all health records.
     * Supported query params: search, status, recordType, studentId, from, to
     */
    getAll: (params = {}) =>
      apiClient.get('/health-records', { params }),

    /**
     * Get all records for a specific student (shorthand).
     */
    getByStudent: (studentId, params = {}) =>
      apiClient.get('/health-records', { params: { ...params, studentId } }),

    getById: (id) =>
      apiClient.get(`/health-records/${id}`),

    /**
     * Create a health record.
     * Pass a FormData object — include `reportFile` field for the uploaded report.
     *
     * Example:
     *   const fd = new FormData();
     *   fd.append('studentId',  student._id);
     *   fd.append('recordType', 'General Checkup');
     *   fd.append('recordDate', '2026-04-07');
     *   fd.append('reportFile', fileInput.files[0]); // optional
     *   api.healthRecords.create(fd);
     */
    create: (formData) =>
      apiClient.post('/health-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),

    /**
     * Update a health record.
     * Pass FormData — include `reportFile` only if replacing the existing report.
     */
    update: (id, formData) =>
      apiClient.put(`/health-records/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),

    delete: (id) =>
      apiClient.delete(`/health-records/${id}`)
  },
  // ─────────────────────────────────────────────────────────────────────────

  // Events
  events: {
    getAll:  (params = {}) => apiClient.get('/events', { params }),
    create:  (data)        => apiClient.post('/events', data),
    update:  (id, data)    => apiClient.put(`/events/${id}`, data),
    delete:  (id)          => apiClient.delete(`/events/${id}`)
  },

  // Fitness Members
  fitnessMember: {
    getAll:  (params)     => apiClient.get('/fitness/member', { params }),
    getById: (id)         => apiClient.get(`/fitness/member/${id}`),
    create:  (formData)   => apiClient.post('/fitness/member', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update:  (id, formData) => apiClient.put(`/fitness/member/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete:  (id)         => apiClient.delete(`/fitness/member/${id}`)
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
},

  // Fitness Events
  fitnessEvents: {
    getAll:  (params = {}) => apiClient.get('/fitness/events', { params }),
    create:  (data)        => apiClient.post('/fitness/events', data),
    update:  (id, data)    => apiClient.put(`/fitness/events/${id}`, data),
    delete:  (id)          => apiClient.delete(`/fitness/events/${id}`)
  },

  // Fitness Activities
  fitnessActivities: {
    getAll:  ()            => apiClient.get('/fitness/activities'),
    getById: (id)          => apiClient.get(`/fitness/activities/${id}`),
    create:  (data)        => apiClient.post('/fitness/activities', data),
    update:  (id, data)    => apiClient.put(`/fitness/activities/${id}`, data),
    delete:  (id)          => apiClient.delete(`/fitness/activities/${id}`)
  },

  // Fitness Schedules
  fitnessSchedules: {
    getAll: (params = {}) => apiClient.get('/fitness/schedules', { params }),
    getById: (id) => apiClient.get(`/fitness/schedules/${id}`),
    create: (data) => apiClient.post('/fitness/schedules', data),
    update: (id, data) => apiClient.put(`/fitness/schedules/${id}`, data),
    delete: (id) => apiClient.delete(`/fitness/schedules/${id}`),
  },

  // fitness dashboard
 dashboard: {
  get: () => apiClient.get('/dashboard'),
  getTodaySchedules: () => apiClient.get('/fitness/schedules'),
},

//schoolDashboard
schoolDashboard: {
  getData: () => apiClient.get('/school/dashboard'),
},


};

export default apiClient;