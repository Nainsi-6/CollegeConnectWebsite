// // Signup.jsx (Responsive for Mobile + Preserved Desktop)
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [batch, setBatch] = useState('');
//   const [regNumber, setRegNumber] = useState('');
//   const [facultyId, setFacultyId] = useState('');
//   const [department, setDepartment] = useState('');
//   const [company, setCompany] = useState('');
//   const [passedOutBatch, setPassedOutBatch] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleRoleChange = (e) => {
//     const selectedRole = e.target.value;
//     setRole(selectedRole);
//     setBatch('');
//     setRegNumber('');
//     setFacultyId('');
//     setDepartment('');
//     setCompany('');
//     setPassedOutBatch('');
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!username || !email || !password || !role) {
//       alert('❌ Please fill all required fields.');
//       setLoading(false);
//       return;
//     }

//     if (role === 'student' && (!batch || !regNumber)) {
//       alert('❌ Batch and Registration Number are required for students.');
//       setLoading(false);
//       return;
//     }

//     if (role === 'faculty' && (!facultyId || !department)) {
//       alert('❌ Faculty ID and Department are required for faculty.');
//       setLoading(false);
//       return;
//     }

//     if (role === 'alumni' && (!company || !passedOutBatch)) {
//       alert('❌ Company and Passed Out Batch are required for alumni.');
//       setLoading(false);
//       return;
//     }

//     const userDetails = {
//       username: username.trim(),
//       email: email.trim(),
//       password,
//       role,
//       batch: role === 'student' ? batch.trim() : '',
//       regNumber: role === 'student' ? regNumber.trim() : '',
//       facultyId: role === 'faculty' ? facultyId.trim() : '',
//       department: role === 'faculty' ? department.trim() : '',
//       company: role === 'alumni' ? company.trim() : '',
//       passedOutBatch: role === 'alumni' ? passedOutBatch.trim() : '',
//     };

//     try {
//       const res = await fetch('http://localhost:5005/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userDetails),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (res.ok) {
//         alert('✅ Signup successful! Please log in.');
//         navigate('/login');
//       } else {
//         alert(`❌ Signup failed: ${data.message}`);
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       alert('❌ Something went wrong. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center px-6 py-8"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop')",
//       }}
//     >
//       {/* Left Section */}
//       <div className="text-white md:ml-36 mb-10 md:mb-0 max-w-md">
//         <div className="flex items-center gap-2 mb-6">
//           <img
//             src="/assets/collabcampus-logo.png"
//             alt="CollabCampus Logo"
//             className="h-10 w-10 rounded-lg shadow-md"
//           />
//           <h2 className="text-3xl font-extrabold tracking-wide text-black">
//             CollabCampus
//           </h2>
//         </div>

//         <p className="text-xl font-semibold drop-shadow-md mb-3">
//           Welcome Back
//         </p>
//         <p className="text-sm text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
//           Empower your academic journey by connecting with students, alumni, and mentors. Discover opportunities, grow your network, and make meaningful connections. Your campus community — united and thriving.
//         </p>
//       </div>

//       {/* Signup Form */}
//       <div className="w-full max-w-xl border-2 rounded-xl border-blue-500 p-6 md:p-10 bg-white bg-opacity-90 shadow-2xl md:ml-10">
//         <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Signup</h2>
//         <form onSubmit={handleSignup} className="flex flex-col">
//           <input
//             type="text"
//             required
//             placeholder="Enter Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//           />

//           <input
//             type="email"
//             required
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             autoComplete="off"
//             className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//           />

//           <input
//             type="password"
//             required
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             autoComplete="new-password"
//             className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//           />

//           <select
//             required
//             value={role}
//             onChange={handleRoleChange}
//             className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg text-black bg-white"
//           >
//             <option value="">Select Role</option>
//             <option value="student">Student</option>
//             <option value="faculty">Faculty</option>
//             <option value="alumni">Alumni</option>
//           </select>

//           {role === 'student' && (
//             <div className="flex flex-col sm:flex-row gap-4 mb-4">
//               <input
//                 type="text"
//                 placeholder="Enter Batch"
//                 value={batch}
//                 onChange={(e) => setBatch(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//               <input
//                 type="text"
//                 placeholder="Enter Registration Number"
//                 value={regNumber}
//                 onChange={(e) => setRegNumber(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//             </div>
//           )}

//           {role === 'faculty' && (
//             <div className="flex flex-col sm:flex-row gap-4 mb-4">
//               <input
//                 type="text"
//                 placeholder="Enter Faculty ID"
//                 value={facultyId}
//                 onChange={(e) => setFacultyId(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//               <input
//                 type="text"
//                 placeholder="Enter Department"
//                 value={department}
//                 onChange={(e) => setDepartment(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//             </div>
//           )}

//           {role === 'alumni' && (
//             <div className="flex flex-col sm:flex-row gap-4 mb-4">
//               <input
//                 type="text"
//                 placeholder="Enter Company Name"
//                 value={company}
//                 onChange={(e) => setCompany(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//               <input
//                 type="text"
//                 placeholder="Enter Passed Out Batch"
//                 value={passedOutBatch}
//                 onChange={(e) => setPassedOutBatch(e.target.value)}
//                 className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white"
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md ${
//               loading ? 'opacity-60 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Signing Up...' : 'Sign Up'}
//           </button>
//         </form>

//         <p className="text-xs text-gray-500 text-center mt-6">
//           © 2025 Nainsi Gupta. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [batch, setBatch] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [passedOutBatch, setPassedOutBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setBatch('');
    setRegNumber('');
    setFacultyId('');
    setDepartment('');
    setCompany('');
    setPassedOutBatch('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password || !role) {
      alert('❌ Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (role === 'student' && (!batch || !regNumber)) {
      alert('❌ Batch and Registration Number are required for students.');
      setLoading(false);
      return;
    }

    if (role === 'faculty' && (!facultyId || !department)) {
      alert('❌ Faculty ID and Department are required for faculty.');
      setLoading(false);
      return;
    }

    if (role === 'alumni' && (!company || !passedOutBatch)) {
      alert('❌ Company and Passed Out Batch are required for alumni.');
      setLoading(false);
      return;
    }

    const userDetails = {
      username: username.trim(),
      email: email.trim(),
      password,
      role,
      batch: role === 'student' ? batch.trim() : '',
      regNumber: role === 'student' ? regNumber.trim() : '',
      facultyId: role === 'faculty' ? facultyId.trim() : '',
      department: role === 'faculty' ? department.trim() : '',
      company: role === 'alumni' ? company.trim() : '',
      passedOutBatch: role === 'alumni' ? passedOutBatch.trim() : '',
    };

    try {
      const res = await fetch('http://localhost:5005/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('✅ Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert(`❌ Signup failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('❌ Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-cover bg-center px-4 py-8 font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop')",
      }}
    >
      {/* Left Section */}
      <div className="text-white md:ml-36 mb-6 md:mb-0 max-w-md w-full md:w-auto">
        <div className="flex items-center gap-2 mb-3 md:mb-6">
          <img
            src="/assets/collabcampus-logo.png"
            alt="CollabCampus Logo"
            className="h-10 w-10 rounded-lg shadow-md"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-black md:font-bold">
            CollabCampus
          </h2>
        </div>

        {/* Hide below text on small screens */}
        <div className="hidden md:block">
          <p className="text-xl font-semibold drop-shadow-md mb-3 md:font-bold">
            Welcome Back
          </p>
          <p className="text-sm text-white/90 drop-shadow-sm leading-relaxed font-[Poppins] md:font-medium">
            Empower your academic journey by connecting with students, alumni, and mentors. Discover opportunities, grow your network, and make meaningful connections.
          </p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-xl rounded-xl bg-white/20 md:bg-white md:bg-opacity-90 backdrop-blur-md shadow-2xl p-6 md:p-10 md:border-2 md:border-blue-500 md:ml-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white md:text-blue-600 md:font-extrabold">Signup</h2>
        <form onSubmit={handleSignup} className="flex flex-col text-sm md:text-base">
          <input
            type="text"
            required
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white w-full font-medium"
          />

          <input
            type="email"
            required
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white w-full font-medium"
          />

          <input
            type="password"
            required
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white w-full font-medium"
          />

          <select
            required
            value={role}
            onChange={handleRoleChange}
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg text-black bg-white w-full font-medium"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="alumni">Alumni</option>
          </select>

          {role === 'student' && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
              <input
                type="text"
                placeholder="Enter Registration Number"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
            </div>
          )}

          {role === 'faculty' && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
              <input
                type="text"
                placeholder="Enter Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
            </div>
          )}

          {role === 'alumni' && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
              <input
                type="text"
                placeholder="Enter Passed Out Batch"
                value={passedOutBatch}
                onChange={(e) => setPassedOutBatch(e.target.value)}
                className="flex-1 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 text-black bg-white font-medium"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md transition-all duration-200 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-gray-100 md:text-gray-500 text-center mt-6 font-medium">
          © 2025 Nainsi Gupta. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;