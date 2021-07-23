import React from 'react'
import { Button } from '@material-ui/core'
import "./login.css"
import { auth, provider } from './firebase'
import { actionTypes } from './reducer';
import {useStateValue} from "./StateProvider"
export default function Login() {

    // eslint-disable-next-line
    const [{}, dispatch]=useStateValue();
    const signin =()=>
    {
        auth
        .signInWithPopup(provider)
        .then((result)=>{
            dispatch({
                type:actionTypes.SET_USER,
                user:result.user,
            });
        })
        .catch((error)=>alert(error.message))
    };
    return (
        <div className="login">
            <div className="login_container">
                <img 
                src="https://www.freeiconspng.com/thumbs/whatsapp-icon/whatsapp-logo-png-6.png" 
                alt="Whatsapp "/>
                <div className="login_text">
                    <h1>Sign in to Whatsapp </h1>
                </div>
                <Button  onClick={signin}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}

