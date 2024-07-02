import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { validateEmail } from '../../utils/helper';
import PasswordInput from '../../components/input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate=useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

       if(!name)
      {
        setError("Please enter your name");
        return;
      }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //signup Api call
    try{
      const response=await axiosInstance.post('/create-account',{
          fullName:name,
          email:email,
          password:password,
      });

      //Handle Successful register
      if(response.data&&response.data.error){
          setError(response.data.message);
          return;
      }

      if(response.data&&response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken);
        navigate('/dashboard');
      }
  }catch(error){
      if(error.response&&error.response.data&&error.response.data.message){
          setError(error.response.data.message);
      }else{
          setError("An unexpected error occured");
      }
  }

  }
  return (
    <div>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-18'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>
            <input
              type="text"
              placeholder='Name'
              value={name}
              className="input-box"
              onChange={(e) => { setName(e.target.value) }}
            />
            <input
              type="text"
              placeholder='Email'
              value={email}
              className="input-box"
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} />

{error&& <p className='text-red-500 text-xs pb-1'>{error}</p>}   
                    <button type='submit' className='btn-primary'>Create Account</button>
                    <p className='text-sm text-center mt-4'>
                        Already have an account?{" "}
                        <Link to='/login' className='font-medium text-primary underline'>Login</Link>
                    </p>
          </form>
        </div>
      </div>


    </div>
  )
}

export default Signup