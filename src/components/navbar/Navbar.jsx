import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import LoginButton from '../buttons/LoginButton';
import { increment, decrement } from '../../redux/actions/counterActions'; // Import actions for counter
import { incrementByAmount } from '../../redux/reducers/counterReducer';
import { addTodo, deleteTodo } from '../../redux/reducers/todoReducer'; // Import actions for todos

function Navbar() {
  const todos = useSelector(state => state.todos); // Get todos from Redux store
  const count = useSelector(state => state.counter.count); // Get count from Redux store
  const dispatch = useDispatch();

  const [newTodo, setNewTodo] = useState('');
  const [showTodoBar, setShowTodoBar] = useState(false); // State variable for toggling todo bar visibility

  const handleAddTodo = () => {
    dispatch(addTodo(newTodo)); // Dispatch addTodo action
    setNewTodo(''); // Clear input after adding todo
    dispatch(incrementByAmount(increment()))
  }

  const handleDeleteTodo = (todoId) => {
    dispatch(deleteTodo(todoId)); // Dispatch deleteTodo action

    if (count > 0) {
      dispatch(incrementByAmount(decrement()))
    }
  }

  const toggleTodoBar = () => {
    setShowTodoBar(!showTodoBar); // Toggle todo bar visibility
  }
  

  return (
    <nav className="bg-gray-800 text-white p-4 ps-12 pe-0 me-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white">
            <img src={logo} alt="Logo" className="inline-block mr-2 w-32" />
          </Link>
        </div>
        <div className="hidden md:flex space-x-4"> {/* Hide on small screens */}
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-gray-300">
            Expenses
          </Link>
          <Link to="/reports" className="hover:text-gray-300">
            Report
          </Link>
          <Link to="/settlement" className="hover:text-gray-300">
            Settlements
          </Link>
        </div>


        <LoginButton />


        <div className="relative">
          <button className="bg-gray-700 text-white px-3 py-1 rounded w-40" onClick={toggleTodoBar}>
            {showTodoBar ? 'Hide Todos' : 'Show Todos'}
          </button>
          {showTodoBar && (
            <div className="absolute top-14 right-0 bg-gray-800 p-4 border border-gray-600 rounded shadow-md h-72 z-20 overflow-auto">
              <div className="mb-4 flex">
                <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} className="border border-gray-300 rounded px-2 py-1 mr-2 text-gray-800" />
                <button onClick={handleAddTodo} className="bg-gray-700 text-white px-3 py-1 w-20 rounded hover:bg-gray-600">
                  Add
                </button>
              </div>
              
              <p className="mb-2 text-gray-400">Currenly Added ({count})</p>

              <ul>
                {todos.todos.map(todo => (
                  <li key={todo.id} className="flex items-center justify-between mb-2">
                    <span className="text-white">
                      <input type="checkbox" className="mr-2" />
                      {todo.text}</span>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-sm px-5 py-2">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      

      </div>
    </nav>
  );
}

export default Navbar;
