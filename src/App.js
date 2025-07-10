import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Faculties from "./pages/Faculties";
import StudyPrograms from "./pages/StudyPrograms";
import Students from "./pages/Students";
import Lecturers from "./pages/Lecturers";
import Courses from "./pages/Courses";
import Classrooms from "./pages/Classrooms";
import Schedules from "./pages/Schedules";
import Attendances from "./pages/Attendances";
import Grades from "./pages/Grades";
import Enrollments from "./pages/Enrollments";
import Announcements from "./pages/Announcements";
import Logs from "./pages/Logs";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Navigate to="/dashboard" replace />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Dashboard />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Users />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/faculties" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Faculties />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/study-programs" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <StudyPrograms />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/students" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Students />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/lecturers" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Lecturers />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/courses" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Courses />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/classrooms" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Classrooms />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/schedules" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Schedules />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/attendances" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Attendances />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/grades" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Grades />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/enrollments" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Enrollments />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/announcements" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Announcements />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/logs" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                      <Logs />
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
