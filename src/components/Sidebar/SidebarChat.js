import { Avatar } from '@material-ui/core';
import React, { useState ,useEffect} from 'react'
import db from '../firebase/firebase';
import "./SidebarChat.css";
import {Link } from "react-router-dom";
import cookie from "react-cookies"
import PhotoIcon from '@material-ui/icons/Photo';

import Description from '@material-ui/icons/Description';
function  SidebarChat({id,user}) {
    const [messages,setMessages]=useState([]);
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState("");
    const [name,setName]=useState("");       
    useEffect(()=>
    {
      
         if(id)
        
        {
          var friendid=user.data().members.filter((u)=>{return u!==userid })
          // console.log(friendid[0]);
          db.collection("users")
          .where('userid','==',friendid[0])
          .onSnapshot((snapshot)=>{
            if(snapshot)
            {
              (snapshot.docs.forEach((doc)=>{
                setPhotoURL(doc.data().photoURL);
                setName(doc.data().name)
              }))
            }
            else
            {
              console.log("not found");
            }
          })
          
            db.collection("chats")
            .doc(id)
            .collection('messages')
            .orderBy("timestamp","desc")
            .onSnapshot((Snapshot)=>{
              setMessages(Snapshot.docs.map((doc)=>{
                return doc.data();
              }))
            })
            // return unsubscribe();
        }
    },[])

    return  (
        <Link to={`/whatsapp/rooms/${id}`}>
        <div className="sidebarChat" >
            <Avatar src={photoURL}/>
            <div className="sidebarChat_info ">
                <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
                {
                    messages[0]?.type==='image'? <PhotoIcon />
                  : messages[0]?.type==="doc" ? <Description/>  :<p>{messages[0]?.message} </p>
                }
                {messages[0]? <p>{new Date(messages[0]?.timestamp?.toDate()).toLocaleString()} </p>: " " }
            </div>
        </div>
         </Link>
        ) 
    
}

export default SidebarChat
