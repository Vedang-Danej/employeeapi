import asyncHandler from 'express-async-handler';
import Employee from '../models/employeeModel.js';
import Joi from 'joi';

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});

export const getOneEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee Not Found');
  }
  res.json(employee);
});

export const addEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, position, department, birth_day, birth_month, birth_year } =
    req.body;

  // converting date into the format that JOI understands

  const DOB = `${birth_month}-${birth_day}-${birth_year}`;

  // input validation

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    department: Joi.string().required(),
    position: Joi.string().required(),
    DOB: Joi.date().greater('1-1-1900').required(),
  });
  const { error } = schema.validate({ firstName, lastName, email, department, position, DOB });

  // throw error if input validation fails

  if (error) {
    res.status(400);
    throw new Error('Input Validation Failed');
  }

  const userExists = await Employee.findOne({ email });

  // throw error if employee (email) already exists in the database

  if (userExists) {
    res.status(400);
    throw new Error('Employee already exists');
  }

  const employee = new Employee({
    firstName,
    lastName,
    position,
    department,
    email,
    DOB: new Date(birth_year, birth_month, birth_day),
  });
  const createdEmployee = await employee.save();
  res.status(201).json(createdEmployee);
});

export const editEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, position, department, birth_day, birth_month, birth_year } =
    req.body;

  let DOB = undefined;
  if (birth_day && birth_month && birth_year) {
    DOB = `${birth_month}-${birth_day}-${birth_year}`;
  }

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    department: Joi.string(),
    position: Joi.string(),
  });

  const { error } = schema.validate({ firstName, lastName, email, department, position });

  if (error) {
    res.status(400);
    throw new Error('Input Validation Failed');
  }

  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee Not Found');
  }
  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.email = email || employee.email;
  employee.department = department || employee.department;
  employee.position = position || employee.position;

  const updatedDOB = new Date(birth_year, birth_month, birth_day);

  // check if the date is valid. Incase the user has not sent a valid date to update or
  // not send a date at all, the below check would fail

  if (Object.prototype.toString.call(updatedDOB) === '[object Date]' && !isNaN(updatedDOB)) {
    const DOBSchema = Joi.date().greater('1-1-1900');
    const { error } = DOBSchema.validate(updatedDOB);
    // input date validations
    if (error) {
      res.status(400);
      throw new Error('Input Validation Failed');
    }
    employee.DOB = updatedDOB;
  }

  const updatedEmployee = await employee.save();
  res.status(201).json(updatedEmployee);
});

export const removeEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee Not Found');
  }

  await Employee.deleteOne({ _id: req.params.id });
  res.json({ message: 'The Employee has been removed' });
});
