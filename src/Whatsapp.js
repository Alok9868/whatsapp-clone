
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React from 'react'
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import NoChat from './components/NoChat/NoChat';

export default function Whatsapp() {
    return (
        <Router>
           <Sidebar />
        <Switch>
        <Route exact path="/whatsapp/rooms/:roomId">
          <Chat />
        </Route>
        <Route   exact path="/whatsapp">
          {/* {<h1>Click on the Chat to show</h1>} */}
          <NoChat />
        </Route>
        </Switch>
        </Router>
    )
}
