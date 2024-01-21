import express from 'express';
import {
  addEmployee,
  editEmployee,
  getAllEmployees,
  getOneEmployee,
  removeEmployee,
} from '../controllers/employeeController.js';
import { sendAuthToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// generate token for protected routes

router.get('/auth', sendAuthToken);

// get all employees
router.get('/', getAllEmployees);

// get employee by ID
router.get('/:id', getOneEmployee);

// add an employee (JWT authentication required)
router.post('/', protect, addEmployee);

// update an employee (JWT authentication required)
router.put('/:id', protect, editEmployee);

// delete an employee (JWT authentication)
router.delete('/:id', protect, removeEmployee);

export default router;
