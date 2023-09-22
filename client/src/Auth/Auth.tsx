import React, { useRef, useState } from 'react'
import axios from 'axios';
import './Auth.css'
import TextField from '@mui/material/TextField';



export default function Auth({setUserHandler, fetchUser}) {

    const emailRef = useRef("")
    const passwordRef = useRef("second")
    const [error, setError] = useState("")
    const [login, setLogin] = useState(true)


    const onClick = async() => {
        if(!login) {
            try {
                
                const res = await axios.post("http://127.0.0.1:8080/signup", {email: emailRef.current.value, password: passwordRef.current.value },{withCredentials: true});
                console.log({res});
                if(res.status !== 200 ) {
                    setError("Somthing went wrong")
                }
                fetchUser(res.data)
            } catch (error) {
                
                setError("Somthing went wrong")
            }
        }
        else {
            try {
                
                const res = await axios.post("http://127.0.0.1:8080/login", {email: emailRef.current.value, password: passwordRef.current.value },{withCredentials: true});
                console.log({res});
                
                if(res.status !== 200 ) {
                    setError("Wrong credentials")
                }
                fetchUser(res.data)
            } catch (error) {
                setError("Wrong credentials")
            }
        }
        
    }


  return (
    <div className='auth'>
        <div className='auth__container'>
        <h1>{login ? "Login" : "Sign Up"}</h1>
         <TextField id="standard-basic" label="Email" variant="outlined" placeholder={"Email"} inputRef={emailRef}/>
         <TextField type='password' id="standard-basic" label="Password" variant="outlined" placeholder={'password'} inputRef={passwordRef}/>
         {error && <div className='auth__error'>{error}</div>}
        <button onClick={onClick}>{login ? "Login" : "Sign Up"}</button>
        <div className='auth__mode' onClick={() => setLogin(prev => !prev)}>{!login ? "Login" : "Sign Up"}</div>
        </div>
    </div>
  )
}
