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

  async function getBudgets() {
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
    //   const expensesnapshot = await db.collections("expenses").get();
    //alternate way of accessing the expenses related to a budget
      const expensesSnapshot = await db.collection('expenses')
      .where('budgetId', '==', budgetId)
      .get();

      const expenses = expensesSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));
    setexpenses(expenses)
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

  async function addBudget({ name, max }) {
    
    //db.collection("budgets").add(newBudget);
    const budgetsCollection = db.collection('budgets');
    const existingBudget = await budgetsCollection.where('name', '==', name).get();

    if (!existingBudget.empty) {
      throw new Error('Budget with the same name already exists.');
    }
    const newBudget = { id: uuidv4(), name, max };
    await budgetsCollection.add(newBudget);
    
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

  async function deleteExpense({ id }) {
  await db.collection('expenses').doc(id).delete();
    setexpenses((prevExpenses) => {
      return prevExpenses.filter((expense) => expense.id !== id);
    });
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgets,
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
