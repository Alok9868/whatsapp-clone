import { Avatar } from '@material-ui/core';
import {  SearchOutlined} from "@material-ui/icons";
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
import db from '../firebase/firebase';
import cookie from 'react-cookies';
import { useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import LongMenufriend from '../Menu/Menufriend';


export default function Chat() {
    const [input,setInput]=useState("");
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState("");
    const {roomId}=useParams();
    const [name,setName]=useState("");
    const [messages,setMessages]=useState([]);
    const [status,setStatus]=useState("");
    var friend=useRef("");
    const m="last message ";
    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages])
    useEffect(()=>
    {
        if(roomId){
            db.collection("chats").doc(roomId).collection("messages").orderBy
            ("timestamp","asc").onSnapshot(snapshot=>
                (
                    setMessages(snapshot.docs.map(doc=> doc.data()))
                ))
            db.collection("chats").doc(roomId)
            .onSnapshot((snapshot)=>{
                if(snapshot)
                {
                    friend.current=(snapshot.data().members.filter((u)=>{return u!==userid}));
                    // console.log(friend.current[0]);
                    db.collection('users')
                    .where('userid','==',friend.current[0])
                    .onSnapshot((snapshot)=>{
                        if(snapshot)
                        {
                            snapshot.docs.map((doc)=>{
                                setPhotoURL(doc.data().photoURL);
                                setName(doc.data().name);
                                setStatus(doc.data().status);
                            })
                        }
                    })
                }
                
            })
        }
    },[userid,roomId]);
    const  sendmessage =async(e)=>
    {
        e.preventDefault();
        if(input==="")
        {
            return;
        }
        
        db.collection("chats").doc(roomId).collection("messages").add({
            message:input,
            senderid:userid,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }
    
    return (
        <div className="chat">
       <div className="chat_header"  >
            <Avatar src={photoURL } alt=""/>
        <div className="chat_headerInfo">
        <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
        <p> 
        {
            messages.length>=1? m+ new Date(messages[messages.length - 1]?.timestamp?.toDate()).toLocaleString() 
                : "No message yet"
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
    <LongMenufriend
    photoURL={photoURL}
    name={name}
    status={status}
    roomId={roomId}
    />
    </IconButton>
</div>
</div>
{/* <ScrollToBottom > */}
<div className="chat_body" >
    {messages.map(message=>{    
    return message.senderid!==userid? 
     <div ref={scrollRef}>
        <Chatmessage 
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    />
    </div> : <div ref={scrollRef}> 
    <Chatmessagerecieve

    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    /></div>
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
