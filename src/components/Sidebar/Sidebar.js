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
import { storage } from '../firebase/firebase';
export default function Sidebar() {
    const [loader,setLoader]=useState(false);
    const userid=cookie.load("userid");
  const photoURL=cookie.load("photoURL");
  const displayName=cookie.load("displayName");
  const [searchName,setsearchName]=useState("");
  const [users,setUsers]=useState([]);
  const [smShow, setSmShow] = useState(false);
  const [image,setImage]=useState(null);
  const [allImages, setImages] = useState([]);

  useEffect(() => {
    setLoader(true);
    const unsubscribe=  db.collection('chats')
   .where('members','array-contains',userid)
   .onSnapshot((snapshot)=>{
     setUsers(snapshot.docs.map((doc)=>{
        return(doc)
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
           snapshot.docs.forEach((doc)=>{
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
    const onImageChange = (e) => {
      const reader = new FileReader();
      let file = e.target.files[0]; // get the supplied file
      // if there is a file, set image to that file
      if (file) {
        reader.onload = () => {
          if (reader.readyState === 2) {
            console.log(file);
            setImage(file);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      // if there is no file, set image back to null
      } else {
        setImage(null);
      }
    };
    const uploadToFirebase = () => {
      //1.
      if (image) {
        //2.
        const storageRef = storage.ref();
        //3.
        const imageRef = storageRef.child(image.name);
        //4.
        console.log(imageRef);
        imageRef.put(image)
       //5.
       .then(() => {
          alert("Image uploaded successfully to Firebase.");
      });
      } else {
        alert("Please upload an image first.");
      }
      setImage(null);
      getFromFirebase();
    };
    const getFromFirebase = () => {
      //1.
      let storageRef = storage.ref();
      //2.
      storageRef.listAll().then(function (res) {
          //3.
          res.items.forEach((imageRef) => {
            imageRef.getDownloadURL().then((url) => {
                //4.
                setImages((allImages) => [...allImages, url]);
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    const deleteFromFirebase = (url) => {
      //1.
      let pictureRef = storage.refFromURL(url);
     //2.
      pictureRef.delete()
        .then(() => {
          //3.
          setImages(allImages.filter((image) => image !== url));
          alert("Picture is deleted successfully!");
        })
        .catch((err) => {
          console.log(err);
        });
    };

      
    return ( 
         loader ? <Loader />  : <div className="sidebar">
            <div className="sidebar_header">
              <Avatar src={photoURL}  alt="no image"  onClick={()=>{setSmShow(true)}}/>
            <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body> <img src={photoURL} alt="no match" ></img></Modal.Body>
      </Modal>
      {/* <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }}/>
      <div id="photos">
     {allImages.map((image) => {
        return (
           <div key={image} className="image">
              <img src={image} alt="" />
              <button onClick={() => deleteFromFirebase(image)}>
               Delete
              </button>
           </div>
         );
     })}
</div>
          <button onClick={uploadToFirebase}>Upload to Firebase</button> */}
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
