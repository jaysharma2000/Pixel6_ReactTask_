import React, { useContext, useState, useEffect } from 'react';
import { HiFilter } from "react-icons/hi";
import { GoArrowDown } from "react-icons/go";
import { GoArrowUp } from "react-icons/go";
import { AppContext } from '../Context/Context';
import { IoIosArrowDown } from "react-icons/io";

const UserData = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  
  const { data, error, loading, handleNextPage, handlePreviousPage, usersPerPage, totalUsers, currentPage } = useContext(AppContext);

  useEffect(() => {
    setFilteredData(data.users);
  }, [data]);

  //function to handle the sorting
  const handleDescendingOrder = (columnName) => {
    let sortedData = [...filteredData];
    sortedData.sort((a, b) => {
      if (typeof a[columnName] === 'string') {
        return b[columnName].localeCompare(a[columnName]);
      } else {
        return b[columnName] - a[columnName];
      }
    });
    setFilteredData(sortedData);
  };

  //function to handle the sorting
  const handleAscendingOrder = (columnName) => {
    let sortedData = [...filteredData];
    sortedData.sort((a, b) => {
      if (typeof a[columnName] === 'string') {
        return a[columnName].localeCompare(b[columnName]);
      } else {
        return a[columnName] - b[columnName];
      }
    });
    setFilteredData(sortedData);
  };

  //function to handle the statewise filtering
  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    filterUsers(state, selectedGender);
  };

  //function to handle the genderwise filtering
  const handleGenderChange = (event) => {
    const gender = event.target.value;
    setSelectedGender(gender);
    filterUsers(selectedState, gender);
  };

  //function to handle the filtering
  const filterUsers = (state, gender) => {
    let filtered = [...data.users];

    if (state) {
      filtered = filtered.filter(user => user.address.state === state);
    }

    if (gender) {
      filtered = filtered.filter(user => user.gender === gender);
    }

    setFilteredData(filtered);
  };

  //error handler
  if(error){
    return <p>Error: {error}</p>
  }

  return (
    <>
      <div className='container'>
        <div className='header-section'>
          <h1>Employees</h1>
          
          <div className='filter-section'>
              <HiFilter className='filter-icon'/>

            {/* Filter statewise */}
            <div className='select-container'>
              <select
                  className='country-filter-button'
                  value={selectedState}
                  onChange={handleStateChange}
                > 
                  <option value="">All States</option>
                  {data && data.users && [...new Set(data.users.map(user => user.address.state))].map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}    
              </select>
              <IoIosArrowDown className='downarrow2'/>
            </div>
              
              
              {/* Filter genderwise */}
            <div className='select-container'>
                <select className='gender-filter-button' value={selectedGender} onChange={handleGenderChange}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
             
                <IoIosArrowDown className='downarrow2'/>
            </div>
          </div>
        </div>

        {/* table of user details */}
        <div className='table-section'>
          <table> 
            {loading ? (
              <div className='spinner'></div>
            ) : (
              filteredData && (
                <>
                  <thead>
                    <tr>
                      <th id='first-col'>ID <GoArrowUp onClick={() => handleDescendingOrder('id')} /><GoArrowDown onClick={() => handleAscendingOrder('id')} /></th>
                      <th id='second-col'>Image </th>
                      <th>Full Name <GoArrowUp onClick={() => handleDescendingOrder('firstName')} /><GoArrowDown onClick={() => handleAscendingOrder('firstName')} /></th>
                      <th>Demography</th>
                      <th>Designation</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((user) => (
                      <tr key={user.id}>
                        <td id='first-col-data'>{user.id < 10 ? `0${user.id}` : user.id}</td>
                        <td id='second-col-data'><img src={user.image} alt="User" /></td>
                        <td>{user.firstName} {user.maidenName} {user.lastName}</td>
                        <td>{user.gender === 'female' ? `F/${user.age}` : `M/${user.age}`}</td>
                        <td>{user.company.title}</td>
                        <td>{user.address.state}, {user.address.country === 'United States' ? 'USA' : user.address.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )
            )}
          </table>
          <div className='button-section'>
            <p>{`Page ${currentPage} of ${Math.ceil(totalUsers / usersPerPage)}`}</p>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
            <button onClick={handleNextPage} disabled={currentPage * usersPerPage >= totalUsers}>Next Page</button>     
          </div>
        </div>
      </div>
    </>
  );
};

export default UserData;
