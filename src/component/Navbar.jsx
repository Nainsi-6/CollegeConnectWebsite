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

// // export default Navbar

// // yaha tak *****************************


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
// "use client"

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useUser } from "../contexts/UserContext"

// // Heroicons
// import {
//   HomeIcon,
//   UserGroupIcon,
//   ChatBubbleBottomCenterTextIcon,
//   InformationCircleIcon,
//   UserCircleIcon,
//   PhoneIcon,
//   LifebuoyIcon,
//   ArrowRightOnRectangleIcon,
//   BriefcaseIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline"

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
//     <nav className="fixed top-0 left-0 w-full bg-gray-800 px-5 py-4 mb-2 text-white flex justify-between items-center shadow-md" style={{ zIndex: 10 }}>
//       {/* Left Section */}
//       <div className="flex items-center space-x-4">
//         {user && (
//           <span className="text-white font-medium text-base flex items-center gap-1">
//             👋 Hi, {user.name}
//           </span>
//         )}
//         <input
//           type="text"
//           placeholder="Search..."
//           className="bg-white border border-indigo-400 text-indigo-900 py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//         />
//       </div>

//       {/* Right Section */}
//       <div className="flex space-x-6 items-center text-sm font-semibold">
//         <button onClick={() => handleNavigate("/home")} className="flex items-center gap-1 hover:text-indigo-300">
//           <HomeIcon className="w-5 h-5" />
//           Home
//         </button>
//         <button onClick={() => handleNavigate("/connect")} className="flex items-center gap-1 hover:text-indigo-300">
//           <UserGroupIcon className="w-5 h-5" />
//           Connect People
//         </button>
//         <button onClick={() => handleNavigate("/messages")} className="flex items-center gap-1 hover:text-indigo-300">
//           <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
//           Messaging
//         </button>
//         {/* New Jobs Button */}
//         <button onClick={() => handleNavigate("/jobs")} className="flex items-center gap-1 hover:text-indigo-300">
//           <BriefcaseIcon className="w-5 h-5" />
//           Jobs
//         </button>
//         {/* New Events Button */}
//         <button onClick={() => handleNavigate("/events")} className="flex items-center gap-1 hover:text-indigo-300">
//           <CalendarIcon className="w-5 h-5" />
//           Events
//         </button>
//         <button onClick={() => handleNavigate("/about")} className="flex items-center gap-1 hover:text-indigo-300">
//           <InformationCircleIcon className="w-5 h-5" />
//           About Us
//         </button>
//         <button onClick={() => handleNavigate("/profile")} className="flex items-center gap-1 hover:text-indigo-300">
//           <UserCircleIcon className="w-5 h-5" />
//           Profile
//         </button>
//         <button onClick={() => handleNavigate("/contact")} className="flex items-center gap-1 hover:text-indigo-300">
//           <PhoneIcon className="w-5 h-5" />
//           Contact
//         </button>
//         <button onClick={() => handleNavigate("/chatbot")} className="flex items-center gap-1 hover:text-indigo-300">
//           <LifebuoyIcon className="w-5 h-5" />
//           Help
//         </button>
//         {user && (
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 transition px-5 py-2 rounded-full shadow"
//           >
//             <ArrowRightOnRectangleIcon className="w-5 h-5" />
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar





"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "../contexts/UserContext"
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
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { path: "/home", icon: HomeIcon, label: "Home" },
    { path: "/connect", icon: UserGroupIcon, label: "Connect" },
    { path: "/messages", icon: ChatBubbleBottomCenterTextIcon, label: "Messaging" },
    { path: "/jobs", icon: BriefcaseIcon, label: "Jobs" },
    { path: "/events", icon: CalendarIcon, label: "Events" },
    { path: "/about", icon: InformationCircleIcon, label: "About" },
    { path: "/profile", icon: UserCircleIcon, label: "Profile" },
    { path: "/contact", icon: PhoneIcon, label: "Contact" },
    { path: "/chatbot", icon: LifebuoyIcon, label: "Help" },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-lg z-50">
      <div className="max-w-7xl">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Left Section - Mobile menu button and User Greeting */}
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>

            {/* User greeting */}
            <span className="flex items-center text-white font-medium text-sm sm:text-base max-w-[120px] sm:max-w-[150px] md:max-w-none truncate">
  <span className="mr-1">👋 Hi,</span>
  <span className="truncate text-ellipsis">{user.name?.split(" ")[0] || "User"}</span>
</span>

          </div>

          {/* Desktop Navigation */}
         <div className="hidden md:flex items-center justify-between flex-1 ml-4 mr-2">
            {/* Logo/Brand Section */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">🌐</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mr-9">
                ConnectHub
              </span>
            </div>

            {/* Navigation Items - Centered */}
            <div className="flex items-center space-x-0.5 bg-gray-700/50 rounded-full px-2 py-1.5 backdrop-blur-sm ml-10">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                // Add extra spacing for the last few items (Profile, Contact, Help)
                const isLastFew = index >= 6
                // Add more spacing between the last 3 items
                const needsExtraSpace = index === 6 || index === 7 || index === 8
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 text-sm group relative overflow-hidden ${
                      isLastFew ? 'ml-1' : ''
                    } ${
                      needsExtraSpace && index > 6 ? 'ml-1.5' : ''
                    } ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "hover:bg-gray-600 text-gray-300 hover:text-white hover:scale-105"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-indigo-400"
                    }`} />
                    <span className="hidden lg:inline font-medium whitespace-nowrap">{item.label}</span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                  </button>
                )
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-2 mr-12">
              {user && (
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base border-2 border-indigo-400/30 shadow-lg ml-5">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <span className={user.image ? "hidden" : "block"}>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                  </div>

                  {/* User Info */}
                  <div className="hidden xl:block mr-7">
                    <p className="text-white font-semibold text-sm">
                      {user.name || "User"}
                    </p>
                    <p className="text-indigo-300 text-xs capitalize">
                      {user.role || "Member"}
                    </p>
                  </div>
                </div>
              )}

              {/* Logout button */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 xl:w-5 xl:h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="hidden lg:inline font-medium text-sm">Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile user avatar */}
          <div className="md:hidden">
            {user && (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-1">
            {/* Navigation items */}
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-700 transition-colors text-left text-base"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}

            {/* Logout button */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-red-500 hover:bg-red-600 transition-colors text-left mt-4 text-base"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar