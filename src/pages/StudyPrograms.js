import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudyPrograms() {
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ study_program_code: "", study_program_name: "", faculty_id: "" });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, facultiesRes] = await Promise.all([
        axios.get("/api/study-programs"),
        axios.get("/api/faculties")
      ]);
      setStudyPrograms(programsRes.data);
      setFaculties(facultiesRes.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data program studi/fakultas");
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
        await axios.put(`/api/study-programs/${editId}`, form);
      } else {
        await axios.post("/api/study-programs", form);
      }
      setShowModal(false);
      setForm({ study_program_code: "", study_program_name: "", faculty_id: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      setError("Gagal menyimpan data program studi");
    }
  };

  const handleEdit = (program) => {
    setForm({ study_program_code: program.study_program_code, study_program_name: program.study_program_name, faculty_id: program.faculty_id });
    setEditId(program.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus program studi ini?")) return;
    try {
      await axios.delete(`/api/study-programs/${id}`);
      fetchData();
    } catch (err) {
      setError("Gagal menghapus program studi");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Studi</h1>
        <button 
          onClick={() => { setShowModal(true); setForm({ study_program_code: "", study_program_name: "", faculty_id: "" }); setEditId(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Program Studi
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Program Studi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fakultas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studyPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.study_program_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.study_program_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculties.find(f => f.id === program.faculty_id)?.faculty_name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleEdit(program)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(program.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal Tambah/Edit Program Studi */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{editId ? "Edit Program Studi" : "Tambah Program Studi"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Kode Program Studi</label>
                  <input type="text" name="study_program_code" value={form.study_program_code} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama Program Studi</label>
                  <input type="text" name="study_program_name" value={form.study_program_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fakultas</label>
                  <select name="faculty_id" value={form.faculty_id} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Fakultas</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.faculty_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Batal</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 