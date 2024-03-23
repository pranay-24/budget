import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";
import { db } from "../firebase/config";
const BudgetsContext = React.createContext();
export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

export function useBudgets() {
  return useContext(BudgetsContext);
}
// //budget format
// {
//     id:
//     name:
//     max:
// }
// expense Format
// {
//     id:
//     budgetId:
//     amount:
//     description:
// }
export const BudgetsProvider = ({ children }) => {
  //  const [budgets,setbudgets ]= useLocalStorage("budgets",[])
  //  const [expenses,setexpenses] = useLocalStorage("expenses", [])

  const [budgets, setbudgets] = useState([]);
  const [expenses, setexpenses] = useState([]);

  async function get_budgets() {
    const budgetsnapshot = await db.collection("budgets").get();
    const budgetData = budgetsnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setbudgets(budgetData);
  }

  // get expenses
//from snapshot.docs filter expense swith  a given budgetId and then map to an array of expenses objects
  async function getBudgetExpenses(budgetId) {
    try {
      const expensesnapshot = await db.collections("expenses").get();
      const expenses = expensesnapshot.docs
        .filter((doc) => doc.data().budgetId === budgetId)
        .map((doc) => ({ ...doc.data(), id: doc.id }));

      return expenses;
    } catch (error) {
      console.error("Error fetching expenses");
      return [];
    }
  }

  //add expense
  function addExpense({ description, amount, budgetId }) {
    
    const newExpense = { id: uuidv4(), description, amount, budgetId };
    db.collection("expenses").add(newExpense);
    setexpenses((prevExpenses) => {
      return [...prevExpenses, newExpense];
    });
  }

  //add budget

  function addBudget({ name, max }) {
    const newBudget = { id: uuidv4(), name, max };
    db.collections("budgets").add(newBudget);

    setbudgets((prevBudgets) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidv4(), name, max }];
    });
  }

  async function deleteBudget({ id }) {
    //deal with uncategorized expenses
    await db.collection('budgets').doc(id).delete();

    // Update expenses associated with the deleted budget in the "expenses" collection
    const expensesSnapshot = await db.collection('expenses')
      .where('budgetId', '==', id)
      .get();

    const batch = db.batch();
    expensesSnapshot.forEach((doc) => {
      batch.update(doc.ref, { budgetId: UNCATEGORIZED_BUDGET_ID });
    });
    await batch.commit();
    

    setexpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId !== id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });

    setbudgets((prevBudgets) => {
      return prevBudgets.filter((budget) => budget.id !== id);
    });
  }
  function deleteExpense({ id }) {
    setexpenses((prevExpenses) => {
      return prevExpenses.filter((expense) => expense.id !== id);
    });
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
