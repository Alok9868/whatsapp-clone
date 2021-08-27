import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import "./Emoji.css"
export default  function App({setEmoji}) {
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setEmoji(emojiObject.emoji)
    // console.log("select emoji");
  };

  return (
    <div className="top">
      {/* {chosenEmoji ? (
        <span> {chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )} */}
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};