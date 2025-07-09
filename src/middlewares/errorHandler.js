export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const name = err.name || 'Error';
    const message = err.message || 'Something went wrong';
    
    if (status < 500) {
        return next(err);
    }
  
    res.status(status).json({
        status,
        name,
        message,
        ...(err.data && { data: err.data }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};