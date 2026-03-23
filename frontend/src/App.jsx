import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import Videos from './pages/Videos'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/user/dashboard' element={<UserDashboard/>}/>
      <Route path='/user/videos' element={<Videos/>}/>
      <Route path='/settings' element={<Profile/>}/>
      <Route path='/user/wallet' element={<Wallet/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App