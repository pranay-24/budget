import React from 'react'
import {Modal} from 'react-bootstrap'
import { Form ,Button} from 'react-bootstrap'
import {useRef} from 'react'
import { useBudgets } from '../contexts/BudgetsContext'

export default function AddBudgetModal({show, handleClose}) {
    const nameRef = useRef()
    const maxRef = useRef()

const {addBudget} = useBudgets()

    const handleSubmit= async (e)=>{
        e.preventDefault()

        await addBudget(
        {
            name:nameRef.current.value,
            max: parseFloat(maxRef.current.value)
        }  
        )   
        handleClose()
    }
  return (
  <Modal show={show} onHide = {handleClose}>
    <Form onSubmit= {handleSubmit}>
        <Modal.Header closeButton>
            <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>

    <Modal.Body>
        <Form.Group className='mb-3' controlid="name">
            <Form.Label>Name</Form.Label>
            <Form.Control ref={nameRef} type="text" required/>
        </Form.Group>

        <Form.Group className='mb-3' controlid="max">id
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control ref={maxRef} type="number" required min={0} step={0.01} />
        </Form.Group>

        <div className="d-flex justify-content-end">
        <Button variant="primary" type = "submit">Add</Button>
        </div>

    </Modal.Body>
    </Form>
  </Modal>
  )
}
