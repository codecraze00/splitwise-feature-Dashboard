import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExpenseDetails from '../components/ExpenseDetails';
import { collection, getDocs } from 'firebase/firestore';
import db from '../config/firebasedb';
import LoadingOverlay from '../components/loading/LoadingOverlay';

const Settlements = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // fetch expenses whose status is active
      const expensesCollection = collection(db, 'expense');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expensesData = expensesSnapshot.docs
        .filter(doc => doc.data().status === 'done')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
  };

  const handleClosePopup = () => {
    setSelectedExpense(null);
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <section className='flex justify-center items-center py-16 px-10 md:px-1 relative'>
        <div className='w-3/5 flex flex-col gap-8'>
          <div>
            <div>
              <h1 className='text-primary text-3xl text-left p-0 m-0'>Settled Expenses</h1>
              <hr className='border border-blue-800 my-1 w-32' />
              <hr className='border border-blue-800 mb-5 w-28' />
            </div>
            <p className='text-gray-600'>
              Here, you'll find the history of all the settled expenses.
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            {expenses.map((expense) => (
              <div key={expense.id} className='flex flex-row justify-between bg-blue-800 bg-opacity-20 p-4 rounded-sm'>
                <div className='flex flex-row gap-12 items-center'>
                  <div className="flex-shrink-0">
                    <img src={expense.photo} alt="Expense" className="h-10 w-10 rounded-full" />
                  </div>
                  <p className='text-primary text-green-800 text-lg w-14'>{expense.totalExpense}</p>
                  <p className='text-gray-600'>{expense.date}</p>
                  <p className='text-lg '>{expense.description}</p>
                </div>

                <div className='flex flex-row gap-6'>
                  <button
                    onClick={() => handleViewExpense(expense)}
                    className='bg-blue-800 text-white px-3 py-1 rounded-md'
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popup */}
        {selectedExpense && (
          <ExpenseDetails expense={selectedExpense} onClose={handleClosePopup} />
        )}
      </section>
    </>
  );
};

export default Settlements;
