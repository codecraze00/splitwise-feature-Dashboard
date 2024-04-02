import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store/store';

import Navbar from '../components/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/registrations/Login';
import Register from '../components/registrations/Register';
import Dashboard from './Dashboard';
import Expenses from './Expenses';
import ExpenseReport from './ExpenseReport';
import Settlements from './Settlements';

const App = () => {

  return (
    <BrowserRouter>

      <Provider store={store}>
        <Navbar />
      </Provider>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<ExpenseReport />} />
        <Route path="/settlement" element={<Settlements />} />
        <Route path="/add-expense" element={<div>Add Expense</div>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
