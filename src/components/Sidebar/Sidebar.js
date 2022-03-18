import React from 'react';
import "./Sidebar.css";
import db from '../firebase/firebase';
import { Avatar } from '@material-ui/core';
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import { useState, useEffect } from 'react';
import cookie from "react-cookies";
import Loader from "../Loader/Loader";
import { Button } from '@material-ui/core';
import Modal from 'react-bootstrap/Modal'
import LongMenu from "../Menu/Menuuser";
import { storage } from '../firebase/firebase';
import AlertDismissible from '../Alerts/Alert';
export default function Sidebar() {
  const [loader, setLoader] = useState(false);
  const userid = cookie.load("userid");
  const [photoURL, setPhotoURL] = useState("");
  const displayName = cookie.load("displayName");
  const [searchName, setsearchName] = useState("");
  const [users, setUsers] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [image, setImage] = useState(null);
  const [state, setState] = useState(false);
  const [alertmessage, setAlertmessage] = useState("");
  const [show, setShow] = useState(false);
  var friendid;

  useEffect(() => {
    setLoader(true);
    db.collection('chats')
      .where('members', 'array-contains', userid)
      .onSnapshot((snapshot) => {
        setUsers(snapshot.docs.map((doc) => {
          return (doc)
        }))
        setLoader(false);
      })

  }, [userid])
  useEffect(() => {
    db.collection('users')
      .where('userid', '==', userid)
      .onSnapshot((snapshot) => {
        setPhotoURL(snapshot.docs[0].data().photoURL);
      })
  }, [userid]);
  async function Search() {

    if (searchName === displayName) {
      alert("You cannot chat withYourself");
      //  setState(true);
      setsearchName("");
      return;
    }

    db.collection('users').where('name', '==', searchName)
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          alert("No user found");
          //  setState(true);
          setsearchName("");
          return;
        }
        else {
          friendid = snapshot.docs[0].data().userid;
          db.collection('chats')
            .where("members", '==', [userid, friendid])
            .onSnapshot((snapshot) => {
              console.log(snapshot);
              if (snapshot.empty) {
                db.collection('chats').add({
                  members: [userid, friendid]
                })
                  .then(() => {
                    console.log("successfully added");
                  })
                  .catch((e) => {
                    console.log(e);
                  })
              }
              else {
                alert("Chat already exists");
              }

            })
        }
      })
    setsearchName("");
  }


  function setfn() {
    setState(false);
  }


  return (
    loader ? <Loader /> : <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={photoURL} alt="no image" onClick={() => { setSmShow(true) }} />
        <Modal
          size="sm"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Body> <img height="500" width="500" src={photoURL} alt="no match" ></img>


          </Modal.Body>
        </Modal>
        {state ? <AlertDismissible
          message={alertmessage}
          setfn={setfn}
          state={true}
        /> : " "}

        <div className="sidebar_headerRight">
          <h2>{displayName}</h2>
          <LongMenu />
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <Button onClick={Search} className="search-button"><SearchOutlined /> </Button>
          <input placeholder="Search for friends"
            type="text"
            className="search-input-field"
            value={searchName}
            onChange={(e) => { setsearchName(e.target.value) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { Search() } }}
          />
        </div>


      </div>
      <div className="sidebar_chats">
        {users.map(user =>
          <SidebarChat
            id={user.id}
            key={user.id}
            user={user}
          />

        )}

      </div>

    </div>

  )
}
