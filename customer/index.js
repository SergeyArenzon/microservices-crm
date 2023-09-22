"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect('mongodb://mongodb:27017');
    });
}
main().catch(err => console.log(err));
const Customer = mongoose.model('Customer', {
    name: String,
    groupSelection: String,
    appointments: []
});
// const Appointmnet = mongoose.model('Appointment', { name: String });
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, groupSelection } = req.body;
    let customer = null;
    try {
        customer = new Customer({ name, groupSelection, appointments: [] });
        yield customer.save();
    }
    catch (error) {
        res.status(400).json({ error });
    }
    res.status(201).json({ message: `customer created successfuly`, customer });
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield Customer.find().exec();
    if (customer) {
        return res.status(200).json(customer);
    }
    res.status(404).json({ message: "customer not found" });
}));
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield Customer.findById(req.params.id).exec();
    if (customer) {
        return res.status(200).json({ customer });
    }
    res.status(404).json({ message: "customer not found" });
}));
app.listen(3001, () => {
    console.log("Listening on 3001");
});
