1. Overall Flow Summary (High Level)

Single Login Screen
→ Admin enters UserID + Password
→ Backend verifies credentials
→ If valid → returns JWT token + admin's allowed organizations (array of org IDs/names)
Frontend receives token + org list
→ Stores token in localStorage / context
→ Default org = first one (e.g. School)
→ Shows Navbar with dropdown to switch organizations
Every API call includes:
Authorization: Bearer <token>
X-Organization-ID: <currentOrg.id> (header)

Backend uses organization header to filter data
→ All queries add where: { organizationId: req.headers['x-organization-id'] }
Sidebar changes dynamically based on current organization
→ School → Participants, Fees, Health Records, etc.
→ Fitness → Members, Fee, Events, etc.
Data is separated at database level (recommended ways below)

2. Database Structure Options (Choose One)

































OptionTable StructureProsConsRecommendationASingle table + organizationId columnEasy to query, easy reports across orgsRisk of data leak if filter forgottenBest for your case (small scale)BSeparate tables (school_enquiries, fitness_enquiries, etc.)Strong isolation, easier permissionsMore tables, harder cross-org reportsIf security is very strictCMulti-tenant DB (schema per org)Maximum isolationComplex setup, expensiveOverkill
I recommend Option A → one admins, one enquiries, one admissions, one members, etc. + organizationId field everywhere.
3. Backend – Important Endpoints & Logic
A. Create First Admin (one-time script)
JavaScript// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('../models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ userId: 'admin123' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin@preetam2025', 10);

  await Admin.create({
    userId: 'admin123',
    password: hashed,
    fullName: 'Super Admin',
    allowedOrganizations: [
      { id: 'school', name: 'Preetam Senior Citizen School', label: 'Senior Citizen School' },
      { id: 'fitness', name: 'Sport Fitness Club', label: 'Sport Fitness Club' }
    ],
    role: 'superadmin'
  });

  console.log('Admin created successfully');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
Run: node scripts/createAdmin.js
B. Login Endpoint (most important)
JavaScript// routes/auth.js
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  const admin = await Admin.findOne({ userId });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT
  const token = jwt.sign(
    {
      id: admin._id,
      userId: admin.userId,
      organizations: admin.allowedOrganizations
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    organizations: admin.allowedOrganizations,
    defaultOrg: admin.allowedOrganizations[0]
  });
});
C. Protected Route Middleware (with org filter)
JavaScript// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const orgId = req.header('X-Organization-ID');

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;

    // Validate requested organization is allowed
    const allowed = decoded.organizations.some(o => o.id === orgId);
    if (!allowed) {
      return res.status(403).json({ message: 'Organization not allowed' });
    }

    req.organizationId = orgId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
D. Example Enquiry Route (always filter by org)
JavaScript// routes/enquiry.js
router.get('/', authMiddleware, async (req, res) => {
  const enquiries = await Enquiry.find({
    organizationId: req.organizationId
  }).sort({ createdAt: -1 });

  res.json(enquiries);
});

router.post('/', authMiddleware, async (req, res) => {
  const enquiry = new Enquiry({
    ...req.body,
    organizationId: req.organizationId,
    createdBy: req.admin.id
  });
  await enquiry.save();
  res.status(201).json(enquiry);
});
4. Frontend – Complete Organization Switching Logic
A. OrgContext.jsx (already good, small improvement)
jsx// src/contexts/OrgContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const organizations = [
  { id: 'school', name: 'Preetam Senior Citizen School', label: 'Senior Citizen School' },
  { id: 'fitness', name: 'Sport Fitness Club', label: 'Sport Fitness Club' },
];

const OrgContext = createContext();

export function OrgProvider({ children }) {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [availableOrgs, setAvailableOrgs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedOrgs = localStorage.getItem('organizations');

    if (token && storedOrgs) {
      const parsed = JSON.parse(storedOrgs);
      setAvailableOrgs(parsed);
      setCurrentOrg(parsed[0] || null);
    }
  }, []);

  const switchOrg = (orgId) => {
    const org = availableOrgs.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      // Optional: save preference
      localStorage.setItem('currentOrgId', orgId);
    }
  };

  return (
    <OrgContext.Provider value={{ currentOrg, switchOrg, availableOrgs }}>
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => useContext(OrgContext);
B. Login Page – Save orgs & token
jsx// In handleLogin success
const { token, organizations, defaultOrg } = response.data;

localStorage.setItem('token', token);
localStorage.setItem('organizations', JSON.stringify(organizations));
localStorage.setItem('currentOrgId', defaultOrg.id);

navigate('/dashboard');  // or /school/dashboard
C. Axios Interceptor (send org header automatically)
jsx// src/utils/axios.js
import axios from 'axios';
import { useOrg } from '../contexts/OrgContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Get current org from context or localStorage
  const currentOrgId = localStorage.getItem('currentOrgId');
  if (currentOrgId) {
    config.headers['X-Organization-ID'] = currentOrgId;
  }

  return config;
});

export default api;
D. Protected Route / Layout
Use <Outlet context={{ currentOrg }} /> or just consume useOrg() in every page.
5. Final Recommended Folder Structure (Backend)
textbackend/
├── models/
│   ├── Admin.js
│   ├── Enquiry.js
│   ├── Admission.js
│   ├── Member.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── enquiry.js
│   ├── admission.js
│   └── ...
├── middleware/
│   └── auth.js
├── scripts/
│   └── createAdmin.js
└── server.js
Quick Checklist Before Coding More

 Create .env with JWT_SECRET and MONGO_URI
 Run createAdmin.js once
 Test login → check localStorage has token + organizations
 Switch org → sidebar changes + API calls have correct header
 All GET/POST/PUT routes use organizationId: req.organizationId