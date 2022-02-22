require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const proposal = require('./proposal');


const app = express();
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.DATABASE_URI)
    .then(()=>{
        console.log('Database Connected')
    })
    .catch(()=> console.log("Database Connected Failed"))


app.use('/proposal',proposal)


app.listen(process.env.PORT||3000, () => {console.log('Server listening')})