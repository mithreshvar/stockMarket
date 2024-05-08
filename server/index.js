require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require('./routes/user');
const stockRoute = require('./routes/stockRoute');

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// app.get('/api/', stockRoute);
app.use('/api/user', userRoutes);
app.use('/api/stock', stockRoute);

mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        
        app.listen(port, () => {
            console.log("connected to database && Server running on port: ", port);
        });
    })
    .catch((error) => {
        console.log(error);
    })