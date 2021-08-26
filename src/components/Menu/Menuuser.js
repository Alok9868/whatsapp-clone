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
import { Redirect } from "react-router-dom";
const ITEM_HEIGHT = 48;
function Example() {
    const [smShow, setSmShow] = useState(false);
    const userid=cookie.load("userid");
    const photoURL=cookie.load("photoURL");
    const displayName=cookie.load("displayName");
    const docid = useRef("");
    useEffect(() => {
      if(userid!==undefined)
      {
        db.collection('users')
      .where('userid','==',userid)
      .onSnapshot((snapshot)=>{
        snapshot.docs.map((doc)=>{
          docid.current= doc.id
          console.log(doc.id);
        })})
      }
      else{
        
      }
    }, [userid])
    // const status=cookie.load("status");
    const [status,setStatus]=useState(cookie.load("status"));
    function handleChange(event) {
        const value=event.target.value;
        setStatus(value);
    }
    function close()
    {
      setSmShow(false) 
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
    return (
      <>
        <Button onClick={() => setSmShow(true)}>Profile</Button>{' '}
        <Modal
          animation={false}
          size="lg"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Body>
           <img src={photoURL} alt="img"></img>    
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
           <Button className="btn btn-secondary save-changes" variant="secondary" onClick={submit}>
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
            width: '20ch',
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