import { Avatar } from '@material-ui/core';
import { SearchOutlined, SettingsSystemDaydreamRounded } from "@material-ui/icons";
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
import cookie from 'react-cookies';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useRef } from 'react';
export default function Chat() {
    const [input,setInput]=useState("");
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState("");
    // const name=cookie.load("displayName");
    const {roomId}=useParams();
    const [name,setName]=useState("");
    // const [seed,setSeed]=useState("");
    const [messages,setMessages]=useState([]);
    // const [{user} ,dispatch]=useStateValue();
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
                            })
                        }
                    })
                }
                
            })
            
            




        }
    },[roomId]);
    // useEffect(() => {
       
    // }, [])
    
    
    // useEffect(() => {
    //     setSeed(Math.floor(Math.random()*100));
        
    // }, [roomId])

    const  sendmessage =async(e)=>
    {
        e.preventDefault();
        db.collection("chats").doc(roomId).collection("messages").add({
            message:input,
            senderid:userid,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }
    
    return (
        <div className="chat">
       <div className="chat_header">
            <Avatar src={photoURL }/>
        <div className="chat_headerInfo">
        <h3>{name}</h3>
        <p> {""}
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
    <MoreVertIcon />
    </IconButton>
</div>
</div>
{/* <ScrollToBottom > */}
<div className="chat_body" >
    {messages.map(message=>{    
    return message.senderid!==userid? 
     <div ref={scrollRef}>
        <Chatmessage 
    // name={message.name}
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    />
    </div> : <div ref={scrollRef}> 
    <Chatmessagerecieve
    // name={message.name}
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
