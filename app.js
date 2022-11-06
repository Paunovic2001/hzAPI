const express = require('express');
const app = express();

const dotenv = require('dotenv');
const ErrorHandler = require('./utils/errorHandler');

dotenv.config({path: './config/config.env'});

const hzroutes = require('./routes');

app.use('/api/v1', hzroutes);

//handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`), 404);
});

const PORT = process.env.PORT;
const server = app.listen(PORT, (req,res) =>{
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode `);
});