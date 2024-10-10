import React, { useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [response, setResponse] = useState([]);
  const [classificationReport, setClassificationReport] = useState(''); // Nuevo estado para el classification_report
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [obj, setObj] = useState({});
  const [pageRange, setPageRange] = useState(2); // Cantidad de páginas a mostrar en la paginación

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleObjChange = (e) => {
    setObj(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('obj', obj);

    try {
      const res = await axios.post('http://localhost:8000/predictCSV/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data;
      setResponse(data.predictions); // Actualiza las predicciones
      setClassificationReport(data.classification_report); // Actualiza el classification_report
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
        alert('Error enviando el texto');
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

  // Calcular el rango de páginas a mostrar
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Modelo de Clasificación</h2>

      <div className="row">
        {/* Sección para entrenar el modelo */}
        <div className="col-md-6">
          <Card className="p-3 mb-5 border-primary">
            <h4 className="text-primary">Entrenar modelo</h4>
            <p>Sube un archivo CSV con los datos de entrenamiento para entrenar el modelo de clasificación.</p>
            <form onSubmit={handleSubmitFile}>
              <input type="file" className="form-control mb-3" onChange={handleFileChange} />
              <h5>Variable objetivo</h5>
              <input type="text" className="form-control mb-3" onChange={handleObjChange} placeholder="Ejemplo: ODS" />
              <button className="btn btn-primary" type="submit">Entrenar modelo</button>
            </form>
          </Card>
        </div>

        {/* Sección para predecir texto */}
        <div className="col-md-6">
          <Card className="p-3 mb-5 border-success">
            <h4 className="text-success">Predecir con texto</h4>
            <p>Ingresa un texto para predecir a qué categoría ODS pertenece.</p>
            <form onSubmit={handleSubmitText}>
              <input type="text" className="form-control mb-3" value={text} onChange={handleTextChange} placeholder="Escribe un texto aquí..." />
              <button className="btn btn-success" type="submit">Predecir</button>
            </form>
          </Card>
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-5">
        <h2>Resultados</h2>
        {response.length > 0 ? (
          <div>
            {/* Mostrar classification_report */}
            {classificationReport && (
              <div className="mt-4">
                <h3>Classification Report</h3>
                <pre>{classificationReport}</pre> {/* Mostrar como texto preformateado */}
              </div>
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Texto (Español)</th>
                  <th>ODS</th>
                  <th>Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.Textos_espanol}</td>
                    <td>{item.ods}</td>
                    <td>{item.probabilidad}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginación */}
            <Pagination>
              {currentPage > 1 && (
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
              )}
              {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                <Pagination.Item
                  key={startPage + index}
                  active={startPage + index === currentPage}
                  onClick={() => paginate(startPage + index)}
                >
                  {startPage + index}
                </Pagination.Item>
              ))}
              {currentPage < totalPages && (
                <Pagination.Next onClick={() => paginate(currentPage + 1)} />
              )}
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
