import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Authorization error, no token');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Authorization error, no token');
  }
});
