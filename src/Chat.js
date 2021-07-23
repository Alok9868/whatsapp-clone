import { Avatar } from '@material-ui/core';
import { SearchOutlined } from "@material-ui/icons";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { useState ,useEffect } from 'react'
import { IconButton } from '@material-ui/core';
import "./Chat.css";
import Chatmessage from './Chatmessage';
import Chatmessagerecieve from './Chatmessagerecieve';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import firebase from "firebase";
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router';
import db from './firebase';
import { useStateValue } from './StateProvider';
export default function Chat() {
    const [input,setInput]=useState("");
    const {roomId}=useParams();
    const [roomName,setRoomName]=useState("");
    const [seed,setSeed]=useState("");
    const [messages,setMessages]=useState([]);
    const [{user} ,dispatch]=useStateValue();

    useEffect(()=>
    {
        if(roomId){
            db.collection("rooms")
            .doc(roomId)
            .onSnapshot((snapshot)=>
            {
                setRoomName(snapshot.data().name);
            })
            db.collection("rooms").doc(roomId).collection("messages").orderBy
            ("timestamp","asc").onSnapshot(snapshot=>
                (
                    setMessages(snapshot.docs.map(doc=> doc.data()))
                ))
        }
    },[roomId]);
    
    
    useEffect(() => {
        setSeed(Math.floor(Math.random()*100));
        
    }, [roomId])

    const  sendmessage =async(e)=>
    {
        e.preventDefault();
        db.collection("rooms").doc(roomId).collection("messages").add({
            message:input,
            name:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }
    


    return (
        <div className="chat">
       <div className="chat_header">
            <Avatar src={`https://avatars.dicebear.com/api/human/:${seed}.svg` }/>
        <div className="chat_headerInfo">
        <h3>{roomName}</h3>
        <p>last seen {""}
        {
            new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
                ).toLocaleString()
        }
        
        
        </p>
        </div>
<div className="chat_headerRight">
<IconButton>
    <SearchOutlined />
    </IconButton>
    <IconButton>
    <AttachFileIcon/>
    </IconButton>
    <IconButton>
    <MoreVertIcon />
    </IconButton>
</div>
</div>
<div className="chat_body">
    {messages.map(message=>{    
      
    return message.name!==user.displayName? (<Chatmessage 
    name={message.name}
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    />) :(
    <Chatmessagerecieve
    name={message.name}
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    />)
})
}    
</div>
<div className="chat_footer">
    <InsertEmoticonIcon />
    <form>
        <input 
        value={input}
        onChange={(e)=>setInput(e.target.value)}
         placeholder="Type a message"
          type="text" />
        <button onClick={sendmessage}type="submit"><SendIcon /></button>
    </form>
    <MicIcon />
</div>
        </div>
    )
}
