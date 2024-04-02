import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../config/firebasedb';
import LoadingOverlay from './loading/LoadingOverlay';
import { calculateNetExpense, getUserExpense } from '../helpers/ExpenseDetailHelper';

const ExpenseDetails = ({ expense, onClose }) => {
  const [userExpenses, setUserExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserExpenses = async () => {
      setLoading(true);
      try {
        const expenseDetailQuery = query(collection(db, 'expense_detail'), where('expense_id', '==', expense.id));
        const expenseDetailSnapshot = await getDocs(expenseDetailQuery);
        const userExpensesData = expenseDetailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserExpenses(userExpensesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user expenses:', error);
        setLoading(false);
      }
    };

    fetchUserExpenses();
  }, [expense.id]);



  return (
    <>
      {loading && <LoadingOverlay />}
      <div className='popup fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50'>
        <div className='popup-content bg-white px-8 py-6 rounded-lg border border-gray-300 shadow-lg max-w-2xl px-auto flex flex-justify-center flex-col'>
          <h2 className='text-xl font-bold mb-4 mx-auto'>Expense Report</h2>
          <p className="mb-2"><span className="font-semibold">Added By:</span> {expense.addedBy}</p>
          <p className="mb-2"><span className="font-semibold">Description:</span> {expense.description}</p>
          <p className="mb-2"><span className="font-semibold">Date:</span> {expense.date}</p>

          <div className='p-4 divide-y divide-slate-200 border-2 border-200'>
            <p className="mb-2 text-green-800 text-lg mx-auto"><span className="font-semibold">Total:</span> {expense.totalExpense}</p>
            {userExpenses.map(userExpense => (
              <div key={userExpense.user_id} className="py-2">
                <p className='flex justify-between'>
                  {calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense}) > 0 ? (
                    <div className="flex justify-between">
                      <span className="font-semibold text-green-800 w-52">{userExpense.user_name}:</span>
                      <span className='text-slate-500 w-32'> (paid: {getUserExpense({userExpenses : userExpenses, userID:  userExpense.user_id})}) </span>
                      <span className="text-green-800 mx-2 w-32">will get back</span>
                    </div>
                  ) : calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense}) < 0 ? (
                    <div className='flex justify-between'>
                      <span className="font-semibold text-red-800 w-52">{userExpense.user_name}:</span>
                      <span className='text-slate-500 w-32'> (paid: {getUserExpense({userExpenses : userExpenses, userID:  userExpense.user_id})}) </span>
                      <span className="text-red-800 mx-2 w-32">has to pay</span>
                    </div>
                  ) : (
                    <div className='flex justify-between'>
                      <span className="font-semibold text-gray-800 w-52">{userExpense.user_name}:</span>
                      <span className='text-slate-500 w-32'> (paid: {getUserExpense({userExpenses : userExpenses, userID:  userExpense.user_id})}) </span>
                      <span className="text-gray-800 mx-2 w-32">is settled</span>
                    </div>
                  )}
                  {calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense}) !== 0 && (
                    calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense}) > 0 ? (
                      <span className="font-semibold text-green-800 float-right">+ {calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense})}</span>
                    ) : (
                      <span className="font-semibold text-red-800 float-right">- {Math.abs(calculateNetExpense({userExpenses: userExpenses,userID:userExpense.user_id, expense : expense}))}</span>
                    )
                  )}
                </p>
              </div>
            ))}

          </div>
          <div className="mx-auto my-4">
            <img src={expense.photo} alt="Expense" className="w-40 h-auto rounded-lg" />
          </div>
          <button
            onClick={onClose}
            className='bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700'
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default ExpenseDetails;
