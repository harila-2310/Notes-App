import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import {useNavigate} from "react-router-dom";
import Searchbar from '../SearchBar/Searchbar';
const Navbar = ({userInfo,onSearchNote,handleClearSearch}) => {
  const[searchQuery,setSearchQuery]=useState("");

  const navigate=useNavigate();
  const onLogout=()=>{
    localStorage.clear();
    navigate('/login')
  }
  const handleSearch=()=>{
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  }

  const onClearSearch=()=>{
    setSearchQuery("");
    handleClearSearch();
  }
  return (
    <div className='bg-white flex items-center justify-between pax-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
      <Searchbar value={searchQuery} onChange={({target})=>{setSearchQuery(target.value)}} onClearSearch={onClearSearch} handleSearch={handleSearch}/>
    {userInfo&&<ProfileInfo userInfo={userInfo} onLogout={onLogout}/>}  
    </div>
  )
}

export default Navbar