import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Attendances() {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    student_id: "", 
    schedule_id: "", 
    absence_date: "", 
    status: "", 
    description: "" 
  });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attendancesRes, studentsRes, schedulesRes] = await Promise.all([
        axios.get("/api/attendances"),
        axios.get("/api/students"),
        axios.get("/api/schedules")
      ]);
      setAttendances(attendancesRes.data);
      setStudents(studentsRes.data);
      setSchedules(schedulesRes.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data kehadiran");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/attendances/${editId}`, form);
      } else {
        await axios.post("/api/attendances", form);
      }
      setShowModal(false);
      setForm({ student_id: "", schedule_id: "", absence_date: "", status: "", description: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      setError("Gagal menyimpan data kehadiran");
    }
  };

  const handleEdit = (attendance) => {
    setForm({
      student_id: attendance.student_id,
      schedule_id: attendance.schedule_id,
      absence_date: attendance.absence_date,
      status: attendance.status,
      description: attendance.description || ""
    });
    setEditId(attendance.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data kehadiran ini?")) return;
    try {
      await axios.delete(`/api/attendances/${id}`);
      fetchData();
    } catch (err) {
      setError("Gagal menghapus data kehadiran");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kehadiran</h1>
        <button 
          onClick={() => { 
            setShowModal(true); 
            setForm({ student_id: "", schedule_id: "", absence_date: "", status: "", description: "" }); 
            setEditId(null); 
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Kehadiran
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahasiswa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {students.find(s => s.id === attendance.student_id)?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedules.find(s => s.id === attendance.schedule_id)?.course_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.absence_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        attendance.status === 'hadir' ? 'bg-green-100 text-green-800' :
                        attendance.status === 'sakit' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleEdit(attendance)}>
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(attendance.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal Tambah/Edit Kehadiran */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editId ? "Edit Kehadiran" : "Tambah Kehadiran"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Mahasiswa</label>
                  <select name="student_id" value={form.student_id} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Mahasiswa</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name} - {student.nim}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Jadwal</label>
                  <select name="schedule_id" value={form.schedule_id} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Jadwal</option>
                    {schedules.map(schedule => (
                      <option key={schedule.id} value={schedule.id}>{schedule.course_name} - {schedule.day}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal</label>
                  <input type="date" name="absence_date" value={form.absence_date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Status</option>
                    <option value="hadir">Hadir</option>
                    <option value="sakit">Sakit</option>
                    <option value="izin">Izin</option>
                    <option value="alpha">Alpha</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Keterangan</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3" placeholder="Keterangan (opsional)"></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Batal
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 