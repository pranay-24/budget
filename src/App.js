import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddBudgetModal from "./components/AddBudgetModal";
import AddExpenseModal from "./components/AddExpenseModal";
import BudgetCard from "./components/BudgetCard";
import {useState} from "react"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext";
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard";
import ViewExpensesModal from "./components/ViewExpensesModal";

function App() {
const [showAddBudgetModal,setshowAddBudgetModal] = useState(false)
const [showAddExpenseModal,setshowAddExpenseModal] = useState(false)
const [viewExpensesModalBudgetId,setviewExpensesModalBudgetId] = useState()

const [addExpenseModalBudgetId,setaddExpenseModalBudgetId] = useState()

const {budgets, getBudgetExpenses} = useBudgets()

function openAddExpenseModal(budgetId){
setshowAddExpenseModal(true)
setaddExpenseModalBudgetId(budgetId)
}

  return (
    <>
    <Container className="my-4">
      <Stack direction="horizontal" gap="2" className="mb-4">
        <h1 className="me-auto">Budget</h1>
        <Button variant="primary" onClick={()=>setshowAddBudgetModal(true)}>Add Budget</Button>
        <Button variant="outline-primary" onClick={()=>openAddExpenseModal()}>Add expense</Button>
      </Stack>
      {/* adding a style attribute */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px, 1fr))",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        {budgets.map(budget => {
          const amount = getBudgetExpenses(budget.id).reduce((total,expense)=>  total + expense.amount ,0)

          return(
          <BudgetCard key = {budget.id}
           name={budget.name}
            amount ={amount}
             max={budget.max}
             onAddExpenseClick= {()=> openAddExpenseModal(budget.id) }
             onViewExpensesClick= {()=> setviewExpensesModalBudgetId(budget.id) }
             />

          )
              })}

        <UncategorizedBudgetCard onAddExpenseClick= {openAddExpenseModal} 
        onViewExpensesClick= {()=> setviewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID) } />
        <TotalBudgetCard />
      </div>
    </Container>

  {/* Add budget modal */}
    <AddBudgetModal 
    show={showAddBudgetModal} 
    handleClose={()=>setshowAddBudgetModal(false)}/>

{/* Add expense modal */}
<AddExpenseModal 
    show={showAddExpenseModal} 
    defaultBudgetId = {addExpenseModalBudgetId}
    handleClose={()=>setshowAddExpenseModal(false)}/>

{/* View Expenses Modal */}
<ViewExpensesModal 
    budgetId ={viewExpensesModalBudgetId}
    handleClose={()=>setviewExpensesModalBudgetId()}/>
    </>
  );
}

export default App;
