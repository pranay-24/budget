import React,{useState, useEffect} from 'react'
import { UNCATEGORIZED_BUDGET_ID , useBudgets} from "../contexts/BudgetsContext"
import BudgetCard from "./BudgetCard"

export default function UncategorizedBudgetCard(props) {
   //  const {getBudgetExpenses} = useBudgets()
   //  const expenses = await getBudgetExpenses(UNCATEGORIZED_BUDGET_ID);
   //  const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce((total,expense)=>  total + expense.amount ,0)
    const { getBudgetExpenses } = useBudgets();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
      const fetchExpenses = async () => {
        try {
          const expenses = await getBudgetExpenses(UNCATEGORIZED_BUDGET_ID);
          const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
          setTotalAmount(amount);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      };
  
      fetchExpenses();
    }, [getBudgetExpenses]);

 if(totalAmount === 0) return null
    return (
   <BudgetCard name='Uncategorized' gray amount = {totalAmount} {...props}/>
  )
}
