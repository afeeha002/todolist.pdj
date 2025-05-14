import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/loginpage/Login';
import Main from './components/mainpage/Main';
import Register from './components/register/Register';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>



  );
}

export default App;
