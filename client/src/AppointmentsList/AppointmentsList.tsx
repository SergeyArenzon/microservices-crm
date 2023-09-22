import React, { useEffect, useState } from 'react'
import Appointment from '../Appointment/Appointment';
import Modal from '../Modal/Modal';
import CreateAppointment from '../CreateAppointment/CreateAppointment';
import "./AppointmenstList.css"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween)


export default function AppointmentsList({appointments,customers, onCreateAppointment}) {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [filteredAppointments, setDilteredAppointments] = useState(appointments);


  useEffect(() => {
    const startOfDay = date.startOf('day');
    const endOfDay = date.endOf('day');
    let filteredAppointments = [...appointments];
    filteredAppointments = filteredAppointments.filter(a => dayjs(a.date).isBetween(startOfDay,endOfDay))
    setDilteredAppointments(filteredAppointments);
    
  }, [date])
  
  const onAppointmentClick = (appointment, customer) => {
    setShowEdit({appointment, customer});
  }


  
  return (
    <div className="appointments-list">
      <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Date Filter" value={date} onChange={(e) => setDate(e)} format="DD/MM/YYYY" />
      </DemoContainer>
    </LocalizationProvider>
      </div>
      <ul >
        {filteredAppointments.map(a => {
          return <div onClick={() => onAppointmentClick(a, customers[customers.findIndex(c => c._id === a.customerId)])}><Appointment appointment={a} customer={customers[customers.findIndex(c => c._id === a.customerId)]}/></div>
        })}
      </ul>
      {(showCreateAppointment || showEdit) && <div onClick={() => {setShowCreateAppointment(false); setShowEdit(null)}}><Modal/></div>}
      {showEdit && <div className="appointments-list__create"><CreateAppointment customers={customers} editAppointment={showEdit} onCreateAppointment={onCreateAppointment}/></div>}
      { showCreateAppointment && <div className="appointments-list__create">
        <CreateAppointment  customers={customers} onCreateAppointment={onCreateAppointment}/>
        </div>}
      <button onClick={() => setShowCreateAppointment(true)}>+</button>
    </div>
  )
}
