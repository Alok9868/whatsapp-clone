import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'

import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
export default function Chatmessagerecieve (props)
{
    const [smShow,setSmShow]=useState(false);
    return <div>
    <p className="chat_message chat_reciever">
    {
          props.type ==="image" ? <>
          <img 
          width="100" 
          height="100" 
          src={props.message} 
          alt=" not supported" 
           onClick={()=>{setSmShow(true)}}
           />
          <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body> <img height="200" width="200" src={props.message} alt="no match" ></img>
        <Button onClick={()=>{setSmShow(false)}}><CloseIcon /> </Button> 
        </Modal.Body>
        </Modal>
        </>
          : props.type==="doc" ? <a target="_blank" href={ props.message} rel="noreferrer"  > <DescriptionIcon /><div > {props.name} </div> </a> : <span>{props.message}</span>  
    }
    <span className="chat_timestamp">
        {
            props.type ==="text"?
            <span>{props.timestamp}</span>
            :<div> {props.timestamp}</div>
        }
    </span>
    </p> 
    </div>

}