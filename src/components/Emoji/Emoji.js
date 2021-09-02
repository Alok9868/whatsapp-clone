import React from 'react';
import Picker from 'emoji-picker-react';
import "./Emoji.css"
export default  function App({setEmoji}) {
   const onEmojiClick = (event, emojiObject) => {

    setEmoji(emojiObject.emoji)
  };
  return (
    <div className="top">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};