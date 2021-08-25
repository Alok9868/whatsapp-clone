import React, { useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Login from './Login';
// import { useStateValue } from './StateProvider';
import cookie from 'react-cookies';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useStateValue } from './StateProvider';
import  WhatsApp  from './Whatsapp';
function App() {
  
  
  // const [ { user } , dispatch]= useStateValue();
 
  // console.log(user);
  // const user=true;
  // useEffect(()=>
  // {
  //   axios.get("/messages/sync").then(response=>
  //     {
  //       setMessages(response.data);
  //     })
  // },[])

  // useEffect(() => {
  //   var pusher = new Pusher('633b5f99259b543112fe', {
  //     cluster: 'ap2'
  //   });

  //   var channel = pusher.subscribe('messages');
  //   channel.bind('inserted', (newmessage) => {
  //     setMessages([...messages,newmessage])
  //   });

   
  //     return () => {
  //       channel.unbind_all();
  //       channel.unsubscribe();
  //     }

  // }, [messages]);

  return (
    <div className="app">
      <div className="app_body">
      <Router>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/whatsapp">
        <WhatsApp />
      </Route>
        </Router>
    </div> 
    </div>
  );
  // return ( 
  //   <div className="app">
  //   {   <Router>
  //     <Switch>
  //       <Route path="/">
  //         <Login />
  //       </Route>
  //       <Route exact path="/rooms/:roomId">
  //       <div className="app_body">
  //   <Sidebar />

  //         <Chat 
  //         />
  //       </Route>
  //       <Route path="/chats">
        
  //         {<h1>Click on the Chat to show</h1>}
  //       </Route> 

  //     </Switch>

  //   </Router>
  //     {/* <Switch> 
  //     <Login />  

  //     <div className="app_body">
    
  //     <Sidebar />
        
  //       <Route exact path="/rooms/:roomId">
  //         <Chat 
  //         />
  //       </Route>
  //       <Route path="/">
  //         {<h1>Click on the Chat to show</h1>}
  //       </Route> */}
  //       {/* </Switch>
  //       </Router> */}
  //   </div> 
  //   }
  //   </div>
  // );
}

export default App;
