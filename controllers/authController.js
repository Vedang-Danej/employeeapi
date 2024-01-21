import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const sendAuthToken = asyncHandler(async (req, res) => {
  //   matching the hashed password with the entered password
  const passwordMatch = await bcrypt.compare(req.body.password, process.env.AUTH);

  if (!passwordMatch) {
    res.status(401);
    throw new Error('Wrong Password');
  }
  //   send a token if the password is correct
  res.json({ token: generateToken() });
});
