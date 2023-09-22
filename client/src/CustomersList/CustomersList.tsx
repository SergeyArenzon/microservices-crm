import React, { useEffect, useRef, useState } from 'react';
import Customer from '../Customer/Customer';
import  './CustomersList.css';
import TextField from '@mui/material/TextField';
import Modal from '../Modal/Modal';
import elon from '../assets/elon.jpg'
import Appointment from '../Appointment/Appointment';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



export default function Customers({customers, onCreateCustomer}) {

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customer, setCustomer] = useState(customers[0])
  const customerNameRef = useRef({});
  const customerGroupRef = useRef({});

  useEffect(() => {
    setCustomer(customers[0])
  }, [customers])
  
  const onSubmitHandler = (e) => {
    e.preventDefault();
    setCustomer(customerNameRef.current.value)
    onCreateCustomer(customerNameRef.current.value, customerGroupRef.current.value)
    
  }

  console.log({customer});
  

  // if(!customer) return  <>
  //   <div>wow</div>
  //   <button className='customer-list__add' onClick={()=>setShowAddCustomer(true)}>+</button>
  // </>


  return (
  <div className='customer-list'>
      {customer && <div className='customer' onClick={()=> null}>
        <h3>Customer</h3>
         <div className='customer__title'>
          <img src={elon}/>
          <h5>{customer.name}</h5>
        </div>

        <div className='customer__info'>
          <div>
            <p>Name</p>
           
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={customer?._id}
              onChange={(e)=> setCustomer(customers[customers.findIndex(c => c._id === e.target.value)])}
              label="Customer"
            >
              {customers.map(c => {
                  return <MenuItem value={c._id}>{ <p className='customer__blue'>{c.name}</p>}</MenuItem>
                })}
            </Select>
          </FormControl>
          </div>
          <div className="customer__br"></div>
          <div>
            <p>ID</p>
            <p className='customer__blue'>{customer._id}</p>
          </div>
          <div className="customer__br"></div>
          <div>
            <p>Group</p>
            <p className='customer__blue'>{customer.groupSelection}</p>
          </div>
        </div>
    </div>}

    {customer && <div className='customer-list__appointments'>
        <div className='customer-list__title'>
          <h3>Appointments</h3>
          <div></div>
        </div>
      {customer.appointments.map(a => <Appointment customer={customer} appointment={a}/>)}
    </div>}

    <button className='customer-list__add' onClick={()=>setShowAddCustomer(true)}>+</button>
    {showAddCustomer && <div onClick={()=>setShowAddCustomer(false)}><Modal/></div>}
    {showAddCustomer && <form onSubmit={onSubmitHandler} className='customer-list__form'>
            <h1>Create Customer</h1>
            <TextField id="outlined-basic" label="Name" variant="outlined" inputRef={customerNameRef}/>
            <TextField id="outlined-basic" label="Group" variant="outlined" inputRef={customerGroupRef}/>
        <button type="submit">Save</button>
      </form>}
  </div>
  )
}
