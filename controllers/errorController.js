/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateKeyErrorDB = (err) => {
  const message = `Duplicate field value: ${
    Object.keys(err.keyValue)[0]
  }. please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input data: ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError(`invalid token, please log in again`, 401);
};

const handleTokenExpiredError = () => {
  return new AppError(`Your token has expired! please log in again.`, 401);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log(err, 'Error occured');
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error(err, 'error occured');
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
  //Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }

  console.log('ERROR --', err);
  res.status(err.statusCode).render('error', {
    msg: 'please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (err instanceof mongoose.Error.CastError)
      error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateKeyErrorDB(error);
    if (err instanceof mongoose.Error.ValidationError)
      error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(err);
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError(err);

    sendErrorProd(error, req, res);
  }
};
