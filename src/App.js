import logo from './logo.svg';
import './App.css';
import ReactDom from 'react-dom/client'
import NavBar from './components/navbar.component';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { Container } from 'reactstrap'
import Prisoner from './components/prisoner/prisoner-list.component'
import Home from './components/home/home.component';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <h1>App</h1>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="prisoners" element={<Prisoner />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}