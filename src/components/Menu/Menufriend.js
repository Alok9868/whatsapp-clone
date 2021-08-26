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
import { func } from 'prop-types';
import { doc, deleteDoc } from "firebase/firestore";
const ITEM_HEIGHT = 48;
function Example({photoURL,name,status}) {
    const [smShow, setSmShow] = useState(false);
    return (
      <>
        <Button onClick={() => setSmShow(true)}>Show Profile</Button>
        <Modal
          size="lg"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Body>
           <img src={photoURL} alt="img"></img>    
           <div>
            <h2>{name}</h2>
            <h4>{status}</h4>
           </div>
           </Modal.Body>
        </Modal>
      </>
    );
  }

export default function LongMenufriend({name,photoURL,status,roomId}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function clearchat()
  {
      db.collection('chats').doc(roomId)
      .onSnapshot((snapshot)=>{
          if(snapshot)
          {
              console.log(snapshot);
          }
      })


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
            width: '20ch',
          },
        }}
      >
          <MenuItem  onClick={clearchat}>
            Clear Chat
          </MenuItem>
          <MenuItem onClick={handleClose} >
            <Example 
            name={name}
            photoURL={photoURL}
            status={status}
             />
          </MenuItem>
      </Menu>
    </div>
  );
}