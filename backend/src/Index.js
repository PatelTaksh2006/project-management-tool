import empRoute from './Routers/EmployeeRoute.js';
import proRoute from './Routers/ProjectRoute.js'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
const app=express()
mongoose.connect("mongodb://127.0.0.1:27017/ProDb")
.then(()=>console.log("connected"))
.catch(err=>console.log("Not connected",err));

app.use(cors({
    origin: 'http://localhost:3000', // allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed methods
  credentials: true
}))
app.use(express.json());
app.use('/api/emp',empRoute)
app.use('/api/project',proRoute)
app.listen(3001,()=>{
    console.log("Api can read");
});