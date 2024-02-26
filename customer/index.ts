const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


app.use(bodyParser.json());


// const Appointment = mongoose.model('Appointment', { 
//   subject: String,
//   status: String,
//   notes: String,
//   date: String
// });



async function main() {
  await mongoose.connect('mongodb://ms-mongo-srv:27017');
}
main().catch(err => console.log(err));

const Customer = mongoose.model('Customer', { 
  name: String,
  groupSelection: String,
  appointments: []
});
// const Appointmnet = mongoose.model('Appointment', { name: String });


app.post("/", async(req, res) => {
  const {name, groupSelection} = req.body;
  let customer = null;
  try {
     customer = new Customer({ name, groupSelection,appointments: [] });
    await customer.save();
  } catch (error) {
    res.status(400).json({ error})
  }
  res.status(201).json({message:  `customer created successfuly`, customer})
})

app.get("/",async(req, res) => {
  const customer = await Customer.find().exec();
  if(customer) {
    return res.status(200).json(customer);
    
  }
  res.status(404).json({message: "customer not found"});
})
app.get("/:id",async(req, res) => {
  const customer = await Customer.findById(req.params.id).exec();
  if(customer) {

    return res.status(200).json({customer});
  }
  res.status(404).json({message: "customer not found"});
})

app.listen(3001, () => {
  console.log("Listening on 3001");
});





