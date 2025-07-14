import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthProvider";

export default function Lecturers() {

  const { user } = useAuth();

  const [ lecturers, setLecturers ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( {
    username: "",
    password: "",
    nidn: 0,
    name: "",
    gender: "",
    degree: "",
    is_full_time: false,
  } );
  const [ editId, setEditId ] = useState( null );

  // Fetch data lecturers
  const fetchData = async () => {
    setLoading( true );
    try {
      const response = await axios.get( "http://localhost:9090/api/v1/admin/lecturers", {
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        }
      } );
      setLecturers( response.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data dosen" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  // Handle input changes
  const handleChange = ( e ) => {
    const { name, value } = e.target;
    const newValue = name === "nidn" ? Number( value ) : name === "is_full_time" ? Boolean( value ) : value;
    setForm( { ...form, [ name ]: newValue } );
  };

  // Handle form submission (create or update)
  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put(
          `http://localhost:9090/api/v1/admin/lecturers/${editId}`,
          form,
          {
            headers: {
              'Authorization': user.token,

              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:9090/api/v1/admin/lecturers",
          form,
          {
            headers: {
              'Authorization': user.token,

              'Content-Type': 'application/json',
            },
          }
        );
      }
      setShowModal( false );
      setForm( {
        username: "",
        password: "",
        nidn: 0,
        name: "",
        gender: "",
        degree: "",
        is_full_time: false,
      } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data dosen" );
    }
  };

  // Handle edit action
  const handleEdit = ( lecturer ) => {
    setForm( {
      username: lecturer.username,
      password: "", // Password tidak ditampilkan saat edit
      nidn: lecturer.nidn,
      name: lecturer.name,
      gender: lecturer.gender,
      degree: lecturer.degree,
      is_full_time: Boolean( lecturer.is_full_time ),
    } );
    setEditId( lecturer.nidn );
    setShowModal( true );
  };

  // Handle delete action
  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus dosen ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/lecturers/${id}`, {
        headers: {
          'Authorization': user.token,

          'Content-Type': 'application/json',
        },
      } );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus dosen" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dosen</h1>
        <button
          onClick={ () => {
            setShowModal( true );
            setForm( {
              username: "",
              password: "",
              nidn: 0,
              name: "",
              gender: "",
              degree: "",
              is_full_time: false,
            } );
            setEditId( null );
          } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Dosen
        </button>
      </div>

      { loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{ error }</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIDN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gelar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { lecturers.map( ( lecturer ) => (
                  <tr key={ lecturer.nidn } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.username }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.nidn }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.name }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.gender }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.degree }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturer.is_full_time ? "Full Time" : "Part Time" }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={ () => handleEdit( lecturer ) }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={ () => handleDelete( lecturer.nidn ) }
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }

      {/* Modal Tambah/Edit Dosen */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                { editId ? "Edit Dosen" : "Tambah Dosen" }
              </h3>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={ form.username }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={ editId == null ? false : true }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={ form.password }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={ !editId } // Required only when creating
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    NIDN
                  </label>
                  <input
                    type="number"
                    name="nidn"
                    value={ form.nidn }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled={ editId == null ? false : true }

                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={ form.name }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={ form.gender }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Pilih Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gelar
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={ form.degree }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gender
                  </label>
                  <select
                    name="is_full_time"
                    value={ form.is_full_time }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="true">Full time</option>
                    <option value="false">Part time</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={ () => setShowModal( false ) }
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
}