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
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield Appointment.find().exec();
    if (appointment) {
        return res.status(200).json(appointment);
    }
    res.status(404).json({ message: "appointments not found" });
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, customerId, status, notes, date } = req.body;
    let appointment = null;
    try {
        appointment = new Appointment({ subject, customerId, status, notes, date });
        yield appointment.save();
    }
    catch (error) {
        return res.status(400).json({ error: `Somthing went wrong...` });
    }
    res.status(201).json({ message: `appointment created successfuly`, appointment });
}));
app.get("/customer/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield Appointment.find({ customerId: req.params.id }).exec();
    if (appointment) {
        return res.status(200).json({ appointment });
    }
    res.status(404).json({ message: "appointment not found" });
}));
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield Appointment.findById(req.params.id).exec();
    console.log({ appointment });
    if (appointment) {
        return res.status(200).json({ appointment });
    }
    res.status(404).json({ message: "appointment not found" });
}));
// PUT
app.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield Appointment.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    });
    if (appointment) {
        return res.status(200).json({ appointment });
    }
    res.status(404).json({ message: "appointment not found" });
}));
main().catch(err => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect('mongodb://mongodb:27017');
    });
}
app.listen(3002, () => {
    console.log("Listening on 3002");
});
