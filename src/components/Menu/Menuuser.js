import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import cookie from "react-cookies";
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react';
import db from '../firebase/firebase';
import { useEffect ,useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Menuuser.css";
import { PhotoCamera } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import { storage } from '../firebase/firebase';

const ITEM_HEIGHT = 48;
function Example() {
    const [smShow, setSmShow] = useState(false);
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState("");
    // const photoURL=cookie.load("photoURL");
    const displayName=cookie.load("displayName");
    const [status,setStatus]=useState(cookie.load("status"));
    const [show,setShow]=useState(false);
  const [image,setImage]=useState(null);
    // console.log("example");
    const docid = useRef("");
    useEffect(() => {
      if(userid!==undefined)
      {
        db.collection('users')
      .where('userid','==',userid)
      .onSnapshot((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
          docid.current= doc.id
          // console.log(doc.id);
        }    )  })   
      }
    }, [userid])
    useEffect(() => {
      const unsubscribe=db.collection('users')
      .where('userid','==',userid)
      .onSnapshot((snapshot)=>{
        setPhotoURL(snapshot.docs[0].data().photoURL);
      })
      // return unsubscribe();
    }, [userid])
    
    function handleChange(event) {
        const value=event.target.value;
        setStatus(value);
    }
    function close()
    {
      setSmShow(false) ;
    }
    function submit() {
                    db.collection('users').doc(docid.current)
                    .update({
                        status:status
                    })
                    .then(()=>{
                        console.log("successfully updated");
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                    close();
    }
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
          // alert("Image uploaded successfully .");
      });
      } else {
        alert("Please upload an image first.");
      }
      setImage(null);
      setShow(false);
      // getFromFirebase();
    };
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
    return (
      <>
        <button onClick={() => setSmShow(true)}  >Profile</button>
        <Modal
          animation={false}
          size="lg"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Body>
           <img height="150" width="150" src={photoURL} alt="img"></img>  
           {  show ? <>
     <input type="file"  onChange={(e) => {onImageChange(e); }} />
     <Button  ><CloudUploadIcon  onClick={uploadToFirebase}/> </Button>
     <Button onClick={()=>{setShow(false)}}><CloseIcon /> </Button>  
     </> 
     : <Button><PhotoCamera  onClick={()=>{setShow(true)}}/></Button> 
     }  
           <div>
            <h2>{displayName}</h2>
            <input
                name="title"
                onChange={handleChange}
                value={status}
            />
           </div>
           </Modal.Body>
           <Button className="btn btn-secondary close" variant="primary" onClick={close}>
            Close
            </Button>
           <Button className="btn btn-secondary " variant="secondary" onClick={submit}>
             Save
         </Button>
        </Modal>
      </>
    );
  }

export default function LongMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function Logout() {
    setAnchorEl(null);
    cookie.remove("userid",{path:"/"});
    cookie.remove("displayName",{path:"/"});
    cookie.remove('photoURL',{path:"/"});
    cookie.remove('status',{path:"/"});
  }
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '15ch',
          },
        }}
      >
          <MenuItem onClick={handleClose} >
            <Example />
          </MenuItem>
          <MenuItem onClick={handleClose} >
          <a href="http://localhost:3000/" onClick={Logout} >
               Log out
          </a>
          </MenuItem>
        
      </Menu>
    </div>
  );
}