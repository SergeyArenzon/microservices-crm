const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

app.use(bodyParser.json());



const Appointment = mongoose.model('appointment', { 
  subject: String,
  customerId: String,
  status: String,
  notes: String,
  date: String
});
// const Appointmnet = mongoose.model('Appointment', { name: String });

app.get("/",async(req, res) => {
  const appointment = await Appointment.find().exec();
  if(appointment) {
    return res.status(200).json(appointment);
    
  }
  res.status(404).json({message: "appointments not found"});
})

app.post("/", async(req, res) => {
  const {subject,customerId, status,notes,date } = req.body;
  let appointment = null;
  try {
     appointment = new Appointment({ subject, customerId, status,notes,date});
    await appointment.save();
  } catch (error) {
    return res.status(400).json({error:  `Somthing went wrong...`})
  } 
  res.status(201).json({message:  `appointment created successfuly`, appointment})

})
app.get("/customer/:id",async(req, res) => {
  const appointment = await Appointment.find({customerId: req.params.id}).exec();
  
  if(appointment) {
    return res.status(200).json({appointment});
    
  }
  res.status(404).json({message: "appointment not found"});
});


app.get("/:id",async(req, res) => {
  const appointment = await Appointment.findById(req.params.id).exec();
  console.log({appointment});
  
  if(appointment) {
    return res.status(200).json({appointment});
    
  }
  res.status(404).json({message: "appointment not found"});
});


// PUT
app.put("/:id",async(req, res) => {
  const appointment = await Appointment.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true
  });
  
  if(appointment) {
    return res.status(200).json({appointment});
    
  }
  res.status(404).json({message: "appointment not found"});
})

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://mongodb:27017');
}
app.listen(3002, () => {
  console.log("Listening on 3002");
});
