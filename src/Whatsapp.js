import cookie from 'react-cookies';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React from 'react'
import Sidebar from './Sidebar';
import Chat from './Chat';
export default function Whatsapp() {
    return (
        <Router>
           <Sidebar />
        <Switch>
        <Route exact path="/whatsapp/rooms/:roomId">
          <Chat />
        </Route>
        <Route   path="/whatsapp">
          {<h1>Click on the Chat to show</h1>}
        </Route>
        </Switch>
        </Router>
            
        
    )
}
