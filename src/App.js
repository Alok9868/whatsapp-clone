import React from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import { Route, Switch } from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import Login from './Login';
import { useStateValue } from './StateProvider';
function App() {
  
  const [ { user } , dispatch]= useStateValue();
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
    {!user ?   <Login /> : 
    (
      <div className="app_body">
      <Router>
      <Sidebar />
        <Switch>
        <Route exact path="/rooms/:roomId">
          <Chat 
          />
        </Route>
        <Route path="/">
          {<h1>Click on the Chat to show</h1>}
        </Route>
        </Switch>
        </Router>
    </div>
    ) 
    }
    </div>
  );
}

export default App;
