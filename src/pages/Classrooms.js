import axios from "axios";
import React, { useEffect, useState } from "react";


export default function Classrooms() {
  const [ classrooms, setClassrooms ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { name: "", capacity: "", location: "" } );
  const [ editId, setEditId ] = useState( null );

  const fetchData = async () => {
    setLoading( true );
    try {
      const res = await axios.get( "http://localhost:9090/api/v1/admin/classrooms", {
        headers: {
          'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
          'Content-Type': 'application/json'
        }
      } );
      setClassrooms( res.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data kelas" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchData();
  }, [] );

  const handleChange = ( e ) => {
    const { name, value } = e.target;


    const newValue = name === 'capacity' ? Number( value ) : value;

    setForm( { ...form, [ name ]: newValue } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/classrooms/${editId}`, form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/classrooms", form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { name: "", capacity: "", location: "" } );
      setEditId( null );
      fetchData();
    } catch ( err ) {

      setError( "Gagal menyimpan data kelas" );
    }
  };

  const handleEdit = ( classroom ) => {
    setForm( { name: classroom.name, capacity: classroom.capacity, location: classroom.location } );
    setEditId( classroom.id );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus kelas ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/classrooms/${id}`, {
        headers: {
          'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
          'Content-Type': 'application/json'
        }
      } );
      fetchData();
    } catch ( err ) {
      setError( "Gagal menghapus kelas" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelas</h1>
        <button
          onClick={ () => { setShowModal( true ); setForm( { name: "", capacity: "", location: "" } ); setEditId( null ); } }

          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Kelas
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
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { classrooms.map( ( classroom ) => (
                  <tr key={ classroom.id } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      { classroom.name }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { classroom.capacity } orang
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { classroom.location }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( classroom ) }>
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( classroom.id ) }>
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

      {/* Modal Tambah Kelas */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{ editId ? "Edit Kelas" : "Tambah Kelas" }</h3>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama
                  </label>
                  <input
                    name="name" value={ form.name } onChange={ handleChange }
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Contoh: Ruang A"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kapasitas
                  </label>
                  <input
                    name="capacity" value={ form.capacity } onChange={ handleChange }
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Contoh: 40"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Lokasi
                  </label>
                  <input
                    name="location" value={ form.location } onChange={ handleChange }
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Contoh: Gedung A"
                  />
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