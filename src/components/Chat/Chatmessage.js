import React from "react";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import './Chatmessage'
import DescriptionIcon from '@material-ui/icons/Description';
export default function Chatmessage(props)
{
    // console.log(props.message);
    const [smShow,setSmShow]=useState(false);
    return   <div>
    <p className="chat_message">
    {
        props.type ==="image" ?
         <div  className="img-chat">
         <img 
        width="100"
         height="100" 
         src={props.message}
         alt= "not suppported"
         onClick={()=>{setSmShow(true)}}
         />
         { <Modal
        size="lg"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
         >
        <Modal.Body className="chat-img-body"> <img height="500px" width="500px" src={props.message} alt="file format not supported" ></img>
        {/* <Button onClick={()=>{setSmShow(false)}}><CloseIcon /> </Button>  */}
        </Modal.Body>
          </Modal> 
         }
         </div> 
        :  props.type==="doc" ? <a target="_blank" href={ props.message} rel="noreferrer"  > <DescriptionIcon /><div > {props.name} </div> </a> : <span>{props.message}</span> 
       
    }
     {/* <> <DescriptionIcon /><div> {props.name} </div> </> : <span>{props.message}</span>  */}
    <span className="chat_timestamp">
        {
            props.type ==="text"?
            <p>{props.timestamp}</p>
            :<div> {props.timestamp}</div>
        }
    </span>
    </p>
    </div>
}