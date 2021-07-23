import { Avatar } from '@material-ui/core';
import React, { useState ,useEffect} from 'react'
import db from './firebase';
import "./SidebarChat.css";
import {Link } from "react-router-dom";

function  SidebarChat({id,name,addnewChat}) {
    const [seed,setSeed]=useState("");
    const [messages,setMessages]=useState([]);
    useEffect(() => {
        setSeed(Math.floor(Math.random()*100));      
    }, [])
    useEffect(()=>
    {
        if(id)
        {
            db.collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot)=>
            {
                setMessages(snapshot.docs.map((doc)=> 
                    doc.data()))
            })
        }
    },[id])

    const createChat=()=>{
        const roomName=prompt("Enter New  name for chat");
        if(roomName)
        {
            db.collection("rooms").add({
                name:roomName
            })
        }
    };
    
    return !addnewChat ? (
        <Link to={`/rooms/${id}`}>
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/:${seed}.svg` }/>
            <div className="sidebarChat_info">
                <h2>{name}</h2>
                <p>{messages[0]?.message}</p>
            </div>
        </div>
         </Link>
        )    : (<div className="sidebarChat" onClick={createChat}>
        <div className="sidebarChat_info" >
            <h2 >Add new chat room</h2>
        </div>
    </div>)
    
}

export default SidebarChat
