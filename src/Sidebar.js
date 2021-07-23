import React from 'react';
import "./Sidebar.css";
import db from './firebase';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { IconButton ,Avatar} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchOutlined } from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import { useState ,useEffect } from 'react';
import { useStateValue } from './StateProvider';
export default function Sidebar() {


    const [rooms,setRooms]=useState([]);
    const [{user},dispatch]=useStateValue();
    useEffect(() => {

       const unsubcribe= db.collection('rooms').onSnapshot(Snapshot=>
            {
                setRooms(Snapshot.docs.map((doc)=>({
                    id:doc.id,
                    data:doc.data()
                })))
            });
            return ()=>
            {
                unsubcribe();
            }
        
    }, [])
 
    return (
        <div className="sidebar">
            <div className="sidebar_header">
            <Avatar src={user?.photoURL} />
            <div className="sidebar_headerRight">
            <IconButton>
            <DonutLargeIcon />
            </IconButton>
            <IconButton>
            <ChatIcon/>
            </IconButton>
            <IconButton>
            <MoreVertIcon />
            </IconButton>
            </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar_chats">
            <SidebarChat 
                addnewChat={true}
            />

            {rooms.map(room =>   <SidebarChat 
                name={room.data.name}
                id={room.id}
                key={room.id}
            />    )}

            </div>
            
        </div>
    )
}
