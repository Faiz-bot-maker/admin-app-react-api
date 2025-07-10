import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    enrollment_id: "", 
    nilai_akhir: "", 
    grade_letter: "" 
  });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gradesRes, enrollmentsRes] = await Promise.all([
        axios.get("/api/grades"),
        axios.get("/api/enrollments")
      ]);
      setGrades(gradesRes.data);
      setEnrollments(enrollmentsRes.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data nilai");
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
        await axios.put(`/api/grades/${editId}`, form);
      } else {
        await axios.post("/api/grades", form);
      }
      setShowModal(false);
      setForm({ enrollment_id: "", nilai_akhir: "", grade_letter: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      setError("Gagal menyimpan data nilai");
    }
  };

  const handleEdit = (grade) => {
    setForm({
      enrollment_id: grade.enrollment_id,
      nilai_akhir: grade.nilai_akhir,
      grade_letter: grade.grade_letter
    });
    setEditId(grade.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data nilai ini?")) return;
    try {
      await axios.delete(`/api/grades/${id}`);
      fetchData();
    } catch (err) {
      setError("Gagal menghapus data nilai");
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 85) return "bg-green-100 text-green-800";
    if (grade >= 75) return "bg-blue-100 text-blue-800";
    if (grade >= 65) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nilai</h1>
        <button 
          onClick={() => { 
            setShowModal(true); 
            setForm({ enrollment_id: "", nilai_akhir: "", grade_letter: "" }); 
            setEditId(null); 
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Nilai
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Akhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((grade) => {
                  const enrollment = enrollments.find(e => e.id === grade.enrollment_id);
                  return (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment?.student_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment?.course_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.nilai_akhir}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded text-xs ${getGradeColor(grade.nilai_akhir)}`}>
                          {grade.grade_letter}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleEdit(grade)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(grade.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal Tambah/Edit Nilai */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editId ? "Edit Nilai" : "Tambah Nilai"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Enrollment</label>
                  <select name="enrollment_id" value={form.enrollment_id} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Enrollment</option>
                    {enrollments.map(enrollment => (
                      <option key={enrollment.id} value={enrollment.id}>
                        {enrollment.student_name} - {enrollment.course_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nilai Akhir</label>
                  <input type="number" name="nilai_akhir" value={form.nilai_akhir} onChange={handleChange} min="0" max="100" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Grade Letter</label>
                  <select name="grade_letter" value={form.grade_letter} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Grade</option>
                    <option value="A">A (85-100)</option>
                    <option value="B">B (75-84)</option>
                    <option value="C">C (65-74)</option>
                    <option value="D">D (50-64)</option>
                    <option value="E">E (0-49)</option>
                  </select>
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