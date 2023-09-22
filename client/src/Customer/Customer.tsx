import React, { useState } from 'react'
import './Customer.css';
import elon from '../assets/elon.jpg'
import Appointment from '../Appointment/Appointment';

export default function Customer({customer}) {
  return (
    <>
    <div className='customer' onClick={()=> null}>
        <h3>Customer</h3>
        <div className='customer__title'>
          <img src={elon}/>
          <h5>{customer.name}</h5>
        </div>

        <div className='customer__info'>
          <div>
            <p>Name</p>
            <p className='customer__blue'>{customer.name}</p>
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
        
    </div>

    </>
  )
}
