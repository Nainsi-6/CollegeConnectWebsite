"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

// Create a Context for the user
const UserContext = createContext()

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext)

// Provider component to wrap around parts of the app that need access to user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user data exists in localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setLoading(false)
          return
        }

        // If no stored user but token exists, fetch user data
        const token = localStorage.getItem("token")
        if (token) {
          const response = await axios.get("http://localhost:5005/api/profiles/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.data && response.data.profile) {
            const userData = {
              ...response.data.profile,
              token,
            }
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return <UserContext.Provider value={{ user, setUser, loading, logout }}>{children}</UserContext.Provider>
}


// "use client"


// import { createContext, useContext, useState } from "react"
// import type { User } from "../types"

// interface UserContextType {
//   user: User | null
//   setUser: React.Dispatch<React.SetStateAction<User | null>>
// }

// const UserContext = createContext<UserContextType | undefined>(undefined)

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null)

//   return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
// }

// export const useUser = () => {
//   const context = useContext(UserContext)
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider")
//   }
//   return context
// }

// "use client"

// import { createContext, useState, useContext } from "react"

// const UserContext = createContext()

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null)

//   return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
// }

// export const useUser = () => {
//   return useContext(UserContext)

