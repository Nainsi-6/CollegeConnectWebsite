// A simple script to check if the server is running and accessible
const http = require("http")

const PORT = process.env.PORT || 5005
const options = {
  hostname: "localhost",
  port: PORT,
  path: "/api/test",
  method: "GET",
  timeout: 3000,
}

console.log(`Checking if server is running at http://localhost:${PORT}/api/test...`)

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)

  let data = ""
  res.on("data", (chunk) => {
    data += chunk
  })

  res.on("end", () => {
    console.log("RESPONSE:", data)
    console.log("✅ Server is running and accessible!")
  })
})

req.on("error", (error) => {
  console.error("❌ Server is not accessible:", error.message)
  console.log("\nPossible reasons:")
  console.log("1. The server is not running")
  console.log("2. The server is running on a different port")
  console.log("3. There's a firewall blocking the connection")
  console.log("4. The server is not listening on localhost")

  console.log("\nTroubleshooting steps:")
  console.log("1. Make sure the server is running with 'npm start' or 'node server.js'")
  console.log("2. Check if the PORT in .env matches the port in your frontend API_BASE_URL")
  console.log("3. Try running the server with 'node server.js' to see any startup errors")
  console.log("4. Check if another process is using port", PORT)
})

req.on("timeout", () => {
  console.error("❌ Request timed out")
  req.destroy()
})

req.end()
