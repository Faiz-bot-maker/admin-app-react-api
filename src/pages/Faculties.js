import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Faculties() {
  const [ faculties, setFaculties ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ form, setForm ] = useState( { code: "", name: "", dekan: "", address: "" } );
  const [ editId, setEditId ] = useState( null );

  const fetchFaculties = async () => {
    setLoading( true );
    try {
      const res = await axios.get( "http://localhost:9090/api/v1/admin/faculties", {
        headers: {
          'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
          'Content-Type': 'application/json'
        }
      } );
      setFaculties( res.data.data );
      setError( null );
    } catch ( err ) {
      setError( "Gagal mengambil data fakultas" );
    }
    setLoading( false );
  };

  useEffect( () => {
    fetchFaculties();
  }, [] );

  const handleChange = ( e ) => {
    setForm( { ...form, [ e.target.name ]: e.target.value } );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    try {
      if ( editId ) {
        await axios.put( `http://localhost:9090/api/v1/admin/faculties/${editId}`, form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      } else {
        await axios.post( "http://localhost:9090/api/v1/admin/faculties", form, {
          headers: {
            'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
            'Content-Type': 'application/json'
          }
        } );
      }
      setShowModal( false );
      setForm( { code: "", name: "", dekan: "", address: "" } );
      setEditId( null );
      fetchFaculties();
    } catch ( err ) {

      setError( "Gagal menyimpan data fakultas" );
    }
  };

  const handleEdit = ( faculty ) => {
    setForm( { code: faculty.code, name: faculty.name, dekan: faculty.dekan, address: faculty.address } );
    setEditId( faculty.id );
    setShowModal( true );
  };

  const handleDelete = async ( id ) => {
    if ( !window.confirm( "Yakin ingin menghapus fakultas ini?" ) ) return;
    try {
      await axios.delete( `http://localhost:9090/api/v1/admin/faculties/${id}`, {
        headers: {
          'Authorization': 'e7c731d3-811c-4ab8-a4d9-5a62623b57bb',
          'Content-Type': 'application/json'
        }
      } );
      fetchFaculties();
    } catch ( err ) {
      setError( "Gagal menghapus fakultas" );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fakultas</h1>
        <button
          onClick={ () => { setShowModal( true ); setForm( { code: "", name: "", dekan: "", address: "" } ); setEditId( null ); } }
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Tambah Fakultas
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dekan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { faculties.map( ( faculty ) => (
                  <tr key={ faculty.id } className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ faculty.code }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ faculty.name }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ faculty.dekan }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ faculty.address }</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={ () => handleEdit( faculty ) }>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={ () => handleDelete( faculty.id ) }>Hapus</button>
                    </td>
                  </tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }
      {/* Modal Tambah/Edit Fakultas */ }
      { showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{ editId ? "Edit Fakultas" : "Tambah Fakultas" }</h3>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Kode</label>
                  <input type="text" name="code" value={ form.code } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                  <input type="text" name="name" value={ form.name } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Dekan</label>
                  <input type="text" name="dekan" value={ form.dekan } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
                  <input type="text" name="address" value={ form.address } onChange={ handleChange } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
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