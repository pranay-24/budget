import React, { useContext, useState } from 'react'
const BudgetsContext = React.createContext()

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

 const [budgets,setbudgets ]= useState([])
 const [expenses,setexpenses] = useState([])
 
 function getBudgetExpenses(){

 }
 function addExpense(){

 }
 function addBudget(){

 }
 function deleteBudget(){

 }
 function deleteExpense(){

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
