import { useEffect, useState } from "react";
import axios from "axios";

export default function Students() {
  const [ students, setStudents ] = useState( [] );
  const [ studyPrograms, setStudyPrograms ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( {
    username: "",
    password: "",
    npm: 0,
    class: "",
    registration_wave: "",
    registration_date: "",
    name: "",
    date_birth: "",
    address: "",
    gender: "",
    study_program_id: 0,
  } );
  const [ editId, setEditId ] = useState( null );

  // Fetch data students and study programs
  const fetchData = async () => {
    setLoading( true );
    try {
      const [ studentsRes, studyProgramsRes ] = await Promise.all( [
        axios.get( "http://localhost:9090/api/v1/admin/students", {
          headers: {
            Authorization: "e7c731d3-811c-4ab8-a4d9-5a62623b57bb",
            "Content-Type": "application/json",
          },
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/study-programs", {
          headers: {
            Authorization: "e7c731d3-811c-4ab8-a4d9-5a62623b57bb",
            "Content-Type": "application/json",
          },
        } ),
      ] );
      setStudents( studentsRes.data.data );
      setStudyPrograms( studyProgramsRes.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data mahasiswa/program studi" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  // Handle input changes
  const handleChange = ( e ) => {
    const { name, value } = e.target;
    const newValue =
      name === "npm" || name === "study_program_id" ? Number( value ) : value;
    setForm( { ...form, [ name ]: newValue } );
  };

  // Format tanggal dengan zona waktu +07:00
  const formatDateWithTimeZone = ( dateString ) => {
    if ( !dateString ) return "";
    const date = new Date( dateString );
    const offset = "+07:00"; // Zona waktu tetap
    return `${date.toISOString().split( "T" )[ 0 ]}T00:00:00${offset}`;
  };

  // Handle form submission (create or update)
  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      const formattedForm = {
        ...form,
        registration_date: formatDateWithTimeZone( form.registration_date ),
        date_birth: formatDateWithTimeZone( form.date_birth ),
      };

      if ( editId ) {
        await axios.put(
          `http://localhost:9090/api/v1/admin/students/${editId}`,
          formattedForm,
          {
            headers: {
              Authorization: "e7c731d3-811c-4ab8-a4d9-5a62623b57bb",
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:9090/api/v1/admin/students",
          formattedForm,
          {
            headers: {
              Authorization: "e7c731d3-811c-4ab8-a4d9-5a62623b57bb",
              "Content-Type": "application/json",
            },
          }
        );
      }

      setShowModal( false );
      setForm( {
        username: "",
        password: "",
        npm: 0,
        class: "",
        registration_wave: "",
        registration_date: "",
        name: "",
        date_birth: "",
        address: "",
        gender: "",
        study_program_id: 0,
      } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data mahasiswa" );
    }
  };

  // Handle edit action
  const handleEdit = ( student ) => {
    // Parse data dari API agar sesuai dengan form
    setForm( {
      username: student.username,
      password: "", // Password tidak ditampilkan saat edit
      npm: student.npm,
      class: student.class,
      registration_wave: student.registration_wave.toString(),
      registration_date: student.registration_date.split( "T" )[ 0 ], // Hanya tanggal
      name: student.name,
      date_birth: student.date_birth.split( "T" )[ 0 ], // Hanya tanggal
      address: student.address,
      gender: student.gender,
      study_program_id: student.study_program_id,
    } );
    setEditId( student.npm );
    setShowModal( true );
  };

  // Handle delete action
  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus mahasiswa ini?" ) ) return;
    try {
      await axios.delete(
        `http://localhost:9090/api/v1/admin/students/${id}`,
        {
          headers: {
            Authorization: "e7c731d3-811c-4ab8-a4d9-5a62623b57bb",
            "Content-Type": "application/json",
          },
        }
      );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus mahasiswa" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mahasiswa</h1>
        <button
          onClick={ () => {
            setShowModal( true );
            setForm( {
              username: "",
              password: "",
              npm: 0,
              class: "",
              registration_wave: "",
              registration_date: "",
              name: "",
              date_birth: "",
              address: "",
              gender: "",
              study_program_id: 0,
            } );
            setEditId( null );
          } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Mahasiswa
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
                    NPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program Studi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { students.map( ( student ) => (
                  <tr key={ student.npm } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { student.username }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { student.npm }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { student.name }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { studyPrograms.find( ( sp ) => sp.id === student.study_program_id )?.name || "-" }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { student.gender }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={ () => handleEdit( student ) }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={ () => handleDelete( student.npm ) }
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

      {/* Modal Tambah/Edit Mahasiswa */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                { editId ? "Edit Mahasiswa" : "Tambah Mahasiswa" }
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
                    disabled
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
                    required={ !editId == null } // Required only when creating
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    NPM
                  </label>
                  <input
                    type="number"
                    name="npm"
                    value={ form.npm }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kelas
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={ form.class }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gelombang Pendaftaran
                  </label>
                  <input
                    type="text"
                    name="registration_wave"
                    value={ form.registration_wave }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal Pendaftaran
                  </label>
                  <input
                    type="date"
                    name="registration_date"
                    value={ form.registration_date.split( "T" )[ 0 ] } // Hanya tanggal
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
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
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="date_birth"
                    value={ form.date_birth.split( "T" )[ 0 ] } // Hanya tanggal
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={ form.address }
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
                    Program Studi
                  </label>
                  <select
                    name="study_program_id"
                    value={ form.study_program_id }
                    onChange={ handleChange }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Pilih Program Studi</option>
                    { studyPrograms.map( ( sp ) => (
                      <option key={ sp.id } value={ sp.id }>
                        { sp.name }
                      </option>
                    ) ) }
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