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
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(cookieParser());
const SECRET = "sdf1s3dg4!f?kgjk";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
});
const User = mongoose.model('user', userSchema);
// const accessToken = jwt.sign()
const posts = [
    {
        username: "sergey",
    },
    {
        username: "alex",
    },
    {
        username: "dani",
    },
];
app.get('/set-cookie', (req, res) => {
    res.cookie('new-user', false);
    res.cookie('new-user httponly', false, { httpOnly: true });
    res.send("set cookie");
});
app.get('/get-cookie', (req, res) => {
    // res.cookie('new-user',false)
    // res.cookie('new-user httponly',false, {httpOnly: true})
    res.send(req.cookies);
});
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, SECRET, {
        expiresIn: maxAge
    });
};
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const salt = yield bcrypt.genSalt();
        const hashedPassword = yield bcrypt.hash(password, salt);
        const user = yield User.create({ email, password: hashedPassword });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User.findOne({ email });
    if (user) {
        const auth = yield bcrypt.compare(password, user.password);
        if (auth) {
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ user: user._id });
        }
        else {
            res.status(400).json({ error: "user is not auth" });
        }
    }
    else {
        res.status(400).json({ error: "user is not auth" });
    }
}));
app.get('/auth', (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    console.log(token);
    if (token) {
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401);
            }
            else {
                res.status(200).json({ user: decodedToken.id });
            }
        });
    }
    else {
        res.status(401).json({ error: "Not authenticated" });
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect('mongodb://auth-mongodb:27017');
    });
}
main().catch(err => console.log(err));
app.listen(3003, () => {
    console.log("Listening on 3003");
});
