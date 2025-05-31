import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

import Login from './component/Login';
import Signup from './component/Signup';
import HomePage from './component/HomePage';
import AboutUs from './component/AboutUs';
import ContactUs from './component/ContactUs';
import Chatbot from './component/Chatbot';
import ConnectPeople from './pages/ConnectPeople';
import ViewProfile from './component/ViewProfile';
import Event from "./component/Event";
import ProfilePage from "./component/ProfilePage";
import StudentProfile from './component/StudentProfile';
import AlumniProfile from './component/AlumniProfile';
import FacultyProfile from './component/FacultyProfile';
import ProfileView from './component/ProfileView';
import Messages from './pages/Messages';
import Jobs from './pages/Jobs';

import PostDetailPage from './component/PostDetailPage';
import UserPostsPage from './component/UserPostsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/view-profile/:userId" element={<ViewProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/connect" element={<ConnectPeople />} />
          <Route path="/events" element={<Event />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/alumni-profile" element={<AlumniProfile />} />
          <Route path="/faculty-profile" element={<FacultyProfile />} />
          <Route path="/profile/:userId" element={<ProfileView />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* ✅ New Routes for posts */}
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/posts/user/:userId" element={<UserPostsPage />} />
          <Route path="/posts/user" element={<UserPostsPage />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </UserProvider>
  );
};

export default App;
