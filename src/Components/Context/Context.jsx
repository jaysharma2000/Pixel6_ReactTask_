import React, { createContext, useState, useEffect } from 'react';

// createContext
export const AppContext = createContext();

const Context = ({ children }) => {
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ users: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  //function to fetch the users data
  async function fetchData(page) {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * usersPerPage;
      const response = await fetch(`https://dummyjson.com/users?limit=${usersPerPage}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData({ users: result.users });
      setTotalUsers(result.total);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  //functions for handling pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // context
  const value = {
    data,
    setData,
    error,
    loading,
    currentPage, 
    totalUsers, 
    handlePreviousPage,
    handleNextPage,
    usersPerPage
  };

  // contextProvider
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default Context;
