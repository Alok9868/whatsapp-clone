import React from 'react';
import "./Sidebar.css";
import db from '../firebase/firebase';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { IconButton ,Avatar} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import { useState ,useEffect } from 'react';
import cookie from "react-cookies";
import SendIcon from '@material-ui/icons/Send';
import Loader from "../Loader/Loader";
import Button from "@restart/ui/esm/Button";
import Modal from 'react-bootstrap/Modal'
import LongMenu from "../Menu/Menuuser";
  
function Example() {
  const [smShow, setSmShow] = useState(false);
  const photoURL=cookie.load("photoURL");
  return ( <>
    
    <div >
      {/* <Button onClick={() => setSmShow(true)}>Small modal</Button>{' '} */}
      <Avatar src={photoURL}   onClick={() => setSmShow(true)}/>
      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body> <img src={photoURL} alt="no match" ></img>    </Modal.Body>
      </Modal>
    </div>
    </>
  );
}
export default function Sidebar() {
    const [loader,setLoader]=useState(false);
    const userid=cookie.load("userid");
  const photoURL=cookie.load("photoURL");
  const displayName=cookie.load("displayName");
  const [searchName,setsearchName]=useState("");
  const [users,setUsers]=useState([]);
  useEffect(() => {
    setLoader(true);
    const unsubscribe=  db.collection('chats')
   .where('members','array-contains',userid)
   .onSnapshot((snapshot)=>{
     setUsers(snapshot.docs.map((doc)=>{
        return doc
       }))
       setLoader(false);
     })
    //  return unsubscribe();
    
   },[userid])
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
         loader ? <Loader />  : <div className="sidebar">
            <div className="sidebar_header">
              {/* <Avatar src={photoURL}  /> */}
             <Example  />
            <div className="sidebar_headerRight">
            <h2>{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h2>
            {/* <IconButton>
            <DonutLargeIcon />
            </IconButton>
            <IconButton>
            <ChatIcon/>
            </IconButton> */}
            {/* <IconButton>
            <MoreVertIcon  />
            <Menu />
            </IconButton> */}
            <LongMenu />
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
