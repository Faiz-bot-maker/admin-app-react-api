import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthProvider";

export default function Grades() {
  const { user } = useAuth();

  const [ grades, setGrades ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { name: "", weight: "" } );
  const [ editId, setEditId ] = useState( null );

  const fetchData = async () => {
    setLoading( true );
    try {
      const res = await axios.get( "http://localhost:9090/api/v1/admin/grade-components", {
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json'
        }
      } );
      setGrades( res.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data nilai" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  const handleChange = ( e ) => {
    setForm( { ...form, [ e.target.name ]: e.target.value } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/grade-components/${editId}`, form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/grade-components", form, {
          headers: {
            'Authorization': user.token,
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { name: "", weight: "" } );
      setEditId( null );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menyimpan data nilai" );
    }
  };

  const handleEdit = ( grade ) => {
    setForm( { name: grade.name, weight: grade.weight } );
    setEditId( grade.id );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus data nilai ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/grade-components/${id}` );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus data nilai" );
    }
  };

  // const getGradeColor = ( grade ) => {
  //   if ( grade >= 85 ) return "bg-green-100 text-green-800";
  //   if ( grade >= 75 ) return "bg-blue-100 text-blue-800";
  //   if ( grade >= 65 ) return "bg-yellow-100 text-yellow-800";
  //   return "bg-red-100 text-red-800";
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nilai</h1>
        <button
          onClick={ () => {
            setShowModal( true );
            setForm( { name: "", weight: "" } );
            setEditId( null );
          } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Nilai
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beban (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { grades.map( ( grade ) => {
                  return (
                    <tr key={ grade.id } className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        { grade.name }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        { grade.weight }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( grade ) }>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( grade.id ) }>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                } ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }
      {/* Modal Tambah/Edit Nilai */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                { editId ? "Edit Nilai" : "Tambah Nilai" }
              </h3>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama
                  </label>
                  <input
                    name="name" value={ form.name } onChange={ handleChange }
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Contoh: UTS"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Beban (%)
                  </label>
                  <input
                    name="weight" value={ form.weight } onChange={ handleChange }
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Contoh: 20"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={ () => setShowModal( false ) } className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
      ) }
    </div>
  );
} 