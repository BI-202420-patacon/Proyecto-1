import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [response, setResponse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/predictCSV/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (error) {
      alert('Error subiendo el archivo');
    }

    
  };

  const handleSubmitText = async (e) => {
    e.preventDefault();

    if (text) {
      try {
        const res = await axios.post('http://localhost:8000/predictText/', { texto: text });
        console.log(res.data);
        setResponse(res.data);
      } catch (error) {
        console.error('Error subiendo el texto:', error);
      }
    } else {
      setResponse([]);
      alert('No se ha ingresado texto');
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = response.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(response.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Subir archivo o texto</h2>

      <div className="row">
        <div className="col-md-6">
          <h4>Subir archivo CSV</h4>
          <form onSubmit={handleSubmitFile}>
            <input type="file" className="form-control" onChange={handleFileChange} />
            <button className="btn btn-primary mt-3" type="submit">Subir archivo</button>
          </form>
        </div>

        <div className="col-md-6">
          <h4>Predecir texto</h4>
          <form onSubmit={handleSubmitText}>
            <input type="text" className="form-control" value={text} onChange={handleTextChange} />
            <button className="btn btn-primary mt-3" type="submit">Enviar texto</button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <h2>Resultados</h2>
        {response.length > 0 ? (
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Texto (Español)</th>
                  <th>ODS</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.Textos_espanol}</td>
                    <td>{item.ods}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginación */}
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        ) : (
          <p>No hay resultados disponibles</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
