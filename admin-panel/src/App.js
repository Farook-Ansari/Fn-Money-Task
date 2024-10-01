import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import DashboardLayoutAccount from './components/DashboardLayoutAccount';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/*" element={<DashboardLayoutAccount />} />  
    </Routes>
  </BrowserRouter>
);

export default App;
