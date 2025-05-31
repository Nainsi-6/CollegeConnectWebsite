// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useUser } from "../contexts/UserContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { setUser } = useUser();

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("http://localhost:5005/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         alert(data.message);
//         return;
//       }
  
//       // Store token in localStorage
//       localStorage.setItem("token", data.token);
//       setUser(data.user);
//       navigate("/home");
//     } catch (error) {
//       console.error("Login request failed:", error);
//       alert("Network error! Check console.");
//     }
//   };
  
//   return (
//     <div
//       className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundImage: `url('https://i.ytimg.com/vi/kyWiZlrS9mA/maxresdefault.jpg')`,
//       }}
//     >
//       {/* Welcome Heading */}
//       <h1 className="text-5xl font-bold text-white mb-6">Welcome to College Connect</h1>

//       {/* Short Description (Smaller & Centered Above Login Box) */}
//       <p className="text-white text-lg bg-black bg-opacity-60 px-6 py-2 rounded-lg mb-4">
//         Connect with students & alumni to build your professional network.
//       </p>

//       {/* Main Content: Login + Image */}
//       <div className="flex w-4/5 max-w-6xl h-[70vh] gap-x-10">
//         {/* Left Side - Login Form */}
//         <div className="w-1/3 flex flex-col justify-center bg-black bg-opacity-90 p-6 rounded-3xl shadow-lg mt-10 mb-10">
//           <h2 className="text-2xl font-semibold text-white mb-6">Login to Your Account</h2>
//           <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
//             <input
//               required
//               className="border border-gray-600 mb-3 text-white bg-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="off"
//             />
//             <input
//               required
//               className="border border-gray-600 mb-3 text-white bg-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               type="password"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="off"
//             />
//             <button
//               type="button"
//               onClick={handleLogin}
//               className="mt-4 text-lg text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg py-2 transition-all"
//             >
//               Login
//             </button>
//           </form>
//           <p className="mt-4 text-gray-400 text-sm">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-emerald-400 hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>

//         {/* Right Side - Larger Image */}
//         <div className="w-2/3 flex justify-center items-center">
//           <img
//             src="https://png.pngtree.com/png-vector/20230728/ourlarge/pngtree-connection-clipart-flat-illustration-of-people-networking-together-vector-illustration-ilustratura-png-image_6805393.png"
//             alt="Networking"
//             className="w-[90%] h-[100%] object-cover rounded-lg"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error! Check console.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-between bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* LEFT SIDE TEXT + LOGO */}
      <div className="hidden md:block text-white max-w-md ml-60 mt-[-10px]  ">
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

        <h1 className="text-5xl font-bold drop-shadow-lg leading-tight font-[Poppins] mt-24">
          Hello!
        </h1>
        <p className="text-2xl mt-2 font-semibold drop-shadow-md ">
          Welcome Back
        </p>
        <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
          Empower your academic journey by connecting with students, alumni, and mentors. <br />
          Discover opportunities, grow your network, and make meaningful connections. <br />
          Your campus community — united and thriving.
        </p>
      </div>

      {/* LOGIN BOX - RHS */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl p-8 mr-36 mt-9 rounded-xl w-full max-w-md">
        {/* Login Header */}
        <div className="mb-6">
          <p className="text-2xl font-bold text-gray-800">Login</p>
          <p className="text-sm text-gray-600">Access your account</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md"
          >
            Sign In
          </button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>

        {/* Copyright */}
        <p className="text-xs text-gray-500 text-center mt-6">
          © 2025 Nainsi Gupta. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
