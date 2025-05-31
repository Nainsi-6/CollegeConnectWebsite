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

    // Reset all optional fields when role changes
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

    // Basic validations
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

    // Construct the request body
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop')",
      }}
    >

        <div className=" text-white ml-48 mt-6 p-10">
        {/* LOGO ABOVE HELLO */}
        <div className="flex items-center gap-1 mb-8">
          <img
            src="/assets/collabcampus-logo.png"
            alt="CollabCampus Logo"
            className="h-10 w-10 rounded-lg shadow-md"
          />
          <h2 className="text-3xl font-extrabold tracking-wide text-black">
            CollabCampus
          </h2>
        </div>


        <p className="text-2xl mt-2 font-semibold drop-shadow-md ">
          Welcome Back
        </p>
        <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
          Empower your academic journey by connecting with students, alumni, and mentors. <br />
        
        </p>
          <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
         
          Discover opportunities, grow your network, and make meaningful connections. <br />
          Your campus community — united and thriving.
        </p>
      </div>

      <div className="w-full max-w-xl border-2 rounded-xl border-blue-500 p-10 bg-white bg-opacity-80 shadow-2xl ml-16 mr-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Signup</h2>
        <form onSubmit={handleSignup} className="flex flex-col">

          {/* Username */}
          <input
            type="text"
            required
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
          />

          {/* Email */}
          <input
            type="email"
            required
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
          />

          {/* Password */}
          <input
            type="password"
            required
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
          />

          {/* Role */}
          <select
            required
            value={role}
            onChange={handleRoleChange}
            className="border-2 border-blue-500 mb-4 py-2 px-4 rounded-lg text-black bg-white"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="alumni">Alumni</option>
          </select>

          {/* Student Fields */}
          {role === 'student' && (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
              <input
                type="text"
                placeholder="Enter Registration Number"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
            </div>
          )}

          {/* Faculty Fields */}
          {role === 'faculty' && (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
              <input
                type="text"
                placeholder="Enter Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
            </div>
          )}

          {/* Alumni Fields */}
          {role === 'alumni' && (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
              <input
                type="text"
                placeholder="Enter Passed Out Batch"
                value={passedOutBatch}
                onChange={(e) => setPassedOutBatch(e.target.value)}
                className="w-1/2 border-2 border-blue-500 py-2 px-4 rounded-lg placeholder-gray-500 bg-transparent text-black"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

            {/* Copyright */}
        <p className="text-xs text-gray-500 text-center mt-6">
          © 2025 Nainsi Gupta. All rights reserved.
        </p>
      </div>

     
    </div>
  );
};

export default Signup;
