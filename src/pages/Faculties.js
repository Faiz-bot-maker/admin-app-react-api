import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ faculty_code: "", faculty_name: "" });
  const [editId, setEditId] = useState(null);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/faculties");
      setFaculties(res.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data fakultas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/faculties/${editId}`, form);
      } else {
        await axios.post("/api/faculties", form);
      }
      setShowModal(false);
      setForm({ faculty_code: "", faculty_name: "" });
      setEditId(null);
      fetchFaculties();
    } catch (err) {
      setError("Gagal menyimpan data fakultas");
    }
  };

  const handleEdit = (faculty) => {
    setForm({ faculty_code: faculty.faculty_code, faculty_name: faculty.faculty_name });
    setEditId(faculty.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus fakultas ini?")) return;
    try {
      await axios.delete(`/api/faculties/${id}`);
      fetchFaculties();
    } catch (err) {
      setError("Gagal menghapus fakultas");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fakultas</h1>
        <button 
          onClick={() => { setShowModal(true); setForm({ faculty_code: "", faculty_name: "" }); setEditId(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Fakultas
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Fakultas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Fakultas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faculties.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{faculty.faculty_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.faculty_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleEdit(faculty)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(faculty.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal Tambah/Edit Fakultas */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{editId ? "Edit Fakultas" : "Tambah Fakultas"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Kode Fakultas</label>
                  <input type="text" name="faculty_code" value={form.faculty_code} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama Fakultas</label>
                  <input type="text" name="faculty_name" value={form.faculty_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
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