const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');



app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://127.0.0.1:8000',
  credentials: true,
}));








const SERVICES = {
  CUSTOMER: "http://customer:3001",
  APPOINTMENT: "http://appointment:3002",
  AUTH: "http://auth:3003",
}

const maxAge = 3 * 24 * 60 * 60



// AUTH
app.post("/signup", async(req, res) => {
  console.log(req.body);
  
  try {
    let response = await axios.post(`${SERVICES.AUTH}/signup`, req.body);

    const {token, refreshToken} = response.data;

    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
    res.cookie('refreshToken', refreshToken, {httpOnly: true, expires: new Date('9999-12-31')});
    return res.status(200).json(response.data)
    
  } catch (error) {
    return res.status(409).json({error: "user already exist"})
  }
})

app.post("/login", async(req, res) => {
  try {
    let response = await axios.post(`${SERVICES.AUTH}/login`, req.body);
    if(response.status !== 200) {
      return res.status(401).json({error: "wrong credentials"})
    }
    const {token} = response.data;
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
    return res.status(200).json(response.data)
  } catch (error) {
    return res.status(401).json({error: "wrong credentials"})
  }
})

app.get("/auth", async(req, res) => {
  try {
    const token = req.cookies?.jwt
    let response = await axios.post(`${SERVICES.AUTH}/auth`, {token});
    console.log({token, res: response });
    
    if(response.status === 200) {
      console.log(1);
      
      return res.status(200).json(response.data)
    } else {
      console.log(2);
      return res.status(401).json({error: "not authenticated"})
    }
  } catch (error) {
    console.log(3);
    return res.status(401).json({error: "not authenticated"})
    
  }
})
// app.get("/auth", async(req, res) => {
//   const token = req.cookies?.jwt
//   console.log(1, Date.now());
  
//   try {
//     let response = await axios.post(`${SERVICES.AUTH}/auth`, {token},{withCredentials: true, credentials: 'include'});
//     console.log(2,Date.now(),response.status);
//     if(response.status === 200) {
//       console.log(3, Date.now());
//       return res.status(200).json(response)
//     } else {
//       console.log(4, Date.now());
//       return res.status(401).json("user is not authenticated")
//     }
//   } catch (error) {
//     console.log(5, Date.now());
//     return res.status(401).json({error: "wrong credentials"})
//   }
// })


const authMiddleware = async(req,res, next) => {
  try {
    
    const token = req.cookies?.jwt
    let response = await axios.post(`${SERVICES.AUTH}/auth`, {token});
    if(response.status === 200) {
      next()
    } else {
      res.status(401).json({error: "not authenticated"})
    }
  } catch (error) {
    res.status(401).json({error: "not authenticated"})
    
  }
}




// CUSTOMER
app.get("/customer",authMiddleware, async(req, res) => {
  let customers = null;
  try {
    customers = await axios.get(SERVICES.CUSTOMER);
    customers = customers.data;
  } catch (error) {
    
    res.status(400).json(error)
  }

  let  appointments = null;
  try {
     appointments = await axios.get(SERVICES.APPOINTMENT);
     appointments = appointments.data;
  } catch (error) {
    res.status(400).json(error)
    
  }


  
  
  if(appointments?.length > 0) {
    appointments.forEach(a => {
      const customerId = a.customerId;
      const indexOfCustomer = customers.findIndex(c => c._id === customerId);
      if(indexOfCustomer > -1) {
        customers[indexOfCustomer].appointments.push(a)
      }

    });
  }
 
  res.status(200).json(customers)
});
app.get("/customer/:id",authMiddleware, async(req, res) => {
  let response = await axios.get(`${SERVICES.CUSTOMER}/${req.params.id}`);

  res.status(200).json({customers: response.data})
});

app.post("/customer", authMiddleware,async(req, res) => {
  console.log(req.body);
  let response = await axios.post(SERVICES.CUSTOMER, req.body)
  res.status(200).json(response.data["customer"])
});



// APPOINTMENT
app.get("/appointment",authMiddleware, async(req, res) => {
  let response = await axios.get(SERVICES.APPOINTMENT);
  if(response.status === 200) {
    return res.status(200).json( response.data)
  }
  res.status(400).json( {error: "somthing went wrong"})
});

app.put("/appointment/:id",authMiddleware, async(req, res) => {
  console.log(`${SERVICES.APPOINTMENT}/${req.params.id}`)
  
  let response = await axios.put(`${SERVICES.APPOINTMENT}/${req.params.id}`, req.body);
  if(response.status === 200) {
    return res.status(200).json( response.data)
  }
  res.status(400).json( {error: "somthing went wrong"})
});

app.post("/appointment",authMiddleware, async(req, res) => {
  try {
    let response = await axios.post(SERVICES.APPOINTMENT, req.body);
    if(response.status === 201){
      return res.status(201).json( response.data)
    }
    
  } catch (error) {
    
    return res.status(400).json( {error: "somthing went wrong"})
  }
  res.status(400).json( {error: "somthing went wrong"})
});





app.listen(8080, () => {
  console.log("Listening on 8080");
});










