# 🎓 CollabSphere – Campus Engagement Network

CollabSphere is a full-stack campus engagement platform designed to connect **students, alumni, and faculty** within a single ecosystem.  
The platform focuses on collaboration, communication, and career discovery inside a college community.

It supports social networking features, real-time interaction, and a job discovery system built using web scraping and basic NLP techniques.

🔗 **Live Demo:** https://collegeconnectt.onrender.com/  
🔗 **GitHub Repository:** https://github.com/Nainsi-6/CollegeConnectWebsite  

---

## ✨ Features

- User authentication with role-based access (Student / Alumni / Faculty)
- Profile creation and connection requests
- Real-time chat and notifications
- Create posts with likes, comments, and reactions
- Media uploads (profile photos, posts)
- Job discovery module using web scraping and NLP
- RESTful APIs with optimized MongoDB queries
- Responsive UI for desktop and mobile devices

---

## 🧠 Job Discovery & NLP

CollabSphere includes a job discovery feature that:
- Scrapes job listings using **Puppeteer** and **Cheerio**
- Processes job descriptions using basic **NLP techniques**
- Matches listings with user profiles for better relevance
- Updates job data regularly to keep listings current

This allows users to explore opportunities directly within the platform.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB

### Tools & Libraries
- Puppeteer, Cheerio (Web Scraping)
- Natural (NLP)
- JWT Authentication
- Multer (File Uploads)

---

## 📁 Project Structure

``` bash
CollegeConnectWebsite/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── uploads/
│ └── server.js
│
├── src/
│ ├── components/
│ ├── api/
│ ├── pages/
│ └── App.jsx
│
├── public/
├── package.json
└── README.md
```

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nainsi-6/CollegeConnectWebsite.git
cd CollegeConnectWebsite
2️⃣ Install Dependencies
Frontend
npm install
Backend
cd backend
npm install
3️⃣ Environment Variables
Create a .env file inside the backend folder:

bash
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
4️⃣ Run the Application
Start Backend Server
cd backend
npm start
Start Frontend
bash
Copy code
npm run dev
The application will be available at:

arduino
Copy code
http://localhost:5173
🚀 Future Enhancements
Advanced job and connection recommendations

Real-time notifications using WebSockets

Improved NLP-based job matching

Role-based analytics dashboard

👩‍💻 Author
Nainsi Gupta
📧 Email: nainsigupta438@gmail.com
🔗 GitHub: https://github.com/Nainsi-6
🔗 LinkedIn: https://www.linkedin.com/in/nainsi-gupta-2015a0250/

```
