import { useState, useEffect } from 'react'
import './App.css'
import CustomersList from './CustomersList/CustomersList';
import axios from 'axios';
import AppointmentsList from './AppointmentsList/AppointmentsList';
import Auth from './Auth/Auth';

axios.defaults.withCredentials = true

function App() {
  const [show, setShow] = useState('customer');
  const [showSpinner, setShowSpinner] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [user, setUser] = useState(null);


  const API = 'http://127.0.0.1:8080'


  const fetchData = async() => {

    let customers = await axios.get(`${API}/customer`);
    customers = customers.data;
    setCustomers(customers)
  }
  const auth = async() => {

    const res = await axios.get("http://127.0.0.1:8080/auth",{withCredentials: true});
    if(res.status === 200) {

      setUser(res.data)
    }
  }

  const fetchUser = (user) => {
    setUser(user);
    fetchData()
  }


  useEffect(() => {

    auth()
    fetchData();
  }, [])
  
  

  const onCreateCustomer = async(name, group) => {

    setShowSpinner(true);
    const res = await axios.post(`${API}/customer`, {name, groupSelection: group });
    const newCustomers = [...customers];
    console.log(res.data._id);
    
    newCustomers.push({name, groupSelection: group,_id: res.data._id,appointments: []})
    setCustomers(newCustomers)
    setShowSpinner(false);

  }
  
  let allAppointments = [];
  console.log({customers});
  
  customers?.forEach(c => {
    c.appointments.forEach(a => {
      const appointment = a;
      a.customer = c;
      allAppointments.push(a)
    })
  })
  
  
  const onCreateAppointment = async(appointment) => {

    setShowSpinner(true);
    let newAppointment = null 
    if(appointment._id) {
      newAppointment = await axios.put(`${API}/appointment/${appointment._id}`, appointment)
    } else {
      newAppointment = await axios.post(`${API}/appointment/`, appointment)
    }
    newAppointment = newAppointment.data.appointment
    const newCustomers = [...customers];  
    const customerIndex = newCustomers.findIndex(c => c._id === appointment.customerId);
    
    if(appointment._id) {
      const tempApp = newCustomers[customerIndex].appointments
      const updateAppindex = tempApp.findIndex(s => s._id === appointment._id)
      newCustomers[customerIndex].appointments[updateAppindex] = newAppointment
    } else {

      newCustomers[customerIndex].appointments.push(newAppointment) ;
    }
    setCustomers(newCustomers)
    setShowSpinner(false)
    
  }
  

  
  if(!user) return <Auth fetchUser={fetchUser}/>
  if(showSpinner) return <div>LOADING...</div>
  return <div className="app">
      <aside className="app__aside">
          <button onClick={() => setShow('customer')}>C</button>
          <button onClick={() => setShow('appointment')}>A</button>
      </aside>
      <main>
       { show === 'customer' && <CustomersList 
                                  customers={customers} 
                                  onCreateCustomer={onCreateCustomer}
                                  />}
       { show === 'appointment' && <AppointmentsList 
                                      appointments={allAppointments}
                                      customers={customers}
                                      onCreateAppointment={onCreateAppointment}
                                  />}
       {/* { show === 'customer' && <CustomersList/>} */}
      </main>
  </div>
}

export default App
