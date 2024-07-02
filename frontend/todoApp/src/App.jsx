import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route exact path='/dashboard' element={<Home/>}/>
      <Route exact path='/login' element={<Login/>}/>
      <Route exact path='/signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
