import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, ButtonGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [offset, setOffset] = useState(0);
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(`https://sakila-films.herokuapp.com/films?limit=${moviesPerPage}&offset=${offset}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`);
      setMovies(response.data);
      setTotalPages(Math.ceil(response.data[0].count / moviesPerPage));

    };

    fetchMovies();
  }, [currentPage, moviesPerPage, offset, sortColumn, sortDirection, totalPages]);

  const handlePageSizeChange = (size) => {
    setMoviesPerPage(size);
    if (currentPage > 1) {
      setCurrentPage(1);
      setOffset(0);
    }
  };

  const handlePageChange = (page) => {

    const newOffset = (page - 1) * moviesPerPage;
    setCurrentPage(page);
    setOffset(newOffset);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th>Index</th>
          <th onClick={() => handleSort('title')}>Title {sortColumn === 'title' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
          <th onClick={() => handleSort('category_name')}>Genre {sortColumn === 'category_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
          <th onClick={() => handleSort('rental_rate')}>Rental Rate {sortColumn === 'rental_rate' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
          <th onClick={() => handleSort('rating')}>Rating {sortColumn === 'rating' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
          <th onClick={() => handleSort('nb_of_rent')}>Rental Count {sortColumn === 'nb_of_rent' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
        </tr>
      </thead>
    );
  };
  

  const renderTableBody = () => {
    return (
      <tbody>
        {movies.map((movie, index) => {
        const genre = movie.category_name;
        const movieIndex = index + (currentPage - 1) * moviesPerPage;
          return (
            <tr key={movie.id}>
              <td>{movieIndex + 1}</td>
              <td>{movie.title}</td>
              <td>{genre ? genre : ''}</td>
              <td>{movie.rental_rate}</td>
              <td>{movie.rating}</td>
              <td>{movie.nb_of_rent}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderPagination = () => {
    const pageNumbers = [];
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
  
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
      <ButtonGroup>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </ButtonGroup>
      <span
        style={{
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >Page {currentPage} of {totalPages}</span>
      </div>
    );
  };
  
  

  const renderPageSizeOptions = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <span
          style={{
            marginRight: "10px",
          }}
        >Movies per page:</span>
        <ButtonGroup>
          <Button color="secondary" onClick={() => handlePageSizeChange(10)} active={moviesPerPage === 10}>
            10
          </Button>
          <Button color="secondary" onClick={() => handlePageSizeChange(20)} active={moviesPerPage === 20}>
            20
          </Button>
          <Button color="secondary" onClick={() => handlePageSizeChange(50)} active={moviesPerPage === 50}>
            50
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Table striped bordered hover>
        {renderTableHeader()}
        {renderTableBody()}
      </Table>
      {renderPagination()}
      {renderPageSizeOptions()}
    </div>
  );
};

export default App;
