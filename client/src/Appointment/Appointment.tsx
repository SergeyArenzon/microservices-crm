import React from 'react'
import elon from '../assets/elon.jpg'
import './Appointment.css'
import dayjs from 'dayjs'

export default function Appointment({appointment, customer}) {

  return (
    <div className='appointment'>
        <div className="appointment__customer">
            <img className='appointment__image' src={elon}/>
            <div className='appointment__name' >{customer.name}</div>
        </div>
        <div className='appointment__subject'>{appointment.subject}</div>
        <div className='appointment__date'>Task Date: <strong>{dayjs(appointment.date).format("DD/MM/YYYY: HH:mm")}</strong></div>
        {/* <div>{appointment.status}</div> */}
        {/* <div className='appointment__notes'>{appointment.notes}</div> */}
    </div>
  )
}
