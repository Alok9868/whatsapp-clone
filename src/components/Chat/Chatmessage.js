import React from "react";
import { useRef } from 'react';
import { useEffect } from "react";
export default function Chatmessage(props)
{
   

    return   <div>
    <p className="chat_message">
    {/* <span className="chat_name">{props.name}</span> */}
    {props.message}
    <span className="chat_timestamp">
        {
            props.timestamp
        }
    </span>
    </p>
    </div>
}