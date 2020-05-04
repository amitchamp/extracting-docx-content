const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/assets', express.static('assets'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Databse configuration
const database = process.env.DATABASE;
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(connection => {
    console.log("Database connected successfully")
}).catch(error => {
    console.log("Something went wrong while connect the databae", error);
})

// Routes Middleware
const mainIndexRoutes = require('./routes/mainRoute');

// Use Routes
app.use('/', mainIndexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        return '';
    }
    console.log(`Magic run at port ${port}....`);
});
