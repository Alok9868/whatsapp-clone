import { Avatar } from '@material-ui/core';
import React, { useState ,useEffect} from 'react'
import db from './firebase';
import "./SidebarChat.css";
import {Link } from "react-router-dom";
import cookie from "react-cookies";
import Chat from './Chat';

function  SidebarChat({id,user}) {
    const [seed,setSeed]=useState("");
    const [messages,setMessages]=useState([]);
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState("");
    const [name,setName]=useState("");
    

    // useEffect(() => {
    //   // db.collection("chats")
    //   // .doc(id)
    //   // .onSnapshot((Snapshot)=>{
        
    //   // })
    //     setSeed(Math.floor(Math.random()*100));      
    // }, [])
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
              (snapshot.docs.map((doc)=>{
                setPhotoURL(doc.data().photoURL);
                setName(doc.data().name)
              }))
            }
            else
            {
              console.log("not found");
            }
          })
          
            // db.collection("chats")
            // .doc(id)
            // .collection("messages")
            // .orderBy("timestamp","desc")
            // .onSnapshot((snapshot)=>
            // {
            //   snapshot.docs.map((doc)=>{
            //     console.log(doc.data());
            //   })
            //     setMessages(snapshot.docs.map((doc)=> 

            //         console.log(doc.data());
            //         return doc.data()

            //         ))
            // })
            db.collection("chats")
            .doc(id)
            .collection('messages')
            .orderBy("timestamp","desc")
            .onSnapshot((Snapshot)=>{
              setMessages(Snapshot.docs.map((doc)=>{
                return doc.data();
              }))
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


    return  (
        <Link to={`/whatsapp/rooms/${id}`}>
        <div className="sidebarChat" 
        onClick={()=> {
          <Chat 
            photoURL={photoURL}
            name={name}
            roomId={id}
          />
        } } 
        
        >
            <Avatar src={photoURL}/>
            <div className="sidebarChat_info">
                <h2>{name}</h2>
                <p>{messages[0]?.message}</p>
            </div>
        </div>
         </Link>
        ) 
    
}

export default SidebarChat
