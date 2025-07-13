import axios from "axios";
import { useEffect, useState } from "react";

export default function Courses() {
  const [ courses, setCourses ] = useState( [] );
  const [ lecturers, setLecturers ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { code: "", name: "", sks: 0, semester: 0, lecturer_nidn: 0 } );
  const [ editId, setEditId ] = useState( null );

  const fetchData = async () => {
    setLoading( true );
    try {
      const [ coursesRes, lecturerRes ] = await Promise.all( [
        axios.get( "http://localhost:9090/api/v1/admin/courses", {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/lecturers", {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } ),
      ] );
      setCourses( coursesRes.data.data );
      setLecturers( lecturerRes.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data program mata kuliah" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  const handleChange = ( e ) => {

    const { name, value } = e.target;

    console.log( name, value )

    // Konversi nilai menjadi number jika nama input adalah "faculty_id"
    const newValue = name !== 'code' || name !== 'name' ? Number( value ) : value;

    setForm( { ...form, [ name ]: newValue } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/courses/${editId}`, form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/courses", form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { code: "", name: "", sks: 0, semester: 0, lecturer_nidn: 0 } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data mata kuliah" );
    }
  };

  const handleEdit = ( course ) => {

    setForm( { code: course.code, name: course.name, sks: course.sks, semester: course.semester, lecturer_nidn: course.lecturer_nidn } );
    setEditId( course.code );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus mata kuliah ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/courses/${id}`, {
        headers: {
          'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
          'Content-Type': 'application/json'
        }
      } );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus mata kuliah" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mata Kuliah</h1>
        <button
          onClick={ () => { setShowModal( true ); setForm( { code: "", name: "", sks: 0, semester: 0, lecturer_nidn: 0 } ); setEditId( null ); } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Mata Kuliah
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
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { courses.map( ( course ) => (
                  <tr key={ course.code } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      { course.code }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { course.name }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { course.sks }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { course.semester }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ lecturers.find( f => f.nidn === course.lecturer_nidn )?.name || "-" }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( course ) }>
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( course.code ) }>
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
      {/* Modal Tambah Mata Kuliah */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Mata Kuliah</h3>
              <form onSubmit={ handleSubmit }>

                { editId == null ? (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Kode</label>
                    <input type="text" name="code" value={ form.code } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                  </div>
                ) : "" }

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                  <input type="text" name="name" value={ form.name } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">SKS</label>
                  <input type="text" name="sks" value={ form.sks } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
                  <input type="text" name="semester" value={ form.semester } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Dosen</label>
                  <select name="lecturer_nidn" value={ form.lecturer_nidn } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Dosen</option>
                    { lecturers.map( f => (
                      <option key={ f.nidn } value={ f.nidn }>{ f.name }</option>
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