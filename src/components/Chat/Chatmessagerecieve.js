import React from "react";
export default function Chatmessagerecieve (props)
{

    return <div>
    <p className="chat_message chat_reciever">
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