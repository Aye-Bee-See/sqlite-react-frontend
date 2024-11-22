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

export default function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="prisoners" element={<List subject="Prisoner" key="Prisoner" />} />
          <Route path="prisoner/:id" element={<InputForm subject="Prisoner" key="Prisoner" solo />} />
          <Route path="users" element={<List subject="User" key="User" />} />
          <Route path="user/:id" element={<InputForm subject="User" key="User" solo />} />
          <Route path="prisons" element={<List subject="Prison" key="Prison" />} />
          <Route path="prison/:id" element={<InputForm subject="Prison" key="Prison" solo />} />
          <Route path="messaging" element={<List subject="Message" key="Message" />} />
          <Route path="rules" element={<ProtectedRoute element={<List subject="Rule" key="Rule" />} />} />
          <Route path="rule/:id" element={<InputForm subject="Rule" key="Rule" solo />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}