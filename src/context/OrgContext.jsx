import { createContext, useContext, useState, useEffect } from 'react';

const OrgContext = createContext();

export const organizations = [
  { id: 'school', name: 'Preetam Senior Citizen School', label: 'Senior Citizen School' },
  { id: 'fitness', name: 'Sport Fitness Club', label: 'Sport Fitness Club' },
];

export function OrgProvider({ children }) {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedOrgs = localStorage.getItem('organizations');
    const storedUser = localStorage.getItem('user');
    const currentOrgId = localStorage.getItem('currentOrgId');

    if (token && storedOrgs) {
      const parsed = JSON.parse(storedOrgs);
      setAvailableOrgs(parsed);
      
      if (currentOrgId) {
        const org = parsed.find(o => o.id === currentOrgId);
        setCurrentOrg(org || parsed[0]);
      } else {
        setCurrentOrg(parsed[0]);
      }
      
      setIsAuthenticated(true);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = (organizations, defaultOrg) => {
    setAvailableOrgs(organizations);
    setCurrentOrg(defaultOrg);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organizations');
    localStorage.removeItem('currentOrgId');
    localStorage.removeItem('user');
    setAvailableOrgs([]);
    setCurrentOrg(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchOrg = (orgId) => {
    const org = availableOrgs.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem('currentOrgId', orgId);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <OrgContext.Provider value={{ 
      currentOrg, 
      switchOrg, 
      availableOrgs, 
      isAuthenticated, 
      user,
      loading,
      login, 
      logout,
      updateUser
    }}>
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => useContext(OrgContext);
