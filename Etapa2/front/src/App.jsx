import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append('file', file);  // Añadir el archivo

    // Enviar el archivo al backend usando axios
    try {
      const response = await axios.post('http://localhost:8000/predictCSV/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Archivo subido:', response.data);
      setResponse(response.data);

    } catch (error) {
      console.error('Error subiendo el archivo:', error);
    }
  };

  return (
    <>
      <div>
        <h2>Subir archivo</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Subir</button>
        </form>
      </div>
      <div>
        <h2>Respuesta del servidor</h2>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </>
  );
};

export default FileUpload;

