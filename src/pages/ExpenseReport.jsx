import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../config/firebasedb';
import LoadingOverlay from '../components/loading/LoadingOverlay';
import { calculateTotalExpense, calculateEachExpense, calculateBudget, settleExpenses } from '../helpers/ExpenseReportHelper';

const ExpenseReport = () => {
  const [expense_details, setExpense_details] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserExpenses();
    fetchUsers();
  }, []);

  const fetchUserExpenses = async () => {
    try {
      setLoading(true);
      const expensesCollection = collection(db, 'expense');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expenseData = expensesSnapshot.docs
        .filter(doc => doc.data().status === 'active')
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expenseData);

      const expenseDetailCollection = collection(db, 'expense_detail');
      const expenseDetailSnapshot = await getDocs(expenseDetailCollection);
      const expenseDetailData = expenseDetailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpense_details(expenseDetailData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'user_detail');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = {};
      usersSnapshot.forEach(doc => {
        usersData[doc.id] = doc.data().displayName;
      });
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };


  return (
    <>
      {loading && <LoadingOverlay />}
      {!loading &&
      <div className="p-4 my-10 bg-gray-100 rounded-lg shadow-md w-full mx-auto max-w-3xl">
        <h2 className="text-3xl my-4 font-semibold text-center">All Expenses' Report</h2>
        <div className="mb-8 pb-4">
          <p className="text-lg font-semibold text-center  text-blue-800">Total Expense: {calculateTotalExpense({expenses: expenses})}</p>
          <ul className="list-disc pl-6">
            {Object.keys(calculateBudget({expense_details: expense_details,expenses : expenses})).map(userId => (
              <li className='flex items-center py-1' key={userId}>
                <span className='w-40'>{users[userId]}:</span>
                <span className={parseFloat(calculateBudget({expense_details: expense_details,expenses: expenses})[userId]) >= 0 ? 'text-green-800' : 'text-red-800'}>
                  {calculateBudget({expense_details: expense_details,expenses : expenses})[userId]}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 py-6 border-y-4 text-center">Expense Details</h2>
          {expenses.map(expense => (
            <div key={expense.id} className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-lg font-semibold mb-2">Date: {expense.date}</p>
              <p className=' text-blue-800'><strong className='mr-8'>Expense:</strong> {parseFloat(expense.totalExpense).toFixed(2)}</p>
              <p><strong className='mr-4'>Description:</strong > {expense.description}</p>
              <p className='mb-8'><strong className='mr-6'>Added By:</strong> {expense.addedBy}</p>
              {Object.keys(calculateEachExpense({expense_details: expense_details,expenseID : expense.id})[1]).map(userId => (
                <div className="flex items-center py-1" key={userId}>
                  <span className='w-40'>{users[userId]}:</span>
                  <span className={parseFloat(calculateEachExpense({expense_details: expense_details, expenseID : expense.id})[1][userId]) >= 0 ? 'text-green-800' : 'text-red-800'}>
                    {calculateEachExpense({expense_details: expense_details,expenseID : expense.id})[1][userId]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-green-500 w-full text-white py-2 px-4 rounded-md hover:bg-green-600" onClick={(() => settleExpenses({expenses : expenses}))}>Settle All Expenses</button>
        </div>
      </div>}
    </>
  );
};

export default ExpenseReport;
