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

//       localStorage.setItem("token", data.token);
//       setUser(data.user);
//       navigate("/home");
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Network error! Check console.");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-between bg-cover bg-center px-6"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
//       }}
//     >
//       {/* LEFT SIDE TEXT + LOGO */}
//       <div className="hidden md:block text-white max-w-md ml-60 mt-[-10px]  ">
//         {/* LOGO ABOVE HELLO */}
//         <div className="flex items-center gap-1 mb-8">
//           <img
//             src="/assets/collabcampus-logo.png"
//             alt="CollabCampus Logo"
//             className="h-10 w-10 rounded-lg shadow-md"
//           />
//           <h2 className="text-3xl font-extrabold tracking-wide text-black">
//             CollabCampus
//           </h2>
//         </div>

//         <h1 className="text-5xl font-bold drop-shadow-lg leading-tight font-[Poppins] mt-24">
//           Hello!
//         </h1>
//         <p className="text-2xl mt-2 font-semibold drop-shadow-md ">
//           Welcome Back
//         </p>
//         <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
//           Empower your academic journey by connecting with students, alumni, and mentors. <br />
//           Discover opportunities, grow your network, and make meaningful connections. <br />
//           Your campus community — united and thriving.
//         </p>
//       </div>

//       {/* LOGIN BOX - RHS */}
//       <div className="bg-white/90 backdrop-blur-md shadow-xl p-8 mr-36 mt-9 rounded-xl w-full max-w-md">
//         {/* Login Header */}
//         <div className="mb-6">
//           <p className="text-2xl font-bold text-gray-800">Login</p>
//           <p className="text-sm text-gray-600">Access your account</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//               autoComplete="off"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700">Password</label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//               autoComplete="off"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleLogin}
//             className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md"
//           >
//             Sign In
//           </button>

//           <p className="text-sm text-center text-gray-500 mt-4">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-blue-600 hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </form>

//         {/* Copyright */}
//         <p className="text-xs text-gray-500 text-center mt-6">
//           © 2025 Nainsi Gupta. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useUser } from "../contexts/UserContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setUser } = useUser();

//   const handleLogin = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:5005/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         alert(data.message);
//         setIsLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       setUser(data.user);
//       navigate("/home");
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Network error! Check console.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Desktop Layout - Keep Original */}
//       <div
//         className="hidden md:flex min-h-screen items-center justify-between bg-cover bg-center px-6"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
//         }}
//       >
//         {/* LEFT SIDE TEXT + LOGO */}
//         <div className="text-white max-w-md ml-60 mt-[-10px]">
//           {/* LOGO ABOVE HELLO */}
//           <div className="flex items-center gap-1 mb-8">
//             <img
//               src="/assets/collabcampus-logo.png"
//               alt="CollabCampus Logo"
//               className="h-10 w-10 rounded-lg shadow-md"
//             />
//             <h2 className="text-3xl font-extrabold tracking-wide text-black">
//               CollabCampus
//             </h2>
//           </div>

//           <h1 className="text-5xl font-bold drop-shadow-lg leading-tight font-[Poppins] mt-24">
//             Hello!
//           </h1>
//           <p className="text-2xl mt-2 font-semibold drop-shadow-md">
//             Welcome Back
//           </p>
//           <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins]">
//             Empower your academic journey by connecting with students, alumni, and mentors. <br />
//             Discover opportunities, grow your network, and make meaningful connections. <br />
//             Your campus community — united and thriving.
//           </p>
//         </div>

//         {/* LOGIN BOX - RHS */}
//         <div className="bg-white/90 backdrop-blur-md shadow-xl p-8 mr-36 mt-9 rounded-xl w-full max-w-md">
//           {/* Login Header */}
//           <div className="mb-6">
//             <p className="text-2xl font-bold text-gray-800">Login</p>
//             <p className="text-sm text-gray-600">Access your account</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-700">Email</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter email"
//                 className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//                 autoComplete="off"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700">Password</label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//                 autoComplete="off"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={handleLogin}
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold py-2 rounded-md disabled:opacity-50"
//             >
//               {isLoading ? "Signing In..." : "Sign In"}
//             </button>

//             <p className="text-sm text-center text-gray-500 mt-4">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-blue-600 hover:underline">
//                 Sign Up
//               </Link>
//             </p>
//           </form>

//           {/* Copyright */}
//           <p className="text-xs text-gray-500 text-center mt-6">
//             © 2025 Nainsi Gupta. All rights reserved.
//           </p>
//         </div>
//       </div>

//       {/* Mobile Layout - New Beautiful Design */}
//       <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
//           <div className="absolute top-40 right-8 w-24 h-24 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
//           <div className="absolute bottom-32 left-6 w-20 h-20 bg-indigo-400/20 rounded-full blur-lg animate-ping"></div>
//           <div className="absolute bottom-20 right-12 w-28 h-28 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
//         </div>

//         {/* Content Container */}
//         <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
//           {/* Logo Section */}
//           <div className="text-center mb-8 animate-fadeInDown">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="relative">
//                 <img
//                   src="/assets/collabcampus-logo.png"
//                   alt="CollabCampus Logo"
//                   className="h-12 w-12 rounded-xl shadow-2xl transform hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
//               </div>
//               <h1 className="text-3xl font-extrabold text-white tracking-wide">
//                 CollabCampus
//               </h1>
//             </div>
//           </div>

//           {/* Welcome Section */}
//           <div className="text-center mb-12 animate-fadeInUp">
//             <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               Welcome Back!
//             </h2>
//             <p className="text-white/80 text-lg leading-relaxed px-4">
//               Connect with your campus community
//             </p>
//             <div className="flex justify-center mt-6">
//               <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
//             </div>
//           </div>

//           {/* Login Form */}
//           <div className="flex-1 flex items-center justify-center">
//             <div className="w-full max-w-sm">
//               <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-slideInUp">
//                 <div className="mb-6 text-center">
//                   <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
//                   <p className="text-white/70 text-sm">Access your account</p>
//                 </div>

//                 <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="relative">
//                       <input
//                         type="email"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Email address"
//                         className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//                         autoComplete="off"
//                       />
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="password"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Password"
//                         className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//                         autoComplete="off"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleLogin}
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                         Signing In...
//                       </div>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </button>
//                 </form>

//                 <div className="mt-6 text-center">
//                   <p className="text-white/70 text-sm">
//                     Don't have an account?{" "}
//                     <Link 
//                       to="/signup" 
//                       className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
//                     >
//                       Sign Up
//                     </Link>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center mt-8 animate-fadeInUp">
//             <p className="text-white/50 text-xs">
//               © 2025 Nainsi Gupta. All rights reserved.
//             </p>
//           </div>
//         </div>

//         {/* Custom CSS for animations */}
//         <style jsx>{`
//           @keyframes fadeInDown {
//             from {
//               opacity: 0;
//               transform: translateY(-30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes slideInUp {
//             from {
//               opacity: 0;
//               transform: translateY(50px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .animate-fadeInDown {
//             animation: fadeInDown 0.8s ease-out;
//           }

//           .animate-fadeInUp {
//             animation: fadeInUp 0.8s ease-out;
//           }

//           .animate-slideInUp {
//             animation: slideInUp 0.6s ease-out;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { 
  ChevronDown, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Award,
  ArrowRight,
  Star,
  Globe,
  Zap,
  Heart,
  CheckCircle,
  Play
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error! Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToLogin = () => {
    setShowLanding(false);
    setTimeout(() => {
      document.getElementById('login-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Peers",
      description: "Build meaningful relationships with students from your campus and beyond"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Academic Excellence",
      description: "Share knowledge, collaborate on projects, and achieve academic success together"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Instant messaging and group discussions to stay connected with your community"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Mentorship Program",
      description: "Connect with alumni and industry professionals for career guidance"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "CollabCampus helped me find study partners and land my dream internship!"
    },
    {
      name: "Michael Chen",
      role: "Alumni, Software Engineer",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "The mentorship connections I made here shaped my entire career path."
    },
    {
      name: "Emily Rodriguez",
      role: "Business Student",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "Amazing platform for networking and collaborative learning experiences."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "200+", label: "Universities" },
    { number: "10K+", label: "Success Stories" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <>
      {/* Landing Section */}
      {showLanding && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-8 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute bottom-32 left-6 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-ping"></div>
            <div className="absolute bottom-20 right-12 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Hero Section */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 md:p-8">
              <div className="flex items-center gap-2 animate-slideInLeft">
                <div className="relative">
                  <img
                    src="/assets/collabcampus-logo.png"
                    alt="CollabCampus Logo"
                    className="h-10 w-10 md:h-10 md:w-10 rounded-xl shadow-2xl transform hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                </div>
                <h1 className="text-xl md:text-2xl font-serif font-extrabold text-white tracking-wide">
                  CollabCampus
                </h1>
              </div>
              <button
                onClick={scrollToLogin}
                className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 animate-slideInRight"
              >
                Login
              </button>
            </nav>

            {/* Hero Content */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <div className="animate-fadeInUp">
                  <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Your Campus
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                      Community Awaits
                    </span>
                  </h2>
                  <p className="text-xl md:text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
                    Connect, collaborate, and grow with students, alumni, and mentors. 
                    Build meaningful relationships that last beyond graduation.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center">
                    <button
                      onClick={scrollToLogin}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transform transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-2 group ml-7"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {/* <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Watch Demo
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="text-center pb-8 animate-bounce">
              <button
                onClick={scrollToLogin}
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                <ChevronDown className="w-8 h-8 mx-auto" />
                <p className="text-sm mt-2">Explore More</p>
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="relative z-10 py-20 px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-fadeInUp">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Why Choose CollabCampus?
                </h3>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Discover the features that make our platform the perfect place for academic collaboration
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 animate-slideInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-blue-400 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="relative z-10 py-20 px-6 md:px-8 bg-black/20">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-3xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-white/80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="relative z-10 py-20 px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-fadeInUp">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  What Students Say
                </h3>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Real stories from our community members
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 animate-slideInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="text-white font-bold">{testimonial.name}</h4>
                        <p className="text-white/70 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/80 italic">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative z-10 py-20 px-6 md:px-8 text-center">
            <div className="max-w-4xl mx-auto animate-fadeInUp">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Join the Community?
              </h3>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Start your journey today and connect with thousands of students worldwide
              </p>
              <button
                onClick={scrollToLogin}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-full font-bold text-xl transform transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Join Now - It's Free!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Section */}
      <div id="login-section" className="min-h-screen">
        {/* Desktop Layout */}
        <div
          className="hidden md:flex min-h-screen items-center justify-between bg-cover bg-center px-6 relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1646614871839-881108ea8407?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* LEFT SIDE TEXT + LOGO */}
          <div className="text-white max-w-md ml-60 mt-[-10px] relative z-10 animate-slideInLeft">
            {/* LOGO ABOVE HELLO */}
            <div className="flex items-center gap-1 mb-8">
              <img
                src="/assets/collabcampus-logo.png"
                alt="CollabCampus Logo"
                className="h-10 w-10 rounded-lg shadow-md transform hover:scale-110 transition-transform duration-300"
              />
              <h2 className="text-3xl font-extrabold tracking-wide text-white">
                CollabCampus
              </h2>
            </div>

            <h1 className="text-5xl font-bold drop-shadow-lg leading-tight font-[Poppins] mt-24 animate-fadeInUp">
              Hello!
            </h1>
            <p className="text-2xl mt-2 font-semibold drop-shadow-md animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Welcome Back
            </p>
            <p className="mt-4 text-base text-white/90 drop-shadow-sm leading-relaxed font-[Poppins] animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Empower your academic journey by connecting with students, alumni, and mentors. <br />
              Discover opportunities, grow your network, and make meaningful connections. <br />
              Your campus community — united and thriving.
            </p>
          </div>

          {/* LOGIN BOX - RHS */}
          <div className="bg-white/95 backdrop-blur-md shadow-2xl p-8 mr-36 mt-9 rounded-2xl w-full max-w-md relative z-10 animate-slideInRight transform hover:scale-105 transition-all duration-300">
            {/* Login Header */}
            <div className="mb-6 text-center">
              <p className="text-3xl font-bold text-gray-800 mb-2">Login</p>
              <p className="text-sm text-gray-600">Access your account</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-3"></div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-gray-300"
                    autoComplete="off"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-gray-300"
                    autoComplete="off"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>

            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center mt-6">
              © 2025 Nainsi Gupta. All rights reserved.
            </p>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-8 w-24 h-24 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
            <div className="absolute bottom-32 left-6 w-20 h-20 bg-indigo-400/20 rounded-full blur-lg animate-ping"></div>
            <div className="absolute bottom-20 right-12 w-28 h-28 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
            {/* Logo Section */}
            <div className="text-center mb-8 animate-fadeInDown">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src="/assets/collabcampus-logo.png"
                    alt="CollabCampus Logo"
                    className="h-12 w-12 rounded-xl shadow-2xl transform hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-wide">
                  CollabCampus
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-12 animate-fadeInUp">
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="text-white/80 text-lg leading-relaxed px-4">
                Connect with your campus community
              </p>
              <div className="flex justify-center mt-6">
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </div>
            </div>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-slideInUp transform hover:scale-105 transition-all duration-300">
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
                    <p className="text-white/70 text-sm">Access your account</p>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-3"></div>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
                          autoComplete="off"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-white/70 text-sm">
                      Don't have an account?{" "}
                      <Link 
                        to="/signup" 
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 animate-fadeInUp">
              <p className="text-white/50 text-xs">
                © 2025 Nainsi Gupta. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </>
  );
};

export default Login;