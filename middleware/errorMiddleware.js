const notFound = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// main error handler of the application

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV == 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
