import jwt from 'jsonwebtoken';

const generateToken = () => {
  // return a token that expires in one hour
  return jwt.sign({ user: 'Admin' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export default generateToken;
