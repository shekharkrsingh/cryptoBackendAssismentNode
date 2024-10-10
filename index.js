const express = require('express');
const database = require('./config/database');
const router = require('./routes/router');
const logger = require('./middleware/logger');
const cryptoData=require("./jobs/cryptoData");

const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
app.use(express.json())

database.connect();

app.use("/api/v1", router)

app.get("/", logger,(req, res) => {
    return res.json({success: true, message: "Server is up and running"})
})

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})