import React from 'react'
import { Button } from '@material-ui/core'
import "./login.css"
import { auth, provider } from './firebase'
import { actionTypes } from './reducer';
import {useStateValue} from "./StateProvider"
import cookie from 'react-cookies'
import { Redirect } from "react-router-dom";
export default function Login() {
    // eslint-disable-next-line
    const [{user}, dispatch]=useStateValue();
    const userid=cookie.load("userid");
    const signin =()=>
    {
        auth
        .signInWithPopup(provider)
        .then((result)=>{
            var  token=result.user.uid;
            var name=result.user.displayName;
            var photoURL=result.user.photoURL;
            cookie.save("userid",token,{path:'/'});
            cookie.save('displayName',name,{path :'/'});
            cookie.save('photoURL',photoURL,{path:'/'});
            dispatch({
                type:actionTypes.SET_USER,
                user:result.user,
            });
        })
        .catch((error)=>alert(error.message))
        return;
    };
    return  userid ?<Redirect to ="/whatsapp" />
      :(<div className="login">
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
        </div>   )
}

