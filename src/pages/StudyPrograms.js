import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthProvider";

export default function StudyPrograms() {
  const { user } = useAuth();
  const [ studyPrograms, setStudyPrograms ] = useState( [] );
  const [ faculties, setFaculties ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { name: "", faculty_id: 0, level: "", accreditation: "", duration_semester: "" } );
  const [ editId, setEditId ] = useState( null );

  const fetchData = async () => {
    setLoading( true );
    try {
      const [ programsRes, facultiesRes ] = await Promise.all( [
        axios.get( "http://localhost:9090/api/v1/admin/study-programs", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/faculties", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } )
      ] );
      setStudyPrograms( programsRes.data.data );
      setFaculties( facultiesRes.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data program studi/fakultas" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  const handleChange = ( e ) => {

    const { name, value } = e.target;

    // Konversi nilai menjadi number jika nama input adalah "faculty_id"
    const newValue = name === 'faculty_id' || name === 'duration_semester' ? Number( value ) : value;

    setForm( { ...form, [ name ]: newValue } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/study-programs/${editId}`, form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/study-programs", form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { name: "", faculty_id: 0, level: "", accreditation: "", duration_semester: "" } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data program studi" );
    }
  };

  const handleEdit = ( program ) => {

    setForm( { name: program.name, faculty_id: parseInt( program.faculty_id ), level: program.level, accreditation: program.accreditation, duration_semester: program.duration_semester } );
    setEditId( program.id );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus program studi ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/study-programs/${id}`, {
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        }
      } );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus program studi" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Studi</h1>
        <button
          onClick={ () => { setShowModal( true ); setForm( { name: "", faculty_id: 0, level: "", accreditation: "", duration_semester: "" } ); setEditId( null ); } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Program Studi
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fakultas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akreditasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { studyPrograms.map( ( program ) => (
                  <tr key={ program.id } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ program.name }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ faculties.find( f => f.id === program.faculty_id )?.name || "-" }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ program.level }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ program.accreditation }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ program.duration_semester }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( program ) }>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( program.id ) }>Hapus</button>
                    </td>
                  </tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }
      {/* Modal Tambah/Edit Program Studi */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{ editId ? "Edit Program Studi" : "Tambah Program Studi" }</h3>
              <form onSubmit={ handleSubmit }>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                  <input type="text" name="name" value={ form.name } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fakultas</label>
                  <select name="faculty_id" value={ form.faculty_id } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Pilih Fakultas</option>
                    { faculties.map( f => (
                      <option key={ f.id } value={ f.id }>{ f.name }</option>
                    ) ) }
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Level</label>
                  <input type="text" name="level" value={ form.level } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Akreditasi</label>
                  <input type="text" name="accreditation" value={ form.accreditation } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah semester</label>
                  <input type="text" name="duration_semester" value={ form.duration_semester } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={ () => setShowModal( false ) } className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Batal</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
} 