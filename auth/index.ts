const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');



app.use(bodyParser.json());
app.use(cookieParser())


async function main() {
  await mongoose.connect('mongodb://mongodb:27017');
}
main().catch(err => console.log(err));



const SECRET = "sdf1s3dg4!f?kgjk"
const REFRESH_SECRET = "sdasd4!f?kgsdf!?#jk"


const Token = mongoose.model('Appointment', { 
    token: String
});


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
})


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
]




app.get('/set-cookie',  (req, res) => {
  res.cookie('new-user',false)
  res.cookie('new-user httponly',false, {httpOnly: true})
  res.send("set cookie")
});
app.get('/get-cookie',  (req, res) => {
  // res.cookie('new-user',false)
  // res.cookie('new-user httponly',false, {httpOnly: true})
  res.send(req.cookies)
});



const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, {
    expiresIn: maxAge
  })
}
const createRefreshToken = (id) => {
  return jwt.sign({ id }, REFRESH_SECRET)
}


app.post('/signup', async(req, res) => {
  const { email, password } = req.body;
  
  try {
    const salt = await bcrypt.genSalt()
    console.log({password, salt});
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ email, password: hashedPassword } );
    const token = createToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    await Token.create({token: refreshToken})
    // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({user: user._id, token, refreshToken })
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
  } 

});

app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email});
  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      const token = createToken(user._id)
      res.status(200).json({user: user._id, token})
    } else {
        res.status(401).json({error: "user is not auth"})
    }
  } else {
    res.status(401).json({error: "user is not auth"})
  }
});


app.post('/auth', (req,res) => {
  const { token } = req.body
  if(token) {
    console.log(2,Date.now());
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if(err) {
        
        res.status(401).json({error: "Not authenticated"})
      } else {
        
        return res.status(200).json({user: decodedToken.id})
      }
    })
  } else {
    res.status(401).json({error: "Not authenticated"})
  }
})



app.listen(3003, () => {
  console.log("Listening on 3003");
});
