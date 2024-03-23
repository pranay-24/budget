import React, { useContext, useState } from 'react'
import{v4 as uuidv4} from'uuid'
import useLocalStorage from '../hooks/useLocalStorage'
import {db } from '../firebase/config'
const BudgetsContext = React.createContext()
export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets(){
return useContext(BudgetsContext)
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
export const BudgetsProvider =({children})=>{

 const [budgets,setbudgets ]= useLocalStorage("budgets",[])
 const [expenses,setexpenses] = useLocalStorage("expenses", [])


async function get_budgets(){
    const budgetsnapshot = await db.collection('budgets').get()
    const budgetData = budgetsnapshot.docs.map(doc => (
      {...doc.data(), id : doc.id}  
    ))
        setbudgets(budgetData)
}


 // get expenses

 function getBudgetExpenses(budgetId){
return expenses.filter(expense=> expense.budgetId === budgetId)
 }

 //add expense
 function addExpense({description, amount, budgetId}){
    const newExpense = {id:uuidv4(), description, amount, budgetId}
    db.collection('expense').add(newExpense)
    setexpenses(prevExpenses =>{
       
        return [...prevExpenses, newExpense]
    })
 }

 //add budget

 function addBudget({name,max}){
    const newBudget = {id:uuidv4(), name, max}
    db.collections('budgets').add(newBudget)
    
setbudgets(prevBudgets =>{
    if(prevBudgets.find(budget =>budget.name=== name)){
        return prevBudgets
    }
    return [...prevBudgets, {id:uuidv4(), name, max}]
})
 }
 function deleteBudget({id}){
    //deal with uncategorized expenses
    setexpenses(prevExpenses =>{
return prevExpenses.map(expense => {
    if(expense.budgetId !== id) return expense
    return {...expense , budgetId: UNCATEGORIZED_BUDGET_ID}
})
    })

setbudgets(prevBudgets =>{
    return prevBudgets.filter(budget =>budget.id !== id)
})
 }
 function deleteExpense({id}){
    setexpenses(prevExpenses =>{
        return prevExpenses.filter(expense =>expense.id !== id)
    })
 }

return (
<BudgetsContext.Provider value={{
    budgets,
    expenses,
    getBudgetExpenses,
    addExpense,
    addBudget,
    deleteBudget,
    deleteExpense
}} >{children}</BudgetsContext.Provider>
)

}
