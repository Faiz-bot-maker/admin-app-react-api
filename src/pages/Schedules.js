import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";

export default function Schedules() {
  const { user } = useAuth();

  const now = new Date();

  const [ schedules, setSchedules ] = useState( [] );
  const [ lecturers, setLecturers ] = useState( [] );
  const [ classrooms, setClassrooms ] = useState( [] );
  const [ courses, setCourses ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { date: now, start_at: now.getHours, end_at: now.getHours, course_code: 0, lecturer_nidn: 0, classroom_id: 0 } );
  const [ editId, setEditId ] = useState( null );

  const fetchData = async () => {
    setLoading( true );
    try {
      const [ schedulesRes, lecturersRes, classroomsRes, coursesRes ] = await Promise.all( [
        axios.get( "http://localhost:9090/api/v1/admin/schedules", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/lecturers", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/classrooms", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } ),
        axios.get( "http://localhost:9090/api/v1/admin/courses", {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } )
      ] );
      setSchedules( schedulesRes.data.data );
      setLecturers( lecturersRes.data.data );
      setClassrooms( classroomsRes.data.data );
      setCourses( coursesRes.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data program jadwal" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  const handleChange = ( e ) => {

    const { name, value } = e.target;

    // // Konversi nilai menjadi number jika nama input adalah "faculty_id"
    const newValue = name === 'lecturer_nidn' || name === 'classroom_id' ? Number( value ) : value;

    setForm( { ...form, [ name ]: newValue } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      form.date = `${form.date}T00:00:00+07:00`
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/schedules/${editId}`, form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/schedules", form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { date: now.toISOString().split( 'T' )[ 0 ], start_at: now.toISOString().split( 'T' )[ 1 ].substring( 0, 5 ), end_at: now.toISOString().split( 'T' )[ 1 ].substring( 0, 5 ), course_code: 0, lecturer_nidn: 0, classroom_id: 0 } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data jadwal" );
    }
  };

  const handleEdit = ( schedule ) => {

    setForm( { date: new Date( schedule.date ).toISOString().split( 'T' )[ 0 ], start_at: schedule.start_at, end_at: schedule.end_at, course_code: schedule.course_code, lecturer_nidn: schedule.lecturer_nidn, classroom_id: schedule.classroom_id } );
    setEditId( schedule.id );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus jadwal ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/schedules/${id}`, {
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        }
      } );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus jadwal" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jadwal Kuliah</h1>
        <button
          onClick={ () => { setShowModal( true ); setForm( { date: now.toISOString().split( 'T' )[ 0 ], start_at: now.toISOString().split( 'T' )[ 1 ].substring( 0, 5 ), end_at: now.toISOString().split( 'T' )[ 1 ].substring( 0, 5 ), course_code: 0, lecturer_nidn: 0, classroom_id: 0 } ); setEditId( null ); } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Jadwal
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
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Kuliah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { schedules.map( ( schedule ) => (
                  <tr key={ schedule.id } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { new Date( schedule.date ).toLocaleDateString( "id-ID", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' } ) }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { schedule.start_at } - { schedule.end_at }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      { courses.find( f => f.code === schedule.course_code )?.name || "-" }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { lecturers.find( f => f.nidn === schedule.lecturer_nidn )?.name || "-" }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { classrooms.find( f => f.id === schedule.classroom_id )?.name || "-" }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( schedule ) }>
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( schedule.id ) }>
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

      {/* Modal Tambah Jadwal */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{ editId ? "Edit Jadwal" : "Tambah Jadwal" }</h3>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal
                  </label>
                  <input
                    name="date"
                    value={ form.date }
                    onChange={ handleChange }
                    type="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Waktu Mulai
                  </label>
                  <input
                    name="start_at"
                    value={ form.start_at }
                    onChange={ handleChange }
                    type="time"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Waktu Selesai
                  </label>
                  <input
                    name="end_at"
                    value={ form.end_at }
                    onChange={ handleChange }
                    type="time"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mata Kuliah
                  </label>
                  <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="course_code"
                    value={ form.course_code }
                    onChange={ handleChange }
                  >
                    <option value="">Pilih Matakuliah</option>
                    { courses.map( f => (
                      <option key={ f.code } value={ f.code }>{ f.name }</option>
                    ) ) }
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dosen
                  </label>
                  <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="lecturer_nidn"
                    value={ form.lecturer_nidn }
                    onChange={ handleChange }
                  >
                    <option value="">Pilih Dosen</option>
                    { lecturers.map( f => (
                      <option key={ f.nidn } value={ f.nidn }>{ f.name }</option>
                    ) ) }
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kelas
                  </label>
                  <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="classroom_id"
                    value={ form.classroom_id }
                    onChange={ handleChange }
                  >
                    <option value="">Pilih Kelas</option>
                    { classrooms.map( f => (
                      <option key={ f.id } value={ f.id }>{ f.name }</option>
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