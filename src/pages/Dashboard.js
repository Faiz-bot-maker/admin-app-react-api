import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import axios from "axios";

export default function Dashboard() {

  const { user } = useAuth();
  const [ studentsLen, setStudentsLen ] = useState( 0 );
  const [ lecturersLen, setLecturersLen ] = useState( 0 );
  const [ coursesLen, setCoursesLen ] = useState( 0 );
  const [ facultiesLen, setFacultiesLen ] = useState( 0 );


  const fetchData = async () => {
    try {
      const [ studentsRes, lecturersRes, coursesRes, facultiesRes ] = await Promise.all( [
        axios.get( "http://localhost:9090/api/v1/admin/students", {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/lecturers", {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/courses", {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/faculties", {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        } ),
      ] );
      setStudentsLen( ( studentsRes.data.data ).length );
      setLecturersLen( ( lecturersRes.data.data ).length );
      setCoursesLen( ( coursesRes.data.data ).length );
      setFacultiesLen( ( facultiesRes.data.data ).length );
    } catch ( err ) {

    }
  };

  useEffect( () => {
    fetchData();
  }, [] );


  const stats = [
    {
      title: "Total Mahasiswa",
      value: studentsLen,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600"
    },
    {
      title: "Total Dosen",
      value: lecturersLen,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: "bg-gray-50",
      iconColor: "bg-gray-600"
    },
    {
      title: "Total Mata Kuliah",
      value: coursesLen,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "bg-green-600"
    },
    {
      title: "Total Fakultas",
      value: facultiesLen,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-600"
    }
  ];

  return (
    <div className="content-animate">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di Sistem Akademik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        { stats.map( ( stat, index ) => (
          <div
            key={ index }
            className={ `${stat.bgColor} rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100` }
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{ stat.title }</p>
                <p className="text-3xl font-bold text-gray-800">{ stat.value }</p>
              </div>
              <div className={ `p-3 rounded-lg ${stat.iconColor} text-white shadow-sm` }>
                { stat.icon }
              </div>
            </div>
          </div>
        ) ) }
      </div>

      {/* Quick Actions */ }
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {[
              { text: "Mahasiswa baru mendaftar", time: "2 menit yang lalu", color: "bg-green-100 text-green-800" },
              { text: "Jadwal kuliah diperbarui", time: "15 menit yang lalu", color: "bg-blue-100 text-blue-800" },
              { text: "Nilai semester baru", time: "1 jam yang lalu", color: "bg-purple-100 text-purple-800" },
              { text: "Pengumuman akademik", time: "2 jam yang lalu", color: "bg-orange-100 text-orange-800" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0]}`}></div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistik Cepat</h3>
          <div className="space-y-4">
            {[
              { label: "Kehadiran Hari Ini", value: "87%", progress: 87, color: "bg-green-500" },
              { label: "Mata Kuliah Aktif", value: "24", progress: 80, color: "bg-blue-500" },
              { label: "Tugas Pending", value: "12", progress: 60, color: "bg-yellow-500" },
              { label: "Pengumuman", value: "5", progress: 40, color: "bg-gray-500" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">{stat.label}</span>
                  <span className="text-gray-800 font-bold">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
} 