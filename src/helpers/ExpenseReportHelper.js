import db  from "../config/firebasedb";
import { collection, updateDoc } from "firebase/firestore";
// Function to calculate total expense, each expense, and budget
// props {expenses}
const calculateTotalExpense = (props) => {
  let totalExpense = 0;
  props.expenses.forEach((expense) => {
    totalExpense += parseFloat(expense.totalExpense);
  });
  return totalExpense.toFixed(2);
};

// Function to calculate each expense and remaining expense for each user
// props {expense_details, expense_id}
const calculateEachExpense = (props) => {
  const expenseDetails = props.expense_details.filter(
    (detail) => detail.expense_id === props.expenseID
  );
  const userPayments = {};
  expenseDetails.forEach((detail) => {
    const { user_id, user_expense } = detail;
    if (!userPayments[user_id]) {
      userPayments[user_id] = 0;
    }
    userPayments[user_id] += parseFloat(user_expense);
  });

  const numberOfUsers = Object.keys(userPayments).length;
  let average = 0;
  let totalExpense = 0;
  Object.keys(userPayments).forEach((userId) => {
    totalExpense += userPayments[userId];
  });
  average = totalExpense / numberOfUsers;
  const remainingExpense = {};
  Object.keys(userPayments).forEach((userId) => {
    remainingExpense[userId] = (userPayments[userId] - average).toFixed(2);
  });
  return [totalExpense.toFixed(2), remainingExpense];
};

// Function to calculate budget for each user
// props {expenses}
const calculateBudget = (props) => {
  const userBudget = {};
  props.expenses.forEach((expense) => {
    const data = calculateEachExpense({expense_details: props.expense_details , expenseID :expense.id});
    Object.keys(data[1]).forEach((userId) => {
      if (!userBudget[userId]) {
        userBudget[userId] = 0;
      }
      userBudget[userId] = (
        parseFloat(userBudget[userId]) + parseFloat(data[1][userId])
      ).toFixed(2);
    });
  });
  return userBudget;
};

// Function to settle expenses
// props {expenses}
const settleExpenses = (props) => {
  const confirmation = window.confirm(
    "Are you sure you want to settle all expenses? (This action will not be undone)"
  );
  if (confirmation) {
    props.expenses.forEach(async (expense) => {
      const expenseRef = collection(db, "expense");
      await updateDoc(expenseRef, expense.id, {
        status: "settled",
      });
    });
    window.location.reload();
  }
};

export { calculateTotalExpense, calculateEachExpense, calculateBudget, settleExpenses };