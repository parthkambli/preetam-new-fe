// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useOrg } from '../../context/OrgContext';
// import axios from 'axios';

// export default function Login() {
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useOrg();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
//         userId,
//         password
//       });

//       const { token, organizations, defaultOrg, user } = response.data;

//       // Save to localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('organizations', JSON.stringify(organizations));
//       localStorage.setItem('currentOrgId', defaultOrg.id);
//       localStorage.setItem('user', JSON.stringify(user));

//       // Update context
//       login(organizations, defaultOrg);

//       // Navigate to dashboard
//       navigate(`/${defaultOrg.id}/dashboard`);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
//       <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-20 h-20 bg-[#000359] rounded-full flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg">
//             P
//           </div>
//           <h1 className="text-3xl font-bold text-[#000359]">Preetam</h1>
//           <p className="text-gray-600 mt-1 text-center text-sm">
//             Senior Citizen School And Sport Fitness Club
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">User ID</label>
//             <input
//               type="text"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
//               placeholder="Enter your user ID"
//               required
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
//               placeholder="Enter your password"
//               required
//               disabled={loading}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#000359] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>

//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <p className="text-xs text-gray-500 text-center">
//             Default credentials: <strong>admin123</strong> / <strong>admin@preetam2025</strong>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useOrg } from '../../context/OrgContext';
// import axios from 'axios';
// import logo1 from '../../assets/logoschool.png';
// import logo from '../../assets/logoclub.png';

// export default function Login() {
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useOrg();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
//         userId,
//         password
//       });

//       const { token, organizations, defaultOrg, user } = response.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('organizations', JSON.stringify(organizations));
//       localStorage.setItem('currentOrgId', defaultOrg.id);
//       localStorage.setItem('user', JSON.stringify(user));

//       login(organizations, defaultOrg);
//       navigate(`/${defaultOrg.id}/dashboard`);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//     return (
//       <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">

//         {/* Logo + Title */}
//         <div className="flex flex-col items-center">
//           <div className='flex gap-8'>
//           <img
//             src={logo}
//             alt="logo"
//             className="w-44 h-44 mb-2 mt-4"
//           />
//           <img
//             src={logo1}
//             alt="logo"
//             className="w-40 h-40 mb-2"
//           />
//   </div>
//           <h1 className="text-4xl font-bold text-[#000359] tracking-wide">
//             Preetam
//           </h1>

//           <p className="mt-2 text-lg font-semibold text-gray-700 text-center">
//             Senior Citizen School And Sport Fitness Club
//           </p>
//         </div>

//         {/* Admin Button */}
//         {/* <button
//           className="mt-6 bg-[#000359] text-white px-12 py-2 rounded-lg font-medium shadow-md"
//         >
//           Admin
//         </button> */}

//         {/* Form Card */}
//         <div className="mt-6 bg-white border border-[#000359] rounded-xl shadow-lg px-8 py-10 w-full max-w-md">

//           {error && (
//             <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-6">

//             <div>
//               <label className="block text-gray-900 font-semibold mb-1">
//                 Enter User ID
//               </label>
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="w-full bg-[#eef0ff] px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="block text-gray-900 font-semibold mb-1">
//                 Enter Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full bg-[#eef0ff] px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#000359] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-900 transition disabled:opacity-50"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>

//       </div>
//     );
// }


















import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrg } from '../../context/OrgContext';
import axios from 'axios';
import logo1 from '../../assets/logoschool.png';
import logo from '../../assets/logoclub.png';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useOrg();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
  //       userId,
  //       password
  //     });

  //     const { token, organizations, defaultOrg, user } = response.data;

  //     localStorage.setItem('token', token);
  //     localStorage.setItem('organizations', JSON.stringify(organizations));
  //     localStorage.setItem('currentOrgId', defaultOrg.id);
  //     localStorage.setItem('user', JSON.stringify(user));

  //     login(organizations, defaultOrg);
  //     navigate(`/${defaultOrg.id}/dashboard`);
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Login failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      userId,
      password
    });

    const { token, organizations, defaultOrg, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('organizations', JSON.stringify(organizations));
    localStorage.setItem('currentOrgId', defaultOrg.id);

    // Pass user data to context
login(organizations, defaultOrg, user);

// 🔥 Redirect based on exact sidebar routes
if (user?.role === "FitnessStaff") {
  navigate("/fitness-staff");
}
else if (user?.role === "SchoolStaff") {
  navigate("/school-staff");
}
else {
  // Admin
  navigate(`/${defaultOrg.id}/dashboard`);
}
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo + Title */}
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Logos container - responsive flex with wrapping and centered */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-6 mb-0">
          <img
            src={logo}
            alt="Club Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain"
          />
          <img
            src={logo1}
            alt="School Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#000359] tracking-wide text-center">
          Preetam
        </h1>

        <p className="mt-2 text-base sm:text-lg font-semibold text-gray-700 text-center px-2">
          Senior Citizen School And Sport Fitness Club
        </p>
      </div>

      {/* Admin Button - kept commented as per original */}
      {/* <button
        className="mt-6 bg-[#000359] text-white px-12 py-2 rounded-lg font-medium shadow-md"
      >
        Admin
      </button> */}

      {/* Form Card */}
      <div className="mt-6 sm:mt-8 bg-white border border-[#000359] rounded-xl shadow-lg px-6 sm:px-8 py-8 sm:py-10 w-full max-w-md">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Enter User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-[#eef0ff] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#eef0ff] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000359] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}