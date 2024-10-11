import './App.css';
import NavBar from './components/navbar.component';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import List from './components/list/list.component'
import Home from './components/home/home.component';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputForm from './components/list/inputform.component';

export default function App() {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="prisoners" element={<List subject="Prisoner" />} />
        <Route path="prisoner/:id" element={<InputForm subject="Prisoner" key="Prisoner" solo/>} />
        <Route path="users" element={<List subject="User"/>} />
        <Route path="user/:id" element={<InputForm subject="User" key="User" solo/>} />
        <Route path="prisons" element={<List subject="Prison"/>}/>
        <Route path="messaging" element={<List subject="Message" />} />
        <Route path="rules" element={<List subject="Rule" />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}