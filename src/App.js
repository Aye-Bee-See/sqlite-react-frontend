import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import NavBar from './components/navbar.component';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import List from './components/list/list.component';
import Home from './components/home/home.component';
import InputForm from './components/list/inputform.component';
import Login from './components/login/login.component.js';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import UnitTests from './components/test/unit-tests.component.js';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userDetails, setUserDetails] = useState(localStorage.getItem('userDetails'))

  const handleSetToken = (newToken, userDetails) => {
    setToken(newToken);
    setUserDetails(userDetails);
    localStorage.setItem('token', JSON.stringify(newToken)); // Store token as a JSON string
    localStorage.setItem('user', JSON.stringify(userDetails));
  };

  const logOut = () => {
    setToken(null);
    setUserDetails(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <>
      <BrowserRouter>
        <NavBar token={token} logOut={logOut} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="prisoners" element={<ProtectedRoute element={<List subject="Prisoner" key="Prisoner" token={token}/>}/> } />
          <Route path="prisoner/:id" element={<ProtectedRoute element={<InputForm subject="Prisoner" key="Prisoner" token={token} solo />} />} />
          <Route path="users" element={<ProtectedRoute element={<List subject="User" key="User" token={token} />} />} />
          <Route path="user/:id" element={<ProtectedRoute element={<InputForm subject="User" key="User" token={token} solo />} />} />
          <Route path="prisons" element={<ProtectedRoute element={<List subject="Prison" key="Prison" token={token} />} />} />
          <Route path="prison/:id" element={<ProtectedRoute element={<InputForm subject="Prison" key="Prison" token={token} solo />} />} />
          <Route path="messaging" element={<ProtectedRoute element={<List subject="Message" key="Message" token={token} />} />} />
          <Route path="rules" element={<ProtectedRoute element={<List subject="Rule" key="Rule" token={token} />} />} />
          <Route path="rule/:id" element={<ProtectedRoute element={<InputForm subject="Rule" key="Rule" token={token} solo />} />} />
          <Route path="chapters" element={<ProtectedRoute element={<List subject="Chapter" key="Chapter" token={token} />} />} />
          <Route path="chapter/:id" element={<ProtectedRoute element={<InputForm subject="Chapter" key="Chapter" token={token} solo />} />} />
          <Route path="tests" element={<ProtectedRoute element={<UnitTests subject="Test" key="Test" token={token} />} />} />
          <Route path="login" element={<Login setToken={handleSetToken} />} />
          <Route path="logout" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}