import React from 'react';
import "./Sidebar.css";
import db from './firebase';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { IconButton ,Avatar} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {FormatIndentDecreaseOutlined, SearchOutlined, SimCard } from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import { useState ,useEffect } from 'react';
import { useStateValue } from './StateProvider';
import cookie from "react-cookies";
import SendIcon from '@material-ui/icons/Send';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
export default function Sidebar() {
    const [rooms,setRooms]=useState([]);
    // const [{user},dispatch]=useStateValue();
    const userid=cookie.load("userid");
  const photoURL=cookie.load("photoURL");
  const displayName=cookie.load("displayName");
  const [searchName,setsearchName]=useState("");
  const [users,setUsers]=useState([]);
  const [friends,setFriends]=useState([]);
  const [messages,setMessages]=useState([]);
  var i=0;
 


  useEffect(() => {
    const unsubscribe=  db.collection('chats')
   .where('members','array-contains',userid)
   .onSnapshot((snapshot)=>{
     setUsers(snapshot.docs.map((doc)=>{
        return doc
       }))
     })
    //  return unsubscribe();
    
    //  return unsubcribe();
   },[userid])

  //  var friendsid=[];
  //  users.map((user)=>{
  //    var friendid=user.data().members.filter((u)=>{
  //      return u!==userid
  //    })
  //    friendsid.push(friendid[0]);
  //  })
  //  console.log(friendsid);


    // useEffect(() => {
        

    //    const unsubcribe= db.collection('rooms').onSnapshot(Snapshot=>
    //         {
    //             setRooms(Snapshot.docs.map((doc)=>({
    //                 id:doc.id,
    //                 data:doc.data()
    //             })))
    //         });
    //         return ()=>
    //         {
    //             unsubcribe();
    //         }
        
    // }, [])





    // useEffect(() => {
    //     const unsubcribe= db.collection('users').onSnapshot(Snapshot=>
    //         {
    //           setUsers(Snapshot.docs.map((doc)=>{return doc.data()    })) 
    //         })
    //         return ()=>
    //         {
    //             unsubcribe();
    //         }
    // // },[])
    // function find(user)
    // {
    //   var friendid=user.data().members.filter((u)=>{
    //     return u!==userid;
    //  })
    //  return friendid[0];
    // }
    function Search(searchName)
    {
       db.collection('users').where('name','==',searchName)
       .onSnapshot((snapshot)=>{
         if(snapshot.empty)
         {
           console.log("No user found");
         }
         else{
           var friendid;
           snapshot.docs.map((doc)=>{
             friendid=doc.data().userid;
            //  console.log(friendid);
           })
           db.collection('chats').add({
             members:[userid,friendid]
           })
           
         }
       })
       setsearchName("");
    }
 
    return (
        <div className="sidebar">
            <div className="sidebar_header">
            <Avatar src={photoURL} />
            <div className="sidebar_headerRight">
            <h2>{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h2>
            {/* <IconButton>
            <DonutLargeIcon />
            </IconButton>
            <IconButton>
            <ChatIcon/>
            </IconButton>
            <IconButton>
            <MoreVertIcon />
            </IconButton> */}
            </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search for friends" 
                    type="text"  
                    value={searchName} 
                    onChange={(e)=>{setsearchName(e.target.value)}}/>
                    <button onClick={()=>{Search(searchName) }} type="submit">Search</button>
                </div>
            </div>
            <div className="sidebar_chats">
            {/* <SidebarChat 
                addnewChat={true}
            /> */}

            {users.map(user =>
            <SidebarChat 
              id={user.id}
              key={user.id}
              user={user}
            />


            
            )}

            </div>
            
        </div>
    )
}
