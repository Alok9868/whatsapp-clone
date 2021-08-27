import { Avatar } from '@material-ui/core';
import {  SearchOutlined} from "@material-ui/icons";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { useState ,useEffect } from 'react'
import { IconButton } from '@material-ui/core';
import "./Chat.css";
import Chatmessage from './Chatmessage';
import Chatmessagerecieve from './Chatmessagerecieve';
import firebase from "firebase";
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router';
import db from '../firebase/firebase';
import cookie from 'react-cookies';
import { useRef } from 'react';
import LongMenufriend from '../Menu/Menufriend';
import Modal from 'react-bootstrap/Modal'
import Emoji from "../Emoji/Emoji";
import CloseIcon from '@material-ui/icons/Close';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { storage } from '../firebase/firebase';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from '@material-ui/core';
// function Example() {
//     const [smShow, setSmShow] = useState(false);
//     const photoURL=cookie.load("photoURL");
//     return ( <>
      
//       <div >
//         {/* <Button onClick={() => setSmShow(true)}>Small modal</Button>{' '} */}
//         <Avatar src={photoURL}   onClick={() => setSmShow(true)}/>
//         <Modal
//           size="sm"
//           show={smShow}
//           onHide={() => setSmShow(false)}
//           aria-labelledby="example-modal-sizes-title-sm"
//         >
//           <Modal.Body> <img src={photoURL} alt="no match" ></img>    </Modal.Body>
//         </Modal>
//       </div>
//       </>
//     );
//   }
export default function Chat() {
    const [input,setInput]=useState("");
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState(cookie.load("photoURL"));
    const {roomId}=useParams();
    const [name,setName]=useState("");
    const [messages,setMessages]=useState([]);
    const [status,setStatus]=useState(cookie.load("status"));
    const [emojiTemplate,setEmojiTemplate]=useState(false);
    const [show,setShow]=useState(false);
    const [showimage,setShowimage]=useState(false);
    // var friend=useRef("");
    const [friend,setFriend]=useState("");
    const m="last message ";
  const [image,setImage]=useState(null);
  const [allImages, setImages] = useState([]);
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
                if(snapshot.data() )
                {
                    // console.log(snapshot.data());
                    const  temp=(snapshot.data().members.filter((u)=>{return u!==userid}));
                    // console.log(friend.current[0]);
                    // console.log(temp);
                    setFriend(temp[0]);
                    // console.log(friend);
                    db.collection('users')
                    .where('userid','==',temp[0])
                    .onSnapshot((snapshot)=>{
                        if(snapshot)
                        {
                            snapshot.docs.forEach((doc)=>{
                                // console.log(doc.data().photoURL);
                                setPhotoURL(doc.data().photoURL);
                                setName(doc.data().name);
                                setStatus(doc.data().status);
                            })
                        }
                    })
                }
                
            })
        }
    },[roomId]);
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
        console.log("asdf");
        setInput("");
        setEmojiTemplate(false);
    }
    function setEmoji(Emoji)
    {
        setInput(input+ Emoji);
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
        alert("Image uploaded successfully .");
    });
    } else {
      alert("Please upload an image first.");
    }
    setImage(null);
    setShow(false);
    // getFromFirebase();
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
        <div className="chat">
       <div className="chat_header"  >
            <Avatar src={photoURL } alt="" />
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
{/* <IconButton> */}
    {/* <SearchOutlined /> */}
    {/* </IconButton> */}
    <IconButton>
     {  show ? <>
     <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }} />
     <Button onClick={uploadToFirebase}><CloudUploadIcon /> </Button>
     <CloseIcon onClick={()=>{setShow(false)}}/> 
     </> 
     : <AttachFileIcon onClick={()=>{setShow(true)}}/>
     }
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
<div className="chat_body"  >
    {messages.map(message=>{    
    return message.senderid!==userid? 
     <div ref={scrollRef}>
        <Chatmessage 
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    key={message.id}
    />
    </div> : <div ref={scrollRef}> 
    <Chatmessagerecieve

    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    key={message.id}
    /></div>
})
}    
</div>

<div className="chat_footer">
    {
      emojiTemplate ? <>
      <Emoji 
     setEmoji={setEmoji}   
    />
    <Button><CloseIcon onClick={()=>{setEmojiTemplate(false)}}/></Button>
    </>
    : <Button><EmojiEmotionsOutlinedIcon onClick={()=>{setEmojiTemplate(true)}}/></Button>
    }
    <form className="last"> 
      {
        showimage ? <div>
            <img src={image}  alt="file format not supported"/>
        </div> 
        : <input 
        value={input}
        onChange={(e)=>setInput(e.target.value)}
         placeholder="Type a message"
          type="text" />
      }
      <button onClick={sendmessage}type="submit"><SendIcon /></button>
    </form>
    {/* <MicIcon /> */}
</div>
        </div>
    )
}
