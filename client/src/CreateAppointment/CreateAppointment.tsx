import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import './CreateAppointment.css'
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import elon from '../assets/elon.jpg'

export default function CreateAppointment({customers, onCreateAppointment, editAppointment}) {

    const [customer, setCustomer] = useState(editAppointment?.customer || null);
    const [date, setDate] = useState(editAppointment?.appointment?.date ? dayjs(editAppointment?.appointment?.date) : dayjs());
    const subjectRef = useRef(editAppointment?.appointment?.subject || "");
    const notesRef = useRef(editAppointment?.appointment?.notes || "");

    
    
    const createHandler = () => {

        onCreateAppointment({
            customerId: customer._id,
            date: date.toISOString(),
            subject: subjectRef.current.value,
            notes: notesRef.current.value,
            _id: editAppointment?.appointment._id || undefined
        })
    }
    
  return (
    <div className='create-appointment'>
        <div className='create-appointment__title'>
            <img className='create-appointment__elon' src={elon}/>
            <h3>New Appointment</h3>
        </div>
         <TextField id="standard-basic" label="Subject" variant="standard" defaultValue={editAppointment?.appointment.subject} inputRef={subjectRef}/>

         <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Customer</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={customer?._id}
          onChange={(e)=> setCustomer(customers[customers.findIndex(c => c._id === e.target.value)])}
          label="Customer"
        >
          {customers.map(c => {
              return <MenuItem value={c._id}>{c.name}</MenuItem>
            })}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
          'MobileDateTimePicker',
        ]}
      >
   
        <DemoItem>
          <MobileDateTimePicker value={date} onChange={(e) => setDate(e)} defaultValue={date} format="DD/MM/YYYY: HH:mm"/>
        </DemoItem>

       
      </DemoContainer>
    </LocalizationProvider>
      <TextField id="outlined-basic" label="Notes" variant="outlined"  multiline  rows={10} defaultValue={editAppointment?.appointment.notes} inputRef={notesRef}/>

      <button onClick={createHandler}>Create</button>
    </div>
  )
}
