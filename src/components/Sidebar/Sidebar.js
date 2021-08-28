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
import { Button } from '@material-ui/core';
import Modal from 'react-bootstrap/Modal'
import LongMenu from "../Menu/Menuuser";
import { storage } from '../firebase/firebase';
import AlertDismissible from '../Alerts/Alert';
import { PhotoCamera } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
export default function Sidebar() {
    const [loader,setLoader]=useState(false);
    const userid=cookie.load("userid");
  // const photoURL=cookie.load("photoURL");
  const [photoURL,setPhotoURL]=useState("");
  const displayName=cookie.load("displayName");
  const [searchName,setsearchName]=useState("");
  const [users,setUsers]=useState([]);
  const [smShow, setSmShow] = useState(false);
  const [image,setImage]=useState(null);
  const [allImages, setImages] = useState([]);
  const [state,setState]=useState(false);
  const [alertmessage,setAlertmessage]=useState("");
  const [show,setShow]=useState(false);

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
   useEffect(() => {
   const unsubscribe=db.collection('users')
   .where('userid','==',userid)
   .onSnapshot((snapshot)=>{
     setPhotoURL(snapshot.docs[0].data().photoURL);
   })
  //  return unsubscribe();
   }, [userid]);
    function Search()
    {

      if(searchName===displayName)
      {
           setAlertmessage("You cannot chat withYourself");
           setState(true);
           return;
      }
      db.collection('users').where('name','==',searchName)
       .onSnapshot((snapshot)=>{
         if(snapshot.empty)
         {
           setAlertmessage("No user found");
           setState(true);
         }
         else{
           var friendid;
           friendid=snapshot.docs[0].data().userid;
           db.collection('chats')
           .where('members','array-contains',[userid,friendid])
           .onSnapshot((snapshot)=>{
             if(snapshot.empty)
             {
              db.collection('chats').add({
                members:[userid,friendid]
              })
             }
             else
             {
               console.log(snapshot);
              setAlertmessage("Chat Already exists");
              setState(true);
             }         
         })
        }
      })
       setsearchName("");
    }
    function setfn()
    {
      setState(false);
    }
    const onImageChange = (e) => {
      const reader = new FileReader();
      let file = e.target.files[0]; // get the supplied file
      // if there is a file, set image to that file
      if (file) {
        reader.onload = () => {
          if (reader.readyState === 2) {
          //   console.log(file);
            setImage(file);
          //   setShowimage(true);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
       
      // if there is no file, set image back to null
      } else {
        setImage(null);
      }
    };
    const uploadToFirebase = async () => {
      //1.
      if (image) {
        //2.
        const storageRef = storage.ref();
        //3.
        const imageRef = storageRef.child(image.name);
        //4.
        // console.log(imageRef);
        await imageRef.put(image)
        imageRef.getDownloadURL()
       //5.
       .then((e) => {
        //  setPhotoURL(e);
         db.collection('users')
         .where('userid','==',userid)
        .get()
         .then((snapshot)=>{
           console.log(snapshot.docs[0].id);
           db.collection('users').doc(snapshot.docs[0].id)
           .update({
             photoURL:e
           })
           .then(()=>{
           console.log("successfully updated");
           })
           .catch((e)=>{
             console.log(e);
           })
         })
         .catch((e)=>{
           console.log("error");
         })
          alert("Image uploaded successfully .");
      });
      } else {
        alert("Please upload an image first.");
      }
      setImage(null);
      setShow(false);
      // getFromFirebase();
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
        <Modal.Body> <img height="200" width="200" src={photoURL} alt="no match" ></img>
        {  show ? <>
     <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }} />
     <Button  ><CloudUploadIcon  onClick={uploadToFirebase}/> </Button>
     <Button onClick={()=>{setShow(false)}}><CloseIcon /> </Button>  
     </> 
     : <Button><PhotoCamera  onClick={()=>{setShow(true)}}/></Button> 
     }
        
        </Modal.Body>
      </Modal>
      {  state ?  <AlertDismissible 
                  message={alertmessage}
                  setfn={setfn}
                  state={true}
                />  :" "   }

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
                    <Button onClick={Search } ><SearchOutlined /> </Button>
                    <input placeholder="Search for friends" 
                    type="text"  
                    value={searchName} 
                    onChange={(e)=>{setsearchName(e.target.value)}}
                    onKeyDown={(e)=>{if(e.key==='Enter'){ Search() }   }}
                    />
                </div>

               
            </div>
            <div className="sidebar_chats">
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
