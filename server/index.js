const express = require('express')
const apiRouter = require('./routes/api')
const router = require("express").Router();
const cors = require('cors')


const app = express();
app.use(cors())

require('./db')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRouter);

app.listen(4000, ()=> {
    console.log('Servidor corriendo!!')
})