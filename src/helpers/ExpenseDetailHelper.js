// Calculate net expense for each user
// props {userExpenses, userID, expense}
const calculateNetExpense = (props) => {
  let netExpense = 0;
  let numberOfUsers = props.userExpenses.length;
  let average = parseFloat(props.expense.totalExpense) / numberOfUsers;
  for (let i = 0; i < props.userExpenses.length; i++) {
    if (props.userExpenses[i].user_id === props.userID) {
      netExpense = parseFloat(props.userExpenses[i].user_expense) - average;
    }
  }
  return netExpense;
};

// get the user expense from id
// props {userExpenses, userID}
const getUserExpense = (props) => {
  for (let i = 0; i < props.userExpenses.length; i++) {
    if (props.userExpenses[i].userID === props.userID) {
      return props.userExpenses[i].user_expense;
    }
  }
};

export { calculateNetExpense, getUserExpense };
