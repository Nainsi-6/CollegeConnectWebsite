// "use client"

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"
// import { Link } from "react-router-dom"

// const Navbar = () => {
//   const navigate = useNavigate()
//   const { user, setUser } = useUser()

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) return

//         const response = await axios.get("http://localhost:5005/api/user", {
//           headers: { Authorization: token },
//         })
//         setUser(response.data)
//       } catch (error) {
//         console.error("Error fetching user", error)
//       }
//     }

//     fetchUser()
//   }, [setUser])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     setUser(null)
//     navigate("/login")
//   }

//   const handleNavigate = (path) => {
//     navigate(path)
//   }

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-gray-700 px-4 py-4 text-white flex justify-between items-center shadow-lg">
//   {/* Left Section */}
//   <div className="flex items-center space-x-4">
//     {user && (
//       <span className="text-white font-medium text-base flex items-center">
//         <span role="img" aria-label="waving hand" className="mr-1">👋</span>
//         Hi, {user.name}
//       </span>
//     )}
//     <input
//       type="text"
//       placeholder="Search..."
//       className="bg-white border border-indigo-400 text-indigo-900 py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
//     />
//   </div>

//   {/* Right Section */}
//   <div className="flex space-x-7 items-center text-base">
//     <button onClick={() => handleNavigate("/home")} className="hover:text-indigo-300 font-semibold">Home</button>
//     <button onClick={() => handleNavigate("/connect")} className="hover:text-indigo-300 font-semibold">Connect People</button>
//     <button onClick={() => handleNavigate("/about")} className="hover:text-indigo-300 font-semibold">About Us</button>
//     <button onClick={() => handleNavigate("/profile")} className="hover:text-indigo-300 font-semibold">Profile</button>
//     <button onClick={() => handleNavigate("/contact")} className="hover:text-indigo-300 font-semibold">Contact</button>
//     <button onClick={() => handleNavigate("/chatbot")} className="hover:text-indigo-300 font-semibold">Help</button>
//     {user && (
//       <button
//         onClick={handleLogout}
//         className="bg-indigo-800 text-white font-semibold px-4 py-1 rounded-full hover:bg-indigo-900 transition-colors shadow"
//       >
//         Logout
//       </button>
//     )}
//   </div>
// </nav>
//   )
// }

// export default Navbar 

// abhi wala tha ye *****************************************************************************
// "use client"

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"

// const Navbar = () => {
//   const navigate = useNavigate()
//   const { user, setUser } = useUser()

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) return

//         const response = await axios.get("http://localhost:5005/api/user", {
//           headers: { Authorization: token },
//         })
//         setUser(response.data)
//       } catch (error) {
//         console.error("Error fetching user", error)
//       }
//     }

//     fetchUser()
//   }, [setUser])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     setUser(null)
//     navigate("/login")
//   }

//   const handleNavigate = (path) => {
//     navigate(path)
//   }

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-gray-700 px-4 py-4 text-white flex justify-between items-center shadow-lg">
//       {/* Left Section */}
//       <div className="flex items-center space-x-4">
//         {user && (
//           <span className="text-white font-medium text-base flex items-center">
//             <span role="img" aria-label="waving hand" className="mr-1">
//               👋
//             </span>
//             Hi, {user.name}
//           </span>
//         )}
//         <input
//           type="text"
//           placeholder="Search..."
//           className="bg-white border border-indigo-400 text-indigo-900 py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
//         />
//       </div>

//       {/* Right Section */}
//       <div className="flex space-x-7 items-center text-base">
//         <button onClick={() => handleNavigate("/home")} className="hover:text-indigo-300 font-semibold">
//           Home
//         </button>
//         <button onClick={() => handleNavigate("/connect")} className="hover:text-indigo-300 font-semibold">
//           Connect People
//         </button>
//         <button onClick={() => handleNavigate("/about")} className="hover:text-indigo-300 font-semibold">
//           About Us
//         </button>
//         <button onClick={() => handleNavigate("/profile")} className="hover:text-indigo-300 font-semibold">
//           Profile
//         </button>
//         <button onClick={() => handleNavigate("/contact")} className="hover:text-indigo-300 font-semibold">
//           Contact
//         </button>
//         <button onClick={() => handleNavigate("/chatbot")} className="hover:text-indigo-300 font-semibold">
//           Help
//         </button>
//         {user && (
//           <button
//             onClick={handleLogout}
//             className="bg-indigo-800 text-white font-semibold px-4 py-1 rounded-full hover:bg-indigo-900 transition-colors shadow"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar

// yaha tak *****************************


// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"

// const Navbar = () => {
//   const navigate = useNavigate()
//   const { user, setUser } = useUser()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           setLoading(false)
//           return
//         }

//         // Try to get the current user from the token
//         // This uses the existing endpoint structure without requiring backend changes
//         const response = await axios.get("http://localhost:5005/api/users/current", {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (response.data && response.data.success) {
//           setUser(response.data)
//         }
//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching user", error)
//         // If the specific endpoint fails, try to use the user data from localStorage as fallback
//         try {
//           const userData = JSON.parse(localStorage.getItem("userData"))
//           if (userData) {
//             setUser(userData)
//           }
//         } catch (e) {
//           console.error("No cached user data available", e)
//         }
//         setLoading(false)
//       }
//     }

//     fetchUser()
//   }, [setUser])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("userData") // Also clear cached user data
//     setUser(null)
//     navigate("/login")
//   }

//   const handleNavigate = (path) => {
//     navigate(path)
//   }

//   return (
//     <nav className="bg-gray-700 p-4 text-white flex justify-between items-center shadow-lg">
//       {/* Left Section: User Greeting and Search Bar */}
//       <div className="flex items-center space-x-4">
//         {user && (
//           <span className="text-white font-medium text-lg flex items-center">
//             <span role="img" aria-label="waving hand" className="mr-2">
//               👋
//             </span>
//             Hi, {user.name}
//           </span>
//         )}
//         <input
//           type="text"
//           placeholder="Search..."
//           className="bg-white border-2 border-indigo-400 text-indigo-900 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       {/* Right Section: Navigation Links */}
//       <div className="flex space-x-6 items-center">
//         <button
//           onClick={() => handleNavigate("/home")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           Home
//         </button>
//         <button
//           onClick={() => handleNavigate("/connect")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           Connect People
//         </button>
//         <button
//           onClick={() => handleNavigate("/about")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           About Us
//         </button>
//         <button
//           onClick={() => handleNavigate("/profile")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           Profile
//         </button>
//         <button
//           onClick={() => handleNavigate("/contact")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           Contact
//         </button>
//         <button
//           onClick={() => handleNavigate("/chatbot")}
//           className="hover:text-indigo-300 text-white font-semibold transition-colors"
//         >
//           Help
//         </button>

//         {/* Logout Button: Darker with boldness */}
//         {user && (
//           <button
//             onClick={handleLogout}
//             className="bg-indigo-800 text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-900 transition-colors shadow-md"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar
"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "../contexts/UserContext"

// Heroicons
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  UserCircleIcon,
  PhoneIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline"

const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUser()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("http://localhost:5005/api/user", {
          headers: { Authorization: token },
        })
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user", error)
      }
    }

    fetchUser()
  }, [setUser])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 px-5 py-4 mb-2 text-white flex justify-between items-center shadow-md" style={{ zIndex: 10 }}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-white font-medium text-base flex items-center gap-1">
            👋 Hi, {user.name}
          </span>
        )}
        <input
          type="text"
          placeholder="Search..."
          className="bg-white border border-indigo-400 text-indigo-900 py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex space-x-6 items-center text-sm font-semibold">
        <button onClick={() => handleNavigate("/home")} className="flex items-center gap-1 hover:text-indigo-300">
          <HomeIcon className="w-5 h-5" />
          Home
        </button>
        <button onClick={() => handleNavigate("/connect")} className="flex items-center gap-1 hover:text-indigo-300">
          <UserGroupIcon className="w-5 h-5" />
          Connect People
        </button>
        <button onClick={() => handleNavigate("/messages")} className="flex items-center gap-1 hover:text-indigo-300">
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
          Messaging
        </button>
        {/* New Jobs Button */}
        <button onClick={() => handleNavigate("/jobs")} className="flex items-center gap-1 hover:text-indigo-300">
          <BriefcaseIcon className="w-5 h-5" />
          Jobs
        </button>
        {/* New Events Button */}
        <button onClick={() => handleNavigate("/events")} className="flex items-center gap-1 hover:text-indigo-300">
          <CalendarIcon className="w-5 h-5" />
          Events
        </button>
        <button onClick={() => handleNavigate("/about")} className="flex items-center gap-1 hover:text-indigo-300">
          <InformationCircleIcon className="w-5 h-5" />
          About Us
        </button>
        <button onClick={() => handleNavigate("/profile")} className="flex items-center gap-1 hover:text-indigo-300">
          <UserCircleIcon className="w-5 h-5" />
          Profile
        </button>
        <button onClick={() => handleNavigate("/contact")} className="flex items-center gap-1 hover:text-indigo-300">
          <PhoneIcon className="w-5 h-5" />
          Contact
        </button>
        <button onClick={() => handleNavigate("/chatbot")} className="flex items-center gap-1 hover:text-indigo-300">
          <LifebuoyIcon className="w-5 h-5" />
          Help
        </button>
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 transition px-5 py-2 rounded-full shadow"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar